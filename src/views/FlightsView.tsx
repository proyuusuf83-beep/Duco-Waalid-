import React, { useState } from 'react';
import { Language, FlightOption } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Users,
  Luggage,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface FlightsViewProps {
  currentLang: Language;
  onBookFlight: (flight: FlightOption, params: any) => void;
  initialOrigin?: string;
  initialDestination?: string;
}

export const FlightsView: React.FC<FlightsViewProps> = ({
  currentLang,
  onBookFlight,
  initialOrigin = 'Mogadishu (MGQ)',
  initialDestination = 'Jeddah (JED)'
}) => {
  const t = translations[currentLang];
  const [tripType, setTripType] = useState<'round-trip' | 'one-way'>('round-trip');
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [departureDate, setDepartureDate] = useState('2026-04-18');
  const [returnDate, setReturnDate] = useState('2026-05-05');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<'economy' | 'business'>('economy');

  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initial load
  React.useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const results = await api.searchFlights(origin, destination);
      setFlights(results);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCities = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const totalPassengers = adults + children + infants;

  return (
    <div className="py-12 bg-[#F2F8F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
            {currentLang === 'so' ? 'Duullimaadyada Caalamiga ah' : 'International Air Ticketing'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B5130] tracking-tight">
            {t.flights.sectionTitle}
          </h1>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            {t.flights.sectionSubtitle}
          </p>
        </div>

        {/* Flight Search Engine Box */}
        <div className="bg-white rounded-2xl shadow-md border border-neutral-200 p-6 sm:p-8 mb-12">
          {/* Trip Type Segmented Controls */}
          <div className="flex items-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setTripType('round-trip')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                tripType === 'round-trip'
                  ? 'bg-[#168447] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {t.flights.tripTypeRound}
            </button>
            <button
              type="button"
              onClick={() => setTripType('one-way')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                tripType === 'one-way'
                  ? 'bg-[#168447] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {t.flights.tripTypeOneWay}
            </button>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Origin & Destination Row */}
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {t.flights.from}
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                >
                  <option value="Mogadishu (MGQ)">Muqdisho - Aden Adde Intl (MGQ)</option>
                  <option value="Hargeisa (HGA)">Hargeysa - Egal Intl (HGA)</option>
                  <option value="Garowe (GGR)">Garoowe - Gen. Mohamed Abshir (GGR)</option>
                  <option value="Nairobi (NBO)">Nairobi - Jomo Kenyatta (NBO)</option>
                  <option value="Dubai (DXB)">Dubai International (DXB)</option>
                  <option value="Istanbul (IST)">Istanbul Airport (IST)</option>
                  <option value="London (LHR)">London Heathrow (LHR)</option>
                  <option value="Minneapolis (MSP)">Minneapolis-St Paul (MSP)</option>
                  <option value="Jeddah (JED)">Jeddah - King Abdulaziz (JED)</option>
                </select>
              </div>

              <div className="md:col-span-1 flex justify-center pt-5 md:pt-0">
                <button
                  type="button"
                  onClick={handleSwapCities}
                  className="p-2.5 rounded-full bg-neutral-100 hover:bg-emerald-50 text-neutral-600 hover:text-[#168447] border border-neutral-200 transition-colors"
                  title="Swap Departure and Destination"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="md:col-span-5">
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {t.flights.to}
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                >
                  <option value="Jeddah (JED)">Jeddah - King Abdulaziz (JED)</option>
                  <option value="Madinah (MED)">Madiina - Prince Mohammad (MED)</option>
                  <option value="Dubai (DXB)">Dubai International (DXB)</option>
                  <option value="Istanbul (IST)">Istanbul Airport (IST)</option>
                  <option value="Nairobi (NBO)">Nairobi - Jomo Kenyatta (NBO)</option>
                  <option value="Mogadishu (MGQ)">Muqdisho - Aden Adde Intl (MGQ)</option>
                  <option value="Hargeisa (HGA)">Hargeysa - Egal Intl (HGA)</option>
                </select>
              </div>
            </div>

            {/* Dates & Passengers Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {t.flights.departureDate}
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  required
                />
              </div>

              {tripType === 'round-trip' ? (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    {t.flights.returnDate}
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    required
                  />
                </div>
              ) : (
                <div className="opacity-50">
                  <label className="block text-xs font-semibold text-neutral-400 mb-1.5">
                    {t.flights.returnDate} (One Way)
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Hal jiho / Not applicable"
                    className="w-full text-xs p-3.5 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {t.flights.passengers}
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value))}
                    className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'Adult' : 'Adults'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {t.flights.cabinClass}
                </label>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as any)}
                  className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                >
                  <option value="economy">Economy Class</option>
                  <option value="business">Business Class</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <Plane className="w-4 h-4" />
                <span>{loading ? 'Searching...' : t.flights.searchFlights}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Disclaimer per §05 of Master Prompt */}
        <div className="mb-8 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-[#0B5130]">
          <ShieldCheck className="w-5 h-5 text-[#168447] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.flights.disclaimer}
          </p>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-base font-bold text-[#0B5130]">
              {t.flights.flightResults} ({flights.length})
            </h3>
            <span className="text-xs text-neutral-500">
              {origin} → {destination}
            </span>
          </div>

          {flights.map((flight) => {
            const calculatedPrice = flight.price * (cabinClass === 'business' ? 1.9 : 1) * totalPassengers;

            return (
              <div
                key={flight.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Airline & Flight Numbers */}
                <div className="flex items-start gap-4 min-w-[200px]">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#168447] flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-100">
                    {flight.airlineCode}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#202820]">{flight.airline}</h4>
                    <span className="text-xs text-neutral-500 font-mono-numbers">{flight.flightNumber}</span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">{flight.airplane}</span>
                  </div>
                </div>

                {/* Timeline & Route */}
                <div className="flex-1 flex items-center justify-between max-w-md">
                  <div className="text-left">
                    <span className="text-base font-extrabold text-[#202820] block font-mono-numbers">
                      {flight.departureTime}
                    </span>
                    <span className="text-xs text-neutral-500 font-semibold">{flight.origin}</span>
                    <span className="text-[11px] text-neutral-400 block truncate max-w-[100px]">
                      {flight.originCity}
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-4">
                    <span className="text-[11px] text-neutral-500 font-medium font-mono-numbers">
                      {flight.duration}
                    </span>
                    <div className="relative w-28 sm:w-36 flex items-center my-1.5">
                      <div className="h-0.5 w-full bg-neutral-200" />
                      <Plane className="w-3.5 h-3.5 text-[#168447] absolute right-0" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800">
                      {flight.stops === 0
                        ? t.flights.directFlight
                        : `${flight.stops} ${t.flights.stop} (${flight.stopCity})`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#202820] block font-mono-numbers">
                      {flight.arrivalTime}
                    </span>
                    <span className="text-xs text-neutral-500 font-semibold">{flight.destination}</span>
                    <span className="text-[11px] text-neutral-400 block truncate max-w-[100px]">
                      {flight.destinationCity}
                    </span>
                  </div>
                </div>

                {/* Baggage, Pricing & Request CTA */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Luggage className="w-3.5 h-3.5 text-[#168447]" />
                    <span>{flight.baggage}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-extrabold text-[#0B5130] font-mono-numbers block leading-none">
                      ${calculatedPrice} USD
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {totalPassengers > 1 ? `Total for ${totalPassengers} pax` : 'per passenger'}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      onBookFlight(flight, {
                        tripType,
                        origin,
                        destination,
                        departureDate,
                        returnDate,
                        passengersCount: { adults, children, infants },
                        cabinClass,
                        totalPrice: calculatedPrice
                      })
                    }
                    className="py-2.5 px-5 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    {t.flights.requestBooking}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
