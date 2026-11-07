import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  MessageCircle,
  Cpu,
  Palette,
  Film,
  Video
} from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onContact: () => void;
  onSelectProductBySlug: (slug: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onContact, onSelectProductBySlug }) => {
  const { lang, isRtl, t } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const quickBadges = [
    { slug: 'chatgpt-plus', name: 'ChatGPT Plus', tag: 'GPT-4o & DALL-E 3', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: Cpu, logoUrl: '/assets/aistudio/chatgpt-logo-free-download-chatgpt-logo-free-png_3817733a.webp' },
    { slug: 'canva-pro', name: 'Canva Pro', tag: lang === 'ar' ? 'تفعيل على إيميلك' : 'Sur votre email', color: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: Palette, logoUrl: '/assets/aistudio/canva-app-logo-on-a-transparent-background-free-png_89ef5199.webp' },
    { slug: 'netflix-premium', name: 'Netflix 4K', tag: 'Ultra HD + HDR', color: 'from-red-500/20 to-rose-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: Film, logoUrl: '/assets/aistudio/netflix-logo-square-rounded-netflix-logo-netflix-logo-free-download-free-png_2f1d7c44.webp' },
    { slug: 'capcut-pro', name: 'CapCut Pro', tag: lang === 'ar' ? 'للحاسوب والموبايل' : 'PC & Mobile 4K', color: 'from-blue-500/20 to-indigo-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: Video, logoUrl: '/assets/aistudio/images_0740e306.jpg' }
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/60">
      {/* Background radial gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-purple-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-10 end-10 w-72 h-72 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Market Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-slate-300">
              {lang === 'ar' 
                ? '🇹🇳 متجر الاشتراكات الرقمية الأول والموثوق في تونس' 
                : '🇹🇳 Le N°1 des Abonnements Digitaux & IA en Tunisie'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            {lang === 'ar' ? (
              <>
                عالمك الرقمي، <span className="gradient-text">كلّه في مكان واحد.</span>
              </>
            ) : (
              <>
                Your Digital World, <span className="gradient-text">One Smart Place.</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {t('heroSubtitle')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onExplore}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{t('exploreSubscriptions')}</span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onContact}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-slate-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{t('contactUs')}</span>
            </button>
          </div>

          {/* Reassurance pills */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              {lang === 'ar' ? 'حسابات واشتراكات رسمية ومضمونة' : 'Abonnements officiels et garantis'}
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-400 shrink-0" />
              {lang === 'ar' ? 'تفعيل سريع عبر واتساب' : 'Activation rapide via WhatsApp'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              {lang === 'ar' ? 'دفع محلي: D17 / Flouci / بنك' : 'Paiement local : D17 / Flouci / Virement'}
            </span>
          </div>

        </div>

        {/* Featured Service Interactive Cards */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {quickBadges.map((badge) => {
            const Icon = badge.icon;
            return (
              <button
                key={badge.slug}
                onClick={() => onSelectProductBySlug(badge.slug)}
                className={`p-3.5 rounded-xl bg-gradient-to-br ${badge.color} border ${badge.border} text-start transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between group focus:outline-none`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center overflow-hidden p-1">
                    {badge.logoUrl ? (
                      <img src={badge.logoUrl} alt={badge.name} className="w-full h-full object-contain rounded" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${badge.text}`}>
                    {lang === 'ar' ? 'متوفر' : 'Actif'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {badge.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                    {badge.tag}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
