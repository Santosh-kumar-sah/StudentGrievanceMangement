import { useEffect, useRef, useState } from "react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (open && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: "user", text, id: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      const reply = data.reply || data?.raw || "No reply";
      setMessages((m) => [...m, { role: "assistant", text: typeof reply === "string" ? reply : JSON.stringify(reply), id: Date.now() + 1 }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", text: "Error: unable to reach chat server", id: Date.now() + 2 }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end">
        {open && (
          <div className="mb-3 w-[420px] max-w-xs sm:max-w-sm rounded-xl bg-white shadow-lg dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-xl border-b px-4 py-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-cyan-600 flex items-center justify-center text-white font-bold">AI</div>
                <div>
                  <div className="text-sm font-semibold">Chatbot</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Ask anything — powered by your API</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => {
                    setMessages([]);
                  }}
                >
                  Clear
                </button>
                <button
                  className="rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={containerRef} className="max-h-80 overflow-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-slate-500">No messages yet — start the conversation.</div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="mr-2 flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-700 dark:text-slate-100">AI</div>
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] whitespace-pre-wrap rounded-xl px-4 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-cyan-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-900 dark:bg-slate-800/70 dark:text-slate-100 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.role === "user" && (
                    <div className="ml-2 flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-cyan-600 flex items-center justify-center text-sm font-semibold text-white">U</div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2">
                  <div className="mr-2">
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                  </div>
                  <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800/70">
                    <span className="inline-block animate-pulse">...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t px-3 py-2 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <textarea
                  className="input h-10 flex-1 resize-none rounded-md border px-3 py-2 text-sm dark:bg-slate-900"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Send a message... (Enter to send)"
                />
                <button
                  onClick={send}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-3 py-2 text-white hover:bg-cyan-700 disabled:opacity-60"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-3 text-white shadow-lg hover:bg-cyan-700"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle chatbot"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H7l-5 3V5z" />
          </svg>
          <span className="hidden sm:inline">Chat</span>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
