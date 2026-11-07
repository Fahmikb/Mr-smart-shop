import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Product, Category, StoreSettings, SubscriptionPlan, Order } from './types';
import { apiClient } from './api/client';
import { DEFAULT_SETTINGS, DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from './server/defaultData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustSection } from './components/TrustSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { SubscriptionRequestModal } from './components/SubscriptionRequestModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HowItWorksView, AboutUsView, ContactUsView, FaqView, LegalView } from './components/InformationViews';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

function MainApp() {
  const { lang, t } = useLanguage();

  // Data states
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Navigation states
  const [activeView, setActiveView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [requestTarget, setRequestTarget] = useState<{ product: Product; plan: SubscriptionPlan } | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<{ order: Order; whatsappUrl: string } | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Fetch initial data from server API
  const refreshData = async () => {
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        apiClient.getProducts(),
        apiClient.getCategories(),
        apiClient.getSettings()
      ]);
      if (prodRes && prodRes.length) setProducts(prodRes);
      if (catRes && catRes.length) setCategories(catRes);
      if (setRes) setSettings(setRes);
    } catch (err) {
      console.warn('Backend API connection in progress, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handle URL hash navigation on load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash.startsWith('product-')) {
      const slug = hash.replace('product-', '');
      const matched = products.find(p => p.slug === slug);
      if (matched) {
        setSelectedProductDetails(matched);
      }
    } else if (hash === 'catalog') {
      setActiveView('catalog');
    } else if (hash === 'admin') {
      setIsAdminOpen(true);
    }
  }, [products]);

  // View navigation handler
  const handleNavigate = (view: string, param?: string) => {
    setActiveView(view);
    if (view === 'catalog' && param) {
      setSelectedCategory(param);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open product details modal
  const handleViewDetails = (product: Product) => {
    setSelectedProductDetails(product);
  };

  // Open subscription request modal
  const handleOpenRequest = (product: Product, defaultPlan?: SubscriptionPlan) => {
    const plan = defaultPlan || product.plans.find(p => p.isAvailable) || product.plans[0];
    setRequestTarget({ product, plan });
    // Close details if open
    setSelectedProductDetails(null);
  };

  // Order submission success
  const handleOrderSuccess = (order: Order, whatsappUrl: string) => {
    setRequestTarget(null);
    setConfirmedOrder({ order, whatsappUrl });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100 selection:bg-blue-600 selection:text-white">
      
      {/* Header */}
      <Header
        settings={settings}
        onNavigate={handleNavigate}
        activeView={activeView}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <Hero
              onExplore={() => {
                const catalogEl = document.getElementById('catalog-section');
                if (catalogEl) {
                  catalogEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNavigate('catalog');
                }
              }}
              onContact={() => handleNavigate('contact')}
              onSelectProductBySlug={(slug) => {
                const prod = products.find(p => p.slug === slug);
                if (prod) {
                  setSelectedProductDetails(prod);
                }
              }}
            />

            <TrustSection />

            <ProductCatalog
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onViewDetails={handleViewDetails}
              onRequest={handleOpenRequest}
            />

            {/* Quick How It Works Section on Homepage */}
            <div className="border-t border-slate-800/80 bg-slate-900/30">
              <HowItWorksView
                settings={settings}
                onNavigateHome={() => handleNavigate('home')}
                onExplore={() => handleNavigate('catalog')}
              />
            </div>
          </>
        )}

        {activeView === 'catalog' && (
          <ProductCatalog
            products={products}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onViewDetails={handleViewDetails}
            onRequest={handleOpenRequest}
          />
        )}

        {activeView === 'how-it-works' && (
          <HowItWorksView
            settings={settings}
            onNavigateHome={() => handleNavigate('home')}
            onExplore={() => handleNavigate('catalog')}
          />
        )}

        {activeView === 'about' && (
          <AboutUsView
            settings={settings}
            onNavigateHome={() => handleNavigate('home')}
            onExplore={() => handleNavigate('catalog')}
          />
        )}

        {activeView === 'contact' && (
          <ContactUsView
            settings={settings}
            onNavigateHome={() => handleNavigate('home')}
            onExplore={() => handleNavigate('catalog')}
          />
        )}

        {activeView === 'faq' && (
          <FaqView />
        )}

        {activeView === 'terms' && (
          <LegalView policyType="terms" />
        )}

        {activeView === 'privacy' && (
          <LegalView policyType="privacy" />
        )}

        {activeView === 'refund' && (
          <LegalView policyType="refund" />
        )}
      </main>

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />

      {/* Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MODALS */}

      {/* 1. Dedicated Product Details Modal */}
      {selectedProductDetails && (
        <ProductDetailsModal
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          onRequestPlan={(product, plan) => handleOpenRequest(product, plan)}
        />
      )}

      {/* 2. Subscription Request Form Modal */}
      {requestTarget && (
        <SubscriptionRequestModal
          product={requestTarget.product}
          selectedPlan={requestTarget.plan}
          onClose={() => setRequestTarget(null)}
          onSuccess={handleOrderSuccess}
        />
      )}

      {/* 3. Order Confirmation Modal with WhatsApp CTA */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder.order}
          whatsappUrl={confirmedOrder.whatsappUrl}
          onClose={() => setConfirmedOrder(null)}
        />
      )}

      {/* 4. Full Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          onRefreshProducts={refreshData}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </LanguageProvider>
  );
}
