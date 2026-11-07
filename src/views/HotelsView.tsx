import React, { useState } from 'react';
import { Language, Hotel } from '../types';
import { translations } from '../translations';
import {
  Building2,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Check,
  Calendar,
  Users,
  Search,
  Eye,
  ArrowRight
} from 'lucide-react';

interface HotelsViewProps {
  currentLang: Language;
  hotels: Hotel[];
  onReserveHotel: (hotel: Hotel, roomType?: any) => void;
}

export const HotelsView: React.FC<HotelsViewProps> = ({
  currentLang,
  hotels,
  onReserveHotel
}) => {
  const t = translations[currentLang];
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [checkIn, setCheckIn] = useState('2026-04-15');
  const [checkOut, setCheckOut] = useState('2026-04-22');
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<Hotel | null>(null);

  const filteredHotels = hotels.filter((h) => {
    if (cityFilter === 'all') return true;
    return h.city.toLowerCase() === cityFilter.toLowerCase();
  });

  return (
    <div className="py-12 bg-[#F2F8F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
            {currentLang === 'so' ? 'Hoteellada Makka, Madiina & Caalamka' : 'Holy Haram & International Hospitality'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B5130] tracking-tight">
            {t.hotels.sectionTitle}
          </h1>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            {t.hotels.sectionSubtitle}
          </p>
        </div>

        {/* Filter Strip */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-neutral-200 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.hotels.destinationCity}
              </label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
              >
                <option value="all">
                  {currentLang === 'so' ? 'Dhammaan Magaalooyinka' : 'All Destinations'}
                </option>
                <option value="Makkah">Makka Al Mukarrama</option>
                <option value="Madinah">Madiina Al Munawwarah</option>
                <option value="Mogadishu">Muqdisho, Soomaaliya</option>
                <option value="Dubai">Dubai, UAE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.hotels.checkIn}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.hotels.checkOut}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                {t.hotels.guests}
              </label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
              >
                <option value={1}>1 Guest / Qof</option>
                <option value={2}>2 Guests / Qol Laba-qof</option>
                <option value={3}>3 Guests / Qol Sadex-qof</option>
                <option value={4}>4 Guests / Qol Afar-qof (Family)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Photo & badges */}
                <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#0B5130] text-white text-xs font-bold px-3 py-1 rounded-lg">
                    {hotel.city}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-[#0B5130] text-sm font-extrabold px-3 py-1 rounded-lg font-mono-numbers">
                    ${hotel.pricePerNight} {hotel.currency} / night
                  </div>
                </div>

                <div className="p-6">
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-xs font-semibold text-neutral-400 ml-1">
                      {hotel.stars}-Star Luxury
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#202820] mb-2 leading-snug">
                    {hotel.name}
                  </h3>

                  {/* Distance to Haram */}
                  <div className="flex items-center gap-1.5 text-xs text-[#168447] font-semibold mb-3">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>{hotel.distanceToHaram}</span>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 mb-4 leading-relaxed">
                    {currentLang === 'so' ? hotel.descriptionSo : hotel.descriptionEn}
                  </p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {hotel.amenities.slice(0, 4).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] text-neutral-600 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-md"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex items-center gap-3">
                <button
                  onClick={() => onReserveHotel(hotel)}
                  className="flex-1 py-3 px-4 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                >
                  {t.hotels.reserveHotel}
                </button>
                <button
                  onClick={() => setSelectedHotelForRooms(hotel)}
                  className="py-3 px-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  title="View available rooms & suites"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Room Selection Modal */}
        {selectedHotelForRooms && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in duration-200">
              <div className="bg-[#0B5130] text-white p-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-300 font-semibold uppercase tracking-wider block">
                    {selectedHotelForRooms.city} · {selectedHotelForRooms.stars}-Star
                  </span>
                  <h3 className="text-lg font-bold">{selectedHotelForRooms.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedHotelForRooms(null)}
                  className="text-white/80 hover:text-white p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <p className="text-xs text-neutral-600">
                  {currentLang === 'so'
                    ? 'Dooro qolka kugu habboon si aad u xaqiijisato boos celintaada:'
                    : 'Select your preferred room configuration below:'}
                </p>

                {selectedHotelForRooms.roomTypes.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#202820]">
                        {currentLang === 'so' ? room.nameSo : room.nameEn}
                      </h4>
                      <span className="text-xs text-neutral-500">
                        {currentLang === 'so' ? `Qaadaa ilaa ${room.capacity} qof` : `Capacity: up to ${room.capacity} guests`}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-base font-extrabold text-[#0B5130] font-mono-numbers">
                        ${room.price} USD
                      </span>
                      <button
                        onClick={() => {
                          const targetHotel = selectedHotelForRooms;
                          setSelectedHotelForRooms(null);
                          onReserveHotel(targetHotel, room);
                        }}
                        className="px-4 py-2 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {t.hotels.selectRoom}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
