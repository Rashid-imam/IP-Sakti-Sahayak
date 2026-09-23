import {
  CheckCircle2,
  FileText,
  FlaskConical,
  Leaf,
  ShieldCheck,
} from 'lucide-react';

export default function ProductJourney() {
  const steps = [
    {
      title: 'Tell us about',
      text: 'your product',
      icon: Leaf,
      iconColor: 'text-[#28734F]',
      iconBg: 'bg-[#DFF3E7]',
    },
    {
      title: 'Get classification',
      text: 'and IP guidance',
      icon: FlaskConical,
      iconColor: 'text-[#2878B8]',
      iconBg: 'bg-[#DCEEFF]',
    },
    {
      title: 'Check TKDL, ABS',
      text: 'and regulations',
      icon: ShieldCheck,
      iconColor: 'text-[#B06A00]',
      iconBg: 'bg-[#FFF0D2]',
    },
    {
      title: 'View sources',
      text: 'and next steps',
      icon: FileText,
      iconColor: 'text-[#7139A8]',
      iconBg: 'bg-[#EEE2FF]',
    },
    {
      title: 'Take action',
      text: 'and move forward',
      icon: CheckCircle2,
      iconColor: 'text-[#C72F45]',
      iconBg: 'bg-[#FFE1E6]',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full bg-[#F0F7F2] py-6 sm:py-7 lg:py-8"
    >
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-16">

        {/* Heading */}
        <div className="mb-6 flex flex-col gap-2 lg:mb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>

            <div className="mb-1 flex items-center gap-2 text-[1.25rem] font-bold uppercase tracking-[0.12em] text-[#D8892F]">
              <span className="h-px w-[24px] bg-current opacity-70" />
              Product Journey
            </div>

            <h2 className="m-0 text-[1.4rem] font-bold leading-tight text-[#245C3A] sm:text-[1.6rem]">
              How it works
            </h2>

            <p className="mt-2 max-w-[600px] text-[0.79rem] leading-[1.5] text-[#607282] sm:text-[0.84rem]">
              Follow a simple path to understand your product, identify
              requirements, and plan your next step.
            </p>

          </div>
        </div>

        {/* Journey */}
        <div className="flex w-full flex-col lg:flex-row lg:items-center">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="flex w-full items-center lg:flex-1"
              >

                {/* Step */}
                <div className="flex w-full items-center gap-3 py-3 lg:px-2 xl:gap-4">

                  {/* Colorful Icon */}
                  <div
                    className={`grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full
                      ${step.iconBg}
                      ${step.iconColor}
                      sm:h-[56px] sm:w-[56px] `}
                  >
                    <Icon
                      size={26}
                      strokeWidth={2}
                    />
                  </div>

                  <div className="min-w-0">

                    <span className="block text-[0.9rem] font-bold tracking-[0.08em] text-[#D8892F] sm:text-[1rem]">
                      0{index + 1}
                    </span>

                    <strong className="block text-[0.78rem] font-bold leading-tight text-[#245C3A] sm:text-[0.84rem]">
                      {step.title}
                    </strong>

                    <span className="mt-0.5 block text-[0.68rem] leading-tight text-[#607282] sm:text-[0.72rem]">
                      {step.text}
                    </span>

                  </div>
                </div>

                {index < steps.length - 1 && (
                  <span className="hidden shrink-0 px-2 text-[2.5rem] font-extralight leading-none text-[#7FA58F] lg:block xl:px-3">
                    ›
                  </span>
                )}

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}