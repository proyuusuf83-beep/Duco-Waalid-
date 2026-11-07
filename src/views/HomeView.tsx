import React, { useState } from 'react';
import { Language, Package, FlightOption, Hotel, VisaCategory, Testimonial } from '../types';
import { translations } from '../translations';
import {
  Plane,
  Building2,
  FileCheck2,
  Compass,
  ArrowRight,
  ShieldCheck,
  Star,
  HeartHandshake,
  Users,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Search
} from 'lucide-react';

interface HomeViewProps {
  currentLang: Language;
  packages: Package[];
  hotels: Hotel[];
  visas: VisaCategory[];
  testimonials: Testimonial[];
  onNavigate: (tab: string) => void;
  onBookPackage: (pkg: Package) => void;
  onReserveHotel: (hotel: Hotel) => void;
  onSearchFlights: (origin: string, destination: string) => void;
  onOpenTrack: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLang,
  packages,
  hotels,
  visas,
  testimonials,
  onNavigate,
  onBookPackage,
  onReserveHotel,
  onSearchFlights,
  onOpenTrack
}) => {
  const t = translations[currentLang];
  const [activeSearchTab, setActiveSearchTab] = useState<'hajj' | 'flights' | 'hotels' | 'visa'>('hajj');

  // Quick search states
  const [flightOrigin, setFlightOrigin] = useState('Mogadishu (MGQ)');
  const [flightDest, setFlightDest] = useState('Jeddah (JED)');
  const [hotelCity, setHotelCity] = useState('Makkah');
  const [selectedVisaCountry, setSelectedVisaCountry] = useState('Saudi Arabia');

  const featuredPackages = packages.filter((p) => p.featured).slice(0, 3);
  const featuredHotels = hotels.slice(0, 3);

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeSearchTab === 'flights') {
      onSearchFlights(flightOrigin, flightDest);
      onNavigate('flights');
    } else if (activeSearchTab === 'hotels') {
      onNavigate('hotels');
    } else if (activeSearchTab === 'visa') {
      onNavigate('visa');
    } else {
      onNavigate('packages');
    }
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center bg-[#0B5130] overflow-hidden text-white">
        {/* Background photo with measured contrast scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/makkah_kaaba_pilgrims_1794064534790.jpg"
            alt="Makkah Holy Kaaba Pilgrims"
            className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-fade-in"
            referrerPolicy="no-referrer"
          />
          {/* Measured gradient scrim per §1.F */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B5130]/95 via-[#0B5130]/80 to-black/50" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              {/* Unboxed category kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.hero.badge}</span>
                <span aria-hidden="true" className="text-emerald-400/50">·</span>
                <span className="text-white/80">Muqdisho & Hargeysa</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white text-balance">
                {t.hero.title}
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    onNavigate('packages');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-[#168447] hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Plane className="w-4 h-4" />
                  <span>{t.hero.bookNow}</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-sm font-bold backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>{t.hero.contactUs}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Parent Service Trust Banner */}
              <div className="pt-4 flex items-center gap-3 text-xs text-emerald-200 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 max-w-xl">
                <HeartHandshake className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>
                  {currentLang === 'so'
                    ? 'Adeeg gaar ah: Cumrada wakiilka (Badal) ee waalidka geeriyooday iyo kuraasta curyaanka ee waayeelka.'
                    : 'Specialized filial care: Umrah Badal on behalf of deceased parents & full wheelchair assistance.'}
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Quick Search Panel */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-[#202820] border border-neutral-100">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <span className="text-sm font-bold text-[#0B5130] tracking-tight">
                    {t.hero.quickSearch}
                  </span>
                  <button
                    onClick={onOpenTrack}
                    className="text-xs text-[#168447] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{t.nav.trackBooking}</span>
                  </button>
                </div>

                {/* Segmented Tab Controls */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-100 rounded-xl mt-4 mb-5">
                  <button
                    type="button"
                    onClick={() => setActiveSearchTab('hajj')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      activeSearchTab === 'hajj'
                        ? 'bg-white text-[#168447] shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{currentLang === 'so' ? 'Xajka' : 'Pilgrimage'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSearchTab('flights')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      activeSearchTab === 'flights'
                        ? 'bg-white text-[#168447] shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <Plane className="w-3.5 h-3.5" />
                    <span>{currentLang === 'so' ? 'Duullimaad' : 'Flights'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSearchTab('hotels')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      activeSearchTab === 'hotels'
                        ? 'bg-white text-[#168447] shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{currentLang === 'so' ? 'Hoteel' : 'Hotels'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSearchTab('visa')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      activeSearchTab === 'visa'
                        ? 'bg-white text-[#168447] shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{currentLang === 'so' ? 'Fiiso' : 'Visa'}</span>
                  </button>
                </div>

                {/* Form fields based on tab */}
                <form onSubmit={handleQuickSearchSubmit} className="space-y-4">
                  {activeSearchTab === 'hajj' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-1">
                          {currentLang === 'so' ? 'Nooca Cibaadada' : 'Service Category'}
                        </label>
                        <select className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none">
                          <option>{currentLang === 'so' ? 'Xidhmada Xajka VIP 2026' : 'VIP Hajj Package 2026'}</option>
                          <option>{currentLang === 'so' ? 'Cumrada Ramadaan' : 'Ramadan Blessed Umrah'}</option>
                          <option>{currentLang === 'so' ? 'Cumrada Badal (Waalidka Geeriyooday)' : 'Umrah Badal for Deceased Parents'}</option>
                          <option>{currentLang === 'so' ? 'Cumrada Waalidka Aan Awoodin Safarka' : 'Assisted Umrah for Mobility-Challenged Parents'}</option>
                          <option>{currentLang === 'so' ? 'Cumrada Qoysaska (Family Umrah)' : 'Family Deluxe Umrah'}</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">
                            {currentLang === 'so' ? 'Bisha Safarka' : 'Preferred Month'}
                          </label>
                          <select className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none">
                            <option>March 2026 (Ramadan)</option>
                            <option>April 2026 (Shawwal)</option>
                            <option>May 2026 (Hajj Season)</option>
                            <option>Year-Round / Joogto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">
                            {currentLang === 'so' ? 'Tirada Qofka' : 'Travelers'}
                          </label>
                          <select className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none">
                            <option>1 Qof / Person</option>
                            <option>2 Qof (Lamaane / Couple)</option>
                            <option>3-5 Qof (Qoys / Family)</option>
                            <option>6+ Qof (Koox / Group)</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {activeSearchTab === 'flights' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">
                            {t.flights.from}
                          </label>
                          <select
                            value={flightOrigin}
                            onChange={(e) => setFlightOrigin(e.target.value)}
                            className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                          >
                            <option value="Mogadishu (MGQ)">Muqdisho (MGQ)</option>
                            <option value="Hargeisa (HGA)">Hargeysa (HGA)</option>
                            <option value="Nairobi (NBO)">Nairobi (NBO)</option>
                            <option value="Dubai (DXB)">Dubai (DXB)</option>
                            <option value="London (LHR)">London (LHR)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">
                            {t.flights.to}
                          </label>
                          <select
                            value={flightDest}
                            onChange={(e) => setFlightDest(e.target.value)}
                            className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                          >
                            <option value="Jeddah (JED)">Jeddah (JED - Makkah)</option>
                            <option value="Madinah (MED)">Madiina (MED)</option>
                            <option value="Dubai (DXB)">Dubai (DXB)</option>
                            <option value="Istanbul (IST)">Istanbul (IST)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">
                            {t.flights.departureDate}
                          </label>
                          <input
                            type="date"
                            defaultValue="2026-04-15"
                            className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">
                            {t.flights.cabinClass}
                          </label>
                          <select className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none">
                            <option>Economy</option>
                            <option>Business Class</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {activeSearchTab === 'hotels' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-1">
                          {t.hotels.destinationCity}
                        </label>
                        <select
                          value={hotelCity}
                          onChange={(e) => setHotelCity(e.target.value)}
                          className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                        >
                          <option value="Makkah">Makka Al Mukarrama</option>
                          <option value="Madinah">Madiina Al Munawwarah</option>
                          <option value="Dubai">Dubai, UAE</option>
                          <option value="Mogadishu">Muqdisho, Somalia</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">
                            {t.hotels.checkIn}
                          </label>
                          <input
                            type="date"
                            defaultValue="2026-04-15"
                            className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">
                            {t.hotels.checkOut}
                          </label>
                          <input
                            type="date"
                            defaultValue="2026-04-25"
                            className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeSearchTab === 'visa' && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-1">
                          {t.visa.selectCountry}
                        </label>
                        <select
                          value={selectedVisaCountry}
                          onChange={(e) => setSelectedVisaCountry(e.target.value)}
                          className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                        >
                          <option value="Saudi Arabia">Sacuudi Carabiya (Umrah / Tourist)</option>
                          <option value="Turkey">Turkiga (Turkey E-Visa / Sticker)</option>
                          <option value="UAE">Imaaraadka Dubai (UAE Tourist 30/60 Days)</option>
                          <option value="Kenya">Kiinya (Kenya ETA)</option>
                          <option value="India">Hindiya (India Medical Visa)</option>
                        </select>
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        {currentLang === 'so'
                          ? 'Waxaan kuu diyaarineynaa xaqiijinta rasmiga ah, caymiska safarka, iyo gudbinta safaaradda.'
                          : 'Official biometric verification, mandatory insurance, and embassy lodgement assistance.'}
                      </p>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>
                      {activeSearchTab === 'hajj'
                        ? t.packages.bookPackage
                        : activeSearchTab === 'flights'
                        ? t.flights.searchFlights
                        : activeSearchTab === 'hotels'
                        ? t.hotels.searchHotels
                        : t.visa.applyNow}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-white border-b border-neutral-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B5130] font-mono-numbers">
                15,000+
              </span>
              <span className="text-xs font-semibold text-neutral-600 mt-1">
                {t.stats.pilgrims}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#168447] font-mono-numbers">
                99.4%
              </span>
              <span className="text-xs font-semibold text-neutral-600 mt-1">
                {t.stats.visaRate}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B5130] font-mono-numbers">
                12+
              </span>
              <span className="text-xs font-semibold text-neutral-600 mt-1">
                {t.stats.airlinePartners}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#168447] font-mono-numbers">
                24/7
              </span>
              <span className="text-xs font-semibold text-neutral-600 mt-1">
                {t.stats.support}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PARENTAL HONOR SPOTLIGHT SECTION */}
      <section className="py-20 bg-[#F2F8F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image on left */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-4/3">
                <img
                  src="/assets/images/hajj_umrah_family_elders_1794064535810.jpg"
                  alt="Elderly Father and Son Umrah"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-2xl shadow-xl border border-emerald-100 max-w-xs hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#168447] flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#0B5130]">Duco Waalid</h5>
                    <p className="text-[11px] text-neutral-500">
                      {currentLang === 'so' ? 'Daryeelka waalidka cibaadada dhexdeeda' : 'Honoring parents through pilgrimage'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content on right */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-xs font-bold text-[#168447] uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>{currentLang === 'so' ? 'Adeegga Gaarka ah ee Shirkadda' : 'Our Signature Filial Service'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B5130] tracking-tight text-balance">
                {currentLang === 'so'
                  ? 'U Gud Cumro Waalidkaaga Geeriyooday ama Caawin U Fidi Kuwa Waayeelka ah'
                  : 'Perform Umrah on Behalf of Deceased Parents or Provide Assisted Wheelchair Pilgrimage'}
              </h2>

              <p className="text-sm text-neutral-700 leading-relaxed">
                {currentLang === 'so'
                  ? 'Duco Waalid waxay ku dhalatay fikradda ah in waalidku mudan yahay sharaf iyo daryeel gaar ah. Waxaan bixinaa labo adeeg oo muhiim ah: Cumrada wakiilashada (Badal) oo culimo aammin ah oo Makka jooga u soo gudanayaan waalidkaaga geeriyooday iyagoo soo duubaya muuqaalka ducada iyo shahaado rasmi ah; iyo adeegga gacan-qabashada waalidka waayeelka ah oo leh kuraasta curyaanka iyo hoteello wiish toos ah ku leh Xaramka.'
                  : 'Duco Waalid was founded on the sacred duty of honoring parents. We provide two distinct services: Authentic Umrah Badal performed on behalf of deceased parents by verified scholars in Makkah with personalized prayer video recordings and certificates, and comprehensive physical assistance for elderly parents with direct wheelchair attendants and zero-stair hotels.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                  <h4 className="text-xs font-bold text-[#0B5130] mb-1">
                    {currentLang === 'so' ? '1. Cumrada Badal' : '1. Proxy Umrah (Badal)'}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {currentLang === 'so'
                      ? 'Loo gudanayo waalidka geeriyooday, oo leh video toos ah iyo shahaado rasmi ah.'
                      : 'Dedicated pilgrimage for late parents with live video prayer proof & certificate.'}
                  </p>
                  <button
                    onClick={() => {
                      const parentDeceasedPkg = packages.find((p) => p.category === 'parent_deceased');
                      if (parentDeceasedPkg) onBookPackage(parentDeceasedPkg);
                      else onNavigate('packages');
                    }}
                    className="mt-3 text-xs font-bold text-[#168447] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{currentLang === 'so' ? 'Faahfaahin & Dalbo ($300)' : 'Details & Order ($300)'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs">
                  <h4 className="text-xs font-bold text-[#0B5130] mb-1">
                    {currentLang === 'so' ? '2. Waalidka Aan Awoodin Socodka' : '2. Assisted Senior Pilgrimage'}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {currentLang === 'so'
                      ? 'Kaaliyeyaal kuraasta u riixa Dawaafka & Sacayga iyo hoteello albaabka Xaramka ah.'
                      : 'Personal wheelchair attendants and elevator-access luxury suites.'}
                  </p>
                  <button
                    onClick={() => {
                      const parentUnablePkg = packages.find((p) => p.category === 'parent_unable');
                      if (parentUnablePkg) onBookPackage(parentUnablePkg);
                      else onNavigate('packages');
                    }}
                    className="mt-3 text-xs font-bold text-[#168447] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{currentLang === 'so' ? 'Faahfaahin & Dalbo' : 'Details & Book'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PACKAGES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
                {currentLang === 'so' ? 'Safarrada Xurmada Leh' : 'Sacred Journeys'}
              </span>
              <h2 className="text-3xl font-extrabold text-[#0B5130] tracking-tight">
                {t.packages.sectionTitle}
              </h2>
            </div>
            <button
              onClick={() => {
                onNavigate('packages');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#168447] hover:text-[#0B5130] flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>{currentLang === 'so' ? 'Eeg Dhammaan Xidhmadaha' : 'View All Packages'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-neutral-100">
                  <img
                    src={pkg.image}
                    alt={pkg.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#0B5130] text-xs font-bold px-3 py-1 rounded-lg shadow-xs">
                    {pkg.category === 'hajj'
                      ? 'Hajj 2026'
                      : pkg.category === 'parent_deceased'
                      ? 'Umrah Badal'
                      : pkg.category === 'parent_unable'
                      ? 'Senior Assisted'
                      : 'Umrah'}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#0B5130]/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg font-mono-numbers">
                    ${pkg.price} USD
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#202820] mb-2 leading-snug">
                      {currentLang === 'so' ? pkg.titleSo : pkg.titleEn}
                    </h3>
                    <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
                      {currentLang === 'so' ? pkg.descriptionSo : pkg.descriptionEn}
                    </p>

                    {/* Metadata line without pills (§1.A) */}
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-4 pb-4 border-b border-neutral-100">
                      <span className="font-semibold text-neutral-700">{pkg.durationDays} {t.packages.days}</span>
                      <span aria-hidden="true">·</span>
                      <span>{pkg.makkahHotel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#168447] font-semibold">{pkg.availableSeats} {t.packages.seatsLeft}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onBookPackage(pkg)}
                      className="flex-1 py-2.5 px-4 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      {t.packages.bookPackage}
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('packages');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      {t.packages.viewDetails}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE DUCO WAALID */}
      <section className="py-20 bg-[#F2F8F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
              {currentLang === 'so' ? 'Kalsooni & Daacadnimo' : 'Trust & Authenticity'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B5130] tracking-tight">
              {t.features.whyChooseUs}
            </h2>
            <p className="text-sm text-neutral-600 mt-3">
              {t.features.whySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center mb-4">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#0B5130] mb-2">{t.features.feature1Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{t.features.feature1Desc}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#0B5130] mb-2">{t.features.feature2Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{t.features.feature2Desc}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#0B5130] mb-2">{t.features.feature3Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{t.features.feature3Desc}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#0B5130] mb-2">{t.features.feature4Title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{t.features.feature4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOTEL PREVIEW (MAKKAH & MADINAH) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
                {currentLang === 'so' ? 'Degsiimada Barakaysan' : 'Sacred Accommodations'}
              </span>
              <h2 className="text-3xl font-extrabold text-[#0B5130] tracking-tight">
                {t.hotels.sectionTitle}
              </h2>
            </div>
            <button
              onClick={() => {
                onNavigate('hotels');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-bold text-[#168447] hover:text-[#0B5130] flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>{currentLang === 'so' ? 'Eeg Hoteellada Kale' : 'Explore All Hotels'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredHotels.map((htl) => (
              <div
                key={htl.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative aspect-16/10 bg-neutral-100">
                  <img
                    src={htl.image}
                    alt={htl.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B5130] text-white text-xs font-bold px-3 py-1 rounded-lg">
                    {htl.city}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-[#0B5130] text-xs font-bold px-2.5 py-1 rounded-lg font-mono-numbers">
                    ${htl.pricePerNight} / night
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 mb-1.5">
                      {[...Array(htl.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <h3 className="text-sm font-bold text-[#202820] mb-1">{htl.name}</h3>
                    <p className="text-xs text-[#168447] font-semibold mb-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{htl.distanceToHaram}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => onReserveHotel(htl)}
                    className="w-full py-2.5 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                  >
                    {t.hotels.reserveHotel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-[#F2F8F4] border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
              {currentLang === 'so' ? 'Codadka Xujaajta & Macaamiisha' : 'Pilgrim & Traveler Stories'}
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B5130] tracking-tight">
              {currentLang === 'so' ? 'Maxay Macaamiishu Ka Yiraahdeen Duco Waalid?' : 'What Our Travelers Say About Us'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed italic mb-6">
                    "{currentLang === 'so' ? item.commentSo : item.commentEn}"
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#0B5130]">{item.name}</h4>
                    <span className="text-[11px] text-neutral-500">
                      {currentLang === 'so' ? item.locationSo : item.locationEn}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#168447] font-semibold">
                    {currentLang === 'so' ? item.packageTypeSo : item.packageTypeEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CALL TO ACTION */}
      <section className="bg-[#0B5130] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {currentLang === 'so'
              ? 'Diyaar Ma U Tahay Inaad Nala Bilowdo Safarkaaga Barakaysan?'
              : 'Ready to Embark on Your Sacred and Global Journey?'}
          </h2>
          <p className="text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'so'
              ? 'Wakiilladayadu waxay diyaar u yihiin inay ku caawiyaan diiwaangelinta Xajka 2026, Cumrada, tikidhada diyaaradaha iyo fiisooyinka.'
              : 'Our dedicated concierges are ready to assist your registration for Hajj 2026, Umrah, international ticketing, and visa procurement.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                onNavigate('packages');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-[#168447] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              {t.packages.bookPackage}
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              {t.hero.contactUs}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
