import React, { useState, useEffect } from 'react';
import { Product, Order, StoreSettings, OrderStatus, Category, SubscriptionPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../api/client';
import { formatTndPrice } from '../utils/order';
import { 
  Lock, 
  LogOut, 
  Package, 
  ShoppingCart, 
  Settings, 
  BarChart3, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle, 
  Clock, 
  PhoneCall, 
  MessageCircle, 
  X, 
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
  onRefreshProducts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, onRefreshProducts }) => {
  const { lang, t } = useLanguage();

  // Auth State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return sessionStorage.getItem('mss_admin_token');
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'settings'>('overview');

  // Data States
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Orders Filter State
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Product Edit State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Load all data when authenticated
  const loadDashboardData = async (token: string) => {
    setLoading(true);
    try {
      const [statsData, ordersData, productsData, settingsData] = await Promise.all([
        apiClient.getAdminStats(token),
        apiClient.getAdminOrders(token),
        apiClient.getProducts(),
        apiClient.getSettings()
      ]);
      setStats(statsData);
      setOrders(ordersData);
      setProducts(productsData);
      setSettings(settingsData);
    } catch (err: any) {
      if (err.message?.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      loadDashboardData(authToken);
    }
  }, [authToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoginLoading(true);

    try {
      const res = await apiClient.adminLogin(passwordInput);
      if (res.success && res.token) {
        sessionStorage.setItem('mss_admin_token', res.token);
        setAuthToken(res.token);
        setPasswordInput('');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Mot de passe incorrect');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mss_admin_token');
    setAuthToken(null);
    setOrders([]);
    setStats(null);
  };

  const showNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Status Updater
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!authToken) return;
    try {
      const updated = await apiClient.updateOrderStatus(authToken, orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? updated : o));
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails(updated);
      }
      showNotification(lang === 'ar' ? 'تم تحديث حالة الطلب بنجاح' : 'Statut de commande mis à jour');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !editingProduct) return;

    try {
      if (isNewProduct) {
        const created = await apiClient.createProduct(authToken, editingProduct);
        setProducts([created, ...products]);
      } else {
        const saved = await apiClient.saveProduct(authToken, editingProduct);
        setProducts(products.map(p => p.id === saved.id ? saved : p));
      }
      setEditingProduct(null);
      setIsNewProduct(false);
      onRefreshProducts();
      showNotification(lang === 'ar' ? 'تم حفظ المنتج وتحديث الأسعار بنجاح' : 'Produit et tarifs enregistrés');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (!authToken) return;
    if (!confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Supprimer définitivement ce produit ?')) return;

    try {
      await apiClient.deleteProduct(authToken, id);
      setProducts(products.filter(p => p.id !== id));
      onRefreshProducts();
      showNotification(lang === 'ar' ? 'تم حذف المنتج' : 'Produit supprimé');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !settings) return;

    try {
      const updated = await apiClient.updateSettings(authToken, settings);
      setSettings(updated);
      showNotification(lang === 'ar' ? 'تم تحديث إعدادات المتجر ورقم الواتساب' : 'Paramètres enregistrés avec succès');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.reference.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.productName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Login Screen if not authenticated
  if (!authToken) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#0A0F1D] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 text-blue-400">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white text-center">
            {t('adminTitle')}
          </h2>
          <p className="text-xs text-slate-400 text-center mt-1.5 mb-6">
            {t('adminLoginPrompt')}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t('adminPassword')}
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="smart2025"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {lang === 'ar' ? 'الرمز الافتراضي: smart2025' : 'Code par défaut : smart2025'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              {loginLoading ? '...' : t('login')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#070B14] flex flex-col">
      
      {/* Top Admin Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-blue-500/40 p-0.5 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Mr Smart Shop AI" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white">
              {t('adminTitle')}
            </h1>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {lang === 'ar' ? 'جلسة مسؤول مفعلة وقاعدة البيانات متصلة' : 'Session administrateur active & Base connectée'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {feedbackMsg && (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg animate-pulse font-medium">
              {feedbackMsg}
            </span>
          )}

          <button
            onClick={() => loadDashboardData(authToken)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Rafraîchir les données"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-[#090E1A] border-b border-slate-800/80 px-4 sm:px-8 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t('statsOverview')}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{t('ordersTab')}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t('productsTab')}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-blue-500 text-blue-400 bg-blue-500/5'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>{t('settingsTab')}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        
        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium block">{t('totalOrders')}</span>
                <span className="text-3xl font-black text-white mt-1 block font-mono">
                  {stats?.totalOrders || orders.length}
                </span>
                <span className="text-[11px] text-blue-400 mt-2 block">
                  {lang === 'ar' ? 'كافة الطلبات المسجلة' : 'Toutes les commandes'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30">
                <span className="text-xs text-blue-300 font-medium block">{t('newOrders')}</span>
                <span className="text-3xl font-black text-blue-400 mt-1 block font-mono">
                  {stats?.newOrders || orders.filter(o => o.status === 'New').length}
                </span>
                <span className="text-[11px] text-blue-300/80 mt-2 block">
                  {lang === 'ar' ? 'بانتظار المراجعة والاتصال' : 'À contacter en priorité'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30">
                <span className="text-xs text-amber-300 font-medium block">{t('pendingOrders')}</span>
                <span className="text-3xl font-black text-amber-400 mt-1 block font-mono">
                  {(stats?.pendingOrders || 0) + (stats?.contactedOrders || 0)}
                </span>
                <span className="text-[11px] text-amber-300/80 mt-2 block">
                  {lang === 'ar' ? 'قيد التنسيق والدفع' : 'En cours de traitement'}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="text-xs text-emerald-300 font-medium block">{t('completedOrders')}</span>
                <span className="text-3xl font-black text-emerald-400 mt-1 block font-mono">
                  {stats?.completedOrders || orders.filter(o => o.status === 'Completed').length}
                </span>
                <span className="text-[11px] text-emerald-300/80 mt-2 block">
                  {lang === 'ar' ? 'تم التفعيل بنجاح' : 'Comptes activés'}
                </span>
              </div>
            </div>

            {/* Quick Recent Orders */}
            <div className="glass-panel rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-base">
                  {lang === 'ar' ? 'آخر الطلبات الواردة' : 'Dernières demandes reçues'}
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-blue-400 hover:underline font-semibold"
                >
                  {lang === 'ar' ? 'عرض كل الطلبات ←' : 'Voir tout →'}
                </button>
              </div>

              <div className="space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400">{o.reference}</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="font-bold text-xs text-white">{o.customerName}</span>
                        <span className="text-xs text-slate-400 dir-ltr">({o.phone})</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {o.productName} - {o.planName} ({formatTndPrice(o.priceTnd, lang)})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        o.status === 'New' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                        o.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                        'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        {o.status}
                      </span>

                      <button
                        onClick={() => setSelectedOrderDetails(o)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                      >
                        {lang === 'ar' ? 'عرض' : 'Détails'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder={lang === 'ar' ? 'بحث بالاسم، الهاتف أو الرقم المرجعي...' : 'Recherche par nom, réf ou tel...'}
                  className="w-full ps-9 pe-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400">{t('status')}:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">{t('allCategories')}</option>
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs sm:text-sm">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 text-start">{t('orderReference')}</th>
                      <th className="py-3 px-4 text-start">{t('customerName')}</th>
                      <th className="py-3 px-4 text-start">{t('summaryProduct')}</th>
                      <th className="py-3 px-4 text-start">{t('summaryPrice')}</th>
                      <th className="py-3 px-4 text-start">{t('status')}</th>
                      <th className="py-3 px-4 text-start">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-slate-500 text-xs">
                          {lang === 'ar' ? 'لا توجد طلبات مطابقة' : 'Aucune commande trouvée'}
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const cleanPhone = order.phone.replace(/\D/g, '');
                        const waMsg = encodeURIComponent(
                          `مرحباً ${order.customerName}، معكم متجر Mr Smart Shop AI بخصوص طلبكم رقم ${order.reference} (${order.productName} - ${order.planName}).`
                        );
                        const waLink = `https://wa.me/${cleanPhone}?text=${waMsg}`;

                        return (
                          <tr key={order.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                              {order.reference}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white">{order.customerName}</div>
                              <div className="text-slate-400 text-xs dir-ltr">{order.phone}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-white">{order.productName}</div>
                              <div className="text-xs text-slate-400">{order.planName}</div>
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white">
                              {formatTndPrice(order.priceTnd, lang)}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                                  order.status === 'New' ? 'bg-blue-950 text-blue-300 border-blue-500/40' :
                                  order.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' :
                                  order.status === 'Cancelled' ? 'bg-red-950 text-red-300 border-red-500/40' :
                                  'bg-amber-950 text-amber-300 border-amber-500/40'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Pending">Pending</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Processing">Processing</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 transition-colors"
                                  title={t('openCustomerWhatsApp')}
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>

                                <button
                                  onClick={() => setSelectedOrderDetails(order)}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                  title="Détails"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: PRODUCTS & PLANS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">
                  {lang === 'ar' ? 'إدارة كتالوج الاشتراكات والأسعار' : 'Gestion des abonnements & tarifs'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'تعديل وتفعيل الأسعار بالدينار التونسي وإضافة خطط جديدة' : 'Modifier les tarifs en DT et ajouter de nouvelles formules'}
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    id: `prod-${Date.now()}`,
                    slug: 'new-service',
                    name: 'New Service',
                    categoryId: 'ai',
                    shortDescAr: 'وصف مختصر باللغة العربية',
                    shortDescFr: 'Description courte en français',
                    fullDescAr: 'تفاصيل كاملة عن الخدمة...',
                    fullDescFr: 'Description détaillée...',
                    brandColor: '#3B82F6',
                    iconName: 'Bot',
                    availability: 'instant',
                    availabilityLabelAr: 'تفعيل فوري مضمون',
                    availabilityLabelFr: 'Activation immédiate garantie',
                    isFeatured: false,
                    isAvailable: true,
                    startingPriceTnd: 50,
                    plans: [
                      {
                        id: `pl-${Date.now()}-1`,
                        nameAr: 'اشتراك شهر واحد',
                        nameFr: 'Abonnement 1 Mois',
                        durationAr: '1 شهر',
                        durationFr: '1 Mois',
                        priceTnd: 50,
                        isPopular: true,
                        isAvailable: true,
                        featuresAr: ['تفعيل رسمي', 'دعم فني'],
                        featuresFr: ['Activation officielle', 'Support']
                      }
                    ],
                    keyFeaturesAr: ['ميزة 1', 'ميزة 2'],
                    keyFeaturesFr: ['Fonction 1', 'Fonction 2'],
                    faqsAr: [{ q: 'سؤال تجريبي؟', a: 'إجابة تجريبية.' }],
                    faqsFr: [{ q: 'Question test ?', a: 'Réponse test.' }]
                  });
                  setIsNewProduct(true);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ar' ? 'إضافة خدمة جديدة' : 'Ajouter un service'}</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {prod.categoryId}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${prod.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {prod.isAvailable ? 'Actif' : 'Désactivé'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mb-1">
                      {prod.logoUrl ? (
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={prod.logoUrl} alt={prod.name} className="w-full h-full object-contain rounded" />
                        </div>
                      ) : null}
                      <h4 className="font-bold text-base text-white">{prod.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {lang === 'ar' ? prod.shortDescAr : prod.shortDescFr}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-1">
                      <span className="text-[11px] text-slate-400 font-medium block">
                        {lang === 'ar' ? 'الباقات والأسعار:' : 'Forfaits configurés :'}
                      </span>
                      {prod.plans.map(p => (
                        <div key={p.id} className="flex justify-between items-center text-xs text-slate-300">
                          <span>{lang === 'ar' ? p.nameAr : p.nameFr}</span>
                          <span className="font-bold text-blue-400">{formatTndPrice(p.priceTnd, lang)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setEditingProduct(JSON.parse(JSON.stringify(prod)));
                        setIsNewProduct(false);
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تعديل الأسعار والبيانات' : 'Modifier'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400 border border-red-500/30"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: STORE SETTINGS */}
        {activeTab === 'settings' && settings && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
              <h3 className="font-bold text-white text-base mb-1">
                {lang === 'ar' ? 'إعدادات متجر Mr Smart Shop AI' : 'Paramètres de la boutique'}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                {lang === 'ar' ? 'تعديل رقم واتساب المعتمد، بيانات التواصل ورسالة الإعلان' : 'Mettez à jour le numéro WhatsApp, emails et bannière'}
              </p>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'ar' ? 'رقم واتساب المعتمد للطلبات (WhatsApp Business)' : 'Numéro WhatsApp Business'}
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500 dir-ltr"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    {lang === 'ar' ? 'يقوم هذا الرقم بتلقي كافة رسائل الطلبات والاستفسارات' : 'Ce numéro reçoit les commandes générées'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {lang === 'ar' ? 'هاتف التواصل المباشر' : 'Téléphone direct'}
                    </label>
                    <input
                      type="text"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs dir-ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'ar' ? 'شريط الإعلان العلوي (بالعربية)' : 'Bannière d\'annonce (Arabe)'}
                  </label>
                  <input
                    type="text"
                    value={settings.announcementAr}
                    onChange={(e) => setSettings({ ...settings, announcementAr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {lang === 'ar' ? 'شريط الإعلان العلوي (بالفرنسية)' : 'Bannière d\'annonce (Français)'}
                  </label>
                  <input
                    type="text"
                    value={settings.announcementFr}
                    onChange={(e) => setSettings({ ...settings, announcementFr: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{t('saveChanges')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ORDER DETAILS VIEWER */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0F1E] border border-slate-700 rounded-2xl max-w-lg w-full p-6 relative space-y-4">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 end-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              <span>{lang === 'ar' ? 'تفاصيل الطلب' : 'Détails de la commande'}</span>
            </h3>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">{t('orderReference')}:</span>
                <span className="font-mono font-bold text-blue-400">{selectedOrderDetails.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('customerName')}:</span>
                <span className="font-bold text-white">{selectedOrderDetails.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('phone')}:</span>
                <span className="font-bold text-white dir-ltr">{selectedOrderDetails.phone}</span>
              </div>
              {selectedOrderDetails.email && (
                <div className="flex justify-between">
                  <span className="text-slate-400">{t('email')}:</span>
                  <span className="text-slate-200">{selectedOrderDetails.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">{t('summaryProduct')}:</span>
                <span className="font-bold text-white">{selectedOrderDetails.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('summaryPlan')}:</span>
                <span className="text-slate-200">{selectedOrderDetails.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('summaryPrice')}:</span>
                <span className="font-black text-blue-400">{formatTndPrice(selectedOrderDetails.priceTnd, lang)}</span>
              </div>
              {selectedOrderDetails.notes && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-slate-400 block mb-1">{t('additionalNotes')}:</span>
                  <p className="p-2 rounded bg-slate-950 text-slate-300 text-xs">{selectedOrderDetails.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={`https://wa.me/${selectedOrderDetails.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `مرحباً ${selectedOrderDetails.customerName}، معكم متجر Mr Smart Shop AI بخصوص طلبكم ${selectedOrderDetails.reference}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('openCustomerWhatsApp')}</span>
              </a>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRODUCT & PLANS EDITOR */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0F1E] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 relative my-8 space-y-4 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 end-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white">
              {isNewProduct ? (lang === 'ar' ? 'إضافة خدمة جديدة' : 'Nouveau service') : (lang === 'ar' ? `تعديل خدمة ${editingProduct.name}` : `Modifier ${editingProduct.name}`)}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">اسم الخدمة (Nom)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">الفئة (Catégorie)</label>
                  <select
                    value={editingProduct.categoryId}
                    onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="ai">AI</option>
                    <option value="design">Design</option>
                    <option value="video">Video</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="music">Music</option>
                    <option value="productivity">Productivity</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">الوصف المختصر (عربي)</label>
                  <input
                    type="text"
                    value={editingProduct.shortDescAr}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Description courte (Français)</label>
                  <input
                    type="text"
                    value={editingProduct.shortDescFr}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescFr: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {lang === 'ar' ? 'رابط الشعار / الصورة (Logo URL)' : 'URL du logo officiel (Logo URL)'}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingProduct.logoUrl || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, logoUrl: e.target.value })}
                    placeholder="/assets/aistudio/... ou URL externe"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                  {editingProduct.logoUrl && (
                    <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={editingProduct.logoUrl} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Subscriptions Plans Management */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">
                    {lang === 'ar' ? 'باقات الاشتراك والأسعار بالدينار (TND)' : 'Forfaits et tarifs en DT'}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const newPlan: SubscriptionPlan = {
                        id: `pl-${Date.now()}`,
                        nameAr: 'خطة جديدة',
                        nameFr: 'Nouveau forfait',
                        durationAr: '1 شهر',
                        durationFr: '1 Mois',
                        priceTnd: 50,
                        isAvailable: true,
                        featuresAr: ['تفعيل رسمي'],
                        featuresFr: ['Activation officielle']
                      };
                      setEditingProduct({
                        ...editingProduct,
                        plans: [...editingProduct.plans, newPlan]
                      });
                    }}
                    className="px-2.5 py-1 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold"
                  >
                    + {lang === 'ar' ? 'إضافة باقة' : 'Ajouter forfait'}
                  </button>
                </div>

                {editingProduct.plans.map((plan, pIdx) => (
                  <div key={plan.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400">اسم الباقة (عربي)</label>
                        <input
                          type="text"
                          value={plan.nameAr}
                          onChange={(e) => {
                            const newPlans = [...editingProduct.plans];
                            newPlans[pIdx].nameAr = e.target.value;
                            setEditingProduct({ ...editingProduct, plans: newPlans });
                          }}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">Nom forfait (Français)</label>
                        <input
                          type="text"
                          value={plan.nameFr}
                          onChange={(e) => {
                            const newPlans = [...editingProduct.plans];
                            newPlans[pIdx].nameFr = e.target.value;
                            setEditingProduct({ ...editingProduct, plans: newPlans });
                          }}
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400">السعر بالدينار (TND) - فارغ للتواصل</label>
                        <input
                          type="number"
                          value={plan.priceTnd ?? ''}
                          onChange={(e) => {
                            const newPlans = [...editingProduct.plans];
                            newPlans[pIdx].priceTnd = e.target.value === '' ? null : Number(e.target.value);
                            setEditingProduct({ ...editingProduct, plans: newPlans });
                          }}
                          placeholder="Ex: 75"
                          className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <input
                          type="checkbox"
                          checked={plan.isAvailable}
                          onChange={(e) => {
                            const newPlans = [...editingProduct.plans];
                            newPlans[pIdx].isAvailable = e.target.checked;
                            setEditingProduct({ ...editingProduct, plans: newPlans });
                          }}
                        />
                        <span>{lang === 'ar' ? 'متوفر للطلب' : 'Disponible'}</span>
                      </label>

                      {editingProduct.plans.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct({
                              ...editingProduct,
                              plans: editingProduct.plans.filter((_, idx) => idx !== pIdx)
                            });
                          }}
                          className="text-red-400 hover:text-red-300 text-[11px]"
                        >
                          {lang === 'ar' ? 'حذف هذه الباقة' : 'Supprimer'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                >
                  <Save className="w-3.5 h-3.5 inline-block me-1" />
                  {t('saveChanges')}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  {t('close')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
