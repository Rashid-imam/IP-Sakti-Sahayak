export default function TopBar({
  onTextSize,
}: {
  onTextSize: () => void;
}) {
  return (
    <div className="bg-[#245C3A] text-white text-[0.72rem]">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-[0.45rem] md:px-6">

        {/* Left accessibility links */}
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">

          <a
            href="#main-content"
            className="text-white no-underline hover:underline"
          >
            Skip to main content
          </a>

          <span className="h-3 w-px bg-white/40" />

          <button
            className="border-0 bg-transparent p-0 text-white hover:underline"
          >
            Screen Reader Access
          </button>

          <span className="hidden h-3 w-px bg-white/40 sm:block" />

          <button
            onClick={onTextSize}
            className="hidden border-0 bg-transparent p-0 text-white hover:underline sm:block"
            aria-label="Toggle larger text"
          >
            A+
          </button>

          <button
            className="hidden border-0 bg-transparent p-0 text-white hover:underline sm:block"
            aria-label="Normal text size"
          >
            A
          </button>

          <button
            className="hidden border-0 bg-transparent p-0 text-white hover:underline sm:block"
            aria-label="Smaller text"
          >
            A-
          </button>

          <span className="hidden h-3 w-px bg-white/40 sm:block" />

          <button
            className="hidden items-center gap-1 border-0 bg-transparent p-0 text-white hover:underline sm:flex"
          >
            <span className="inline-block h-3 w-3 rounded-full border border-white" />
            High Contrast
          </button>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-3 whitespace-nowrap">

          <button className="border-0 bg-transparent p-0 text-white hover:underline">
            हिंदी
          </button>

          <span className="h-3 w-px bg-white/40" />

          <button className="border-0 bg-transparent p-0 text-white hover:underline">
            English
          </button>

          <span className="hidden h-3 w-px bg-white/40 sm:block" />

          <span className="hidden text-[0.65rem] text-white/80 sm:inline">
            Last Updated: 16 September 2026
          </span>

        </div>
      </div>
    </div>
  );
}