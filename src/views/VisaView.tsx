import React, { useState } from 'react';
import { Language, VisaCategory, VisaApplication } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import {
  FileCheck2,
  Upload,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Search,
  ArrowRight
} from 'lucide-react';

interface VisaViewProps {
  currentLang: Language;
  visas: VisaCategory[];
  onOpenTrack: () => void;
}

export const VisaView: React.FC<VisaViewProps> = ({ currentLang, visas, onOpenTrack }) => {
  const t = translations[currentLang];
  const [selectedVisaId, setSelectedVisaId] = useState<string>(visas[0]?.id || 'vsa-sau-umrah');
  const [isApplying, setIsApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState<VisaApplication | null>(null);
  const [copied, setCopied] = useState(false);

  // Form states
  const [applicantName, setApplicantName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [nationality, setNationality] = useState('Somali');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string; docType: string; fileSize: string }[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const currentVisa = visas.find((v) => v.id === selectedVisaId) || visas[0];

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      setUploadedFiles((prev) => [
        ...prev.filter((f) => f.docType !== docType),
        { fileName: file.name, docType, fileSize: sizeStr }
      ]);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !passportNumber.trim() || !phone.trim()) {
      setErrorMsg(currentLang === 'so' ? 'Fadlan buuxi magacaaga, baasaboorka iyo telefoonka.' : 'Please provide your full name, passport number, and phone.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const app = await api.applyVisa({
        visaCategoryId: currentVisa.id,
        visaTitle: currentLang === 'so' ? currentVisa.titleSo : currentVisa.titleEn,
        destinationCountry: currentVisa.country,
        applicantName,
        gender,
        nationality,
        passportNumber,
        passportExpiry,
        birthDate,
        phone,
        email: email || `${applicantName.toLowerCase().replace(/\s+/g, '')}@visa.travel`,
        travelDate: travelDate || '2026-05-01',
        uploadedDocuments: uploadedFiles.length > 0 ? uploadedFiles : [
          { fileName: 'Passport_Copy.pdf', docType: 'Passport Bio-Data', fileSize: '1.2 MB' },
          { fileName: 'Photo.jpg', docType: 'White Background Photo', fileSize: '450 KB' }
        ]
      });

      setApplicationSuccess(app);
      setIsApplying(false);
    } catch (err) {
      console.error(err);
      setErrorMsg(currentLang === 'so' ? 'Qalad ayaa dhacay, fadlan mar kale isku day.' : 'An error occurred, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#F2F8F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
            {currentLang === 'so' ? 'Adeegga Fiisooyinka Rasmiga ah' : 'Global Visa Processing'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B5130] tracking-tight">
            {t.visa.sectionTitle}
          </h1>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            {t.visa.sectionSubtitle}
          </p>
        </div>

        {/* Disclaimer Banner (§07: Never guarantee visa approval) */}
        <div className="mb-10 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {t.visa.disclaimer}
          </p>
        </div>

        {/* Country Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {visas.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                setSelectedVisaId(v.id);
                setApplicationSuccess(null);
                setIsApplying(false);
              }}
              className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer border ${
                selectedVisaId === v.id
                  ? 'bg-[#168447] text-white border-[#168447] shadow-sm'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#168447]'
              }`}
            >
              {v.country}
            </button>
          ))}
        </div>

        {/* Success Modal/Card if submitted */}
        {applicationSuccess && (
          <div className="mb-12 bg-white rounded-2xl border border-emerald-200 p-8 shadow-lg max-w-2xl mx-auto text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-[#168447] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-[#0B5130] mb-2">
              {currentLang === 'so' ? 'Codsigaaga Fiisaha Si Guul Leh Ayaa Loo Gudbiyey!' : 'Visa Application Submitted Successfully!'}
            </h3>
            <p className="text-xs text-neutral-600 mb-6">
              {currentLang === 'so'
                ? 'Waxaan bilownay baaritaanka dukumiintiyadaada. Fadlan keydso lambarka tixraaca ee hoose si aad ula socoto xaaladda fiisaha.'
                : 'Our consular officers have received your dossier. Please retain your reference number below to track visa progress.'}
            </p>

            <div className="bg-[#F2F8F4] p-4 rounded-xl border border-emerald-200 mb-6 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500 block">Tixraaca Fiisaha / Reference:</span>
                <span className="text-lg font-extrabold text-[#0B5130] font-mono-numbers">
                  {applicationSuccess.referenceNo}
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(applicationSuccess.referenceNo);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-2 hover:bg-emerald-200/50 rounded-lg text-[#168447] transition-colors"
                title="Copy reference"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenTrack}
                className="w-full sm:w-auto px-6 py-3 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {t.visa.trackVisa}
              </button>
              <button
                onClick={() => setApplicationSuccess(null)}
                className="w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl cursor-pointer"
              >
                {t.bookingModal.close}
              </button>
            </div>
          </div>
        )}

        {/* Selected Visa Overview & Form */}
        {currentVisa && !applicationSuccess && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Requirements & Inclusions */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#168447] uppercase tracking-wider">
                    {currentVisa.category.toUpperCase()}
                  </span>
                  <span className="text-base font-extrabold text-[#0B5130] font-mono-numbers">
                    ${currentVisa.price} USD
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#202820] mb-2">
                  {currentLang === 'so' ? currentVisa.titleSo : currentVisa.titleEn}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  {currentLang === 'so' ? currentVisa.descriptionSo : currentVisa.descriptionEn}
                </p>

                <div className="space-y-3 py-4 border-y border-neutral-100 text-xs text-neutral-700">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">{t.visa.processingTime}:</span>
                    <span className="font-semibold text-neutral-900">{currentVisa.processingDays}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">{t.visa.validity}:</span>
                    <span className="font-semibold text-neutral-900">{currentVisa.validity}</span>
                  </div>
                </div>

                {/* Requirements */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                    {t.visa.requirements}
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    {(currentLang === 'so' ? currentVisa.requirementsSo : currentVisa.requirementsEn).map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Documents */}
                <div className="mt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
                    {t.visa.documents}
                  </h4>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    {(currentLang === 'so' ? currentVisa.documentsSo : currentVisa.documentsEn).map((doc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#168447] shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {!isApplying && (
                  <button
                    onClick={() => setIsApplying(true)}
                    className="w-full mt-6 py-3.5 px-4 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                  >
                    {t.visa.applyNow}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Online Application Form with Document Upload */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-[#0B5130]">
                      {currentLang === 'so' ? 'Foomka Codsiga Fiisaha ee Rasmiga ah' : 'Official Online Visa Application Form'}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {currentVisa.country} · {currentVisa.category.toUpperCase()}
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#168447] font-mono-numbers">
                    Fee: ${currentVisa.price} USD
                  </span>
                </div>

                {errorMsg && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t.bookingModal.fullName} *
                    </label>
                    <input
                      type="text"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Sahra Jaamac Aadan"
                      className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {currentLang === 'so' ? 'Jinsiga / Gender' : 'Gender'}
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                      >
                        <option value="male">{currentLang === 'so' ? 'Lab (Male)' : 'Male'}</option>
                        <option value="female">{currentLang === 'so' ? 'Dhedig (Female)' : 'Female'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t.bookingModal.nationality}
                      </label>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t.bookingModal.passportNo} *
                      </label>
                      <input
                        type="text"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        placeholder="P0987654"
                        className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none uppercase font-mono-numbers"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {t.bookingModal.passportExpiry}
                      </label>
                      <input
                        type="date"
                        value={passportExpiry}
                        onChange={(e) => setPassportExpiry(e.target.value)}
                        className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                        required
                      />
                    </div>
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
                        placeholder="+252 61 777 4433"
                        className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
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
                        placeholder="client@example.com"
                        className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Document Upload Simulation per §07 */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-[#0B5130] mb-2">
                      {currentLang === 'so' ? 'Dukumiintiyada La Gelinayo (Upload Documents)' : 'Document Upload Dossier'}
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      {/* Passport Bio-page */}
                      <div className="p-3 bg-neutral-50 border border-dashed border-neutral-300 rounded-xl text-center">
                        <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                        <span className="text-[11px] font-semibold text-neutral-700 block">
                          {currentLang === 'so' ? 'Baasaboor Scan (Bio-Data)' : 'Passport Bio-Data Scan'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleSimulateUpload(e, 'Passport Bio-Data')}
                          className="text-[10px] text-neutral-500 mt-1 w-full"
                        />
                      </div>

                      {/* Photo */}
                      <div className="p-3 bg-neutral-50 border border-dashed border-neutral-300 rounded-xl text-center">
                        <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
                        <span className="text-[11px] font-semibold text-neutral-700 block">
                          {currentLang === 'so' ? 'Sawir Cad (White Background)' : 'Biometric White Background Photo'}
                        </span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) => handleSimulateUpload(e, 'Biometric Photo')}
                          className="text-[10px] text-neutral-500 mt-1 w-full"
                        />
                      </div>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1">
                        <span className="text-[11px] font-bold text-emerald-800 block">
                          {currentLang === 'so' ? 'Dukumiintiyada Diyaar ah:' : 'Attached Documents:'}
                        </span>
                        {uploadedFiles.map((f, i) => (
                          <div key={i} className="text-xs text-emerald-900 flex items-center justify-between">
                            <span>{f.docType}: {f.fileName}</span>
                            <span className="font-mono-numbers text-[10px] text-emerald-700">{f.fileSize}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{submitting ? 'Gudbinayaa...' : t.visa.applyNow}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
