import React, { useState } from 'react';
import { Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatTndPrice } from '../utils/order';
import { 
  CheckCircle, 
  MessageCircle, 
  Copy, 
  Check, 
  X, 
  ShieldCheck, 
  Info, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface OrderConfirmationModalProps {
  order: Order;
  whatsappUrl: string;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  whatsappUrl,
  onClose
}) => {
  const { lang, isRtl, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(order.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="bg-[#090D18] border border-slate-700/80 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-10 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label={t('close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Success Banner */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-emerald-950/40 via-slate-900 to-[#090D18] border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-lg shadow-emerald-500/20">
            <CheckCircle className="w-9 h-9" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t('confirmationTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
            {t('confirmationSubtitle')}
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-5">
          
          {/* Order Reference Box */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider block">
                {t('orderReference')}
              </span>
              <span className="text-base sm:text-lg font-mono font-extrabold text-white tracking-wide">
                {order.reference}
              </span>
            </div>

            <button
              onClick={handleCopyRef}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              aria-label="Copy order reference"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t('refCopied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('copyRef')}</span>
                </>
              )}
            </button>
          </div>

          {/* Summary Table */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('customerName')}:</span>
              <span className="font-semibold text-white">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('customerPhone')}:</span>
              <span className="font-semibold text-white dir-ltr">{order.phone}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('summaryProduct')}:</span>
              <span className="font-semibold text-white">{order.productName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('summaryPlan')}:</span>
              <span className="font-semibold text-white">{order.planName}</span>
            </div>
            <div className="flex justify-between items-center py-1 pt-2">
              <span className="text-slate-300 font-bold">{t('summaryPrice')}:</span>
              <span className="text-base font-black text-blue-400">
                {formatTndPrice(order.priceTnd, lang)}
              </span>
            </div>
          </div>

          {/* Primary Action: Direct WhatsApp button */}
          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>{t('whatsAppAction')}</span>
            </a>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              {t('close')}
            </button>
          </div>

          {/* Reassurance Note */}
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{t('confirmationNote')}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
