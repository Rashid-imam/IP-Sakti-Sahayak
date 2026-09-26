import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'react-router-dom'; // NEW: URL params padhne ke liye
import ReadinessScoreCard from './ReadinessScoreCard'; // ✅ NEW: Import ReadinessScoreCard
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  Leaf,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
  Loader2,
  Mic,
  Download,
  BookOpen,
  Globe2,
} from 'lucide-react';

type Chat = {
  id: number;
  title: string;
  time: string;
};

// NEW: metadata describing which statute/PDF + page a message is citing
type SourceMetadata = {
  file_name: string;
  page_number: number;
  label?: string; // optional display label, e.g. "Section 3(h), Biological Diversity Act"
  act_name?: string;
  section?: string;
};

// ✅ UPDATED: Added readiness score fields
type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  source_metadata?: SourceMetadata; // kept for backward compatibility with older responses
  citations?: SourceMetadata[]; // NEW: one entry per statute actually referenced in the answer
  // ✅ NEW: Readiness Score Fields
  readiness_score?: number;
  readiness_level?: string;
  readiness_color?: string;
  readiness_breakdown?: {
    clarity: number;
    legal: number;
    documentation: number;
    international: number;
  };
};

// NEW: shape of the active split-screen PDF panel
type ActivePdf = {
  file_name: string;
  page_number: number;
} | null;

export default function AskSaktiAI() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  // Backend States
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // NEW: which PDF (if any) is currently open in the split-screen panel
  const [activePdf, setActivePdf] = useState<ActivePdf>(null);
  
  // NEW: Jurisdiction State
  const [jurisdiction, setJurisdiction] = useState('India');
  const [jurisdictionOpen, setJurisdictionOpen] = useState(false);
  
  // NEW: Hook to read query parameters from URL
  const [searchParams, setSearchParams] = useSearchParams();

  // ====== NEW STATES FOR REPORT GENERATION ======
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  // ==============================================

  const [recentChats] = useState<Chat[]>([
    {
      id: 1,
      title: 'Patentability of Ashwagandha formulation',
      time: 'Today',
    },
    {
      id: 2,
      title: 'Traditional knowledge similarity',
      time: 'Today',
    },
    {
      id: 3,
      title: 'ABS requirements for Ayurveda',
      time: 'Yesterday',
    },
    {
      id: 4,
      title: 'Ayurvedic formulation regulations',
      time: 'Yesterday',
    },
    {
      id: 5,
      title: 'Can this formulation be patented?',
      time: 'Sep 17',
    },
  ]);

  const quickPrompts = [
    {
      label: 'Patentability',
      text: 'Can this Ayurveda formulation be patented?',
    },
    {
      label: 'Traditional Knowledge',
      text: 'Is this formulation already known as traditional knowledge?',
    },
    {
      label: 'ABS requirements',
      text: 'What ABS requirements apply to this formulation?',
    },
    {
      label: 'Know my formulation',
      text: 'Help me understand the IP and regulatory requirements for my formulation.',
    },
  ];

  // Auto-scroll effect
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // UPDATE: handleSend ab ek optional string le sakta hai auto-trigger ke liye
  const handleSend = async (autoQuery?: string) => {
    const textToProcess = (typeof autoQuery === 'string' ? autoQuery.trim() : message.trim()) || (uploadedFile ? `Analyze this document: ${uploadedFile.name}` : '');
    
    if (!textToProcess || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: textToProcess,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setUploadedFile(null);
    setIsLoading(true);

    try {
      // API call to backend
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToProcess,
          jurisdiction: jurisdiction, // NEW: Updated to pass selected jurisdiction
          language: "English",
          session_id: currentSessionId // IMPORTANT: Send current session ID to backend so chat continues
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to backend');
      }

      const data = await response.json();

      // ====== NEW: SAVE SESSION ID FROM BACKEND ======
      if (data.session_id) {
        setCurrentSessionId(data.session_id);
      }
      // ===============================================

      // ✅ UPDATED: Extract readiness score data from backend response
      const botMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.answer || data.response || data.result || "I couldn't process that response.",
        // NEW: prefer the multi-citation array; fall back to wrapping a single
        // source_metadata in an array for backward compatibility.
        citations: data.citations && data.citations.length > 0
          ? data.citations
          : (data.source_metadata ? [data.source_metadata] : undefined),
        // ✅ NEW: Readiness Score Fields (will be undefined if backend doesn't send them)
        readiness_score: data.readiness_score,
        readiness_level: data.readiness_level,
        readiness_color: data.readiness_color,
        readiness_breakdown: data.readiness_breakdown,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: '⚠️ Sorry, I could not reach the backend server. Please ensure FastAPI is running on port 8000.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Page load par URL check karo aur agar query hai toh auto-send karo
  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      // Query ko URL se hata do taaki refresh hone par wapas na chale
      searchParams.delete('query');
      setSearchParams(searchParams, { replace: true });
      
      // Auto-trigger the search logic
      handleSend(query);
    }
  }, []);

  const handleQuickPrompt = (text: string) => {
    setMessage(text);
  };

  const handleNewChat = () => {
    setMessages([]);
    setMessage('');
    setUploadedFile(null);
    setActivePdf(null); // NEW: close any open PDF panel on new chat
    setCurrentSessionId(null); // NEW: reset session ID on new chat
  };

  // --- VOICE INPUT ---
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };

    recognition.start();
  };

  // ====== UPDATED: REAL REPORT DOWNLOAD LOGIC ======
  const handleDownloadReport = async () => {
    if (!currentSessionId) {
      alert("Please start a chat first before generating a report.");
      return;
    }

    setIsGeneratingReport(true);

    try {
      const response = await fetch("http://localhost:8000/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          session_id: currentSessionId,
          product_name: "Ayurvedic Formulation", // Can be dynamic in the future
          applicant_name: "IP-SAKTI User"
        })
      });

      const result = await response.json();

      if (result.status === "SUCCESS" && result.download_url) {
        // Automatically start download using the backend URL
        window.location.href = `http://localhost:8000${result.download_url}`;
      } else {
        alert("Failed to generate report.");
      }
    } catch (error) {
      console.error("Report download failed:", error);
      alert("Error connecting to report generator.");
    } finally {
      setIsGeneratingReport(false);
    }
  };
  // =================================================

  // NEW: open the split-screen PDF panel for a given citation
  const handleOpenStatutePdf = (source: SourceMetadata) => {
    setActivePdf({ file_name: source.file_name, page_number: source.page_number });
  };

  // NEW: close the split-screen PDF panel
  const handleClosePdfPanel = () => {
    setActivePdf(null);
  };

  return (
    <div 
      className="flex w-full overflow-hidden bg-white text-[#245C3A]"
      /* FIX: subtracting approx header height so main scrollbar doesn't appear */
      style={{ height: 'calc(100vh - 80px)' }}
    >
      {/* =========================================================
          MOBILE OVERLAY
      ========================================================== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================== */}
      <aside
        className={`
          flex flex-col border-r border-[#dce8df] bg-[#f7faf8]
          transition-all duration-300 h-full
          ${sidebarOpen ? 'w-[285px]' : 'w-0'}
          overflow-hidden shrink-0
        `}
      >
        <div className="flex h-full min-w-[285px] flex-col">
          {/* New Chat */}
          <div className="px-3 pt-5 shrink-0">
            <button
              onClick={handleNewChat}
              className="flex w-full items-center gap-2.5 rounded-xl border border-[#cfe0d5] bg-white px-4 py-3 text-[0.82rem] font-semibold text-[#245C3A] shadow-sm transition hover:bg-[#f1f7f3]"
            >
              <Plus size={17} />
              New chat
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pt-3 shrink-0">
            <div className="flex items-center gap-2 rounded-lg bg-[#edf3ef] px-3 py-2.5">
              <Search size={15} className="text-[#82918a]" />

              <input
                placeholder="Search chats"
                className="w-full bg-transparent text-[0.76rem] text-[#345443] outline-none placeholder:text-[#8b9891]"
              />
            </div>
          </div>

          {/* Recent chats */}
          <div className="mt-5 flex-1 overflow-y-auto px-3">
            <div className="mb-2 px-2 text-[0.67rem] font-bold uppercase tracking-[0.1em] text-[#82918a]">
              Recent
            </div>

            <div className="space-y-1">
              {recentChats.map((chat) => (
                <button
                  key={chat.id}
                  className="group flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition hover:bg-white"
                >
                  <MessageSquare
                    size={15}
                    className="mt-0.5 shrink-0 text-[#7b8b83]"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.76rem] font-medium text-[#4c6356]">
                      {chat.title}
                    </p>

                    <p className="mt-0.5 text-[0.62rem] text-[#9aa59f]">
                      {chat.time}
                    </p>
                  </div>

                  <MoreHorizontal
                    size={15}
                    className="mt-0.5 hidden text-[#87948d] group-hover:block"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* =========================================================
          MAIN CONTENT AREA (NEW: wraps chat + split-screen PDF panel)
      ========================================================== */}
      <div className="flex min-w-0 flex-1 overflow-hidden h-full">
        {/* =======================================================
            CHAT PANE (left side; shrinks to 50% when PDF panel open)
        ======================================================== */}
        <section
          className={`relative flex min-w-0 flex-col bg-white transition-all duration-300 ${
            activePdf ? 'w-1/2 border-r border-[#dce8df]' : 'w-full'
          }`}
        >
          {/* =======================================================
              CHAT CONTENT (Flex-1 allows scrolling)
          ======================================================== */}
          <div className="flex-1 overflow-y-auto w-full">
            {messages.length === 0 ? (
              /* ===================================================
                 EMPTY STATE
              ==================================================== */
              <div className="flex min-h-full items-center justify-center px-4 pb-10 pt-1">
                <div className="w-full max-w-[780px] text-center">
                  {/* AI icon */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#dce8df] bg-[#f2f8f4] shadow-sm">
                    <Leaf size={29} className="text-[#245C3A]" />
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#D8892F]">
                      <Sparkles size={13} />
                      IP Research Copilot
                    </div>

                    <h2 className="text-[2rem] font-normal tracking-[-0.025em] text-[#245C3A] sm:text-[2.4rem]">
                      How can Sakti help you?
                    </h2>

                    <p className="mx-auto mt-3 max-w-[580px] text-[0.9rem] leading-[1.6] text-[#718078]">
                      Ask questions about patents, Ayurveda, traditional
                      knowledge, biodiversity, formulations and regulatory
                      requirements.
                    </p>
                  </div>

                  {/* Quick prompts */}
                  <div className="mt-9 grid grid-cols-2 gap-3 max-[600px]:grid-cols-1 pb-10">
                    {quickPrompts.map((prompt) => (
                      <button
                        key={prompt.label}
                        onClick={() => handleQuickPrompt(prompt.text)}
                        className="group rounded-xl border border-[#dce8df] bg-white p-4 text-left transition hover:border-[#b9d1c0] hover:bg-[#f7fbf8] hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[0.78rem] font-semibold text-[#245C3A]">
                            {prompt.label}
                          </span>

                          <ChevronRight
                            size={15}
                            className="text-[#9aa69f] transition group-hover:translate-x-0.5 group-hover:text-[#D8892F]"
                          />
                        </div>

                        <p className="mt-2 text-[0.72rem] leading-[1.45] text-[#7d8b84]">
                          {prompt.text}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ===================================================
                 MESSAGES
              ==================================================== */
              <div className="mx-auto w-full max-w-[820px] px-4 py-8 sm:px-6">
                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`mb-7 flex gap-3 ${
                      item.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    {item.role === 'assistant' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf6ef]">
                        <Leaf size={16} className="text-[#245C3A]" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[0.88rem] leading-[1.6] ${
                        item.role === 'user'
                          ? 'rounded-br-md bg-[#245C3A] text-white whitespace-pre-wrap'
                          : 'rounded-bl-md bg-[#f3f7f4] text-[#405a4b]'
                      }`}
                    >
                      {item.role === 'assistant' ? (
                        <>
                          <ReactMarkdown
                            components={{
                              p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                              strong: ({ node, ...props }) => <strong className="font-bold text-[#17382A]" {...props} />,
                              ul: ({ node, ...props }) => <ul className="mb-3 list-disc pl-5" {...props} />,
                              ol: ({ node, ...props }) => <ol className="mb-3 list-decimal pl-5" {...props} />,
                              li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                              h1: ({ node, ...props }) => <h1 className="mb-2 mt-4 text-xl font-bold text-[#17382A]" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="mb-2 mt-3 text-lg font-bold text-[#17382A]" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="mb-2 mt-2 text-base font-bold text-[#17382A]" {...props} />,
                            }}
                          >
                            {item.content}
                          </ReactMarkdown>

                          {/* NEW: one citation badge + "Open Statute PDF" button PER referenced statute */}
                          {item.citations && item.citations.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#e1ebe3] pt-3">
                              {item.citations.map((citation, idx) => (
                                <button
                                  key={`${citation.file_name}-${citation.page_number}-${idx}`}
                                  onClick={() => handleOpenStatutePdf(citation)}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D8892F]/40 bg-[#fdf3e7] px-2.5 py-1 text-[0.68rem] font-semibold text-[#D8892F] transition hover:bg-[#fbe7cd]"
                                  title="Open Statute PDF"
                                >
                                  <BookOpen size={12} />
                                  {citation.label ||
                                    (citation.act_name
                                      ? `${citation.act_name}${citation.section ? ` — ${citation.section}` : ''}`
                                      : `${citation.file_name} · Page ${citation.page_number}`)}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* ✅ NEW: READINESS SCORE CARD - displayed below citations */}
                          {item.readiness_score !== undefined && (
                            <ReadinessScoreCard 
                              response={{
                                readiness_score: item.readiness_score,
                                readiness_level: item.readiness_level,
                                readiness_color: item.readiness_color,
                                readiness_breakdown: item.readiness_breakdown,
                              }}
                              query={messages[messages.findIndex(m => m.id === item.id) - 1]?.content || ''}
                            />
                          )}
                        </>
                      ) : (
                        item.content
                      )}
                    </div>
                  </div>
                ))}

                {/* Loader UI */}
                {isLoading && (
                  <div className="mb-7 flex gap-3 justify-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#edf6ef]">
                      <Leaf size={16} className="text-[#245C3A]" />
                    </div>
                    <div className="flex items-center gap-2 max-w-[75%] rounded-2xl rounded-bl-md bg-[#f3f7f4] px-4 py-3 text-[0.88rem] text-[#405a4b]">
                      <Loader2 size={16} className="animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* =======================================================
              COMPOSER (Fix: Shrink-0 keeps it at bottom)
          ======================================================= */}
          <div className="w-full shrink-0 bg-white px-4 pb-4 pt-2 sm:px-6">
            <div className="mx-auto w-full max-w-[820px]">
              {/* File preview */}
              {uploadedFile && (
                <div className="mb-2 flex items-center justify-between rounded-lg border border-[#dce8df] bg-[#f7faf8] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#245C3A]" />

                    <span className="max-w-[300px] truncate text-[0.72rem] text-[#607282]">
                      {uploadedFile.name}
                    </span>
                  </div>

                  <button
                    onClick={() => setUploadedFile(null)}
                    className="rounded p-1 text-[#718078] hover:bg-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Composer */}
              <div className="rounded-2xl border border-[#cfded4] bg-white shadow-[0_5px_25px_rgba(36,92,58,0.08)] transition focus-within:border-[#9bbca7] focus-within:shadow-[0_5px_30px_rgba(36,92,58,0.12)]">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={isLoading}
                  placeholder="Ask Sakti anything..."
                  rows={2}
                  className="max-h-32 min-h-[64px] w-full resize-none border-0 bg-transparent px-4 pt-4 text-[0.88rem] leading-[1.5] text-[#345443] outline-none placeholder:text-[#89968f]"
                />

                <div className="flex items-center justify-between px-3 pb-3">
                  {/* Left Side: Attachment & Jurisdiction Toggle */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <label className="cursor-pointer rounded-lg p-2 text-[#718078] transition hover:bg-[#f2f7f4] hover:text-[#245C3A]" title="Attach document">
                        <Paperclip size={18} />

                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (!file) return;

                            if (file.size > 10 * 1024 * 1024) {
                              alert(
                                'Please upload a file smaller than 10 MB.'
                              );
                              return;
                            }

                            setUploadedFile(file);
                          }}
                        />
                      </label>

                      <span className="hidden text-[0.65rem] text-[#9aa59f] sm:block ml-2">
                        Attach research document
                      </span>
                    </div>

                    {/* Jurisdiction Dropdown */}
                    <div className="relative border-l border-[#dce8df] pl-3 ml-1">
                      <button
                        type="button"
                        onClick={() => setJurisdictionOpen((prev) => !prev)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#245C3A] px-3 text-[0.68rem] font-semibold text-white shadow-sm transition hover:bg-[#1d4d30]"
                      >
                        <Globe2 size={14} />
                        <span>{jurisdiction}</span>
                        <ChevronRight
                          size={13}
                          className={`transition-transform duration-200 ${jurisdictionOpen ? 'rotate-90' : ''}`}
                        />
                      </button>

                      {jurisdictionOpen && (
                        <div className="absolute bottom-[calc(100%+8px)] left-3 z-50 w-[150px] overflow-hidden rounded-xl border border-[#dce8df] bg-white p-1.5 shadow-[0_12px_30px_rgba(36,92,58,0.16)]">
                          {['India', 'International'].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setJurisdiction(option);
                                setJurisdictionOpen(false);
                              }}
                              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[0.72rem] font-semibold transition ${
                                jurisdiction === option
                                  ? 'bg-[#EAF4ED] text-[#245C3A]'
                                  : 'text-[#607282] hover:bg-[#F5F8F6]'
                              }`}
                            >
                              <span className="text-sm">{option === 'India' ? '🇮🇳' : '🌐'}</span>
                              {option}
                              {jurisdiction === option && (
                                <span className="ml-auto text-[#D8892F]">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Voice, Download Report, and Send buttons */}
                  <div className="flex items-center gap-2">
                    {/* Voice Input / Mic Button */}
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className="cursor-pointer rounded-lg p-2 text-[#718078] transition hover:bg-[#f2f7f4] hover:text-[#245C3A]"
                      title="Voice Search (Speech to Text)"
                    >
                      <Mic size={18} />
                    </button>

                    {/* UPDATED: Download Report Button with Loader */}
                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      disabled={isGeneratingReport}
                      className={`cursor-pointer rounded-lg p-2 text-[#718078] transition hover:bg-[#f2f7f4] hover:text-[#245C3A] ${
                        isGeneratingReport ? 'opacity-50 cursor-wait' : ''
                      }`}
                      title={isGeneratingReport ? "Generating Report..." : "Download PDF Report"}
                    >
                      {isGeneratingReport ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    </button>

                    {/* Send Button */}
                    <button
                      onClick={() => handleSend()}
                      disabled={(!message.trim() && !uploadedFile) || isLoading}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D8892F] text-white transition hover:bg-[#c67a24] disabled:cursor-not-allowed disabled:opacity-35"
                      title="Send Message"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-2 text-center text-[0.61rem] text-[#9aa49f]">
                Sakti can make mistakes. Verify important legal or regulatory
                information with authoritative sources.
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================
            NEW: SPLIT-SCREEN PDF VIEWER PANE (right side, 50%)
        ======================================================== */}
        {activePdf && (
          <section className="flex w-1/2 min-w-0 flex-col bg-[#f7faf8]">
            {/* Panel header with close button */}
            <div className="flex items-center justify-between border-b border-[#dce8df] bg-white px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={16} className="shrink-0 text-[#245C3A]" />
                <span className="truncate text-[0.8rem] font-medium text-[#345443]">
                  {activePdf.file_name} · Page {activePdf.page_number}
                </span>
              </div>

              <button
                onClick={handleClosePdfPanel}
                className="rounded-lg p-1.5 text-[#718078] transition hover:bg-[#f2f7f4] hover:text-[#245C3A]"
                title="Close PDF viewer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Embedded PDF viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                key={`${activePdf.file_name}-${activePdf.page_number}`}
                // NOTE: absolute backend URL (not a relative "/docs/..." path) because the
                // React app runs on localhost:5173 while FastAPI serves the PDFs from
                // localhost:8000 -- a relative path would resolve against the wrong origin.
                // encodeURIComponent() handles file names with spaces/commas
                // (e.g. "THE BIOLOGICAL DIVERSITY ACT, 2002 (as amended...).pdf").
                src={`http://localhost:8000/statute-docs/${encodeURIComponent(activePdf.file_name)}#page=${activePdf.page_number}`}
                title={`${activePdf.file_name} viewer`}
                className="h-full w-full border-0"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
