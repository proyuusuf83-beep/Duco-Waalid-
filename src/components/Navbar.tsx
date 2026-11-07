import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { Plane, Search, ShieldCheck, Menu, X, Globe, PhoneCall } from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onNavigate,
  onOpenTrack,
  onOpenAdmin,
  isAdminLoggedIn
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang];

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'packages', label: t.nav.packages },
    { id: 'flights', label: t.nav.flights },
    { id: 'hotels', label: t.nav.hotels },
    { id: 'visa', label: t.nav.visa },
    { id: 'about', label: t.nav.about },
    { id: 'contact', label: t.nav.contact }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top micro-bar for emergency contact and quick trust notice */}
      <div className="bg-[#0B5130] text-white text-xs py-1.5 px-4 sm:px-8 border-b border-[#0B5130]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium text-emerald-200">{t.hero.badge}</span>
            <span className="hidden md:inline text-emerald-300/60">·</span>
            <span className="hidden md:inline text-white/95 font-medium font-mono-numbers tracking-tight">
              {currentLang === 'so' ? 'Makka: +966 54 825 5198 / Hargeysa: +252 63 6793144' : 'Makkah: +966 54 825 5198 / Hargeisa: +252 63 6793144'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/20 text-xs">
              <button
                onClick={() => onLanguageChange('so')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  currentLang === 'so'
                    ? 'bg-white text-[#0B5130] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
                title="Dooro Af-Soomaali"
              >
                <span>Soomaali</span>
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-white text-[#0B5130] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
                title="Select English"
              >
                <span>English</span>
              </button>
            </div>
            {isAdminLoggedIn && (
              <>
                <span className="text-emerald-300/60">·</span>
                <button
                  onClick={onOpenAdmin}
                  className="bg-emerald-950/70 hover:bg-emerald-950 text-emerald-200 hover:text-white px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 border border-emerald-500/30"
                  title="Galka Maamulka Shirkadda"
                >
                  <ShieldCheck className="w-3 h-3 text-amber-300" />
                  <span>Maamulka (Dashboard)</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav Links) - Zone 3 (Action) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Mark */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 shrink-0 text-left group cursor-pointer"
        >
          <img
            src="/assets/aistudio/Logo_Duco_waalid_d76bc4ba.PNG"
            alt="Duco Waalid Travel and Agency Logo"
            className="w-12 h-12 object-contain transition-transform group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#0B5130] leading-none whitespace-nowrap">
              Duco Waalid
            </span>
            <span className="text-[11px] font-semibold text-[#168447] tracking-wider uppercase mt-1 whitespace-nowrap">
              Travel & Agency
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#202820]">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`transition-colors whitespace-nowrap shrink-0 py-2 relative cursor-pointer ${
                  isActive
                    ? 'text-[#168447] font-semibold'
                    : 'text-[#202820]/80 hover:text-[#168447]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Track Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenTrack}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#0B5130] bg-[#F2F8F4] border border-[#168447]/20 rounded-lg hover:bg-emerald-100/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#168447]" />
            <span>{t.nav.trackBooking}</span>
          </button>

          <button
            onClick={() => {
              onNavigate('packages');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#168447] rounded-lg hover:bg-[#0B5130] transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>{t.hero.bookNow}</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#202820] hover:text-[#168447] rounded-lg focus:outline-none"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-5 shadow-lg">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2.5 text-sm font-medium border-b border-neutral-100 ${
                  activeTab === link.id ? 'text-[#168447] font-semibold' : 'text-[#202820]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onOpenTrack();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-center text-[#0B5130] bg-[#F2F8F4] border border-[#168447]/20 rounded-lg flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-[#168447]" />
                <span>{t.nav.trackBooking}</span>
              </button>

              <div className="flex items-center justify-between pt-2 text-xs text-neutral-500">
                <span className="font-medium">Luuqadda / Language:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onLanguageChange('so')}
                    className={`px-3 py-1 rounded text-xs font-bold border ${
                      currentLang === 'so'
                        ? 'bg-[#168447] text-white border-[#168447]'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    Soomaali
                  </button>
                  <button
                    onClick={() => onLanguageChange('en')}
                    className={`px-3 py-1 rounded text-xs font-bold border ${
                      currentLang === 'en'
                        ? 'bg-[#168447] text-white border-[#168447]'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
