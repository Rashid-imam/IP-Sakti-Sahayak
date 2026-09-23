import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Landmark,
  ShieldCheck,
  FileSearch,
  BookOpen,
  Scale,
} from 'lucide-react';

import { features } from '../data';
import AssistantBox from '../components/AssistantBox';
import FeatureCard from '../components/FeatureCard';
import TutorialStrip from '../components/TutorialStrip';
import ProductJourney from '../components/ProductJourney';

export default function Home() {
  const [slide, setSlide] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const slides = [
    {
      image: '/ip-ph.png',
      alt: 'Ayurvedic research and innovation',
      badge: 'Government of India',
      title: (
        <>
          Research Ayurveda.
          <br />
          <span className="text-[#D8BC8A]">Protect innovation.</span>
        </>
      ),
      description:
        'Ask about patents, traditional knowledge, access and benefit-sharing, regulations and Ayurvedic innovation — in simple language.',
      primaryAction: { label: 'Ask IP-SAKTI', to: '/research' },
      secondaryAction: { label: 'Ministry of Ayush', href: 'https://www.ayush.gov.in/' },
      intro: 'Digital research assistance',
      icon: <Landmark size={21} />,
      accent: 'Source-grounded research assistance',
      note: 'For informed decisions • Not legal advice',
    },
    {
      image: '/banner1.png',
      alt: 'Ayurvedic formulation and product classification',
      badge: 'AYUSH Product Classification',
      title: (
        <>
          Know your
          <br />
          <span className="text-[#D8BC8A]">Ayurvedic formulation.</span>
        </>
      ),
      description:
        'Identify your product category and understand the IP and regulatory requirements for your formulation.',
      primaryAction: { label: 'Know your product', to: '/classification' },
      secondaryAction: { label: 'View Process', href: '#how-it-works' },
      intro: 'AYUSH Product Classification',
      icon: <FileSearch size={17} />,
      accent: '',
      note: '',
    },
    {
      image: '/tutoriall.jpeg',
      alt: 'Ayurveda knowledge and learning resources',
      badge: 'Knowledge & Learning',
      title: (
        <>
          Learn how
          <br />
          <span className="text-[#D8BC8A]">IP-SAKTI works.</span>
        </>
      ),
      description:
        'Explore simple learning resources covering patentability, TKDL searches, access and benefit-sharing and formulation classification.',
      primaryAction: { label: 'View Tutorials', to: '/tutorials' },
      secondaryAction: { label: 'Explore Resources', href: '#how-it-works' },
      intro: 'Knowledge & Learning',
      icon: <BookOpen size={17} />,
      accent: '',
      note: '',
    },
    {
      image: '/banner2.png',
      alt: 'Legal and regulatory knowledge',
      badge: 'Legal & Regulatory Knowledge',
      title: (
        <>
          Understand key
          <br />
          <span className="text-[#D8BC8A]">legal provisions.</span>
        </>
      ),
      description:
        'Explore provisions relevant to traditional knowledge, biological resources and access or benefit-sharing considerations.',
      primaryAction: { label: 'Explore Knowledge Base', to: '/library' },
      secondaryAction: { label: 'Understand the Framework', href: '#how-it-works' },
      intro: 'Legal & Regulatory Knowledge',
      icon: <Scale size={17} />,
      accent: '',
      note: '',
    },
  ];

  const loopSlides = [slides[slides.length - 1], ...slides, slides[0]];

  useEffect(() => {
    if (isPaused) return undefined;

    const timer = window.setInterval(() => {
      setSlide((current) => {
        if (current >= loopSlides.length - 1) {
          return 1;
        }

        return current + 1;
      });
    }, 3500);

    return () => window.clearInterval(timer);
  }, [isPaused, loopSlides.length]);

  const handleNext = () => {
    setSlide((current) => (current >= loopSlides.length - 1 ? 1 : current + 1));
  };

  const handlePrev = () => {
    setSlide((current) => (current <= 0 ? loopSlides.length - 2 : current - 1));
  };

  const handleLoopReset = () => {
    if (slide === loopSlides.length - 1) {
      setIsResetting(true);
      setSlide(1);
      return;
    }

    if (slide === 0) {
      setIsResetting(true);
      setSlide(slides.length);
    }
  };

  useEffect(() => {
    if (!isResetting) return undefined;

    const frame = window.requestAnimationFrame(() => {
      setIsResetting(false);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isResetting]);

  return (
    <>
      {/* ================= HERO CAROUSEL ================= */}

      <section
        className="relative flex min-h-[600px] items-center overflow-hidden max-[768px]:min-h-[470px] max-[480px]:min-h-[520px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="absolute inset-0 flex"
          style={{
            transform: `translateX(-${slide * 100}%)`,
            transition: isResetting ? 'none' : 'transform 700ms ease-in-out',
          }}
          onTransitionEnd={handleLoopReset}
        >
          {loopSlides.map((item, index) => {
            const realIndex =
              index === 0 ? slides.length - 1 : index === loopSlides.length - 1 ? 0 : index - 1;

            return (
              <div
                key={`${item.alt}-${index}`}
                className="relative h-[600px] min-w-full w-full max-[768px]:h-[470px] max-[480px]:h-[520px]"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(105deg, rgba(38,78,57,.90) 0%, rgba(55,99,74,.74) 38%, rgba(79,122,98,.42) 68%, rgba(79,122,98,.16) 100%)',
                  }}
                />

                <div className="relative z-[2] mx-auto flex h-full w-full max-w-[1500px] flex-col justify-center px-5 pt-5 pb-10 sm:px-8 sm:pt-6 sm:pb-12 lg:px-16 max-[768px]:px-6 max-[768px]:pt-5 max-[768px]:pb-10 max-[480px]:px-5 max-[480px]:pt-4 max-[480px]:pb-8">
                  <div className="max-w-[720px] text-white">
                    {realIndex === 0 ? (
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/30 bg-white/10">
                          {item.icon}
                        </div>

                        <div>
                          <p className="m-0 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#D8BC8A]">
                            {item.badge}
                          </p>
                          <p className="m-0 mt-0.5 text-[0.82rem] font-medium text-white">
                            Ministry of Ayush
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#D8BC8A]">
                        {item.icon}
                        {item.badge}
                      </div>
                    )}

                    {realIndex === 0 && (
                      <div className="mb-2.5 inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#D8BC8A]">
                        <span className="h-px w-[22px] bg-current opacity-70" />
                        {item.intro}
                      </div>
                    )}

                    <h1 className="m-0 max-w-[680px] text-[clamp(2rem,4.8vw,3.45rem)] font-medium leading-[1.12] tracking-[-0.02em] text-white">
                      {item.title}
                    </h1>

                    <p className="mt-4 mb-0 max-w-[590px] text-[0.98rem] leading-[1.58] text-white/90 sm:text-[1.03rem]">
                      {item.description}
                    </p>

                    {realIndex === 0 && (
                      <div className="mt-6 flex flex-wrap gap-2.5 max-[480px]:flex-col">
                        <Link
                          to={item.primaryAction.to}
                          className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-[5px] border border-transparent bg-[#C99558] px-5 py-3 text-[0.88rem] font-semibold leading-none text-white no-underline transition-colors duration-200 hover:bg-[#B98449] max-[480px]:w-full"
                        >
                          {item.primaryAction.label}
                          <ArrowRight size={17} />
                        </Link>

                        <a
                          href={item.secondaryAction.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-[5px] border border-white/40 bg-transparent px-5 py-3 text-[0.88rem] font-semibold leading-none text-white no-underline transition-colors duration-200 hover:bg-white/10 max-[480px]:w-full"
                        >
                          {item.secondaryAction.label}
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    )}

                    {realIndex === 0 && (
                      <div className="mt-7 inline-flex items-center gap-3 rounded-[6px] border border-white/25 bg-white/10 px-3.5 py-2.5">
                        <ShieldCheck size={19} className="shrink-0 text-[#D8BC8A]" />

                        <div>
                          <strong className="block text-[0.78rem] font-semibold">
                            {item.accent}
                          </strong>

                          <span className="mt-0.5 block text-[0.68rem] text-white/70">
                            {item.note}
                          </span>
                        </div>
                      </div>
                    )}

                    {realIndex !== 0 && realIndex !== 3 && (
                      <div className="mt-6 flex flex-wrap gap-2.5 max-[480px]:flex-col">
                        <Link
                          to={item.primaryAction.to}
                          className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-[5px] border border-transparent bg-[#C99558] px-5 py-3 text-[0.88rem] font-semibold leading-none text-white no-underline transition-colors duration-200 hover:bg-[#B98449] max-[480px]:w-full"
                        >
                          {item.primaryAction.label}
                          <ArrowRight size={17} />
                        </Link>

                        <a
                          href={item.secondaryAction.href}
                          className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-[5px] border border-white/40 bg-transparent px-5 py-3 text-[0.88rem] font-semibold leading-none text-white no-underline transition-colors duration-200 hover:bg-white/10 max-[480px]:w-full"
                        >
                          {item.secondaryAction.label}
                        </a>
                      </div>
                    )}

                    {realIndex === 3 && (
                      <>
                        <div className="mt-5 flex flex-wrap gap-2">
                          <div className="min-w-[95px] rounded-[5px] border border-white/25 bg-white/10 px-4 py-2.5 text-center">
                            <strong className="block text-[1rem] text-[#D8BC8A]">3</strong>
                            <span className="text-[0.68rem] text-white/75">IP Provision</span>
                          </div>

                          <div className="min-w-[95px] rounded-[5px] border border-white/25 bg-white/10 px-4 py-2.5 text-center">
                            <strong className="block text-[1rem] text-[#D8BC8A]">3(p)</strong>
                            <span className="text-[0.68rem] text-white/75">Traditional Knowledge</span>
                          </div>

                          <div className="min-w-[95px] rounded-[5px] border border-white/25 bg-white/10 px-4 py-2.5 text-center">
                            <strong className="block text-[1rem] text-[#D8BC8A]">6(p)</strong>
                            <span className="text-[0.68rem] text-white/75">ABS</span>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2.5 max-[480px]:flex-col">
                          <Link
                            to={item.primaryAction.to}
                            className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-[5px] border border-transparent bg-[#C99558] px-5 py-3 text-[0.88rem] font-semibold leading-none text-white no-underline transition-colors duration-200 hover:bg-[#B98449] max-[480px]:w-full"
                          >
                            {item.primaryAction.label}
                            <ArrowRight size={17} />
                          </Link>

                          <a
                            href={item.secondaryAction.href}
                            className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-[5px] border border-white/40 bg-transparent px-5 py-3 text-[0.88rem] font-semibold leading-none text-white no-underline transition-colors duration-200 hover:bg-white/10 max-[480px]:w-full"
                          >
                            {item.secondaryAction.label}
                          </a>
                        </div>
                      </>
                    )}

                    {realIndex === 2 && (
                      <div className="mt-5 rounded-[6px] border border-white/20 bg-black/10 px-4 py-3 max-w-[580px]">
                        <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#D8BC8A]">
                          Explore the knowledge base
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.76rem] text-white/90">
                          <span>Patentability</span>
                          <span>TKDL</span>
                          <span>ABS</span>
                          <span>Classification</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-5 left-0 right-0 z-[3] mx-auto flex w-full max-w-[1200px] items-center justify-center gap-3 px-5 sm:px-6 max-[480px]:px-4">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous slide"
            className="grid h-[33px] w-[33px] shrink-0 place-items-center rounded-full border border-white/35 bg-[#3F6F55]/25 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSlide(index + 1)}
                aria-label={`Go to slide ${index + 1}`}
                className={
                  slide === index + 1
                    ? 'h-2 w-6 rounded-full border-0 bg-[#D8BC8A] p-0'
                    : 'h-2 w-2 rounded-full border-0 bg-white/45 p-0'
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next slide"
            className="grid h-[33px] w-[33px] shrink-0 place-items-center rounded-full border border-white/35 bg-[#3F6F55]/25 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ================= SAKTI AI ================= */}

      <section className="bg-[#F6F9F7] py-6 sm:py-7 lg:py-8">
        <div className="w-full px-5 sm:px-8 lg:px-16">
          <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[1fr_1.1fr] items-center gap-8 max-[1024px]:grid-cols-1 max-[1024px]:gap-6">

            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-[1.25rem] font-bold uppercase tracking-[0.12em] text-[#C99558]">
                <span className="h-px w-[22px] bg-current opacity-70" />
                Meet Sakti AI
              </div>

              <h2 className="m-0 mt-1 text-[2.2rem] leading-[1.15] text-[#4F7A62] max-[768px]:text-[2rem] max-[480px]:text-[1.75rem]">
                Ask naturally.{' '}
                <em className="italic text-[#C99558]">
                  Research confidently.
                </em>
              </h2>

              <p className="mt-4 mb-0 max-w-[520px] text-[0.95rem] leading-[1.6] text-[#607282]">
                Your Ayurveda IP research copilot, designed to make complex
                information easier to understand.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                <span className="inline-flex items-center gap-[0.35rem] rounded-[4px] bg-white px-3 py-2 text-[0.78rem] font-semibold text-[#4F7A62] shadow-sm">
                  <Check size={15} />
                  From Trusted Sources Answers
                </span>

                <span className="inline-flex items-center gap-[0.35rem] rounded-[4px] bg-white px-3 py-2 text-[0.78rem] font-semibold text-[#4F7A62] shadow-sm">
                  <Check size={15} />
                  India-first guidance
                </span>

                <span className="inline-flex items-center gap-[0.35rem] rounded-[4px] bg-white px-3 py-2 text-[0.78rem] font-semibold text-[#4F7A62] shadow-sm">
                  <Check size={15} />
                  Generates Innovation Passport
                </span>

                <span className="inline-flex items-center gap-[0.35rem] rounded-[4px] bg-white px-3 py-2 text-[0.78rem] font-semibold text-[#4F7A62] shadow-sm">
                  <Check size={15} />
                  Multilingual support
                </span>

                <span className="inline-flex items-center gap-[0.35rem] rounded-[4px] bg-white px-3 py-2 text-[0.78rem] font-semibold text-[#4F7A62] shadow-sm">
                  <Check size={15} />
                  Socially Aware
                </span>

                <span className="inline-flex items-center gap-[0.35rem] rounded-[4px] bg-white px-3 py-2 text-[0.78rem] font-semibold text-[#4F7A62] shadow-sm">
                  <Check size={15} />
                  Jurisdiction Aware
                </span>

                <span className="inline-flex items-center gap-[0.35rem] rounded-[4px] bg-white px-3 py-2 text-[0.78rem] font-semibold text-[#4F7A62] shadow-sm">
                  <Check size={15} />
                  Voice Assistant Support
                </span>


              </div>
            </div>

            <AssistantBox compact />

          </div>
        </div>
      </section>

      {/* ================= EXPLORE IP-SAKTI ================= */}

      <section className="bg-[#F6F9F7] py-6 sm:py-7 lg:py-8">
        <div className="w-full px-5 sm:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-[1500px]">

            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-[1.25rem] font-bold uppercase tracking-[0.12em] text-[#C99558]">
                <span className="h-px w-[22px] bg-current opacity-70" />
                Explore IP-SAKTI
              </div>

              <h2 className="m-0 mt-1 text-[2.2rem] leading-[1.15] text-[#4F7A62] max-[768px]:text-[2rem] max-[480px]:text-[1.75rem]">
                Everything you need to move an idea forward
              </h2>

              <p className="mt-4 mb-0 max-w-[520px] text-[0.95rem] leading-[1.6] text-[#607282]">
                One calm place to understand, search and connect the information
                around Ayurvedic innovation.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-4 max-[1024px]:grid-cols-2 max-[768px]:grid-cols-1 max-[768px]:gap-3">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      <TutorialStrip />
      <ProductJourney />
    </>
  );
}