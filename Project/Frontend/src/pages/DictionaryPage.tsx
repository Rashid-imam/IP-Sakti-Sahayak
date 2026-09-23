import { useState } from 'react';
import { Search, Volume2 } from 'lucide-react';
import PageFrame from '../components/PageFrame';

export default function DictionaryPage() {
  const [term, setTerm] = useState('Rasayana');

  return (
    <PageFrame>
      {/* Page Heading */}
      <div className="mb-10 max-w-[950px]">

        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#D8892F]" />

          <span className="text-[1.25rem] font-bold uppercase tracking-[0.16em] text-[#D8892F]">
            Shared vocabulary
          </span>
        </div>

        <h1 className="m-0 text-[2.35rem] font-normal leading-[1.15] tracking-[-0.02em] text-[#245C3A] max-[768px]:text-[2rem] max-[480px]:text-[1.7rem]">
          Ayurveda Dictionary
        </h1>

        <p className="mt-4 max-w-[760px] text-base leading-7 text-[#607282]">
          Explore classical terms with simple explanations and connections to modern research language.
        </p>

      </div>

      {/* Search */}
      <div className="mb-6 flex w-full max-w-[640px] items-center gap-2 rounded-[6px] border border-[#d9e3eb] bg-white py-[0.45rem] pl-4 pr-[0.45rem]">

        <Search
          size={19}
          className="shrink-0 text-[#397153]"
        />

        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search an Ayurvedic or Sanskrit term..."
          className="min-w-0 flex-1 border-0 bg-transparent outline-0 text-[#17382A] placeholder:text-[#9aa8b2]"
        />

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-[#397153] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245C3A]"
        >
          Search
        </button>

      </div>

      {/* Dictionary Card */}
      <div className="w-full max-w-[760px] rounded-[8px] border border-[#d9e3eb] bg-white p-[1.8rem] max-[480px]:p-[1.2rem]">

        {/* Term Header */}
        <div className="mb-[1.3rem] flex items-center gap-4 max-[480px]:flex-wrap max-[480px]:items-start">

          {/* IP-SAKTI Logo */}
          <div className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-[8px] bg-[#EAF4ED]">
            <img
              src="/ip-logo.png"
              alt="IP-SAKTI"
              className="h-[43px] w-[43px] object-contain"
            />
          </div>

          <div>

            <div className="inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[#D8892F]">
              <span className="h-px w-[22px] bg-current opacity-70" />
              Sanskrit term
            </div>

            <h2 className="my-[0.2rem] text-[2rem] text-[#245C3A]">
              {term || 'Rasayana'}
            </h2>

            <span className="text-[0.8rem] italic text-[#8a98a5]">
              / ra-sa-ya-na /
            </span>

          </div>

          <button
            type="button"
            className="ml-auto inline-flex items-center gap-[0.35rem] rounded-[5px] border border-[#d9e3eb] bg-[#EAF4ED] px-[0.8rem] py-2 text-[0.8rem] font-semibold text-[#397153] transition-colors hover:bg-[#DDEDE3] max-[480px]:ml-0"
          >
            <Volume2 size={17} />
            Listen
          </button>

        </div>

        {/* Meaning / Modern Terminology */}
        <div className="mb-[1.3rem] grid grid-cols-2 gap-6 max-[768px]:grid-cols-1">

          <div>

            <h3 className="font-sans text-[0.9rem] text-[#397153]">
              Meaning
            </h3>

            <p className="text-[0.88rem] leading-[1.6] text-[#607282]">
              Rejuvenation, nourishment and the preservation of vitality. In
              Ayurveda, Rasayana describes approaches that support resilience
              and healthy longevity.
            </p>

          </div>

          <div>

            <h3 className="font-sans text-[0.9rem] text-[#397153]">
              Modern terminology
            </h3>

            <p className="text-[0.88rem] leading-[1.6] text-[#607282]">
              Often discussed alongside preventive wellness, restorative care
              and adaptogenic approaches — depending on context.
            </p>

          </div>

        </div>

        {/* Related Terms */}
        <h3 className="font-sans text-[0.9rem] text-[#397153]">
          Related terms
        </h3>

        <div className="flex flex-wrap gap-[0.4rem]">

          <span className="rounded-[4px] border border-[#d9e3eb] bg-[#EAF4ED] px-[0.7rem] py-[0.35rem] text-[#245C3A]">
            Ojas
          </span>

          <span className="rounded-[4px] border border-[#d9e3eb] bg-[#EAF4ED] px-[0.7rem] py-[0.35rem] text-[#245C3A]">
            Medhya
          </span>

          <span className="rounded-[4px] border border-[#d9e3eb] bg-[#EAF4ED] px-[0.7rem] py-[0.35rem] text-[#245C3A]">
            Balya
          </span>

          <span className="rounded-[4px] border border-[#d9e3eb] bg-[#EAF4ED] px-[0.7rem] py-[0.35rem] text-[#245C3A]">
            Rejuvenation
          </span>

        </div>

      </div>
    </PageFrame>
  );
}