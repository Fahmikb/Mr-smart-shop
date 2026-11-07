import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const { lang, isRtl } = useLanguage();
  const cleanNumber = whatsappNumber.replace(/\D/g, '');

  const text = lang === 'ar'
    ? 'مرحباً، أود الاستفسار حول الاشتراكات الرقمية المتوفرة لدى متجر Mr Smart Shop AI.'
    : 'Bonjour, je souhaite me renseigner sur les abonnements disponibles chez Mr Smart Shop AI.';

  const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;

  return (
    <aside 
      aria-label="WhatsApp Support"
      className={`fixed bottom-6 z-40 ${isRtl ? 'left-6' : 'right-6'}`}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 group border border-emerald-400/40"
        aria-label="Contact support on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white/20" />
          <span className="absolute -top-1 -end-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
        </div>
        <span className="hidden sm:inline-block">
          {lang === 'ar' ? 'تواصل معنا واتساب' : 'Assistance WhatsApp'}
        </span>
      </a>
    </aside>
  );
};
