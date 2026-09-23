import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  LogIn,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageFrame from '../components/PageFrame';

export default function LoginPage() {
  return (
    <PageFrame>
      <div className="mx-auto w-full max-w-[1100px] py-6 sm:py-10">

        {/* Main Login Layout */}
        <div className="grid overflow-hidden rounded-[14px] border border-[#d9e3eb] bg-white shadow-[0_12px_45px_rgba(36,92,58,0.09)] lg:grid-cols-[1fr_0.9fr]">

          {/* ================= LEFT PANEL ================= */}
          <div className="relative overflow-hidden bg-[#245C3A] px-6 py-8 sm:px-10 sm:py-10 lg:px-12">

            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10" />

            <div className="absolute right-10 top-20 h-3 w-3 rounded-full bg-[#E5C98B]/70" />

            <div className="absolute bottom-20 left-12 h-2 w-2 rounded-full bg-white/40" />

            <div className="relative z-10 flex h-full flex-col">

              {/* Logo */}
              <div className="mb-8 flex items-center gap-4">

                <div className="grid h-[66px] w-[66px] place-items-center rounded-full bg-white shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
                  <img
                    src="/ip-logo.png"
                    alt="IP-SAKTI"
                    className="h-[54px] w-[54px] object-contain"
                  />
                </div>

                <div>
                  <div className="text-[1.35rem] font-bold leading-tight text-white">
                    IP-SAKTI{' '}
                    <span className="text-[#E5C98B]">
                      Sahayak
                    </span>
                  </div>

                  <div className="mt-1 text-[0.7rem] text-white/65">
                    Ayurveda IP &amp; Regulatory Guidance
                  </div>
                </div>

              </div>

              {/* Welcome */}
              <div className="max-w-[470px]">

                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#E5C98B]/30 bg-[#E5C98B]/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#E5C98B]">
                  <Sparkles size={12} />
                  Welcome back
                </div>

                <h1 className="m-0 text-[2rem] font-bold leading-[1.15] text-white sm:text-[2.5rem]">
                  Continue your
                  <br />
                  research journey.
                </h1>

                <p className="mt-4 max-w-[440px] text-[0.88rem] leading-[1.7] text-white/75">
                  Log in to keep your research briefs, saved sources and
                  Innovation Passport information together in one place.
                </p>

              </div>

              {/* Benefits */}
              <div className="mt-9 space-y-4">

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[#E5C98B]">
                    <CheckCircle2 size={15} />
                  </div>

                  <div>
                    <p className="m-0 text-[0.8rem] font-semibold text-white">
                      Save your research
                    </p>

                    <p className="m-0 mt-0.5 text-[0.7rem] text-white/55">
                      Keep important sources and research briefs accessible.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[#E5C98B]">
                    <ShieldCheck size={15} />
                  </div>

                  <div>
                    <p className="m-0 text-[0.8rem] font-semibold text-white">
                      Guided IP research
                    </p>

                    <p className="m-0 mt-0.5 text-[0.7rem] text-white/55">
                      Follow your product journey with structured guidance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[#E5C98B]">
                    <Globe2 size={15} />
                  </div>

                  <div>
                    <p className="m-0 text-[0.8rem] font-semibold text-white">
                      Explore from anywhere
                    </p>

                    <p className="m-0 mt-0.5 text-[0.7rem] text-white/55">
                      Access your research workspace whenever you need it.
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom note */}
              <div className="mt-auto pt-10">
                <div className="border-t border-white/10 pt-5 text-[0.68rem] leading-[1.5] text-white/45">
                  IP-SAKTI Sahayak
                  <br />
                  Supporting Ayurveda innovation through informed IP and
                  regulatory research.
                </div>
              </div>

            </div>
          </div>

          {/* ================= RIGHT LOGIN PANEL ================= */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">

            {/* Header */}
            <div className="mb-7">

              <div className="mb-4 grid h-[48px] w-[48px] place-items-center rounded-[10px] bg-[#EAF4ED] text-[#397153]">
                <LogIn size={22} strokeWidth={2.1} />
              </div>

              <h2 className="m-0 text-[1.65rem] font-bold leading-tight text-[#245C3A]">
                Log in
              </h2>

              <p className="m-0 mt-2 text-[0.82rem] leading-[1.55] text-[#607282]">
                Access your IP-SAKTI research workspace.
              </p>

            </div>

            {/* Login Form */}
            <form>

              {/* Email */}
              <label className="mb-5 block text-[0.78rem] font-bold text-[#245C3A]">
                Email or mobile

                <input
                  type="text"
                  placeholder="you@example.com"
                  className="
                    mt-2 block w-full
                    rounded-[7px]
                    border border-[#d9e3eb]
                    bg-[#fbfcfd]
                    px-3.5 py-3
                    text-[0.86rem]
                    text-[#17382A]
                    outline-none
                    transition-all
                    placeholder:text-[#9aa7b2]
                    hover:border-[#b9ccd8]
                    focus:border-[#397153]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#397153]/10
                  "
                />
              </label>

              {/* Password */}
              <label className="mb-2 block text-[0.78rem] font-bold text-[#245C3A]">
                Password

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="
                    mt-2 block w-full
                    rounded-[7px]
                    border border-[#d9e3eb]
                    bg-[#fbfcfd]
                    px-3.5 py-3
                    text-[0.86rem]
                    text-[#17382A]
                    outline-none
                    transition-all
                    placeholder:text-[#9aa7b2]
                    hover:border-[#b9ccd8]
                    focus:border-[#397153]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#397153]/10
                  "
                />
              </label>

              {/* Forgot Password */}
              <div className="mb-6 flex justify-end">
                <button
                  type="button"
                  className="
                    border-0 bg-transparent p-0
                    text-[0.75rem]
                    font-semibold
                    text-[#397153]
                    hover:underline
                  "
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="
                  inline-flex w-full
                  items-center justify-center
                  gap-2
                  rounded-[7px]
                  border border-[#245C3A]
                  bg-[#245C3A]
                  px-4 py-3
                  text-[0.85rem]
                  font-bold
                  text-white
                  shadow-[0_5px_14px_rgba(36,92,58,0.18)]
                  transition-all
                  hover:-translate-y-[1px]
                  hover:bg-[#397153]
                  hover:shadow-[0_7px_18px_rgba(36,92,58,0.22)]
                "
              >
                Continue
                <ArrowRight size={16} />
              </button>

            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3 text-[0.7rem] text-[#8a98a5]">
              <span className="h-px flex-1 bg-[#d9e3eb]" />
              <span>OR</span>
              <span className="h-px flex-1 bg-[#d9e3eb]" />
            </div>

            {/* Signup */}
            <div className="mt-7 rounded-[8px] border border-[#e4ebf0] bg-[#F6F9F7] px-4 py-3.5 text-center">

              <p className="m-0 text-[0.78rem] text-[#607282]">
                New to IP-SAKTI?{' '}

                <Link
                  to="/signup"
                  className="font-bold text-[#397153] no-underline hover:underline"
                >
                  Create an account
                </Link>
              </p>

            </div>

            {/* Guest note */}
            <p className="m-0 mt-5 text-center text-[0.68rem] leading-[1.5] text-[#8a98a5]">
              Most research tools are available without signing in.
            </p>

          </div>
        </div>

        {/* Bottom Security Note */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[0.68rem] text-[#8a98a5]">
          <ShieldCheck size={14} />
          <span>
            Your research workspace is designed for secure access.
          </span>
        </div>

      </div>
    </PageFrame>
  );
}