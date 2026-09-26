import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const isHomePage = location.pathname === '/';

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
    <header
      className={`sticky top-0 z-50 border-b-[3px] border-[#D8892F] transition-all duration-300 ${
        isHomePage
          ? 'bg-[#FDFCF8] text-[#245C3A] shadow-[0_6px_24px_rgba(0,0,0,0.10)]'
          : 'bg-[#245C3A] text-white shadow-[0_8px_26px_rgba(10,44,35,0.18)]'
      }`}
    >
      <div className="mx-auto flex min-h-[76px] w-full max-w-[1600px] items-center gap-3 px-2 sm:min-h-[82px] sm:gap-4 sm:px-4 lg:px-5">
        {/* Logo */}
        <Link
          to="/"
          aria-label="IP-SAKTI Sahayak home"
          onClick={closeAllMenus}
          className="flex h-[70px] w-fit shrink-0 items-center px-0 no-underline sm:h-[78px]"
        >
          {/* Ashoka Emblem */}
          <div
            className={`flex shrink-0 items-center justify-center border-r ${
              isHomePage
                ? 'h-[58px] w-[54px] border-[#D8DED8] pr-2 sm:h-[62px] sm:w-[58px] sm:pr-3'
                : 'h-[72px] w-[58px] border-white/25 pr-0 sm:h-[82px] sm:w-[64px]'
            }`}
          >
            <img
              src={isHomePage ? '/Ashoka.png' : '/Ashoka2.png'}
              alt="Government of India emblem"
              className={
                isHomePage
                  ? 'max-h-[64px] max-w-[42px] object-contain sm:max-h-[70px] sm:max-w-[45px]'
                  : 'max-h-[78px] max-w-[62px] object-contain sm:max-h-[92px] sm:max-w-[72px]'
              }
            />
          </div>

          {/* IP-SAKTI Logo */}
          <div
            className={`flex items-center ${
              isHomePage
                ? 'pl-2 sm:pl-3'
                : '-ml-3 pl-0 sm:-ml-4'
            }`}
          >
            <img
              src={isHomePage ? '/logo3.png' : '/logo.png'}
              alt="IP-SAKTI Sahayak"
              className={
                isHomePage
                  ? 'h-auto w-[175px] object-contain sm:w-[210px] lg:w-[220px]'
                  : 'h-auto w-[205px] object-contain sm:w-[240px] lg:w-[260px]'
              }
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 xl:flex"
          aria-label="Main navigation"
        >
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeAllMenus}
              className={({ isActive }) =>
                `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[9px] px-3 py-3 text-[0.79rem] font-semibold no-underline transition-all duration-200 ${
                  isHomePage
                    ? isActive
                      ? 'bg-[#245C3A] text-white shadow-[0_3px_10px_rgba(36,92,58,0.20)]'
                      : 'text-[#245C3A] hover:bg-[#EAF2ED]'
                    : isActive
                      ? 'bg-[#F7D7A0] text-[#245C3A] shadow-[0_3px_10px_rgba(0,0,0,0.12)]'
                      : 'text-white hover:bg-[#1F6A45]'
                }`
              }
            >
              {item.label === 'Home' && (
                <HomeIcon size={16} strokeWidth={2.2} />
              )}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center justify-end gap-2 xl:flex">
          <Link
            to="/login"
            onClick={closeAllMenus}
            className={`inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] px-3.5 text-[0.77rem] font-semibold no-underline transition-all ${
              isHomePage
                ? 'border border-[#C8D7CE] bg-[#245C3A] text-white hover:bg-[#1F4E31]'
                : 'border border-[#E9D7B7] bg-white text-[#245C3A] hover:bg-[#F5F5F2]'
            }`}
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
              className={`inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] px-3.5 text-[0.77rem] font-semibold transition-all ${
                isHomePage
                  ? 'border border-[#C8D7CE] bg-white text-[#245C3A] hover:bg-[#F5F8F6]'
                  : 'border border-white/45 bg-transparent text-white hover:border-[#F7D7A0] hover:bg-[#1F6A45]'
              }`}
            >
              <Languages size={15} />
              <span>{selectedLanguage}</span>
              <ChevronDown
                size={13}
                className={`transition-transform ${
                  languageOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {languageOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[60] max-h-[360px] w-[230px] overflow-y-auto rounded-[12px] border border-[#DCE6DF] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                <div className="sticky top-0 border-b border-[#E8EEE9] bg-[#F6F9F7] px-4 py-3">
                  <p className="m-0 text-[0.67rem] font-bold uppercase tracking-[0.1em] text-[#D8892F]">
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
                        ? 'bg-[#EAF4ED] font-semibold text-[#245C3A]'
                        : 'bg-white text-[#607282] hover:bg-[#F5F8F6]'
                    }`}
                  >
                    <span>{language}</span>
                    {selectedLanguage === language && (
                      <span className="font-bold text-[#D8892F]">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="ml-auto flex items-center xl:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            className={`grid h-10 w-10 place-items-center rounded-[9px] transition-colors ${
              isHomePage
                ? 'border border-[#C8D7CE] bg-[#245C3A] text-white'
                : 'border border-white/30 bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`border-t px-4 py-4 xl:hidden ${
            isHomePage
              ? 'border-[#D8E3DC] bg-[#FDFCF8]'
              : 'border-[#397153] bg-[#245C3A]'
          }`}
        >
          <div className="mx-auto flex max-w-[700px] flex-col gap-2">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeAllMenus}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-[9px] px-4 py-3 text-[0.84rem] font-semibold no-underline transition-colors ${
                    isHomePage
                      ? isActive
                        ? 'bg-[#245C3A] text-white'
                        : 'text-[#245C3A] hover:bg-[#EAF2ED]'
                      : isActive
                        ? 'bg-[#F7D7A0] text-[#245C3A]'
                        : 'text-white hover:bg-[#1F6A45]'
                  }`
                }
              >
                {item.label === 'Home' && <HomeIcon size={17} />}
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/login"
              onClick={closeAllMenus}
              className={`mt-2 inline-flex items-center justify-center gap-2 rounded-[9px] px-4 py-3 text-[0.82rem] font-semibold no-underline ${
                isHomePage
                  ? 'bg-[#245C3A] text-white'
                  : 'border border-[#E9D7B7] bg-white text-[#245C3A]'
              }`}
            >
              <LogIn size={16} />
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}