import React from 'react';
import { Language, CompanySettings } from '../types';
import { translations } from '../translations';
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

interface FooterProps {
  settings: CompanySettings;
  currentLang: Language;
  onNavigate: (tab: string) => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  currentLang,
  onNavigate,
  onOpenTrack,
  onOpenAdmin
}) => {
  const t = translations[currentLang];

  return (
    <footer className="bg-[#0B5130] text-white pt-16 pb-8 border-t border-[#168447]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          {/* Column 1: Brand & Filial Dedication */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1.5 shadow-sm">
                <img
                  src="/assets/aistudio/Logo_Duco_waalid_d76bc4ba.PNG"
                  alt="Duco Waalid Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block leading-none">
                  Duco Waalid
                </span>
                <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase mt-1 block">
                  Travel & Agency
                </span>
              </div>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {t.footer.aboutSummary}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-200">
              <HeartHandshake className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="italic font-medium">
                {currentLang === 'so'
                  ? 'U adeegida waalidka waa waajib iyo barako.'
                  : 'Honoring and serving parents is our sacred calling.'}
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <button
                  onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('packages'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.packages}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('flights'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.flights}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('hotels'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.hotels}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('visa'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.visa}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onNavigate('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrack}
                  className="hover:text-white transition-colors cursor-pointer font-semibold text-emerald-200"
                >
                  {t.nav.trackBooking}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Specialized Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">
              {t.footer.services}
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>{currentLang === 'so' ? 'Xidhmada Xajka VIP & Caadiga' : 'VIP & Standard Hajj 2026'}</li>
              <li>{currentLang === 'so' ? 'Cumrada Ramadaanka & Sanadlaha' : 'Blessed Ramadan Umrah'}</li>
              <li>{currentLang === 'so' ? 'Cumrada Badal (Waalidka Geeriyooday)' : 'Umrah Badal for Deceased Parents'}</li>
              <li>{currentLang === 'so' ? 'Cumrada Waalidka Aan Awoodin Socodka' : 'Assisted Umrah with Wheelchair Care'}</li>
              <li>{currentLang === 'so' ? 'Boos-celinta Tikidhada Diyaaradaha' : 'International Air Ticketing'}</li>
              <li>{currentLang === 'so' ? 'Hoteellada Makka & Madiina' : 'Makkah & Madinah Luxury Hotels'}</li>
              <li>{currentLang === 'so' ? 'Fiisooyinka Sacuudiga, Turkiga & Dubai' : 'Saudi, Turkey & Dubai Visas'}</li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">
              {t.contact.title}
            </h4>
            
            <div className="flex items-start gap-2.5 text-xs text-emerald-100/90">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{settings.addressMogadishu}</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-emerald-100/90">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{settings.addressHargeisa}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-emerald-100/90">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{settings.phoneMogadishu} / {settings.phoneHargeisa}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-emerald-100/90">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{settings.emailSupport}</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-emerald-100/90 pt-1">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{currentLang === 'so' ? settings.workingHoursSo : settings.workingHoursEn}</span>
            </div>
          </div>
        </div>

        {/* Accreditation & Bottom Legal Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-emerald-200/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{t.footer.licenseInfo}</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenAdmin} className="hover:text-white transition-colors cursor-pointer">
              {t.nav.adminPortal}
            </button>
            <span>·</span>
            <span>{t.footer.rights}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
