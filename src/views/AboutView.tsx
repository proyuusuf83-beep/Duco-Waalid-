import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import {
  HeartHandshake,
  Compass,
  Eye,
  ShieldCheck,
  Award,
  Users,
  Building2,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface AboutViewProps {
  currentLang: Language;
  onNavigate: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ currentLang, onNavigate }) => {
  const t = translations[currentLang];

  const leadershipTeam = [
    {
      name: 'Sheikh Cabdiqani Maxamed Nuur',
      roleSo: 'Hogaamiyaha Guud ee Culimada Xajka & Cumrada',
      roleEn: 'Head of Shariah Clergy & Pilgrimage Guidance',
      bioSo: 'Qalin-jabiyey Jaamacadda Islaamiga ah ee Madiina. Khibrad 18 sano ah u leh hogaaminta xujaajta iyo wacyigelinta axkaamta cibaadada.',
      bioEn: 'Graduate of the Islamic University of Madinah with over 18 years of pilgrimage leadership experience across Makkah and Madinah.',
      image: '/assets/images/hajj_umrah_family_elders_1794064535810.jpg'
    },
    {
      name: 'Cabdiraxmaan Cali Warsame',
      roleSo: 'Agaasimaha Maamulka & Hawlgallada Caalamiga ah',
      roleEn: 'Managing Director & Global Operations',
      bioSo: 'Khabiir ku takhasusay duulimaadyada rayidka ah iyo heshiisyada hoteellada caalamiga ah ee Bariga Dhexe iyo Bariga Afrika.',
      bioEn: 'Aviation and hospitality logistics veteran coordinating charter schedules and top-tier Saudi hotel consortiums.',
      image: '/assets/images/luxury_makkah_hotel_view_1794064536654.jpg'
    },
    {
      name: 'Dr. Deeqa Maxamuud Jaamac',
      roleSo: 'Madaxa Daryeelka Caafimaadka & Waayeelka',
      roleEn: 'Director of Pilgrim Health & Elder Assistance',
      bioSo: 'Dhaqtarad ku takhasustay daryeelka waayeelka iyo dadka qaba cudurrada dabadheeraada xilliyada safarka xurmada leh.',
      bioEn: 'Physician leading our specialized medical squad ensuring senior pilgrims travel safely with tailored assistance.',
      image: '/assets/images/makkah_kaaba_pilgrims_1794064534790.jpg'
    }
  ];

  return (
    <div className="py-12 bg-white">
      {/* Hero Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
            {currentLang === 'so' ? 'Hordhaca & Taariikhda' : 'Heritage & Identity'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0B5130] tracking-tight">
            {t.about.title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-4 leading-relaxed">
            {t.subTagline}
          </p>
        </div>
      </div>

      {/* Story & Philosophy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#168447] uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>{t.about.historyTitle}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B5130] tracking-tight">
              {currentLang === 'so'
                ? 'Shirkad Lagu Dhisay Daacadnimo, Xurmo iyo Daryeelka Waalidka'
                : 'Founded on Reverence, Transparency, and Filial Devotion'}
            </h2>

            <p className="text-sm text-neutral-700 leading-relaxed">
              {t.about.historyDesc}
            </p>

            <p className="text-sm text-neutral-700 leading-relaxed">
              {currentLang === 'so'
                ? 'Waxaan dhisnay xiriir qoto-dheer oo toos ah oo lala leeyahay hoteellada 5-ta xiddigood ee ku xeeran Xaramka Makka iyo Madiina, shirkadaha diyaaradaha ee caalamiga ah sida Turkish Airlines, Daallo, flydubai, Ethiopian, iyo Qatar Airways, si aan macaamiishayada ugu dammaanad qaadno safar xasiloon oo aan lahayn wax walbahaar ah.'
                : 'Over the years, Duco Waalid has forged ironclad partnerships with the premier hotel towers overlooking the Kaaba and the Prophet’s Mosque, as well as premier carriers including Turkish Airlines, Daallo, flydubai, Ethiopian, and Qatar Airways, assuring our travelers seamless, stress-free journeys.'}
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm inline-flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{t.hero.contactUs}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 border-4 border-white">
              <img
                src="/assets/images/madinah_prophet_mosque_1794064535808.jpg"
                alt="Prophet Mosque Madinah Courtyard"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision & Values Cards */}
      <div className="bg-[#F2F8F4] py-20 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B5130] mb-3">{t.about.missionTitle}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed flex-1">
                {t.about.missionDesc}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B5130] mb-3">{t.about.visionTitle}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed flex-1">
                {t.about.visionDesc}
              </p>
            </div>

            {/* Core Values */}
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0B5130] mb-3">{t.about.valuesTitle}</h3>
              <ul className="space-y-2 text-xs text-neutral-700 flex-1">
                {t.about.values.map((v, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership & Guided Clergy Team */}
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
            {currentLang === 'so' ? 'Xirfad & Khibrad' : 'Clergy & Executive Leadership'}
          </span>
          <h2 className="text-3xl font-extrabold text-[#0B5130] tracking-tight">
            {t.about.teamTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadershipTeam.map((member, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-4/3 bg-neutral-100 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#202820] mb-1">{member.name}</h3>
                  <p className="text-xs font-semibold text-[#168447] mb-3">
                    {currentLang === 'so' ? member.roleSo : member.roleEn}
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {currentLang === 'so' ? member.bioSo : member.bioEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
