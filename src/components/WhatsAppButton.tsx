import React, { useState } from 'react';
import { Language, CompanySettings } from '../types';
import { MessageSquare, X, Send } from 'lucide-react';

interface WhatsAppButtonProps {
  settings: CompanySettings;
  currentLang: Language;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ settings, currentLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const defaultMsg = currentLang === 'so'
    ? 'Asc Duco Waalid Travel, waxaan rabaa faahfaahinta Xajka, Cumrada ama Tikidhada.'
    : 'Hello Duco Waalid Travel, I would like more information regarding Hajj, Umrah, or flight bookings.';

  const handleSend = () => {
    const textToSend = encodeURIComponent(customMsg.trim() || defaultMsg);
    const cleanNumber = (settings.whatsappNumber || '+252613000000').replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${textToSend}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#168447] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 p-1 flex items-center justify-center">
                <img
                  src="/assets/aistudio/Logo_Duco_waalid_d76bc4ba.PNG"
                  alt="Duco Waalid"
                  className="w-8 h-8 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">Duco Waalid WhatsApp</h4>
                <p className="text-[11px] text-emerald-100">
                  {currentLang === 'so' ? 'Wakiilkayaga ayaa diyaar kuu ah 24/7' : 'Our team is available 24/7'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-md"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-[#F2F8F4]/50">
            <div className="bg-white p-3 rounded-xl shadow-xs text-xs text-[#202820] border border-emerald-100">
              <p className="font-semibold text-[#0B5130] mb-1">
                {currentLang === 'so' ? 'Ku soo dhawoow Duco Waalid!' : 'Welcome to Duco Waalid!'}
              </p>
              <p className="text-neutral-600">
                {currentLang === 'so'
                  ? 'Fadlan farriintaada noo reeb ama si toos ah noola hadal si aan kuugu soo saarno tikidhada iyo fiisooyinka.'
                  : 'Please send us a message or inquiry to quickly reserve your flights, Umrah packages, or visas.'}
              </p>
            </div>

            <div className="mt-3">
              <textarea
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={defaultMsg}
                rows={3}
                className="w-full text-xs p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#168447] bg-white resize-none text-[#202820]"
              />
            </div>

            <button
              onClick={handleSend}
              className="mt-3 w-full py-2.5 px-4 bg-[#168447] hover:bg-[#0B5130] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{currentLang === 'so' ? 'Kula Hadal WhatsApp' : 'Open in WhatsApp'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-[#168447] hover:bg-[#0B5130] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer group"
        aria-label="Open WhatsApp conversation"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold tracking-wide pr-1">
          {currentLang === 'so' ? 'WhatsApp Toos ah' : 'Chat on WhatsApp'}
        </span>
      </button>
    </div>
  );
};
