import { useState, useRef, useEffect } from 'react';
import { Bot, ChevronDown, Send, X, Loader2 } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState('English');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hello! I'm IP-SAKTI Assistant. How can I help you today?" }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, open]);

  const languages = [
    'English',
    'Hindi',
    'Bengali',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Marathi',
    'Odia',
    'Punjabi',
    'Tamil',
    'Telugu',
  ];

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userQuestion = message.trim();
    setMessage('');
    setMessages((prev) => [...prev, { sender: 'user', text: userQuestion }]);
    setLoading(true);

    try {
      // Connect to your FastAPI backend endpoint (adjust port/route as per your main.py)
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userQuestion,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      const botReply = data.answer || data.response || data.result || "I couldn't process that response.";

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ Sorry, I'm having trouble connecting to the backend server. Please make sure your FastAPI backend is running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING CHAT BUTTON */}
      {!open && (
        <div className="fixed bottom-5 right-5 z-[9999] sm:bottom-6 sm:right-6">
          {/* Soft Orange Glow */}
          <div className="absolute inset-[-10px] animate-pulse rounded-full bg-[#D8892F]/35 blur-md" />

          {/* Rotating Orange Ring */}
          <div className="absolute inset-[-6px] animate-[spin_4s_linear_infinite] rounded-full border-2 border-[#D8892F]/70" />

          {/* Chat Button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open IP-SAKTI Assistant"
            className="relative grid h-[64px] w-[64px] place-items-center overflow-hidden rounded-full border-[5px] border-white bg-[#D8892F] text-white shadow-[0_6px_25px_rgba(216,137,47,0.40)] animate-[chatFloat_3s_ease-in-out_infinite] transition-transform duration-200 hover:scale-110 sm:h-[68px] sm:w-[68px]"
          >
            <Bot size={30} />

            {/* Moving Shine */}
            <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute -left-[80%] top-0 h-full w-[45%] rotate-[25deg] bg-white/35 blur-sm animate-[shine_3s_ease-in-out_infinite]" />
            </span>
          </button>
        </div>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[9999] flex h-[520px] w-[425px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[24px] border border-[#ead8c0] bg-white shadow-[0_10px_40px_rgba(216,137,47,0.20)] sm:bottom-6 sm:right-6 max-[480px]:bottom-3 max-[480px]:right-3 max-[480px]:h-[calc(100vh-24px)] max-[480px]:w-[calc(100vw-24px)]">

          {/* HEADER */}
          <div className="flex shrink-0 items-center gap-3 bg-[#FFF4E3] px-4 py-4 sm:px-5">
            {/* BOT ICON */}
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#D8892F] text-white">
              <Bot size={22} />
            </div>

            {/* TITLE */}
            <div className="min-w-0 flex-1">
              <h3 className="m-0 text-[0.95rem] font-semibold text-[#B96F22] sm:text-[1rem]">
                IP-SAKTI Assistant
              </h3>
              <p className="mt-0.5 text-[0.7rem] leading-[1.4] text-[#607282] sm:text-[0.76rem]">
                Ask about Ayurveda, IP & regulations...
              </p>
            </div>

            {/* LANGUAGE */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLanguageOpen(!languageOpen)}
                className="inline-flex items-center gap-1.5 rounded-[10px] border-2 border-[#D8892F] bg-white px-2.5 py-2 text-[0.78rem] font-medium text-[#B96F22] transition-colors hover:bg-[#FFF4E3] sm:px-3 sm:text-[0.85rem]"
              >
                {language}
                <ChevronDown size={15} />
              </button>

              {languageOpen && (
                <div className="absolute right-0 top-[45px] z-[10000] w-[155px] overflow-hidden rounded-[8px] border border-[#ead8c0] bg-white shadow-[0_8px_20px_rgba(216,137,47,0.18)]">
                  <div className="max-h-[250px] overflow-y-auto py-1">
                    {languages.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setLanguage(item);
                          setLanguageOpen(false);
                        }}
                        className={`w-full border-0 px-3 py-2 text-left text-[0.76rem] ${
                          language === item
                            ? 'bg-[#FFF4E3] font-semibold text-[#B96F22]'
                            : 'bg-white text-[#607282] hover:bg-[#FFF9F0]'
                        }`}
                      >
                        {language === item && (
                          <span className="mr-2 text-[#D8892F]">✓</span>
                        )}
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CLOSE */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setLanguageOpen(false);
              }}
              aria-label="Close assistant"
              className="grid h-8 w-8 shrink-0 place-items-center border-0 bg-transparent text-[#B96F22] transition-colors hover:text-[#D8892F] sm:h-9 sm:w-9"
            >
              <X size={21} />
            </button>
          </div>

          {/* ORANGE ACCENT LINE */}
          <div className="h-[3px] shrink-0 bg-[#D8892F]" />

          {/* CHAT BODY */}
          <div className="flex-1 overflow-y-auto bg-white px-4 py-4 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[310px] rounded-[18px] px-4 py-3 text-[0.90rem] leading-[1.55] sm:text-[0.95rem] ${
                    msg.sender === 'user'
                      ? 'rounded-tr-[6px] bg-[#D8892F] text-white'
                      : 'rounded-tl-[6px] bg-[#FFF9F0] text-[#607282]'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-[18px] rounded-tl-[6px] bg-[#FFF9F0] px-4 py-3 text-[0.90rem] text-[#607282]">
                  <Loader2 className="animate-spin" size={16} />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            {/* SUGGESTIONS (Show only if conversation is just starting or as quick prompts) */}
            <div className="mt-4 pt-2">
              <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[#D8892F]">
                Try asking
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  'Check patentability',
                  'What is ABS?',
                  'Search prior art',
                  'Know your product',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setMessage(suggestion)}
                    className="rounded-full border border-[#ead8c0] bg-white px-3 py-2 text-[0.7rem] text-[#B96F22] transition-colors hover:border-[#D8892F] hover:bg-[#FFF4E3]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="shrink-0 border-t border-[#eee2d4] bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2 rounded-[14px] border border-[#ead8c0] bg-white px-3 py-2 focus-within:border-[#D8892F]">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                placeholder="Type your question..."
                className="min-w-0 flex-1 border-0 bg-transparent py-2 text-[0.82rem] text-[#607282] outline-none placeholder:text-[#9aa6b2] sm:text-[0.88rem]"
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={!message.trim() || loading}
                aria-label="Send message"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#D8892F] text-white transition-colors hover:bg-[#B96F22] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </div>

            <p className="mt-2 text-center text-[0.6rem] text-[#9aa6b2]">
              IP-SAKTI provides research guidance, not legal advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
}