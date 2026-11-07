import React from 'react';
import { Product, SubscriptionPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatTndPrice } from '../utils/order';
import { 
  Bot, 
  Cpu, 
  Layers, 
  Palette, 
  Video, 
  Image, 
  Film, 
  Headphones, 
  FileText, 
  Sparkles, 
  Check, 
  Eye, 
  ArrowUpRight 
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onRequest: (product: Product, defaultPlan?: SubscriptionPlan) => void;
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

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onRequest }) => {
  const { lang, t } = useLanguage();
  const IconComponent = iconMap[product.iconName] || Sparkles;

  // Active plans
  const activePlans = product.plans.filter(p => p.isAvailable);
  const minPrice = activePlans.length > 0 
    ? activePlans.reduce((min, p) => p.priceTnd !== null && (min === null || p.priceTnd < min) ? p.priceTnd : min, null as number | null)
    : product.startingPriceTnd;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800/80 hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
      
      {/* Top Banner & Visual */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          
          {/* Logo / Brand Badge */}
          <div 
            className="w-13 h-13 rounded-2xl flex items-center justify-center p-1.5 shadow-md border border-white/10 group-hover:scale-105 transition-transform overflow-hidden bg-slate-900/90"
            style={{ 
              borderColor: product.brandColor ? `${product.brandColor}55` : '#334155'
            }}
          >
            {product.logoUrl ? (
              <img 
                src={product.logoUrl} 
                alt={product.name} 
                className="w-full h-full object-contain rounded-xl"
                loading="lazy"
              />
            ) : (
              <div 
                className="w-full h-full rounded-xl flex items-center justify-center"
                style={{ backgroundColor: product.brandColor ? `${product.brandColor}22` : '#1E293B' }}
              >
                <IconComponent 
                  className="w-6 h-6" 
                  style={{ color: product.brandColor || '#60A5FA' }} 
                />
              </div>
            )}
          </div>

          {/* Availability Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{lang === 'ar' ? product.availabilityLabelAr : product.availabilityLabelFr}</span>
          </span>
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-2 leading-relaxed">
          {lang === 'ar' ? product.shortDescAr : product.shortDescFr}
        </p>

        {/* Available Plans Pills */}
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-400 mb-2">
            {lang === 'ar' ? 'الباقات المتوفرة:' : 'Forfaits disponibles :'}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activePlans.slice(0, 3).map((plan) => (
              <span 
                key={plan.id}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium"
              >
                {lang === 'ar' ? plan.durationAr : plan.durationFr}
              </span>
            ))}
            {activePlans.length > 3 && (
              <span className="text-[11px] px-2 py-1 rounded-md bg-slate-800/50 text-slate-400">
                +{activePlans.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing and Action Buttons */}
      <div className="p-5 sm:p-6 pt-3 bg-slate-900/60 border-t border-slate-800/60 mt-auto">
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-xs text-slate-400 font-medium">
            {t('startingFrom')}
          </span>
          <span className="text-lg sm:text-xl font-black text-white tracking-tight">
            {formatTndPrice(minPrice, lang)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            aria-label={`${t('viewDetails')} ${product.name}`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('viewDetails')}</span>
          </button>

          <button
            onClick={() => onRequest(product, activePlans[0])}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            aria-label={`${t('requestSubscription')} ${product.name}`}
          >
            <span>{t('requestSubscription')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
