import React, { useState } from 'react';
import { Language, GeneralBooking } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import { Search, X, CheckCircle2, Clock, AlertCircle, MessageSquare, ShieldCheck, Calendar, User, Plane } from 'lucide-react';

interface TrackBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const TrackBookingModal: React.FC<TrackBookingModalProps> = ({
  isOpen,
  onClose,
  currentLang
}) => {
  const t = translations[currentLang];
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneralBooking | null>(null);
  const [notFound, setNotFound] = useState(false);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const res = await api.trackBooking(searchTerm.trim());
      if (res.found && res.booking) {
        setResult(res.booking);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Approved':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Under Review':
      case 'Embassy Processing':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Cancelled':
      case 'Rejected':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Completed':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-neutral-700 bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0B5130] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="text-base font-bold leading-tight">{t.track.title}</h3>
              <p className="text-xs text-emerald-100">
                {currentLang === 'so' ? 'Hubi xaaladda boos celintaada waqti kasta' : 'Live real-time reservation lookup'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleTrack} className="mb-6">
            <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
              {t.track.subtitle}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.track.inputPlaceholder}
                className="flex-1 text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none uppercase font-mono-numbers"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? '...' : t.track.button}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="mb-6 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
            <span>Tusaalayaal (Try sample):</span>
            <button
              type="button"
              onClick={() => { setSearchTerm('DW-HAJJ-849201'); }}
              className="px-2 py-0.5 bg-neutral-100 hover:bg-emerald-50 text-[#168447] rounded border border-neutral-200 font-mono-numbers cursor-pointer"
            >
              DW-HAJJ-849201
            </button>
            <button
              type="button"
              onClick={() => { setSearchTerm('DW-UMR-592184'); }}
              className="px-2 py-0.5 bg-neutral-100 hover:bg-emerald-50 text-[#168447] rounded border border-neutral-200 font-mono-numbers cursor-pointer"
            >
              DW-UMR-592184
            </button>
            <button
              type="button"
              onClick={() => { setSearchTerm('DW-FLT-309172'); }}
              className="px-2 py-0.5 bg-neutral-100 hover:bg-emerald-50 text-[#168447] rounded border border-neutral-200 font-mono-numbers cursor-pointer"
            >
              DW-FLT-309172
            </button>
          </div>

          {/* Not Found State */}
          {notFound && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">
                  {currentLang === 'so' ? 'Lama Helin Tixraacan' : 'Reservation Not Found'}
                </p>
                <p>{t.track.notFound}</p>
              </div>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="bg-[#F2F8F4] border border-emerald-200 rounded-2xl p-5 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-100">
                <div>
                  <span className="text-[11px] text-neutral-500 font-medium block">
                    {t.bookingModal.referenceNo}
                  </span>
                  <span className="text-base font-extrabold text-[#0B5130] font-mono-numbers">
                    {result.referenceNo}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(result.status)}`}>
                  {result.status}
                </span>
              </div>

              {/* Status explanation */}
              <div className="bg-white p-3 rounded-xl border border-neutral-200 mb-4 text-xs">
                <div className="flex items-center gap-2 text-[#168447] font-semibold mb-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {result.status === 'Confirmed' ? t.track.statusConfirmed :
                     result.status === 'Under Review' ? t.track.statusUnderReview :
                     result.status === 'Pending' ? t.track.statusPending :
                     result.status === 'Cancelled' ? t.track.statusCancelled : t.track.statusCompleted}
                  </span>
                </div>
                {result.details?.pnrNumber && (
                  <p className="text-neutral-600 mt-1">
                    <span className="font-semibold text-neutral-800">Airline PNR:</span> {result.details.pnrNumber}
                  </p>
                )}
                {result.details?.ticketNumber && (
                  <p className="text-neutral-600 mt-0.5">
                    <span className="font-semibold text-neutral-800">E-Ticket No:</span> {result.details.ticketNumber}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                <div className="bg-white p-3 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Safarka / Service:</span>
                  <span className="font-semibold text-neutral-800">{result.serviceTitle}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Macaamiilka / Customer:</span>
                  <span className="font-semibold text-neutral-800">{result.customerName}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Taariikhda Safarka / Date:</span>
                  <span className="font-semibold text-neutral-800">{result.travelDate}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Lacagta / Payment:</span>
                  <span className="font-semibold text-[#168447] font-mono-numbers">
                    {result.paymentStatus} (${result.totalAmount} USD)
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  const msg = `Asc Duco Waalid, waxaan la socdaa dalabkayga #${result.referenceNo} (${result.serviceTitle}).`;
                  window.open(`https://wa.me/252613000000?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="w-full py-2.5 px-4 bg-[#168447] hover:bg-[#0B5130] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{currentLang === 'so' ? 'Kala Xiriir Wakiilka WhatsApp' : 'Contact Agent on WhatsApp'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
