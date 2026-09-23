import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Download,
  FileText,
  Image as ImageIcon,
  Mic,
  Plus,
  Send,
  X,
} from 'lucide-react';
import { quickActions } from '../data';

export default function AssistantBox({
  compact = false,
}: {
  compact?: boolean;
}) {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [jurisdiction, setJurisdiction] = useState('India');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const documentInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    navigate('/research', {
      state: {
        query,
        jurisdiction,
        files,
      },
    });
  };

  const handleDownload = () => {
    if (!query.trim()) {
      return;
    }

    const content = `IP-SAKTI Sahayak Research Query

Jurisdiction: ${jurisdiction}

Question:
${query}

Attached Files:
${files.length > 0 ? files.map((file) => file.name).join('\n') : 'None'}
`;

    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'ip-sakti-research-query.txt';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);

    setFiles((previousFiles) => [
      ...previousFiles,
      ...selectedFiles,
    ]);

    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((previousFiles) =>
      previousFiles.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  return (
    <div className={`p-4 ${compact ? 'p-[1.1rem]' : ''}`}>

      <div className="mb-4 flex items-center gap-[0.75rem]">
        <div className="relative h-11 w-11 shrink-0">
          <div className="absolute inset-0 rounded-full bg-[#D8892F]/20 blur-[5px]" />

          <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-[#d9e3eb] bg-white shadow-[0_3px_12px_rgba(36,92,58,0.15)]">
            <img
              src="/ip-logo.png"
              alt="IP-SAKTI"
              className="h-[34px] w-[34px] object-contain"
            />

            <span className="pointer-events-none absolute -left-5 top-[-12px] h-[70px] w-[18px] rotate-[25deg] bg-white/60 blur-[3px]" />
          </div>
        </div>

        <div>
          <strong className="block text-[1rem] font-bold text-[#245C3A]">
            IP-SAKTI Sahayak
          </strong>

          <span className="block text-[0.75rem] text-[#607282]">
            Your Ayurveda IP research copilot
          </span>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-[0.45rem]">
        <span className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-[#607282]">
          Research focus
        </span>

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-[0.4rem] rounded border border-[#245C3A] bg-[#245C3A] px-[0.7rem] py-[0.37rem] text-[0.8rem] text-white transition-colors hover:bg-[#397153]"
          >
            <span className="rounded-[3px] bg-[#E5C98B] px-1 py-px text-[0.62rem] font-bold text-[#245C3A]">
              {jurisdiction === 'India' ? 'IN' : 'INT'}
            </span>

            {jurisdiction}

            <ChevronDown
              size={14}
              className={`transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full z-20 mt-1 min-w-[150px] overflow-hidden rounded-md border border-[#d9e3eb] bg-white shadow-[0_6px_18px_rgba(36,92,58,0.12)]">
              <button
                type="button"
                onClick={() => {
                  setJurisdiction('India');
                  setDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[0.8rem] text-[#245C3A] transition-colors hover:bg-[#EAF4ED]"
              >
                <span className="rounded-[3px] bg-[#E5C98B] px-1 py-px text-[0.6rem] font-bold text-[#245C3A]">
                  IN
                </span>

                India
              </button>

              <button
                type="button"
                onClick={() => {
                  setJurisdiction('International');
                  setDropdownOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[0.8rem] text-[#245C3A] transition-colors hover:bg-[#EAF4ED]"
              >
                <span className="rounded-[3px] bg-[#E5C98B] px-1 py-px text-[0.6rem] font-bold text-[#245C3A]">
                  INT
                </span>

                International
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border border-[#d9e3eb] bg-[#F0F7F2] p-3">

        <textarea
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ask IP-SAKTI Sahayak about your formulation, patent or traditional knowledge question..."
          aria-label="Ask IP-SAKTI Sahayak"
          rows={compact ? 2 : 4}
          className="w-full resize-none border-0 bg-transparent text-[0.95rem] text-[#17382A] outline-none placeholder:text-[#607282]"
        />

        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="inline-flex max-w-[220px] items-center gap-1.5 rounded border border-[#d9e3eb] bg-white px-2 py-1 text-[0.7rem] text-[#245C3A]"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon size={13} />
                ) : (
                  <FileText size={13} />
                )}

                <span className="truncate">
                  {file.name}
                </span>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="shrink-0 text-[#607282] transition-colors hover:text-[#245C3A]"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Hidden Document Input */}
        <input
          ref={documentInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Hidden Image Input */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* QUERY ACTIONS */}
        <div className="mt-2 flex items-center justify-between gap-2">

          {/* Upload Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUploadOpen(!uploadOpen)}
              className={`grid h-9 w-9 place-items-center rounded-full border bg-white transition-all ${
                uploadOpen
                  ? 'border-[#245C3A] bg-[#EAF4ED] text-[#245C3A] shadow-[0_2px_8px_rgba(36,92,58,0.12)]'
                  : 'border-[#d9e3eb] text-[#607282] hover:border-[#245C3A] hover:bg-[#EAF4ED] hover:text-[#245C3A]'
              }`}
              aria-label="Upload files"
              title="Upload"
            >
              <Plus
                size={18}
                className={`transition-transform duration-200 ${
                  uploadOpen ? 'rotate-45' : ''
                }`}
              />
            </button>

            {/* Upload Dropdown */}
            {uploadOpen && (
              <div className="absolute bottom-full left-0 z-30 mb-2 w-[180px] overflow-hidden rounded-md border border-[#d9e3eb] bg-white shadow-[0_6px_18px_rgba(36,92,58,0.14)]">
                <button
                  type="button"
                  onClick={() => {
                    documentInputRef.current?.click();
                    setUploadOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[0.8rem] text-[#245C3A] transition-colors hover:bg-[#EAF4ED]"
                >
                  <FileText size={16} />
                  <span>Upload Document</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Microphone */}
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#d9e3eb] bg-white text-[#607282] transition-all hover:border-[#245C3A] hover:bg-[#EAF4ED] hover:text-[#245C3A] hover:shadow-[0_2px_8px_rgba(36,92,58,0.1)]"
              aria-label="Use microphone"
              title="Voice input"
            >
              <Mic size={17} />
            </button>

            {/* Download */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={!query.trim()}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#d9e3eb] bg-white text-[#607282] transition-all hover:border-[#245C3A] hover:bg-[#EAF4ED] hover:text-[#245C3A] hover:shadow-[0_2px_8px_rgba(36,92,58,0.1)] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Download research query"
              title="Download"
            >
              <Download size={17} />
            </button>

            {/* Research Button */}
            <button
              type="button"
              onClick={submit}
              disabled={!query.trim()}
              aria-label="Send research query"
              title="Send research query"
              className="grid h-11 w-11 place-items-center rounded-full bg-[#D8892F] text-white shadow-[0_8px_18px_rgba(216,137,47,0.32)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#BD7120] hover:shadow-[0_10px_22px_rgba(216,137,47,0.38)] disabled:cursor-not-allowed disabled:bg-[#E4C88F] disabled:text-white/80 disabled:shadow-none"
            >
              <Send size={17} className="translate-x-[1px]" />
            </button>

          </div>
        </div>
      </div>

      <div className="mb-[0.45rem] mt-4 text-[0.76rem] font-bold text-[#607282]">
        Try asking about
      </div>

      <div className="flex flex-wrap gap-[0.4rem]">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() =>
              setQuery(
                `Help me research ${action.label.toLowerCase()} for my Ayurvedic product`,
              )
            }
            className="inline-flex items-center gap-[0.35rem] rounded border-0 bg-[#EAF4ED] px-[0.7rem] py-[0.4rem] text-[0.78rem] text-[#245C3A] transition-colors hover:bg-[#DDEDE3]"
          >
            <action.icon size={15} />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}