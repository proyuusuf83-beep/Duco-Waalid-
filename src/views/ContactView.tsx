import React, { useState } from 'react';
import { Language, CompanySettings } from '../types';
import { translations } from '../translations';
import { api } from '../services/api';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
  Globe,
  Share2
} from 'lucide-react';

interface ContactViewProps {
  currentLang: Language;
  settings: CompanySettings;
}

export const ContactView: React.FC<ContactViewProps> = ({ currentLang, settings }) => {
  const t = translations[currentLang];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await api.submitContact({
        name,
        email,
        phone,
        subject: subject || 'General Inquiry',
        message
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const text = currentLang === 'so'
      ? 'Asc Duco Waalid, waxaan u baahanahay macluumaad safarka ah.'
      : 'Hello Duco Waalid, I would like to inquire about your travel services.';
    const cleanNumber = (settings.whatsappNumber || '+252613000000').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="py-12 bg-[#F2F8F4] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#168447] uppercase tracking-wider block mb-1">
            {currentLang === 'so' ? 'Waxaan Diyaar U Nahay Inaan Ku Adeegno' : 'Customer Care & Concierge'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B5130] tracking-tight">
            {t.contact.title}
          </h1>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Contact Channels & Office Addresses */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Direct Highlight Box */}
            <div className="bg-[#168447] text-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">WhatsApp Concierge 24/7</h3>
                  <p className="text-xs text-emerald-100">
                    {currentLang === 'so' ? 'Farriin toos ah u dir wakiilladayada' : 'Instant live chat with our team'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-emerald-100/90 leading-relaxed mb-4">
                {currentLang === 'so'
                  ? 'Kala hadal su\'aalahaaga Xajka, Cumrada, xaqiijinta tikidhada iyo fiisooyinka adigoo isticmaalaya WhatsApp.'
                  : 'Get immediate flight confirmations, visa requirements check, and Hajj registrations on WhatsApp.'}
              </p>

              <button
                onClick={handleOpenWhatsApp}
                className="w-full py-3 px-4 bg-white text-[#0B5130] hover:bg-emerald-50 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-[#168447]" />
                <span>{currentLang === 'so' ? 'Kula Hadal WhatsApp Hadda' : 'Chat on WhatsApp Now'}</span>
              </button>
            </div>

            {/* Offices & Contacts Info */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-[#0B5130] uppercase tracking-wider">
                {currentLang === 'so' ? 'Goobaha Xafiisyada Rasmiga ah' : 'Official Office Locations'}
              </h3>

              <div className="space-y-4 text-xs text-neutral-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#168447] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900 block">{t.contact.headquarters}</span>
                    <span>{settings.addressMogadishu}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#168447] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900 block">{t.contact.hargeisaBranch}</span>
                    <span>{settings.addressHargeisa}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#168447] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900 block">{t.contact.nairobiBranch}</span>
                    <span>{settings.addressNairobi}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100 space-y-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#168447] shrink-0" />
                    <span>{settings.phoneMogadishu} / {settings.phoneHargeisa}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#168447] shrink-0" />
                    <span>{settings.emailSupport}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#168447] shrink-0 mt-0.5" />
                    <span>{currentLang === 'so' ? settings.workingHoursSo : settings.workingHoursEn}</span>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-neutral-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  {currentLang === 'so' ? 'Barta Bulshada' : 'Social Channels'}
                </span>
                <div className="flex items-center gap-3 text-xs text-[#168447]">
                  <a
                    href={settings.socialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-semibold"
                  >
                    Facebook
                  </a>
                  <span>·</span>
                  <a
                    href={settings.socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-semibold"
                  >
                    Instagram
                  </a>
                  <span>·</span>
                  <a
                    href={settings.socialYouTube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-semibold"
                  >
                    YouTube
                  </a>
                  <span>·</span>
                  <a
                    href={settings.socialTikTok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-semibold"
                  >
                    TikTok
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-[#0B5130] mb-1">
                {t.contact.formTitle}
              </h3>
              <p className="text-xs text-neutral-600 mb-6">
                {currentLang === 'so'
                  ? 'Noo reeb faahfaahintaada, kooxdayada ayaa kugu soo jawaabi doonta 30 daqiiqo gudahood.'
                  : 'Leave your inquiry below; our team responds within 30 minutes.'}
              </p>

              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{t.contact.sentSuccess}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {t.bookingModal.fullName} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.contact.namePlaceholder}
                    className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t.contact.phone} (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t.contact.phonePlaceholder}
                      className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      {t.contact.email}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.contact.emailPlaceholder}
                      className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {currentLang === 'so' ? 'Mowduuca Farriinta' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t.contact.subjectPlaceholder}
                    className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {currentLang === 'so' ? 'Farriintaada' : 'Message'} *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full text-xs p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-[#168447] focus:outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 bg-[#168447] hover:bg-[#0B5130] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Dirayaa...' : t.contact.sendBtn}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Google Maps / Interactive Headquarters Visual Container */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0B5130]">
              <MapPin className="w-4 h-4 text-[#168447]" />
              <span>{settings.companyName} — Headquarters Map Guide (KM4 Mogadishu & Hargeisa)</span>
            </div>
            <span className="text-xs text-neutral-500 font-medium">GPS Coordinates: 2.0371° N, 45.3182° E</span>
          </div>

          <div className="relative h-80 w-full bg-neutral-100 flex items-center justify-center">
            {/* Styled interactive SVG map representation */}
            <iframe
              title="Duco Waalid Mogadishu Location"
              src="https://maps.google.com/maps?q=Aden%20Adde%20International%20Airport,%20Mogadishu,%20Somalia&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
