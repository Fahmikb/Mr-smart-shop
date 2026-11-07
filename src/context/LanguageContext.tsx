import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isRtl: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Brand
    brandName: 'Mr Smart Shop AI',
    brandTagline: 'متجر الاشتراكات الرقمية والذكاء الاصطناعي في تونس',

    // Nav
    home: 'الرئيسية',
    allProducts: 'جميع الاشتراكات',
    aiCategory: 'الذكاء الاصطناعي',
    designCategory: 'التصميم والإبداع',
    videoCategory: 'صناعة الفيديو',
    entertainmentCategory: 'الترفيه والبث',
    musicCategory: 'الموسيقى والصوت',
    productivityCategory: 'الإنتاجية والأعمال',
    howItWorks: 'كيف يعمل المتجر؟',
    contact: 'اتصل بنا',
    faq: 'الأسئلة الشائعة',
    about: 'من نحن',
    admin: 'لوحة التحكم',
    whatsappContact: 'تواصل عبر واتساب',

    // Hero
    heroHeadline: 'عالمك الرقمي، كلّه في مكان واحد.',
    heroSubtitle: 'اكتشف أقوى أدوات الذكاء الاصطناعي، اشتراكات الترفيه، والخدمات الرقمية الاحترافية في تونس بتفعيل رسمي وأسعار واضحة وتجربة طلب سهلة ومضمونة.',
    exploreSubscriptions: 'استكشف الاشتراكات',
    contactUs: 'تواصل معنا مباشرة',
    searchPlaceholder: 'ابحث عن اشتراك (مثال: ChatGPT, Netflix, Canva, CapCut)...',
    allCategories: 'الكل',
    sortBy: 'ترتيب حسب:',
    sortFeatured: 'المميزة أولاً',
    sortPriceAsc: 'السعر: من الأقل للأعلى',
    sortPriceDesc: 'السعر: من الأعلى للأقل',
    startingFrom: 'يبدأ من',
    contactForPricing: 'اتصل بنا لمعرفة السعر',
    viewDetails: 'تفاصيل الباقات',
    requestSubscription: 'طلب اشتراك',
    available: 'متوفر الآن',
    instantActivation: 'تفعيل فوري مضمون',
    assistedActivation: 'تفعيل رسمي بمساعدة',

    // Trust
    trustTitle: 'لماذا يختار عملاؤنا في تونس Mr Smart Shop AI؟',
    trust1Title: 'طلب بسيط وسريع',
    trust1Desc: 'اختر باقتك وسجل طلبك في أقل من دقيقة بدون إجراءات معقدة أو متطلبات صعبة.',
    trust2Title: 'أسعار واضحة وشفافة',
    trust2Desc: 'جميع الأسعار محددة بالدينار التونسي (DT) بدون أي رسوم خفية أو مفاجآت عند الدفع.',
    trust3Title: 'دعم فني شخصي',
    trust3Desc: 'متابعة فردية ودعم فني مستمر عبر واتساب لضمان عمل اشتراكك واستقراره طوال المدة.',

    // Request Form
    requestTitle: 'طلب اشتراك جديد',
    requestSubtitle: 'أدخل بياناتك وسيتم تسجيل طلبك فوراً وتجهيز رابط تواصل عبر واتساب',
    fullName: 'الاسم واللقب',
    fullNamePlaceholder: 'مثال: محمد الطرابلسي',
    phone: 'رقم الهاتف التونسي',
    phonePlaceholder: 'مثال: 58 123 456 أو 22 123 456',
    email: 'البريد الإلكتروني (اختياري)',
    emailPlaceholder: 'name@example.com',
    selectedProduct: 'الخدمة المختارة',
    selectedPlan: 'الباقة المختارة',
    additionalNotes: 'ملاحظات إضافية أو طريقة الدفع المفضلة (اختياري)',
    notesPlaceholder: 'مثال: أريد الدفع عبر Flouci / D17 أو تفعيل على إيميل معين...',
    submitRequest: 'تأكيد وحفظ الطلب',
    submitting: 'جاري تسجيل الطلب...',

    // Confirmation
    confirmationTitle: 'تم تسجيل طلبك بنجاح!',
    confirmationSubtitle: 'شكراً لاختيارك Mr Smart Shop AI. تم حفظ طلبك في النظام برقم مرجعي فريد.',
    orderReference: 'الرقم المرجعي للطلب',
    customerName: 'الاسم',
    customerPhone: 'رقم الهاتف',
    summaryProduct: 'الخدمة',
    summaryPlan: 'الباقة',
    summaryPrice: 'المبلغ المطلوب',
    whatsAppAction: 'متابعة الطلب عبر واتساب الآن',
    copyRef: 'نسخ الرقم المرجعي',
    refCopied: 'تم النسخ!',
    confirmationNote: 'ملاحظة: طلبك محفوظ ومسجل لدينا بالفعل حتى لو لم تفتح واتساب. سيتواصل معك فريقنا في أقرب وقت لتأكيد الدفع والتفعيل.',
    close: 'إغلاق',

    // Details Modal
    planComparison: 'مقارنة الباقات والأسعار',
    featuresTitle: 'أهم ميزات الاشتراك',
    faqsTitle: 'الأسئلة الشائعة حول هذه الخدمة',
    duration: 'المدة:',
    officialGuarantee: 'ضمان كامل ومستمر طيلة فترة الاشتراك الرسمية',
    choosePlan: 'اختر هذه الباقة',

    // Footer
    footerDesc: 'المنصة الرائدة في تونس للاشتراكات الرقمية وأدوات الذكاء الاصطناعي. تفعيل رسمي، أسعار بالدينار التونسي، ودعم فني متميز.',
    quickLinks: 'روابط سريعة',
    legalLinks: 'الشروط والسياسات',
    terms: 'الشروط والأحكام',
    privacy: 'سياسة الخصوصية',
    refundPolicy: 'سياسة الاسترجاع والضمان',
    rightsReserved: 'جميع الحقوق محفوظة.',
    paymentMethods: 'طرق الدفع المحلية المدعومة: D17، Flouci، التحويل البنكي والبريدي',

    // Admin
    adminTitle: 'لوحة التحكم - إدارة المتجر',
    adminLoginPrompt: 'يرجى إدخال رمز الوصول الإداري لمتابعة الطلبات وتعديل الأسعار',
    adminPassword: 'رمز الدخول الإداري',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    ordersTab: 'الطلبات والعملاء',
    productsTab: 'إدارة المنتجات والباقات',
    settingsTab: 'إعدادات المتجر',
    statsOverview: 'ملخص النشاط',
    totalOrders: 'إجمالي الطلبات',
    newOrders: 'طلبات جديدة',
    pendingOrders: 'قيد المتابعة',
    completedOrders: 'مكتملة',
    status: 'الحالة',
    date: 'التاريخ',
    actions: 'الإجراءات',
    changeStatus: 'تعديل الحالة',
    openCustomerWhatsApp: 'مراسلة العميل واتساب',
    saveChanges: 'حفظ التغييرات',
    savedSuccessfully: 'تم الحفظ بنجاح!'
  },
  fr: {
    // Brand
    brandName: 'Mr Smart Shop AI',
    brandTagline: 'Boutique d\'abonnements numériques & IA en Tunisie',

    // Nav
    home: 'Accueil',
    allProducts: 'Tous les abonnements',
    aiCategory: 'Intelligence Artificielle',
    designCategory: 'Design & Créativité',
    videoCategory: 'Montage Vidéo',
    entertainmentCategory: 'Divertissement',
    musicCategory: 'Musique & Audio',
    productivityCategory: 'Productivité',
    howItWorks: 'Comment ça marche',
    contact: 'Contact',
    faq: 'FAQ',
    about: 'À propos',
    admin: 'Administration',
    whatsappContact: 'Contact WhatsApp',

    // Hero
    heroHeadline: 'Votre monde numérique, réuni au même endroit.',
    heroSubtitle: 'Découvrez les meilleurs outils d\'intelligence artificielle, abonnements streaming et services numériques en Tunisie. Activation officielle, tarifs clairs en Dinars Tunisiens et support dédié.',
    exploreSubscriptions: 'Découvrir les abonnements',
    contactUs: 'Nous contacter',
    searchPlaceholder: 'Rechercher un service (ex: ChatGPT, Netflix, Canva, CapCut)...',
    allCategories: 'Tous',
    sortBy: 'Trier par :',
    sortFeatured: 'En vedette',
    sortPriceAsc: 'Prix : croissant',
    sortPriceDesc: 'Prix : décroissant',
    startingFrom: 'À partir de',
    contactForPricing: 'Contactez-nous pour le tarif',
    viewDetails: 'Détails des offres',
    requestSubscription: 'Demander l\'abonnement',
    available: 'Disponible',
    instantActivation: 'Activation immédiate garantie',
    assistedActivation: 'Activation assistée officielle',

    // Trust
    trustTitle: 'Pourquoi choisir Mr Smart Shop AI en Tunisie ?',
    trust1Title: 'Commande simple et rapide',
    trust1Desc: 'Sélectionnez votre forfait et soumettez votre demande en moins d\'une minute, sans démarches complexes.',
    trust2Title: 'Tarifs transparents',
    trust2Desc: 'Des prix clairs affichés en Dinars Tunisiens (DT), sans aucuns frais cachés ni mauvaise surprise.',
    trust3Title: 'Support client personnalisé',
    trust3Desc: 'Un accompagnement individuel continu via WhatsApp pour garantir le bon fonctionnement de votre compte.',

    // Request Form
    requestTitle: 'Demande d\'abonnement',
    requestSubtitle: 'Renseignez vos coordonnées pour enregistrer votre commande et générer votre lien WhatsApp',
    fullName: 'Nom et prénom',
    fullNamePlaceholder: 'Ex: Mohamed Trabelsi',
    phone: 'Numéro de téléphone tunisien',
    phonePlaceholder: 'Ex: 58 123 456 ou 22 123 456',
    email: 'Adresse email (optionnel)',
    emailPlaceholder: 'nom@exemple.com',
    selectedProduct: 'Service sélectionné',
    selectedPlan: 'Formule choisie',
    additionalNotes: 'Remarques ou mode de paiement souhaité (optionnel)',
    notesPlaceholder: 'Ex: Paiement souhaité par Flouci / D17, activation sur email existant...',
    submitRequest: 'Confirmer la commande',
    submitting: 'Enregistrement en cours...',

    // Confirmation
    confirmationTitle: 'Demande enregistrée avec succès !',
    confirmationSubtitle: 'Merci de votre confiance. Votre commande est enregistrée dans notre système avec une référence unique.',
    orderReference: 'Référence de commande',
    customerName: 'Client',
    customerPhone: 'Téléphone',
    summaryProduct: 'Service',
    summaryPlan: 'Formule',
    summaryPrice: 'Montant',
    whatsAppAction: 'Finaliser via WhatsApp maintenant',
    copyRef: 'Copier la référence',
    refCopied: 'Copié !',
    confirmationNote: 'Important : Votre demande est bien enregistrée même si vous n\'ouvrez pas WhatsApp. Notre équipe vous contactera sous peu pour le paiement et l\'activation.',
    close: 'Fermer',

    // Details Modal
    planComparison: 'Comparatif des forfaits',
    featuresTitle: 'Fonctionnalités clés',
    faqsTitle: 'Questions fréquentes sur ce service',
    duration: 'Durée :',
    officialGuarantee: 'Garantie totale et continue pendant toute la période souscrite',
    choosePlan: 'Choisir ce forfait',

    // Footer
    footerDesc: 'La référence en Tunisie pour l\'accès aux abonnements numériques et services IA. Activation officielle, prix en DT et assistance dédiée.',
    quickLinks: 'Liens rapides',
    legalLinks: 'Informations légales',
    terms: 'Conditions générales',
    privacy: 'Politique de confidentialité',
    refundPolicy: 'Politique de garantie & remboursement',
    rightsReserved: 'Tous droits réservés.',
    paymentMethods: 'Moyens de paiement locaux acceptés : D17, Flouci, Virement bancaire et postal',

    // Admin
    adminTitle: 'Administration - Mr Smart Shop AI',
    adminLoginPrompt: 'Entrez le mot de passe administrateur pour gérer les commandes et forfaits',
    adminPassword: 'Code d\'accès administrateur',
    login: 'Se connecter',
    logout: 'Déconnexion',
    ordersTab: 'Commandes & Demandes',
    productsTab: 'Gestion des Abonnements',
    settingsTab: 'Paramètres Boutique',
    statsOverview: 'Statistiques',
    totalOrders: 'Total Commandes',
    newOrders: 'Nouvelles',
    pendingOrders: 'En cours',
    completedOrders: 'Finalisées',
    status: 'Statut',
    date: 'Date',
    actions: 'Actions',
    changeStatus: 'Modifier statut',
    openCustomerWhatsApp: 'Contacter client WhatsApp',
    saveChanges: 'Enregistrer les modifications',
    savedSuccessfully: 'Modifications enregistrées avec succès !'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  setLang: () => {},
  isRtl: true,
  t: (key: string) => key
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('mss_lang');
    return saved === 'fr' ? 'fr' : 'ar';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('mss_lang', newLang);
  };

  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [lang, isRtl]);

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.ar[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
