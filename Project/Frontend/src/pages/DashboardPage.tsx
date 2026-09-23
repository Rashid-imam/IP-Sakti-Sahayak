import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { features } from '../data';
import PageFrame from '../components/PageFrame';
import FeatureCard from '../components/FeatureCard';

export default function DashboardPage() {
  return (
    <PageFrame>
      <div className="mb-10 max-w-[950px]">

        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#D8892F]" />

          <span className="text-[1.25rem] font-bold uppercase tracking-[0.16em] text-[#D8892F]">
            Your workspace
          </span>
        </div>

        <h1 className="m-0 text-[2.35rem] font-normal leading-[1.15] tracking-[-0.02em] text-[#245C3A] max-[768px]:text-[2rem] max-[480px]:text-[1.7rem]">
          Welcome to IP-SAKTI.
        </h1>

        <p className="mt-4 max-w-[760px] text-base leading-7 text-[#607282]">
          Pick up where you left off or begin a new line of research.
        </p>

      </div>

      <div className="mb-6 grid grid-cols-5 gap-4 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1">
        {features.slice(0, 5).map((feature) => (
          <FeatureCard
            key={feature.title}
            {...feature}
          />
        ))}
      </div>

      <div className="rounded-[8px] border border-[#d9e3eb] bg-white p-6">

        <div className="flex items-center justify-between gap-4 max-[600px]:flex-col max-[600px]:items-start">

          <div>
            <h2 className="m-0 text-[1.2rem] font-semibold text-[#245C3A]">
              Recent research
            </h2>

            <p className="mt-1 text-[0.82rem] text-[#607282]">
              Your saved work will appear here.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-[#397153] bg-white px-4 py-2 text-[0.82rem] font-semibold text-[#397153] transition-colors hover:bg-[#397153] hover:text-white"
          >
            View all
          </button>

        </div>

        <div className="flex flex-col items-center gap-[0.4rem] p-[1.7rem] text-[#8a98a5] text-[0.82rem]">

          <BookOpen
            size={23}
            className="text-[#397153]"
          />

          <span>No saved research yet</span>

          <Link
            to="/research"
            className="inline-flex items-center gap-[0.3rem] font-semibold text-[#397153] no-underline transition-colors hover:text-[#245C3A]"
          >
            Start your first question
            <ArrowRight size={15} />
          </Link>

        </div>

      </div>
    </PageFrame>
  );
}