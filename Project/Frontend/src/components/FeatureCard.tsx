import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Icon } from '../data';

const ayurvedaImages = [
  { src: '/pg1.jpeg', alt: 'Ayurvedic research and innovation' },
  { src: '/pg2.jpeg', alt: 'Ayurvedic herbs and traditional knowledge' },
  { src: '/pg3.jpeg', alt: 'Ayurvedic formulation and herbal ingredients' },
  { src: '/pg4.jpeg', alt: 'Traditional Ayurvedic knowledge' },
  { src: '/pg5.jpeg', alt: 'Ayurvedic medicine and research' },
  { src: '/pg6.jpeg', alt: 'Ayurvedic innovation and natural products' },
];

const voiceImages = [
  { src: '/pg3.jpeg', alt: 'Ayurvedic formulation and herbal ingredients' },
  { src: '/pg4.jpeg', alt: 'Traditional Ayurvedic knowledge' },
  { src: '/pg5.jpeg', alt: 'Ayurvedic medicine and research' },
  { src: '/pg6.jpeg', alt: 'Ayurvedic innovation and natural products' },
  { src: '/pg1.jpeg', alt: 'Ayurvedic research and innovation' },
  { src: '/pg2.jpeg', alt: 'Ayurvedic herbs and traditional knowledge' },
];

export default function FeatureCard({
  title,
  description,
  icon: IconComponent,
  iconColor,
  iconBg,
  path,
  featured,
  reverseGallery,
}: {
  title: string;
  description: string;
  icon: Icon;
  iconColor?: string;
  iconBg?: string;
  path: string;
  featured?: boolean;
  reverseGallery?: boolean;
}) {
  const galleryImages = reverseGallery ? voiceImages : ayurvedaImages;

  const [currentImage, setCurrentImage] = useState(
    reverseGallery ? 0 : 0
  );

  useEffect(() => {
    if (!featured) return;

    const interval = window.setInterval(() => {
      setCurrentImage((previous) => {
        if (reverseGallery) {
          return (previous + 1) % galleryImages.length;
        }

        return (previous + 1) % galleryImages.length;
      });
    }, 3500);

    return () => window.clearInterval(interval);
  }, [featured, reverseGallery, galleryImages.length]);

  return (
    <Link
      to={path}
      className={`relative flex min-w-0 w-full flex-col overflow-hidden rounded-lg border p-4 sm:p-5 no-underline transition-all duration-200 ${
        featured
          ? 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2 border-[#245C3A] bg-[#245C3A] text-white'
          : 'border-[#d9e3eb] bg-white text-[#17382A] hover:-translate-y-0.5 hover:border-[#8DB39B] hover:shadow-[0_8px_20px_rgba(36,92,58,0.09)]'
      }`}
    >
      {featured ? (
        <>
          <div className="relative flex min-w-0 items-start gap-3 pr-0 sm:gap-4 sm:pr-[145px]">
            <div className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full bg-white shadow-[0_4px_15px_rgba(0,0,0,0.14)] sm:h-[68px] sm:w-[68px]">
              <img
                src="/ip-logo.png"
                alt="IP-SAKTI"
                className="h-[47px] w-[47px] object-contain sm:h-[55px] sm:w-[55px]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="m-0 text-[1.15rem] leading-[1.25] text-white sm:text-[1.45rem] sm:leading-[1.2]">
                {title}
              </h3>

              <p className="m-0 mt-1 text-[0.78rem] leading-[1.5] text-[rgba(255,255,255,0.82)] sm:text-[0.84rem] sm:leading-[1.55]">
                {description}
              </p>
            </div>

            <span className="absolute right-0 top-0 hidden w-[125px] text-right text-[0.9rem] font-semibold leading-[1.25] text-white sm:block">
              Primary service
            </span>
          </div>

          <div className="mt-4 sm:mt-5">
            <span className="inline-flex items-center gap-1 text-[0.9rem] font-bold text-[#E5C98B] sm:text-[1rem]">
              Explore
              <ArrowRight size={15} />
            </span>
          </div>

          <div className="mt-3 w-full rounded-xl bg-white/5 p-2">
            <div className="relative h-[180px] w-full overflow-hidden rounded-lg sm:h-[210px]">
              {galleryImages.map((image, index) => (
                <img
                  key={`${image.src}-${index}`}
                  src={image.src}
                  alt={image.alt}
                  className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ease-in-out ${
                    index === currentImage
                      ? 'scale-100 opacity-100'
                      : 'scale-105 opacity-0'
                  }`}
                />
              ))}

              <div className="absolute inset-0 bg-gradient-to-t from-[#245C3A]/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                <p className="m-0 text-[0.62rem] font-bold uppercase tracking-[0.17em] text-[#E5C98B]">
                  Ayurveda
                </p>

                <p className="m-0 mt-1 max-w-[600px] text-sm font-semibold text-white sm:text-lg">
                  Traditional knowledge &amp; herbal innovation
                </p>
              </div>

              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 sm:bottom-5 sm:right-5">
                {galleryImages.map((_, index) => (
                  <span
                    key={index}
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? 'w-5 bg-[#E5C98B]'
                        : 'w-1.5 bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-lg"
            style={{
              backgroundColor: iconBg || '#EAF4ED',
              boxShadow: `0 4px 14px ${iconBg || '#EAF4ED'}99`,
            }}
          >
            <IconComponent
              size={21}
              strokeWidth={2.5}
              color={iconColor || '#245C3A'}
              stroke={iconColor || '#245C3A'}
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <h3 className="m-0 mt-3 text-[1.05rem] text-[#245C3A]">
              {title}
            </h3>

            <p className="m-0 mt-1 text-[0.85rem] leading-[1.5] text-[#607282]">
              {description}
            </p>

            <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[0.82rem] font-bold text-[#397153]">
              Explore
              <ArrowRight size={15} />
            </span>
          </div>
        </>
      )}
    </Link>
  );
}