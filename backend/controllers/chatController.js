import jwt from "jsonwebtoken";
import Grievance from "../models/grievance.model.js";

const CATEGORY_KEYWORDS = [
  { category: "Academic", keywords: ["exam", "teacher", "class", "marks", "assignment", "attendance", "syllabus", "study"] },
  { category: "Hostel", keywords: ["hostel", "room", "mess", "water", "electricity", "cleaning", "warden", "bathroom"] },
  { category: "Transport", keywords: ["bus", "transport", "route", "pickup", "drop", "driver", "shuttle"] }
];

function getStudentId(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    if (!process.env.JWT_SECRET) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id || null;
  } catch {
    return null;
  }
}

function extractJson(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function guessCategory(message) {
  const lower = message.toLowerCase();

  for (const item of CATEGORY_KEYWORDS) {
    if (item.keywords.some((keyword) => lower.includes(keyword))) {
      return item.category;
    }
  }

  return "Other";
}

function buildFallbackGrievance(message) {
  const trimmed = message.trim();
  const title = trimmed.split(/[.?!\n]/)[0].slice(0, 80) || "Student grievance";

  return {
    title,
    description: trimmed,
    category: guessCategory(trimmed),
    status: "Pending"
  };
}

async function callChatApi(message) {
  const apiUrl = process.env.CHATBOT_API_URL;
  const apiKey = process.env.CHATBOT_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error("Chatbot API not configured");
  }

  const systemPrompt = [
    "You are a student grievance assistant.",
    "If the user asks to create, add, submit, or file a grievance, return only valid JSON with:",
    '{"intent":"create_grievance","title":"...","description":"...","category":"Academic|Hostel|Transport|Other","status":"Pending"}',
    "If the user is just chatting, return only valid JSON with:",
    '{"intent":"chat","reply":"..."}',
    "Do not wrap JSON in markdown."
  ].join(" ");

  const payload = {
    model: process.env.CHATBOT_MODEL || "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
    temperature: Number(process.env.CHATBOT_TEMPERATURE) || 0.2
  };

  const fetchRes = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!fetchRes.ok) {
    const text = await fetchRes.text();
    throw new Error(text || `Chat API failed with status ${fetchRes.status}`);
  }

  const data = await fetchRes.json();
  const content = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || data.output_text || JSON.stringify(data);
  return { data, content };
}

// POST /api/chat
export async function chat(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const studentId = getStudentId(req);

    const { data, content } = await callChatApi(message);
    const parsed = extractJson(content);

    if (parsed?.intent === "create_grievance") {
      if (!studentId) {
        return res.status(401).json({
          reply: "Please log in first so I can save the grievance to your account.",
          raw: data
        });
      }

      const grievancePayload = {
        title: (parsed.title || "").trim(),
        description: (parsed.description || "").trim(),
        category: parsed.category || guessCategory(message),
        status: parsed.status || "Pending"
      };

      const fallback = buildFallbackGrievance(message);
      const finalPayload = {
        title: grievancePayload.title || fallback.title,
        description: grievancePayload.description || fallback.description,
        category: grievancePayload.category || fallback.category,
        status: grievancePayload.status || fallback.status
      };

      if (!finalPayload.title || !finalPayload.description || !finalPayload.category) {
        return res.status(400).json({
          reply: "I could not understand the grievance details clearly. Please include the issue, title, and category.",
          raw: data
        });
      }

      const grievance = await Grievance.create({
        user: studentId,
        ...finalPayload
      });

      return res.status(201).json({
        reply: `Your grievance has been created successfully: ${grievance.title}`,
        grievance,
        raw: data
      });
    }

    const reply = parsed?.reply || content || "No reply";
    return res.json({ reply, raw: data });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ message: "Chat error", error: err.message });
  }
}

export default { chat };
