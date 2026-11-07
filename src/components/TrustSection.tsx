import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, BadgePercent, Headset } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: ShoppingCart,
      title: t('trust1Title'),
      desc: t('trust1Desc'),
      color: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    },
    {
      icon: BadgePercent,
      title: t('trust2Title'),
      desc: t('trust2Desc'),
      color: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Headset,
      title: t('trust3Title'),
      desc: t('trust3Desc'),
      color: 'from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400'
    }
  ];

  return (
    <section className="py-12 bg-slate-900/40 border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {t('trustTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div 
                key={i} 
                className={`p-6 rounded-2xl bg-gradient-to-br ${b.color} border ${b.border} backdrop-blur-sm transition-transform hover:-translate-y-1`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-center mb-4 shadow-md">
                  <Icon className={`w-6 h-6 ${b.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
