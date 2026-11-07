import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { StoreSettings } from '../types';
import { 
  Sparkles, 
  Menu, 
  X, 
  Globe, 
  MessageCircle, 
  ShieldCheck, 
  Layers, 
  Info, 
  HelpCircle, 
  PhoneCall, 
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  settings: StoreSettings;
  onNavigate: (view: string, param?: string) => void;
  activeView: string;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, onNavigate, activeView, onOpenAdmin }) => {
  const { lang, setLang, isRtl, t } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/\D/g, '');
  const whatsAppGeneralLink = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(
    lang === 'ar' 
      ? 'مرحباً Mr Smart Shop AI، أود الاستفسار حول الاشتراكات الرقمية المتوفرة لديكم.'
      : 'Bonjour Mr Smart Shop AI, je souhaite me renseigner sur vos abonnements disponibles.'
  )}`;

  const navLinks = [
    { id: 'home', label: t('home') },
    { id: 'catalog', label: t('allProducts') },
    { id: 'how-it-works', label: t('howItWorks') },
    { id: 'contact', label: t('contact') },
    { id: 'faq', label: t('faq') },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {settings.announcementAr && (
        <div className="bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 border-b border-blue-500/20 text-xs py-1.5 px-4 text-center font-medium text-blue-100 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse shrink-0" />
          <span className="truncate">
            {lang === 'ar' ? settings.announcementAr : settings.announcementFr}
          </span>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#080C14]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <button 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 text-left focus:outline-none group"
            aria-label="Mr Smart Shop AI Home"
          >
            <div className="w-11 h-11 rounded-xl bg-slate-900/95 border border-blue-500/40 p-1 shadow-lg shadow-blue-500/20 group-hover:scale-105 group-hover:border-blue-400 transition-all flex items-center justify-center overflow-hidden">
              <img 
                src="/logo.png" 
                alt="Mr Smart Shop AI Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  Mr Smart Shop
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {lang === 'ar' ? 'تونس 🇹🇳 متجر الاشتراكات' : 'Tunisie 🇹🇳 Digital Subscriptions'}
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeView === link.id
                    ? 'text-white bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 border border-slate-700/60 transition-colors"
              title={lang === 'ar' ? 'Changer vers le Français' : 'التبديل إلى العربية'}
              aria-label="Language switch"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'ar' ? 'FR' : 'عربي'}</span>
            </button>

            {/* Theme Switcher: Mode Jour / Mode Nuit */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 transition-colors flex items-center justify-center cursor-pointer"
              title={isDark 
                ? (lang === 'ar' ? 'التبديل إلى الوضع النهاري (Mode Jour)' : 'Passer au Mode Jour') 
                : (lang === 'ar' ? 'التبديل إلى الوضع الليلي (Mode Nuit)' : 'Passer au Mode Nuit')}
              aria-label={isDark ? 'Activer le mode jour' : 'Activer le mode nuit'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-blue-500 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* WhatsApp CTA Button */}
            <a
              href={whatsAppGeneralLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm shadow-emerald-500/10"
              aria-label="WhatsApp Contact"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span>{t('whatsappContact')}</span>
            </a>

            {/* Admin entry point button */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-blue-400 border border-slate-800 transition-colors"
              title={t('admin')}
              aria-label="Admin Dashboard"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-[#090E18]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full text-start px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeView === link.id
                      ? 'text-white bg-blue-600/20 text-blue-300 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <a
                href={whatsAppGeneralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('whatsappContact')} ({settings.whatsappNumber})</span>
              </a>

              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700/60"
              >
                <span className="flex items-center gap-2">
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                  <span>{isDark 
                    ? (lang === 'ar' ? 'الوضع النهاري (Mode Jour)' : 'Mode Jour') 
                    : (lang === 'ar' ? 'الوضع الليلي (Mode Nuit)' : 'Mode Nuit')}</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  {isDark ? 'Dark' : 'Light'}
                </span>
              </button>

              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                <Lock className="w-3.5 h-3.5 text-blue-400" />
                <span>{t('admin')}</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
