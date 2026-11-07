import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { StoreSettings } from '../types';
import { 
  Sparkles, 
  MessageCircle, 
  ShieldCheck, 
  Lock, 
  Heart,
  Globe
} from 'lucide-react';

interface FooterProps {
  settings: StoreSettings;
  onNavigate: (view: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenAdmin }) => {
  const { lang, t } = useLanguage();
  const cleanNumber = settings.whatsappNumber.replace(/\D/g, '');
  const whatsAppLink = `https://wa.me/${cleanNumber}`;

  return (
    <footer className="bg-[#05080F] border-t border-slate-800/80 pt-14 pb-10 text-slate-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-blue-500/30 flex items-center justify-center p-0.5 overflow-hidden">
                <img src="/logo.png" alt="Mr Smart Shop AI" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                Mr Smart Shop <span className="text-blue-400">AI</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              {t('footerDesc')}
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                {lang === 'ar' ? 'طرق الدفع المحلية المدعومة في تونس:' : 'Modes de paiement en Tunisie :'}
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300 font-semibold">
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">D17 (Poste TN)</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Flouci</span>
                <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800">Virement Bancaire</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors">
                  {t('home')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-blue-400 transition-colors">
                  {t('allProducts')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-blue-400 transition-colors">
                  {t('howItWorks')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-blue-400 transition-colors">
                  {t('about')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-blue-400 transition-colors">
                  {t('contact')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-blue-400 transition-colors">
                  {t('faq')}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {t('legalLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-blue-400 transition-colors">
                  {t('terms')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-blue-400 transition-colors">
                  {t('privacy')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('refund')} className="hover:text-blue-400 transition-colors">
                  {t('refundPolicy')}
                </button>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              {lang === 'ar' ? 'خدمة العملاء في تونس' : 'Service Client Tunisie'}
            </h4>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'فريق الدعم الفني متواجد لمتابعة طلبك وتوفير المساعدة المباشرة.'
                : 'Notre équipe est à votre écoute pour toute demande d\'activation ou conseil.'}
            </p>

            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{settings.whatsappNumber}</span>
            </a>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {settings.storeNameFr || 'Mr Smart Shop AI'}. {t('rightsReserved')}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{t('admin')}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
