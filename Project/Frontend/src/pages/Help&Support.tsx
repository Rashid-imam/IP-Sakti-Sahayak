import { ArrowRight, Play } from 'lucide-react';
import { heroImage, herbImage } from '../data';
import PageFrame from '../components/PageFrame';
import FAQ from '../components/FAQ';

export default function HelpSupport() {
  return (
    <PageFrame>
      <div className="mb-10 max-w-[950px]">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#D8892F]" />

          <span className="text-[1.25rem] font-bold uppercase tracking-[0.16em] text-[#D8892F] max-[480px]:text-[1rem]">
            Learn IP-SAKTI
          </span>
        </div>

        <h1 className="m-0 text-[2.35rem] font-normal leading-[1.15] tracking-[-0.02em] text-[#245C3A] max-[768px]:text-[2rem] max-[480px]:text-[1.7rem]">
          Simple guides for first-time users.
        </h1>

        <p className="mt-4 max-w-[760px] text-base leading-7 text-[#607282] max-[480px]:text-[0.88rem]">
          Short, practical walkthroughs to help you get useful research
          guidance from the platform.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-4 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1">
        {[
          'How to check patentability',
          'How to perform a TKDL search',
          'How ABS assessment works',
          `How to know your product's formulation`,
          'How to create an Innovation Passport',
        ].map((title, index) => (
          <div
            className="
              overflow-hidden
              rounded-[8px]
              border
              border-[#d9e3eb]
              bg-white
              transition-all
              duration-200
              hover:-translate-y-[2px]
              hover:border-[#8DB39B]
              hover:shadow-[0_8px_20px_rgba(36,92,58,0.09)]
            "
            key={title}
          >
            {/* Thumbnail */}
            <div
              className="
                relative
                flex
                h-[170px]
                items-center
                justify-center
                bg-cover
                bg-center
              "
              style={{
                backgroundImage: `url(${index % 2 ? herbImage : heroImage})`,
              }}
            >
              {/* Play Button */}
              <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-[#245C3A]/90 text-white shadow-[0_4px_14px_rgba(36,92,58,0.25)]">
                <Play size={18} fill="currentColor" />
              </span>

              {/* Duration */}
              <small className="absolute bottom-3 right-3 rounded-[3px] bg-[#245C3A]/90 px-[0.4rem] py-[0.2rem] text-[0.7rem] text-white">
                04:{index + 8}
              </small>
            </div>

            {/* Content */}
            <div className="p-4">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#D8892F]">
                GUIDE 0{index + 1}
              </span>

              <h3 className="mb-[0.7rem] mt-[0.3rem] text-[1.05rem] text-[#245C3A]">
                {title}
              </h3>

              <button
                type="button"
                className="
                  inline-flex
                  items-center
                  gap-[0.3rem]
                  border-0
                  bg-transparent
                  p-0
                  text-[0.8rem]
                  font-semibold
                  text-[#397153]
                  transition-colors
                  hover:text-[#245C3A]
                "
              >
                Watch guide
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
       {/* FAQ SECTION */}
              <FAQ />
    </PageFrame>
  );
}