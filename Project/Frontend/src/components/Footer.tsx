import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-0 bg-[#245C3A] px-0 py-[2.8rem] pb-[1.3rem] text-[#cdd9e3]">
      <div className="mx-auto w-full max-w-[1200px] px-6 max-md:px-4">
        <div className="mb-[1.7rem] grid grid-cols-[2fr_1fr_1fr_1fr] gap-8 max-md:grid-cols-2 max-[480px]:grid-cols-1">

          <div>
            <div className="text-white">
              <div className="font-['Fraunces'] text-[1.4rem] font-bold tracking-[-0.02em]">
                IP-SAKTI <span className="text-[#E5C98B]">SAHAYAK</span>
              </div>
            </div>

            <p className="text-[0.8rem] text-[#B7C9BF]">
              Ayurveda · Intellectual Property · Traditional Knowledge
            </p>

            <small className="text-[0.72rem] text-[#8FA89A]">
              A source-grounded AI decision-support platform for research and IP guidance.
            </small>
          </div>

          <div>
            <h3 className="mb-[0.6rem] font-['Inter'] text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#E5C98B]">
              Explore
            </h3>

            <Link to="/ask-sakti-ai" className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              Sakti AI
            </Link>

            <Link to="/knowProduct" className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              Know your product
            </Link>

            <Link to="/patent-search" className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              Patent search
            </Link>

            <Link to="/library" className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              Library
            </Link>
          </div>

          <div>
            <h3 className="mb-[0.6rem] font-['Inter'] text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#E5C98B]">
              Resources
            </h3>

            <a className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              1800-XXX-XXXX (Toll Free)
            </a>
             <a className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              ipsakti.support@gmail.com
            </a>
             <a className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              Ministry of Ayush, Gov of India
            </a>
             <a className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              FAQ
            </a>

          </div>

          <div>
            <h3 className="mb-[0.6rem] font-['Inter'] text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#E5C98B]">
              Legal
            </h3>

            <a className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              Privacy policy
            </a>

            <a className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              Terms of Service
            </a>

             <a className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              Accessibility 
            </a>

            <a href="#main-content" className="block py-[0.2rem] text-[0.82rem] text-[#cdd9e3] no-underline transition-colors hover:text-[#E5C98B]">
              Help centre
            </a>

          </div>
        </div>

        <div className="flex gap-2 rounded-md border border-[rgba(229,201,139,0.25)] bg-[rgba(216,137,47,0.12)] px-4 py-[0.8rem] text-[0.78rem] text-[#cdd9e3]">
          <ShieldCheck size={18} className="shrink-0 text-[#E5C98B]" />

          <span>
            <strong>Important:</strong> IP-SAKTI provides information and research guidance. It does not constitute legal advice, regulatory approval or professional legal opinion.
          </span>
        </div>

        {/* <div className="mt-4 flex justify-between gap-4 border-t border-[rgba(255,255,255,0.12)] pt-4 text-[0.72rem] text-[#8FA89A] max-md:flex-col max-md:gap-[0.3rem]">
          <span>© Government of India / IP-SAKTI prototype</span>
          <span>Privacy · Terms · Disclaimer</span>
        </div> */}

      </div>
    </footer>
  );
}