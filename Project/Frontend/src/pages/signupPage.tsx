import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageFrame from '../components/PageFrame';

export default function SignupPage() {
  return (
    <PageFrame>
      <div className="mx-auto w-full max-w-[1100px] py-6 sm:py-10">
        {/* Main Signup Container */}
        <div className="grid overflow-hidden rounded-[10px] border border-[#d9e3eb] bg-white shadow-[0_10px_35px_rgba(36,92,58,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT — INFORMATION PANEL */}
          <div className="relative overflow-hidden bg-[#245C3A] px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            {/* Subtle Government-style decoration */}
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10" />

            <div className="relative z-10 flex h-full flex-col">
              {/* Logo */}
              <div className="mb-8 flex items-center gap-4">
                <div className="grid h-[64px] w-[64px] shrink-0 place-items-center rounded-full bg-white shadow-[0_5px_18px_rgba(0,0,0,0.15)]">
                  <img src="/ip-logo.png" alt="IP-SAKTI" className="h-[52px] w-[52px] object-contain" />
                </div>

                <div>
                  <div className="text-[1.3rem] font-bold leading-tight text-white">
                    IP-SAKTI <span className="text-[#E5C98B]">Sahayak</span>
                  </div>

                  <div className="mt-1 text-[0.68rem] leading-[1.4] text-white/60">
                    Ayurveda Intellectual Property &amp;
                    <br />
                    Regulatory Guidance Portal
                  </div>
                </div>
              </div>

              {/* Heading */}
              <div className="max-w-[440px]">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#E5C98B]/30 bg-[#E5C98B]/10 px-3 py-1 text-[0.67rem] font-bold uppercase tracking-[0.1em] text-[#E5C98B]">
                  <UserPlus size={12} />
                  New registration
                </div>

                <h1 className="m-0 text-[2rem] font-bold leading-[1.15] text-white sm:text-[2.45rem]">
                  Start your
                  <br />
                  research journey.
                </h1>

                <p className="mt-4 text-[0.87rem] leading-[1.7] text-white/72">
                  Create your IP-SAKTI account to organize your research,
                  explore intellectual property guidance and keep your work
                  together.
                </p>
              </div>

              {/* What you get */}
              <div className="mt-9">
                <p className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-[#E5C98B]">
                  Your workspace
                </p>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[#E5C98B]">
                      <CheckCircle2 size={15} />
                    </div>

                    <div>
                      <p className="m-0 text-[0.8rem] font-semibold text-white">
                        Save research briefs
                      </p>

                      <p className="m-0 mt-0.5 text-[0.7rem] leading-[1.45] text-white/55">
                        Keep useful research and sources together.
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[#E5C98B]">
                      <ShieldCheck size={15} />
                    </div>

                    <div>
                      <p className="m-0 text-[0.8rem] font-semibold text-white">
                        Track your IP journey
                      </p>

                      <p className="m-0 mt-0.5 text-[0.7rem] leading-[1.45] text-white/55">
                        Organize classification, IP and regulatory research.
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-[#E5C98B]">
                      <Globe2 size={15} />
                    </div>

                    <div>
                      <p className="m-0 text-[0.8rem] font-semibold text-white">
                        Access your workspace
                      </p>

                      <p className="m-0 mt-0.5 text-[0.7rem] leading-[1.45] text-white/55">
                        Continue your work whenever you return.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Government-style note */}
              <div className="mt-auto pt-10">
                <div className="border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2 text-[0.65rem] text-white/45">
                    <ShieldCheck size={13} />
                    <span>Official research guidance portal</span>
                  </div>

                  <p className="m-0 mt-2 text-[0.65rem] leading-[1.5] text-white/35">
                    IP-SAKTI Sahayak supports informed intellectual property
                    and regulatory research for Ayurveda innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — SIGNUP FORM */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
            {/* Form Header */}
            <div className="mb-7">
              <div className="mb-4 grid h-[48px] w-[48px] place-items-center rounded-[9px] bg-[#EAF4ED] text-[#397153]">
                <UserPlus size={22} strokeWidth={2} />
              </div>

              <h2 className="m-0 text-[1.65rem] font-bold leading-tight text-[#245C3A]">
                Create an account
              </h2>

              <p className="m-0 mt-2 text-[0.82rem] leading-[1.55] text-[#607282]">
                Register to save and manage your IP-SAKTI research.
              </p>
            </div>

            {/* Registration Form */}
            <form>
              {/* Full Name */}
              <label className="mb-5 block text-[0.78rem] font-bold text-[#245C3A]">
                Full name
                <input type="text" placeholder="Enter your full name" className="mt-2 block w-full rounded-[7px] border border-[#d9e3eb] bg-[#fbfcfd] px-3.5 py-3 text-[0.86rem] text-[#17382A] outline-none transition-all placeholder:text-[#9aa7b2] hover:border-[#b9ccd8] focus:border-[#397153] focus:bg-white focus:ring-4 focus:ring-[#397153]/10" />
              </label>

              {/* Email */}
              <label className="mb-5 block text-[0.78rem] font-bold text-[#245C3A]">
                Email address
                <input type="email" placeholder="you@example.com" className="mt-2 block w-full rounded-[7px] border border-[#d9e3eb] bg-[#fbfcfd] px-3.5 py-3 text-[0.86rem] text-[#17382A] outline-none transition-all placeholder:text-[#9aa7b2] hover:border-[#b9ccd8] focus:border-[#397153] focus:bg-white focus:ring-4 focus:ring-[#397153]/10" />
              </label>

              {/* Mobile */}
              <label className="mb-5 block text-[0.78rem] font-bold text-[#245C3A]">
                Mobile number
                <input type="tel" placeholder="Enter your mobile number" className="mt-2 block w-full rounded-[7px] border border-[#d9e3eb] bg-[#fbfcfd] px-3.5 py-3 text-[0.86rem] text-[#17382A] outline-none transition-all placeholder:text-[#9aa7b2] hover:border-[#b9ccd8] focus:border-[#397153] focus:bg-white focus:ring-4 focus:ring-[#397153]/10" />
              </label>

              {/* Password Row */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Password */}
                <label className="block text-[0.78rem] font-bold text-[#245C3A]">
                  Password
                  <input type="password" placeholder="Create password" className="mt-2 block w-full rounded-[7px] border border-[#d9e3eb] bg-[#fbfcfd] px-3.5 py-3 text-[0.86rem] text-[#17382A] outline-none transition-all placeholder:text-[#9aa7b2] hover:border-[#b9ccd8] focus:border-[#397153] focus:bg-white focus:ring-4 focus:ring-[#397153]/10" />
                </label>

                {/* Confirm Password */}
                <label className="block text-[0.78rem] font-bold text-[#245C3A]">
                  Confirm password
                  <input type="password" placeholder="Confirm password" className="mt-2 block w-full rounded-[7px] border border-[#d9e3eb] bg-[#fbfcfd] px-3.5 py-3 text-[0.86rem] text-[#17382A] outline-none transition-all placeholder:text-[#9aa7b2] hover:border-[#b9ccd8] focus:border-[#397153] focus:bg-white focus:ring-4 focus:ring-[#397153]/10" />
                </label>
              </div>

              {/* Terms */}
              <label className="mt-6 flex cursor-pointer items-start gap-2.5 text-[0.73rem] leading-[1.5] text-[#607282]">
                <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#397153]" />

                <span>
                  I agree to the{' '}
                  <button type="button" className="border-0 bg-transparent p-0 font-semibold text-[#397153] hover:underline">
                    Terms of Use
                  </button>{' '}
                  and acknowledge the{' '}
                  <button type="button" className="border-0 bg-transparent p-0 font-semibold text-[#397153] hover:underline">
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {/* Create Account Button */}
              <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[7px] border border-[#245C3A] bg-[#245C3A] px-4 py-3 text-[0.85rem] font-bold text-white shadow-[0_5px_14px_rgba(36,92,58,0.16)] transition-all hover:-translate-y-[1px] hover:bg-[#397153] hover:shadow-[0_7px_18px_rgba(36,92,58,0.2)]">
                Create account
                <ArrowRight size={16} />
              </button>
            </form>

            {/* OR */}
            <div className="my-6 flex items-center gap-3 text-[0.7rem] text-[#8a98a5]">
              <span className="h-px flex-1 bg-[#d9e3eb]" />
              <span>OR</span>
              <span className="h-px flex-1 bg-[#d9e3eb]" />
            </div>

            {/* Login */}
            <div className="mt-7 rounded-[8px] border border-[#e4ebf0] bg-[#F6F9F7] px-4 py-3.5 text-center">
              <p className="m-0 text-[0.78rem] text-[#607282]">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-[#397153] no-underline hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Security */}
            <div className="mt-5 flex items-center justify-center gap-2 text-[0.67rem] text-[#8a98a5]">
              <ShieldCheck size={13} />
              <span>Your account information is handled securely.</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-5 text-center text-[0.67rem] text-[#8a98a5]">
          IP-SAKTI Sahayak · Ayurveda Intellectual Property &amp; Regulatory Guidance
        </div>
      </div>
    </PageFrame>
  );
}