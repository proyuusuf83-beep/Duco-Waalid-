import React, { useState } from 'react';
import { Language, GeneralBooking } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import { X, CheckCircle2, ShieldCheck, Copy, Check, MessageSquare, ArrowRight, UserCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'Hajj' | 'Umrah' | 'Parent Umrah' | 'Flight' | 'Hotel' | 'Visa';
  serviceTitle: string;
  defaultPrice?: number;
  initialDetails?: Record<string, any>;
  currentLang: Language;
  onBookingCreated?: (booking: GeneralBooking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  serviceTitle,
  defaultPrice = 0,
  initialDetails = {},
  currentLang,
  onBookingCreated
}) => {
  const t = translations[currentLang];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<GeneralBooking | null>(null);
  const [copied, setCopied] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelDate, setTravelDate] = useState(initialDetails.departureDate || '2026-05-20');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [nationality, setNationality] = useState('Somali');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [parentName, setParentName] = useState(''); // For parent Umrah
  const [passengersCount, setPassengersCount] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      setErrorMsg(currentLang === 'so' ? 'Fadlan buuxi magacaaga iyo telefoonkaaga.' : 'Please provide your full name and phone number.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    const bookingPayload: Partial<GeneralBooking> = {
      serviceType,
      serviceTitle,
      customerName,
      phone,
      email: email || `${customerName.toLowerCase().replace(/\s+/g, '')}@client.travel`,
      travelDate,
      totalAmount: defaultPrice * (passengersCount || 1),
      currency: 'USD',
      details: {
        ...initialDetails,
        passengersCount,
        passportNumber,
        passportExpiry,
        nationality,
        specialNeeds,
        parentName: parentName || initialDetails.parentName
      }
    };

    try {
      const result = await api.createBooking(bookingPayload);
      setConfirmedBooking(result);
      if (onBookingCreated) onBookingCreated(result);
      setStep(3);
    } catch (err) {
      console.error(err);
      setErrorMsg(currentLang === 'so' ? 'Qalad ayaa dhacay, fadlan mar kale isku day.' : 'An error occurred, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (confirmedBooking?.referenceNo) {
      navigator.clipboard.writeText(confirmedBooking.referenceNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppDirect = () => {
    if (!confirmedBooking) return;
    const msg = currentLang === 'so'
      ? `Asc Duco Waalid, waxaan soo gudbiyey dalabka #${confirmedBooking.referenceNo} (${confirmedBooking.serviceTitle}) ee magaca ${confirmedBooking.customerName}. Fadlan xaqiiji.`
      : `Hello Duco Waalid, I submitted booking #${confirmedBooking.referenceNo} (${confirmedBooking.serviceTitle}) for ${confirmedBooking.customerName}. Please confirm.`;
    window.open(`https://wa.me/252613000000?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const isParentService = serviceType === 'Parent Umrah' || initialDetails.category?.startsWith('parent_');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="bg-[#168447] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold leading-tight">{t.bookingModal.title}</h3>
            <p className="text-xs text-emerald-100 font-medium truncate max-w-md">
              {serviceTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Breadcrumb */}
        {step !== 3 && (
          <div className="bg-[#F2F8F4] px-6 py-2.5 border-b border-neutral-200 flex items-center justify-between text-xs">
            <span className={`font-semibold ${step === 1 ? 'text-[#168447]' : 'text-neutral-500'}`}>
              {t.bookingModal.step1}
            </span>
            <span className="text-neutral-300">/</span>
            <span className={`font-semibold ${step === 2 ? 'text-[#168447]' : 'text-neutral-500'}`}>
              {t.bookingModal.step2}
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-400 font-semibold">{t.bookingModal.step3}</span>
          </div>
        )}

        {/* Step 1: Journey Review */}
        {step === 1 && (
          <div className="p-6">
            <div className="bg-[#F2F8F4] p-4 rounded-xl border border-emerald-100 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B5130]">
                  {serviceType}
                </span>
                {defaultPrice > 0 && (
                  <span className="text-sm font-bold text-[#168447] font-mono-numbers">
                    ${defaultPrice} USD
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#202820] mb-2">{serviceTitle}</p>
              
              {initialDetails.hotel && (
                <p className="text-xs text-neutral-600 mb-1">
                  <span className="font-semibold text-neutral-800">Hoteelka:</span> {initialDetails.hotel}
                </p>
              )}
              {initialDetails.durationDays && (
                <p className="text-xs text-neutral-600 mb-1">
                  <span className="font-semibold text-neutral-800">Muddada:</span> {initialDetails.durationDays} Maalmood / Days
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {currentLang === 'so' ? 'Taariikhda Safarka' : 'Travel Date'}
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {currentLang === 'so' ? 'Tirada Rakaabka / Qoyska' : 'Number of Travelers'}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={passengersCount}
                  onChange={(e) => setPassengersCount(parseInt(e.target.value) || 1)}
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                />
              </div>
            </div>

            {/* Parent Umrah specific question */}
            {isParentService && (
              <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <label className="block text-xs font-bold text-[#0B5130] mb-1.5">
                  {currentLang === 'so'
                    ? 'Magaca Hooyada ama Aabbaha loo gudanayo Cumrada'
                    : 'Name of Parent on whose behalf Umrah is being performed'}
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder={currentLang === 'so' ? 'Tusaale: Marxuum Cali Jaamac Nuur' : 'e.g. Late Ali Jama Nur'}
                  className="w-full text-xs p-3 bg-white border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  required
                />
                <p className="text-[11px] text-emerald-800 mt-1.5">
                  {currentLang === 'so'
                    ? 'Magacan waxaa lagu ducaysan doonaa markii la joogo Kacbada sharafta leh, waxaana lagu soo qori doonaa shahaadada rasmiga ah.'
                    : 'This name will be specifically uttered during prayers at the Holy Kaaba and inscribed on the official certificate.'}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                {t.bookingModal.close}
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-[#168447] hover:bg-[#0B5130] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>{currentLang === 'so' ? 'U Gudub Xogtaada' : 'Continue to Personal Details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Passenger & Contact Info */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {t.bookingModal.fullName} *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Maxamed Cabdi Xasan"
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.bookingModal.phone} *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+252 61 XXXXXXX"
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.bookingModal.email}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.bookingModal.passportNo}
                  </label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="P0123456"
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.bookingModal.nationality}
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="Somali"
                    className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {t.bookingModal.specialNeeds}
                </label>
                <textarea
                  value={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.value)}
                  placeholder={t.bookingModal.specialNeedsPlaceholder}
                  rows={2}
                  className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
              >
                {currentLang === 'so' ? 'Dib u Noqo' : 'Back'}
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#168447] hover:bg-[#0B5130] rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{submitting ? t.bookingModal.submitting : t.bookingModal.submitBooking}</span>
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation & Receipt */}
        {step === 3 && confirmedBooking && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-[#168447] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-lg font-bold text-[#0B5130] mb-1">
              {t.bookingModal.successTitle}
            </h3>
            <p className="text-xs text-neutral-600 mb-6 max-w-md mx-auto">
              {t.bookingModal.successSubtitle}
            </p>

            {/* Reference Card */}
            <div className="bg-[#F2F8F4] p-5 rounded-2xl border border-emerald-200 mb-6 text-left">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-emerald-100">
                <span className="text-xs text-neutral-500 font-medium">
                  {t.bookingModal.referenceNo}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-[#0B5130] font-mono-numbers">
                    {confirmedBooking.referenceNo}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-emerald-200/50 rounded-lg text-[#168447] transition-colors"
                    title="Copy Reference"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block">Adeegga / Service:</span>
                  <span className="font-semibold text-neutral-800">{confirmedBooking.serviceTitle}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Macaamiilka / Customer:</span>
                  <span className="font-semibold text-neutral-800">{confirmedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Xaaladda / Status:</span>
                  <span className="inline-flex items-center font-bold text-[#168447]">
                    {confirmedBooking.status}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Taariikhda / Date:</span>
                  <span className="font-semibold text-neutral-800">{confirmedBooking.travelDate}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleWhatsAppDirect}
                className="w-full sm:flex-1 py-3 px-4 bg-[#168447] hover:bg-[#0B5130] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.bookingModal.directWhatsApp}</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                {t.bookingModal.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
