import { useLocation } from 'react-router-dom';

export default function TopBar({
  onTextSize,
}: {
  onTextSize: () => void;
}) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`${isHomePage ? 'bg-[#245C3A] text-white' : 'bg-[#F7F1E1] text-[#245C3A]'} border-b border-[#D8892F] text-[0.72rem]`}>
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-[0.3rem] md:px-6">

        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">

          <a
            href="#main-content"
            className={`${isHomePage ? 'text-white' : 'text-[#245C3A]'} no-underline hover:underline`}
          >
            Skip to main content
          </a>

          <span className={`h-3 w-px ${isHomePage ? 'bg-white/40' : 'bg-[#245C3A]/30'}`} />

          <button
            className={`border-0 bg-transparent p-0 ${isHomePage ? 'text-white' : 'text-[#245C3A]'} hover:underline`}
          >
            Screen Reader Access
          </button>

          <span className={`hidden h-3 w-px sm:block ${isHomePage ? 'bg-white/40' : 'bg-[#245C3A]/30'}`} />

          <button
            onClick={onTextSize}
            className={`hidden border-0 bg-transparent p-0 ${isHomePage ? 'text-white' : 'text-[#245C3A]'} hover:underline sm:block`}
            aria-label="Toggle larger text"
          >
            A+
          </button>

          <button
            className={`hidden border-0 bg-transparent p-0 ${isHomePage ? 'text-white' : 'text-[#245C3A]'} hover:underline sm:block`}
            aria-label="Normal text size"
          >
            A
          </button>

          <button
            className={`hidden border-0 bg-transparent p-0 ${isHomePage ? 'text-white' : 'text-[#245C3A]'} hover:underline sm:block`}
            aria-label="Smaller text"
          >
            A-
          </button>

          <span className={`hidden h-3 w-px sm:block ${isHomePage ? 'bg-white/40' : 'bg-[#245C3A]/30'}`} />

          <button
            className={`hidden items-center gap-1 border-0 bg-transparent p-0 ${isHomePage ? 'text-white' : 'text-[#245C3A]'} hover:underline sm:flex`}
          >
            <span className={`inline-block h-3 w-3 rounded-full border ${isHomePage ? 'border-white' : 'border-[#245C3A]'}`} />
            High Contrast
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">

          <button
            className={`border-0 bg-transparent p-0 ${isHomePage ? 'text-white' : 'text-[#245C3A]'} hover:underline`}
          >
            हिंदी
          </button>

          <span className={`h-3 w-px ${isHomePage ? 'bg-white/40' : 'bg-[#245C3A]/30'}`} />

          <button
            className={`border-0 bg-transparent p-0 ${isHomePage ? 'text-white' : 'text-[#245C3A]'} hover:underline`}
          >
            English
          </button>

          <span className={`hidden h-3 w-px sm:block ${isHomePage ? 'bg-white/40' : 'bg-[#245C3A]/30'}`} />

          <span className={`hidden text-[0.65rem] sm:inline ${isHomePage ? 'text-white/80' : 'text-[#245C3A]/70'}`}>
            Last Updated: 16 September 2026
          </span>

        </div>
      </div>
    </div>
  );
}