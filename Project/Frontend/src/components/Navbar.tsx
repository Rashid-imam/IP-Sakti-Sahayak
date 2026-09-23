import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  ChevronDown,
  Home as HomeIcon,
  Languages,
  LogIn,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const mainNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Know Your Product', path: '/knowProduct' },
    { label: 'Ask SAKTI AI', path: '/ask-sakti-ai' },
    { label: 'Knowledge Graph', path: '/knowledgeGraph' },
    { label: 'Dictionary', path: '/dictionary' },
    { label: 'Resources', path: '/resources' },
    { label: 'Community', path: '/community' },
  ];

  const languages = [
    'Assamese',
    'Bengali',
    'Bodo',
    'Dogri',
    'English',
    'Gujarati',
    'Hindi',
    'Kannada',
    'Kashmiri',
    'Konkani',
    'Maithili',
    'Malayalam',
    'Manipuri',
    'Marathi',
    'Nepali',
    'Odia',
    'Punjabi',
    'Sanskrit',
    'Santali',
    'Sindhi',
    'Tamil',
    'Telugu',
  ];

  const closeAllMenus = () => {
    setLanguageOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-[#D8892F] bg-[#0d5a45] shadow-[0_10px_30px_rgba(10,44,35,0.18)]">
      <div className="mx-auto flex w-full max-w-[1500px] items-center gap-4 px-4 py-3 lg:px-6">
        <Link
          to="/"
          aria-label="IP-SAKTI Sahayak home"
          className="flex shrink-0 items-center no-underline"
        >
          <img
            src="/logo.png"
            alt="IP-SAKTI Sahayak"
            className="h-auto w-[170px] object-contain sm:w-[200px] lg:w-[220px]"
          />
        </Link>

        <div className="flex flex-1 items-center justify-center">
          <nav className="hidden items-center justify-center gap-2 lg:flex">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeAllMenus}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-[8px] px-3.5 py-2.5 text-[0.82rem] font-semibold no-underline transition-all ${
                    isActive
                      ? 'bg-[#F7D7A0] text-[#0d5a45] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]'
                      : 'text-[#F5F9F6] hover:bg-[#0f694f] hover:text-white'
                  }`
                }
              >
                {item.label === 'Home' && <HomeIcon size={16} />}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/login"
            onClick={closeAllMenus}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#E9D7B7] bg-[#F3F4EF] px-3.5 py-2.5 text-[0.78rem] font-semibold text-[#0d5a45] no-underline transition-colors hover:bg-white"
          >
            <LogIn size={15} />
            Login
          </Link>

          <div className="relative">
            <button
              type="button"
              aria-label="Select language"
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#E9D7B7] bg-[#0f694f] px-3.5 py-2.5 text-[0.78rem] font-semibold text-[#F8F9F3] transition-colors hover:bg-[#0c5f49]"
            >
              <Languages size={15} />
              <span>{selectedLanguage}</span>
              <ChevronDown
                size={13}
                className={`transition-transform ${languageOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {languageOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-[220px] overflow-hidden rounded-[10px] border border-[#d9e3eb] bg-white shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                <div className="border-b border-[#edf2f7] bg-[#F6F9F7] px-4 py-3">
                  <p className="m-0 text-[0.68rem] font-bold uppercase tracking-[0.1em] text-[#D8892F]">
                    Select Language
                  </p>
                </div>

                {languages.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(language);
                      setLanguageOpen(false);
                    }}
                    className={`flex w-full items-center justify-between border-0 px-4 py-2.5 text-left text-[0.75rem] transition-colors ${
                      selectedLanguage === language
                        ? 'bg-[#EAF4ED] font-semibold text-[#0d5a45]'
                        : 'bg-white text-[#607282] hover:bg-[#F6F9F7]'
                    }`}
                  >
                    <span>{language}</span>
                    {selectedLanguage === language && <span className="text-[#D8892F]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            className="grid h-10 w-10 place-items-center rounded-[8px] border border-white/25 bg-white/5 text-white"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#397153] bg-[#0d5a45] px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-2">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeAllMenus}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-[8px] px-3 py-2.5 text-[0.82rem] font-medium no-underline transition-colors ${
                    isActive ? 'bg-[#F7D7A0] text-[#0d5a45]' : 'text-white/90 hover:bg-[#0f694f]'
                  }`
                }
              >
                {item.label === 'Home' && <HomeIcon size={16} />}
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/login"
              onClick={closeAllMenus}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-[#E9D7B7] bg-[#F3F4EF] px-3 py-2.5 text-[0.8rem] font-semibold text-[#0d5a45] no-underline"
            >
              <LogIn size={15} />
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}