// POST /api/chat
export async function chat(req, res) {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const apiUrl = process.env.CHATBOT_API_URL;
    const apiKey = process.env.CHATBOT_API_KEY;
    if (!apiUrl || !apiKey) return res.status(500).json({ message: 'Chatbot API not configured' });

    const payload = {
      model: process.env.CHATBOT_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: message }],
      temperature: Number(process.env.CHATBOT_TEMPERATURE) || 0.7
    };

    const fetchRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!fetchRes.ok) {
      const text = await fetchRes.text();
      return res.status(fetchRes.status).json({ error: text });
    }

    const data = await fetchRes.json();

    let reply = '';
    if (data.choices && data.choices[0]?.message?.content) reply = data.choices[0].message.content;
    else if (data.choices && data.choices[0]?.text) reply = data.choices[0].text;
    else if (data.output_text) reply = data.output_text;
    else reply = JSON.stringify(data);

    return res.json({ reply, raw: data });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ message: 'Chat error', error: err.message });
  }
}

export default { chat };
