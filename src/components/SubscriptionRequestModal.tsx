import React, { useState } from 'react';
import { Product, SubscriptionPlan, Order } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatTndPrice, validateTunisianPhone } from '../utils/order';
import { apiClient } from '../api/client';
import { 
  X, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Phone, 
  User, 
  Mail, 
  FileText,
  Sparkles
} from 'lucide-react';

interface SubscriptionRequestModalProps {
  product: Product;
  selectedPlan: SubscriptionPlan;
  onClose: () => void;
  onSuccess: (order: Order, whatsappUrl: string) => void;
}

export const SubscriptionRequestModal: React.FC<SubscriptionRequestModalProps> = ({
  product,
  selectedPlan,
  onClose,
  onSuccess
}) => {
  const { lang, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>(selectedPlan);
  const [notes, setNotes] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate Full Name
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال اسمك الكامل' : 'Veuillez saisir votre nom complet');
      return;
    }

    // Validate Tunisian Phone
    const phoneCheck = validateTunisianPhone(phone);
    if (!phoneCheck.isValid) {
      setErrorMsg(phoneCheck.error || (lang === 'ar' ? 'رقم هاتف غير صحيح' : 'Numéro de téléphone invalide'));
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.createOrder({
        fullName: fullName.trim(),
        phone: phoneCheck.normalized,
        email: email.trim() || undefined,
        productId: product.id,
        productName: product.name,
        planId: currentPlan.id,
        planName: lang === 'ar' ? currentPlan.nameAr : currentPlan.nameFr,
        priceTnd: currentPlan.priceTnd,
        notes: notes.trim() || undefined,
        lang
      });

      if (response.success && response.order) {
        onSuccess(response.order, response.whatsappUrl);
      } else {
        throw new Error('Une erreur est survenue lors de l\'enregistrement');
      }
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'ar' ? 'تعذر حفظ الطلب، يرجى المحاولة ثانية' : 'Erreur de connexion'));
    } finally {
      setLoading(false);
    }
  };

  const activePlans = product.plans.filter(p => p.isAvailable);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="bg-[#090D18] border border-slate-700/80 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative my-6">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'نموذج طلب رسمي' : 'Formulaire Officiel'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t('requestTitle')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('requestSubtitle')}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Product & Plan Summary Box */}
        <div className="px-6 py-4 bg-blue-950/20 border-b border-blue-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {product.logoUrl && (
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                <img src={product.logoUrl} alt={product.name} className="w-full h-full object-contain rounded-lg" />
              </div>
            )}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">
                {t('selectedProduct')}
              </span>
              <span className="font-bold text-white text-sm sm:text-base">
                {product.name}
              </span>
            </div>
          </div>

          <div className="text-end">
            <span className="text-[11px] text-slate-400 font-medium block">
              {lang === 'ar' ? 'السعر المحدد:' : 'Prix :'}
            </span>
            <span className="font-black text-base sm:text-lg text-blue-400">
              {formatTndPrice(currentPlan.priceTnd, lang)}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {t('fullName')} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('fullNamePlaceholder')}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {t('phone')} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phonePlaceholder')}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {lang === 'ar' ? 'أدخل 8 أرقام تونسية للتواصل وتأكيد الحساب عبر واتساب' : '8 chiffres tunisiens pour confirmation via WhatsApp'}
            </p>
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Plan Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {t('selectedPlan')} <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activePlans.map((plan) => {
                const isSelected = plan.id === currentPlan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setCurrentPlan(plan)}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white ring-1 ring-blue-500'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">
                      {lang === 'ar' ? plan.nameAr : plan.nameFr}
                    </div>
                    <div className="text-xs font-bold text-blue-400 mt-0.5">
                      {formatTndPrice(plan.priceTnd, lang)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              {t('additionalNotes')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notesPlaceholder')}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Privacy & Security Note */}
          <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              {lang === 'ar' 
                ? 'بياناتك الشخصية آمنة 100%. لا نطلب أبداً كلمات مرور أو رموز تحقق حساسة.' 
                : 'Vos données sont sécurisées. Nous ne demandons aucun mot de passe ou code confidentiel.'}
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>{t('submitting')}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('submitRequest')}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
