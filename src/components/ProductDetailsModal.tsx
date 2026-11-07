import React, { useState } from 'react';
import { Product, SubscriptionPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatTndPrice } from '../utils/order';
import { 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  Bot,
  Cpu,
  Layers,
  Palette,
  Video,
  Image,
  Film,
  Headphones,
  FileText,
  BadgeCheck
} from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onRequestPlan: (product: Product, plan: SubscriptionPlan) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Bot,
  Cpu,
  Layers,
  Palette,
  Video,
  Image,
  Film,
  Headphones,
  FileText,
  Sparkles
};

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onRequestPlan
}) => {
  const { lang, isRtl, t } = useLanguage();
  const IconComponent = iconMap[product.iconName] || Sparkles;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const activePlans = product.plans.filter(p => p.isAvailable);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    const popular = activePlans.find(p => p.isPopular);
    return popular ? popular.id : (activePlans[0]?.id || '');
  });

  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const currentSelectedPlan = activePlans.find(p => p.id === selectedPlanId) || activePlans[0];

  const faqs = lang === 'ar' ? product.faqsAr : product.faqsFr;
  const keyFeatures = lang === 'ar' ? product.keyFeaturesAr : product.keyFeaturesFr;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-[#090D18] border border-slate-700/80 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-8">
        
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-20 p-2.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          aria-label={t('close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero Section */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-b from-slate-900 to-[#090D18] border-b border-slate-800">
          <div 
            className="absolute top-0 end-12 w-64 h-64 blur-[100px] pointer-events-none rounded-full"
            style={{ backgroundColor: product.brandColor ? `${product.brandColor}25` : '#3B82F625' }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 relative z-10">
            {/* Brand Logo Visual */}
            <div 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center p-2 shadow-xl border border-white/10 shrink-0 overflow-hidden bg-slate-900/90"
              style={{ 
                borderColor: product.brandColor ? `${product.brandColor}55` : '#334155'
              }}
            >
              {product.logoUrl ? (
                <img 
                  src={product.logoUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div 
                  className="w-full h-full rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: product.brandColor ? `${product.brandColor}22` : '#1E293B' }}
                >
                  <IconComponent 
                    className="w-9 h-9 sm:w-11 sm:h-11" 
                    style={{ color: product.brandColor || '#60A5FA' }} 
                  />
                </div>
              )}
            </div>

            {/* Title & Introduction */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {product.categoryId.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{lang === 'ar' ? product.availabilityLabelAr : product.availabilityLabelFr}</span>
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                {lang === 'ar' ? product.shortDescAr : product.shortDescFr}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          
          {/* Detailed Description */}
          <div>
            <h3 className="text-base font-bold text-white mb-2">
              {lang === 'ar' ? 'نبذة عن الخدمة' : 'Description du service'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
              {lang === 'ar' ? product.fullDescAr : product.fullDescFr}
            </p>
          </div>

          {/* Key Features Checklist */}
          {keyFeatures && keyFeatures.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>{t('featuresTitle')}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {keyFeatures.map((feat, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60"
                  >
                    <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 font-medium">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Subscription Plans & Comparison */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>{t('planComparison')}</span>
              </h3>
              <span className="text-xs text-slate-400">
                {lang === 'ar' ? 'اختر الباقة المناسبة لك:' : 'Sélectionnez votre formule :'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePlans.map((plan) => {
                const isSelected = plan.id === selectedPlanId;
                const planFeatures = lang === 'ar' ? plan.featuresAr : plan.featuresFr;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`rounded-2xl p-5 cursor-pointer transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      {/* Popular tag */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase">
                          {lang === 'ar' ? plan.durationAr : plan.durationFr}
                        </span>
                        {plan.isPopular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {lang === 'ar' ? 'الأكثر طلباً' : 'Populaire'}
                          </span>
                        )}
                      </div>

                      {/* Plan Name */}
                      <h4 className="font-bold text-base text-white mb-2">
                        {lang === 'ar' ? plan.nameAr : plan.nameFr}
                      </h4>

                      {/* Price in TND */}
                      <div className="mb-4">
                        <span className="text-2xl font-black text-white">
                          {formatTndPrice(plan.priceTnd, lang)}
                        </span>
                      </div>

                      {/* Plan Feature bullets */}
                      <div className="space-y-2 mb-4 pt-3 border-t border-slate-800/80">
                        {planFeatures.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Radio-like check button */}
                    <button
                      type="button"
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isSelected 
                        ? (lang === 'ar' ? '✓ الباقة المحددة' : '✓ Forfait sélectionné') 
                        : t('choosePlan')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official Guarantee Reassurance */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
            <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
            <p className="text-xs sm:text-sm font-medium">
              {t('officialGuarantee')}
            </p>
          </div>

          {/* Product FAQs */}
          {faqs && faqs.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>{t('faqsTitle')}</span>
              </h3>
              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpen = expandedFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                        className="w-full text-start p-3.5 sm:p-4 text-xs sm:text-sm font-bold text-white hover:text-blue-400 flex items-center justify-between gap-3"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/80">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / Sticky CTA */}
        <div className="p-4 sm:p-6 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 font-medium block">
              {lang === 'ar' ? 'الباقة المحددة:' : 'Formule sélectionnée :'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm text-white">
                {lang === 'ar' ? currentSelectedPlan?.nameAr : currentSelectedPlan?.nameFr}
              </span>
              <span className="text-lg font-black text-blue-400">
                {formatTndPrice(currentSelectedPlan?.priceTnd, lang)}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (currentSelectedPlan) {
                onRequestPlan(product, currentSelectedPlan);
              }
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('requestSubscription')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
