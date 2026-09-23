import {
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  FlaskConical,
  Leaf,
  Play,
  Scale,
} from 'lucide-react';
import PageFrame from '../components/PageFrame';
import FAQ from '../components/FAQ';
import { heroImage, herbImage } from '../data';

export default function Library() {
  const collections = [
    {
      title: 'Legal & regulatory',
      desc: 'Patent laws, biodiversity, ABS and AYUSH regulations.',
      count: '48 resources',
      icon: Scale,
    },
    {
      title: 'Ayurveda & traditional knowledge',
      desc: 'Formulations, terminology and documented knowledge.',
      count: '126 resources',
      icon: Leaf,
    },
    {
      title: 'Research & publications',
      desc: 'Scientific information for deeper exploration.',
      count: '82 resources',
      icon: FlaskConical,
    },
  ];

  return (
    <PageFrame>
      <div className="mb-8 max-w-[950px]">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#D8892F]" />
          <span className="text-[1.25rem] font-bold uppercase tracking-[0.16em] text-[#D8892F]">
            Curated resources
          </span>
        </div>

        <h1 className="m-0 text-[2.35rem] font-normal leading-[1.15] tracking-[-0.02em] text-[#245C3A] max-[768px]:text-[2rem] max-[480px]:text-[1.7rem]">
          Knowledge collections and quick guides
        </h1>

        <p className="mt-4 max-w-[760px] text-base leading-7 text-[#607282]">
          Access the most useful research collections and practical walkthroughs in one place.
        </p>
      </div>

      <div className="relative mb-8 overflow-hidden rounded-[10px] border-2 border-[#D8892F] bg-[#FFF8EE]">
        <div className="absolute left-0 top-0 h-full w-[5px] bg-[#D8892F]" />

        <div className="flex items-center gap-5 px-6 py-5 max-[768px]:flex-col max-[768px]:items-start">
          <div className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[9px] bg-[#245C3A] text-[#E5C98B]">
            <BadgeCheck size={25} />
          </div>

          <div className="min-w-[220px] flex-1">
            <div className="mb-1 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.13em] text-[#D8892F]">
              <span className="h-px w-[22px] bg-current" />
              Premium Access
            </div>

            <h3 className="m-0 text-[1.2rem] font-semibold text-[#245C3A]">
              Advanced Research Collection
            </h3>

            <p className="mt-1 text-[0.84rem] leading-[1.5] text-[#607282]">
              Get access to an advanced dataset for deeper IP, patent and regulatory research.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-[#245C3A] bg-[#245C3A] px-5 py-3 text-[0.84rem] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#397153] hover:shadow-md max-[768px]:w-full"
          >
            View Subscription
            <ExternalLink size={16} />
          </button>
        </div>

        <div className="border-t border-[#eed4ad] bg-white/60 px-6 py-2.5 text-[0.72rem] text-[#8a98a5]">
          Advanced resources may be provided through an external service.
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-5 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1">
        {collections.map((collection) => (
          <div
            key={collection.title}
            className="flex flex-col rounded-[8px] border border-[#d9e3eb] bg-white p-5 transition-all duration-200 hover:-translate-y-[2px] hover:border-[#8DB39B] hover:shadow-[0_8px_20px_rgba(36,92,58,0.09)]"
          >
            <div className="mb-3 grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[8px] bg-[#EAF4ED] text-[#245C3A]">
              <collection.icon size={21} />
            </div>

            <h3 className="m-0 text-[1.05rem] text-[#245C3A]">{collection.title}</h3>

            <p className="mb-3 mt-2 text-[0.85rem] leading-[1.5] text-[#607282]">
              {collection.desc}
            </p>

            <span className="mb-4 text-[0.72rem] font-semibold text-[#8a98a5]">
              {collection.count}
            </span>

            <button
              type="button"
              className="mt-auto inline-flex items-center gap-1 border-0 bg-transparent p-0 text-[0.82rem] font-semibold text-[#397153] transition-colors hover:text-[#245C3A]"
            >
              Explore collection
              <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="mb-10 max-w-[950px]">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#D8892F]" />
          <span className="text-[1.25rem] font-bold uppercase tracking-[0.16em] text-[#D8892F] max-[480px]:text-[1rem]">
            Learn IP-SAKTI
          </span>
        </div>

        <h2 className="m-0 text-[2.35rem] font-normal leading-[1.15] tracking-[-0.02em] text-[#245C3A] max-[768px]:text-[2rem] max-[480px]:text-[1.7rem]">
          Simple guides for first-time users.
        </h2>

        <p className="mt-4 max-w-[760px] text-base leading-7 text-[#607282] max-[480px]:text-[0.88rem]">
          Short, practical walkthroughs to help you get useful research guidance from the platform.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1">
        {[
          'How to check patentability',
          'How to perform a TKDL search',
          'How ABS assessment works',
          `How to know your product's formulation`,
          'How to create an Innovation Passport',
        ].map((title, index) => (
          <div
            className="overflow-hidden rounded-[8px] border border-[#d9e3eb] bg-white transition-all duration-200 hover:-translate-y-[2px] hover:border-[#8DB39B] hover:shadow-[0_8px_20px_rgba(36,92,58,0.09)]"
            key={title}
          >
            <div
              className="relative flex h-[170px] items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage: `url(${index % 2 ? herbImage : heroImage})`,
              }}
            >
              <span className="grid h-[46px] w-[46px] place-items-center rounded-full bg-[#245C3A]/90 text-white shadow-[0_4px_14px_rgba(36,92,58,0.25)]">
                <Play size={18} fill="currentColor" />
              </span>

              <small className="absolute bottom-3 right-3 rounded-[3px] bg-[#245C3A]/90 px-[0.4rem] py-[0.2rem] text-[0.7rem] text-white">
                04:{index + 8}
              </small>
            </div>

            <div className="p-4">
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#D8892F]">
                GUIDE 0{index + 1}
              </span>

              <h3 className="mb-[0.7rem] mt-[0.3rem] text-[1.05rem] text-[#245C3A]">
                {title}
              </h3>

              <button
                type="button"
                className="inline-flex items-center gap-[0.3rem] border-0 bg-transparent p-0 text-[0.8rem] font-semibold text-[#397153] transition-colors hover:text-[#245C3A]"
              >
                Watch guide
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <FAQ />
    </PageFrame>
  );
}