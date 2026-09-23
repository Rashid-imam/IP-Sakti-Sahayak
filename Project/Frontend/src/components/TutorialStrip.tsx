import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { heroImage, herbImage } from '../data';

export default function TutorialStrip() {
  const tutorials = [
    {
      title: 'How to research an Ayurvedic formulation',
      duration: '4 min guide',
      image: herbImage,
    },
    {
      title: 'How to check patentability and TKDL',
      duration: '5 min guide',
      image: heroImage,
    },
  ];

  return (
    <section className="bg-[#F0F7F2] py-6 sm:py-7">
      <div className="mx-auto flex w-full max-w-[1500px] items-center gap-8 px-5 sm:px-8 lg:px-16 max-[1200px]:gap-6 max-[1100px]:flex-wrap">
        
        <div className="flex min-w-[240px] flex-1 flex-col justify-center">
          <div className="mb-1 flex items-center gap-2 text-[1.25rem] font-bold uppercase tracking-[0.12em] text-[#D8892F]">
            <span className="h-px w-[20px] bg-current opacity-70" />
            Learn IP-SAKTI
          </div>

          <h2 className="m-0 text-[1.35rem] font-bold leading-tight text-[#245C3A] sm:text-[1.5rem]">
            Not sure where to begin?
          </h2>

          <p className="mt-1.5 max-w-[300px] text-[0.82rem] leading-[1.45] text-[#607282]">
            Explore short guides made for first-time users.
          </p>
        </div>

        <div className="flex flex-[2.5] items-center justify-start gap-10 max-[1100px]:flex-1 max-[768px]:w-full max-[768px]:flex-wrap">

          <Link
            to="/tutorials"
            className="flex min-h-[105px] w-[330px] items-center gap-4 rounded-[8px] border border-[#d9e3eb] bg-white px-4 py-3 no-underline transition-all duration-200 hover:-translate-y-[1px] hover:border-[#9AB9A5] hover:shadow-[0_5px_14px_rgba(36,92,58,0.09)] max-[1200px]:w-[300px] max-[768px]:w-full"
          >
            <div
              className="grid h-[76px] w-[96px] shrink-0 place-items-center rounded-[6px] bg-cover bg-center text-white"
              style={{ backgroundImage: `url(${herbImage})` }}
            >
              <span className="grid h-[40px] w-[40px] place-items-center rounded-full bg-[#245C3A]/85">
                <Play size={18} fill="currentColor" />
              </span>
            </div>

            <div className="min-w-0">
              <strong className="block text-[0.88rem] font-semibold leading-[1.35] text-[#245C3A]">
                How to research an Ayurvedic formulation
              </strong>

              <span className="mt-2 block text-[0.72rem] text-[#607282]">
                4 min guide
              </span>
            </div>
          </Link>

          <Link
            to="/tutorials"
            className="flex min-h-[105px] w-[330px] items-center gap-4 rounded-[8px] border border-[#d9e3eb] bg-white px-4 py-3 no-underline transition-all duration-200 hover:-translate-y-[1px] hover:border-[#9AB9A5] hover:shadow-[0_5px_14px_rgba(36,92,58,0.09)] max-[1200px]:w-[300px] max-[768px]:w-full"
          >
            <div
              className="grid h-[76px] w-[96px] shrink-0 place-items-center rounded-[6px] bg-cover bg-center text-white"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <span className="grid h-[40px] w-[40px] place-items-center rounded-full bg-[#245C3A]/85">
                <Play size={18} fill="currentColor" />
              </span>
            </div>

            <div className="min-w-0">
              <strong className="block text-[0.88rem] font-semibold leading-[1.35] text-[#245C3A]">
                How to check patentability and TKDL
              </strong>

              <span className="mt-2 block text-[0.72rem] text-[#607282]">
                5 min guide
              </span>
            </div>
          </Link>

          <Link
            to="/tutorials"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[5px] border border-[#245C3A] px-5 py-3 text-[0.9rem] font-semibold text-[#245C3A] no-underline transition-colors hover:bg-[#245C3A] hover:text-white"
          >
            All tutorials
            <ArrowRight size={15} />
          </Link>

        </div>
      </div>
    </section>
  );
}