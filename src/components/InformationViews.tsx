import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { StoreSettings } from '../types';
import { apiClient } from '../api/client';
import { 
  Sparkles, 
  CheckCircle2, 
  Send, 
  MessageCircle, 
  Mail, 
  Phone, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  Clock, 
  CreditCard,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

interface InfoViewProps {
  settings: StoreSettings;
  onNavigateHome: () => void;
  onExplore: () => void;
}

// 1. How It Works View
export const HowItWorksView: React.FC<InfoViewProps> = ({ settings, onExplore }) => {
  const { lang, t } = useLanguage();

  const steps = [
    {
      num: '01',
      titleAr: 'اختر خدمتك الرقمية',
      titleFr: 'Choisissez votre service digital',
      descAr: 'تصفح كتالوج الاشتراكات الذكية (ChatGPT, Claude, Canva Pro, Netflix, CapCut...) واستكشف الميزات والأسعار.',
      descFr: 'Parcourez notre catalogue d\'abonnements certifiés et découvrez les fonctionnalités adaptées à vos besoins.'
    },
    {
      num: '02',
      titleAr: 'حدد باقتك المفضلة',
      titleFr: 'Sélectionnez votre formule préférée',
      descAr: 'قارن بين الاشتراكات الشهرية أو السنوية المتاحة بالدينار التونسي (DT) واختر الأنسب لميزانيتك.',
      descFr: 'Comparez les durées (mensuelle, trimestrielle ou annuelle) en Dinars Tunisiens et choisissez l\'offre idéale.'
    },
    {
      num: '03',
      titleAr: 'سجل طلبك في ثوانٍ',
      titleFr: 'Validez votre demande en quelques secondes',
      descAr: 'أدخل اسمك ورقم هاتفك التونسي، لتحصل فوراً على رقم مرجعي رسمي لطلبك يتم حفظه في قاعدة البيانات.',
      descFr: 'Renseignez votre nom et numéro de téléphone tunisien pour générer votre référence de commande sécurisée.'
    },
    {
      num: '04',
      titleAr: 'التفعيل والتواصل عبر واتساب',
      titleFr: 'Activation & Support via WhatsApp',
      descAr: 'يتم فتح محادثة مباشرة مع فريق الدعم لدينا لتأكيد وسيلة الدفع المحلية (D17, Flouci, بنك) وتفعيل حسابك الرسمي سريعاً.',
      descFr: 'Notre service client vous accompagne sur WhatsApp pour le règlement local (D17, Flouci, virement) et l\'activation rapide.'
    }
  ];

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'خطوات بسيطة وواضحة' : 'Processus simple et transparent'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {t('howItWorks')}
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          {lang === 'ar'
            ? 'خطوات سريعة وسلسة للحصول على اشتراكك الرقمي الرسمي في تونس دون تعقيد'
            : 'Un parcours fluide en 4 étapes pour activer vos abonnements numériques officiels'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {steps.map((step, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
            <span className="text-3xl font-black text-blue-500/30 absolute top-5 end-6 font-mono">
              {step.num}
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm mb-4">
              {idx + 1}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {lang === 'ar' ? step.titleAr : step.titleFr}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {lang === 'ar' ? step.descAr : step.descFr}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onExplore}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02]"
        >
          {t('exploreSubscriptions')}
        </button>
      </div>
    </div>
  );
};

// 2. About Us View
export const AboutUsView: React.FC<InfoViewProps> = ({ settings }) => {
  const { lang, t } = useLanguage();

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'رؤيتنا ورسالتنا' : 'Notre mission'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {lang === 'ar' ? 'عن متجر Mr Smart Shop AI' : 'À propos de Mr Smart Shop AI'}
        </h1>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5 text-sm text-slate-300 leading-relaxed">
        <p>
          {lang === 'ar'
            ? 'متجر Mr Smart Shop AI هو منصة إلكترونية تونسية متخصصة حصرياً في تسهيل الوصول إلى الاشتراكات الرقمية والبرمجيات الاحترافية وحلول الذكاء الاصطناعي العالمية للمستخدمين في تونس.'
            : 'Mr Smart Shop AI est une plateforme tunisienne dédiée exclusivement à l\'accès simplifié aux abonnements numériques officiels, logiciels professionnels et outils d\'intelligence artificielle internationaux pour les utilisateurs en Tunisie.'}
        </p>
        <p>
          {lang === 'ar'
            ? 'تأسس المتجر بهدف سد الفجوة في تونس الناتجة عن صعوبات الدفع الدولي بالعملات الأجنبية، من خلال توفير حلول قانونية وموثوقة لشراء وتفعيل الاشتراكات بالدينار التونسي وبوسائل الدفع المحلية المعتمدة مثل D17 وFlouci والتحويلات المصرفية.'
            : 'Notre mission est de surmonter les contraintes de paiement international en devises pour les Tunisiens, en proposant un accès fiable, transparent et officiel en Dinars Tunisiens (DT) via des modes de paiement locaux comme Flouci, D17 et virement bancaire.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="block text-2xl font-black text-blue-400 font-mono">100%</span>
            <span className="text-xs text-slate-400 mt-1 block">
              {lang === 'ar' ? 'حسابات واشتراكات رسمية' : 'Comptes officiels'}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="block text-2xl font-black text-emerald-400 font-mono">TND</span>
            <span className="text-xs text-slate-400 mt-1 block">
              {lang === 'ar' ? 'أسعار واضحة بالدينار' : 'Tarifs en Dinars'}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="block text-2xl font-black text-purple-400 font-mono">24/7</span>
            <span className="text-xs text-slate-400 mt-1 block">
              {lang === 'ar' ? 'متابعة عبر واتساب' : 'Assistance WhatsApp'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Contact Us View
export const ContactUsView: React.FC<InfoViewProps> = ({ settings }) => {
  const { lang, t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanNumber = settings.whatsappNumber.replace(/\D/g, '');
  const whatsAppDirectLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    lang === 'ar' ? 'مرحباً Mr Smart Shop AI، أود التواصل معكم.' : 'Bonjour Mr Smart Shop AI, je souhaite entrer en contact avec vous.'
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await apiClient.submitContact({
        fullName,
        phone,
        email,
        subject: subject || (lang === 'ar' ? 'استفسار عام' : 'Demande générale'),
        message
      });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {t('contact')}
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          {lang === 'ar' 
            ? 'فريقنا جاهز للإجابة على جميع استفساراتك ومساعدتك في اختيار الباقة المناسبة' 
            : 'Notre équipe est à votre disposition pour vous conseiller et répondre à vos questions'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Contact Info Sidebar */}
        <div className="md:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <h3 className="font-bold text-white text-base">
              {lang === 'ar' ? 'قنوات التواصل المباشر' : 'Canaux de contact direct'}
            </h3>

            <a
              href={whatsAppDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">WhatsApp</span>
                <span className="font-bold text-sm text-white dir-ltr">{settings.whatsappNumber}</span>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <Phone className="w-5 h-5 text-blue-400" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {lang === 'ar' ? 'الهاتف المباشر' : 'Téléphone direct'}
                </span>
                <span className="font-bold text-sm text-white dir-ltr">{settings.contactPhone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <Mail className="w-5 h-5 text-purple-400" />
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </span>
                <span className="font-bold text-sm text-white">{settings.contactEmail}</span>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400">
              <p className="font-semibold text-slate-300 mb-1">
                {lang === 'ar' ? 'ساعات العمل والمتابعة:' : 'Horaires de réponse :'}
              </p>
              <p>{lang === 'ar' ? 'طيلة أيام الأسبوع من 09:00 إلى 23:00' : '7j/7 de 09h00 à 23h00'}</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'تم استلام رسالتك بنجاح!' : 'Message envoyé avec succès !'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {lang === 'ar' 
                    ? 'شكراً لتواصلك معنا. سنرد عليك في أقرب وقت عبر واتساب أو الهاتف.' 
                    : 'Merci. Notre équipe vous répondra dans les plus brefs délais.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
                >
                  {lang === 'ar' ? 'إرسال رسالة أخرى' : 'Envoyer un autre message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-white text-base mb-2">
                  {lang === 'ar' ? 'أرسل لنا استفسارك' : 'Envoyez-nous un message'}
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="58 123 456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'ar' ? 'موضوع الرسالة' : 'Objet'}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'ar' ? 'الرسالة' : 'Votre message'} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? t('submitting') : (lang === 'ar' ? 'إرسال الاستفسار' : 'Envoyer')}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// 4. FAQ View
export const FaqView: React.FC = () => {
  const { lang, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qAr: 'كيف تتم عملية طلب الاشتراك والدفع في تونس؟',
      qFr: 'Comment s\'effectuent la commande et le paiement en Tunisie ?',
      aAr: 'الأمر بسيط جداً: تختار الخدمة والباقة المطلوبة ثم تملأ نموذج الطلب برقم هاتفك. يتم حفظ طلبك تلقائياً برقم مرجعي، ويتواصل معك فريقنا عبر واتساب لتأكيد الدفع عبر الطرق التونسية المتاحة (D17 عبر بريد تونس، Flouci، أو تحويل بنكي) ثم تفعيل الحساب.',
      aFr: 'Le parcours est simple : vous choisissez votre service et formule, puis remplissez le formulaire avec votre numéro de téléphone. Votre commande est enregistrée avec une référence unique, et notre équipe vous contacte via WhatsApp pour le règlement local (D17, Flouci, virement) puis l\'activation.'
    },
    {
      qAr: 'كم يستغرق تفعيل الاشتراك بعد إتمام الدفع؟',
      qFr: 'Combien de temps prend l\'activation après paiement ?',
      aAr: 'يتم التفعيل في أغلب الخدمات (مثل ChatGPT, Canva Pro, Netflix) خلال مدة تتراوح بين 5 إلى 15 دقيقة فقط خلال أوقات العمل الرسمية.',
      aFr: 'Pour la majorité des services (ChatGPT, Canva Pro, Netflix...), l\'activation est effective entre 5 et 15 minutes pendant les heures de service.'
    },
    {
      qAr: 'هل الاشتراكات رسمية ومضمونة؟',
      qFr: 'Les abonnements sont-ils officiels et garantis ?',
      aAr: 'نعم، جميع اشتراكاتنا رسمية ومغطاة بضمان كامل ومستمر طيلة المدة المتفق عليها، مع دعم فني سريع في حال واجهت أي استفسار.',
      aFr: 'Oui, tous nos abonnements sont officiels et assortis d\'une garantie continue pendant toute la durée souscrite.'
    },
    {
      qAr: 'هل يمكن تفعيل الاشتراك على حسابي الحالي (مثل Canva Pro)؟',
      qFr: 'Puis-je activer l\'abonnement sur mon compte existant (comme Canva Pro) ?',
      aAr: 'نعم، بالنسبة لخدمات مثل Canva Pro، نقوم بتفعيل الاشتراك مباشرة على بريدك وحسابك الشخصي دون فقدان أي من ملفاتك أو تصاميمك الخاصة بك.',
      aFr: 'Oui, pour des outils comme Canva Pro, nous activons le service directement sur votre compte personnel afin de préserver l\'ensemble de vos projets et créations.'
    },
    {
      qAr: 'ما هي سياسة الاسترجاع والضمان في حال حدوث أي عطل؟',
      qFr: 'Quelle est la politique de garantie en cas de problème ?',
      aAr: 'في حال واجهت أي خلل فني في حسابك، نقوم بحل المشكلة فوراً أو استبدال الحساب. وإذا تعذر توفير الخدمة، يتم استرجاع المبلغ المتبقي من مدة اشتراكك بكل شفافية.',
      aFr: 'En cas de dysfonctionnement technique, nous intervenons immédiatement pour rétablir ou remplacer l\'accès. Si le service ne peut être maintenu, un remboursement au prorata est effectué sans complication.'
    }
  ];

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'إجابات على أكثر التساؤلات شيوعاً' : 'Toutes vos questions'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {t('faq')}
        </h1>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-start font-bold text-sm sm:text-base text-white hover:text-blue-400 flex items-center justify-between gap-4 transition-colors"
              >
                <span>{lang === 'ar' ? faq.qAr : faq.qFr}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/40">
                  {lang === 'ar' ? faq.aAr : faq.aFr}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 5. Legal Policies View
export const LegalView: React.FC<{ policyType: 'terms' | 'privacy' | 'refund' }> = ({ policyType }) => {
  const { lang } = useLanguage();

  return (
    <div className="py-12 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        
        {policyType === 'terms' && (
          <>
            <h1 className="text-2xl font-black text-white border-b border-slate-800 pb-4">
              {lang === 'ar' ? 'الشروط والأحكام' : 'Conditions Générales d\'Utilisation'}
            </h1>
            <p>
              {lang === 'ar'
                ? 'مرحباً بكم في Mr Smart Shop AI. يُعد استخدامك لهذا الموقع أو تقديم أي طلب اشتراك موافقةً صريحة على الالتزام بالشروط والأحكام المبينة هنا.'
                : 'Bienvenue sur Mr Smart Shop AI. En accédant à ce site et en formulant une demande d\'abonnement, vous acceptez les présentes conditions d\'utilisation.'}
            </p>
            <h3 className="font-bold text-white text-base">
              {lang === 'ar' ? '1. طبيعة الخدمات' : '1. Nature des services'}
            </h3>
            <p>
              {lang === 'ar'
                ? 'يقدم متجر Mr Smart Shop AI خدمات تيسير شراء وتفعيل الاشتراكات الرقمية والبرمجية عبر قنوات رسمية للمستخدمين في تونس، مع تقديم الدعم والمتابعة التقنية.'
                : 'Mr Smart Shop AI facilite l\'acquisition et l\'activation d\'abonnements numériques officiels pour les résidents en Tunisie, en assurant l\'assistance technique et le suivi.'}
            </p>
            <h3 className="font-bold text-white text-base">
              {lang === 'ar' ? '2. التزامات العميل' : '2. Engagements du client'}
            </h3>
            <p>
              {lang === 'ar'
                ? 'يلتزم العميل بتقديم معلومات اتصال صحيحة وعدم استخدام الحسابات بما يخالف شروط وسياسات الشركات المزودة للخدمات الأصلية.'
                : 'Le client s\'engage à fournir des coordonnées exactes et à utiliser les services conformément aux règles d\'usage des éditeurs concernés.'}
            </p>
          </>
        )}

        {policyType === 'privacy' && (
          <>
            <h1 className="text-2xl font-black text-white border-b border-slate-800 pb-4">
              {lang === 'ar' ? 'سياسة الخصوصية وحماية البيانات' : 'Politique de Confidentialité'}
            </h1>
            <p>
              {lang === 'ar'
                ? 'نحن نولي خصوصية بياناتك اهتماماً بالغاً. يتم جمع الاسم ورقم الهاتف والبريد الإلكتروني فقط لغرض معالجة طلبك والتواصل معك بشأن تفعيل الاشتراك والدعم الفني.'
                : 'Nous attachons une importance primordiale à la protection de vos données. Les informations recueillies (nom, téléphone, email) servent exclusivement à traiter vos commandes et à vous contacter pour l\'assistance.'}
            </p>
            <p>
              {lang === 'ar'
                ? 'لا نقوم بمشاركة بياناتك مع أي طرف ثالث أو استخدامها لأغراض تسويقية غير مصرح بها. كما أننا لا نطلب ولا نخزن كلمات المرور الحساسة أو البيانات المصرفية السرية للمستخدمين.'
                : 'Aucune donnée n\'est transmise à des tiers. Nous ne demandons et ne conservons aucun mot de passe bancaire ou code secret.'}
            </p>
          </>
        )}

        {policyType === 'refund' && (
          <>
            <h1 className="text-2xl font-black text-white border-b border-slate-800 pb-4">
              {lang === 'ar' ? 'سياسة الاسترجاع والضمان' : 'Politique de Garantie & Remboursement'}
            </h1>
            <p>
              {lang === 'ar'
                ? 'تخضع جميع الاشتراكات الرقمية المقدمة عبر Mr Smart Shop AI لضمان تشغيلي كامل يمتد طيلة فترة الاشتراك المتفق عليها.'
                : 'Tous les abonnements commercialisés par Mr Smart Shop AI bénéficient d\'une garantie de fonctionnement intégrale pendant toute la durée convenue.'}
            </p>
            <h3 className="font-bold text-white text-base">
              {lang === 'ar' ? 'حالات الاستبدال والاسترجاع' : 'Cas de remplacement et remboursement'}
            </h3>
            <ul className="list-disc ps-5 space-y-2">
              <li>
                {lang === 'ar'
                  ? 'في حال حدوث توقف في الحساب أو خلل تقني، يتم إصلاح العطل أو استبدال الحساب بحساب بديل خلال 24 ساعة.'
                  : 'En cas d\'interruption technique, nous procédons au rétablissement ou au remplacement sous 24 heures.'}
              </li>
              <li>
                {lang === 'ar'
                  ? 'إذا تعذر استمرار الخدمة لأسباب تقنية خارجة عن السيطرة، يحق للعميل استرجاع المبلغ المتبقي بالتناسب مع الفترة المتبقية من اشتراكه.'
                  : 'Si le service ne peut être maintenu, le client est remboursé au prorata temporis de la période non consommée.'}
              </li>
            </ul>
          </>
        )}

      </div>
    </div>
  );
};
