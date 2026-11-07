import React, { useState } from 'react';
import { Language, Package } from '../types';
import { translations } from '../translations';
import {
  Calendar,
  Clock,
  MapPin,
  Check,
  X as XIcon,
  Users,
  Compass,
  HeartHandshake,
  Bus,
  ShieldCheck,
  Info
} from 'lucide-react';

interface PackagesViewProps {
  currentLang: Language;
  packages: Package[];
  onBookPackage: (pkg: Package) => void;
}

export const PackagesView: React.FC<PackagesViewProps> = ({
  currentLang,
  packages,
  onBookPackage
}) => {
  const t = translations[currentLang];
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [detailModalPkg, setDetailModalPkg] = useState<Package | null>(null);

  const categories = [
    { id: 'all', label: t.packages.all },
    { id: 'hajj', label: t.packages.hajj },
    { id: 'umrah', label: t.packages.umrah },
    { id: 'family', label: t.packages.family },
    { id: 'parent_deceased', label: t.packages.parentDeceased },
    { id: 'parent_unable', label: t.packages.parentUnable }
  ];

  const filteredPackages = packages.filter((pkg) => {
    if (selectedCategory === 'all') return true;
    return pkg.category === selectedCategory;
  });

  return (
    <div className="py-12 bg-[#F2F8F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
            {currentLang === 'so' ? 'Safarka Barakaysan ee Xajka & Cumrada' : 'Sacred Pilgrimage Packages'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B5130] tracking-tight">
            {t.packages.sectionTitle}
          </h1>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            {t.packages.sectionSubtitle}
          </p>
        </div>

        {/* Category Tabs (Interactive segmented buttons §1.A) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#168447] text-white border-[#168447] shadow-sm'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#168447]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Photo & Category Banner */}
                <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.titleEn}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B5130] text-white text-xs font-bold px-3 py-1 rounded-lg">
                    {pkg.category === 'hajj'
                      ? 'Xajka / Hajj'
                      : pkg.category === 'parent_deceased'
                      ? 'Umrah Badal'
                      : pkg.category === 'parent_unable'
                      ? 'Senior Assisted'
                      : 'Umrah'}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-[#0B5130] text-sm font-extrabold px-3 py-1.5 rounded-lg shadow-xs font-mono-numbers">
                    ${pkg.price} {pkg.currency}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#202820] mb-2 leading-tight">
                    {currentLang === 'so' ? pkg.titleSo : pkg.titleEn}
                  </h3>

                  <p className="text-xs text-neutral-600 line-clamp-3 mb-4 leading-relaxed">
                    {currentLang === 'so' ? pkg.descriptionSo : pkg.descriptionEn}
                  </p>

                  {/* Clean unboxed metadata strip (§1.A) */}
                  <div className="space-y-2 py-3 border-y border-neutral-100 text-xs text-neutral-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-neutral-500">
                        <Clock className="w-3.5 h-3.5 text-[#168447]" />
                        <span>{t.packages.duration}:</span>
                      </span>
                      <span className="font-semibold text-neutral-800">
                        {pkg.durationDays} {t.packages.days}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-neutral-500">
                        <Calendar className="w-3.5 h-3.5 text-[#168447]" />
                        <span>{t.packages.departure}:</span>
                      </span>
                      <span className="font-semibold text-neutral-800">
                        {pkg.departureDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-neutral-500">
                        <MapPin className="w-3.5 h-3.5 text-[#168447]" />
                        <span>{t.packages.makkahHotel}:</span>
                      </span>
                      <span className="font-semibold text-neutral-800 truncate max-w-[180px]">
                        {pkg.makkahHotel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-neutral-500">
                        <Users className="w-3.5 h-3.5 text-[#168447]" />
                        <span>{t.packages.seatsLeft}:</span>
                      </span>
                      <span className="font-bold text-[#168447]">
                        {pkg.availableSeats} / {pkg.totalSeats}
                      </span>
                    </div>
                  </div>

                  {/* Included highlights snippet */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                      {t.packages.included}:
                    </span>
                    {(currentLang === 'so' ? pkg.includedSo : pkg.includedEn).slice(0, 3).map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => onBookPackage(pkg)}
                  className="flex-1 py-3 px-4 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                >
                  {t.packages.bookPackage}
                </button>
                <button
                  onClick={() => setDetailModalPkg(pkg)}
                  className="py-3 px-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  title="View full package itinerary"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Package Modal */}
        {detailModalPkg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in duration-200">
              <div className="relative aspect-16/9 bg-neutral-900">
                <img
                  src={detailModalPkg.image}
                  alt={detailModalPkg.titleEn}
                  className="w-full h-full object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <button
                  onClick={() => setDetailModalPkg(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
                >
                  <XIcon className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    {detailModalPkg.category === 'hajj'
                      ? 'Xajka / Hajj'
                      : detailModalPkg.category === 'parent_deceased'
                      ? 'Umrah Badal'
                      : 'Umrah Package'}
                  </span>
                  <h3 className="text-xl font-extrabold mt-1">
                    {currentLang === 'so' ? detailModalPkg.titleSo : detailModalPkg.titleEn}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-white/90 mt-1 font-mono-numbers">
                    <span>${detailModalPkg.price} {detailModalPkg.currency}</span>
                    <span>·</span>
                    <span>{detailModalPkg.durationDays} Maalmood / Days</span>
                  </div>
                </div>
              </div>

              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    {currentLang === 'so' ? 'Faahfaahinta Xidhmada' : 'Package Overview'}
                  </h4>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {currentLang === 'so' ? detailModalPkg.descriptionSo : detailModalPkg.descriptionEn}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F2F8F4] p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-neutral-500 block">Makka Hotel:</span>
                    <span className="font-semibold text-[#0B5130]">{detailModalPkg.makkahHotel}</span>
                    <span className="text-[11px] text-neutral-500 block">{detailModalPkg.makkahDistance}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">Madinah Hotel:</span>
                    <span className="font-semibold text-[#0B5130]">{detailModalPkg.madinahHotel}</span>
                    <span className="text-[11px] text-neutral-500 block">{detailModalPkg.madinahDistance}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">{t.packages.departure}:</span>
                    <span className="font-semibold text-neutral-800">{detailModalPkg.departureDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">{t.packages.transport}:</span>
                    <span className="font-semibold text-neutral-800">{detailModalPkg.transportation}</span>
                  </div>
                </div>

                {/* Inclusions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                    {t.packages.included}
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-700">
                    {(currentLang === 'so' ? detailModalPkg.includedSo : detailModalPkg.includedEn).map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    {t.packages.excluded}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-neutral-600">
                    {(currentLang === 'so' ? detailModalPkg.excludedSo : detailModalPkg.excludedEn).map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setDetailModalPkg(null)}
                  className="px-4 py-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  {t.bookingModal.close}
                </button>
                <button
                  onClick={() => {
                    const selected = detailModalPkg;
                    setDetailModalPkg(null);
                    onBookPackage(selected);
                  }}
                  className="px-6 py-2.5 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  {t.packages.bookPackage}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
