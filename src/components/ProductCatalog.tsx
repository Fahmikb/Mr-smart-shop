import React, { useState, useMemo } from 'react';
import { Product, Category, SubscriptionPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  Bot, 
  Palette, 
  Video, 
  Tv, 
  Headphones, 
  Briefcase, 
  Layers 
} from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  onViewDetails: (product: Product) => void;
  onRequest: (product: Product, defaultPlan?: SubscriptionPlan) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  ai: Bot,
  design: Palette,
  video: Video,
  entertainment: Tv,
  music: Headphones,
  productivity: Briefcase
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories,
  selectedCategory,
  onSelectCategory,
  onViewDetails,
  onRequest
}) => {
  const { lang, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Availability check
        if (!p.isAvailable) return false;

        // Category check
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }

        // Search check
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = p.name.toLowerCase().includes(q);
          const descArMatch = p.shortDescAr?.toLowerCase().includes(q) || p.fullDescAr?.toLowerCase().includes(q);
          const descFrMatch = p.shortDescFr?.toLowerCase().includes(q) || p.fullDescFr?.toLowerCase().includes(q);
          return nameMatch || descArMatch || descFrMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          const pA = a.startingPriceTnd || 999999;
          const pB = b.startingPriceTnd || 999999;
          return pA - pB;
        }
        if (sortBy === 'price-desc') {
          const pA = a.startingPriceTnd || 0;
          const pB = b.startingPriceTnd || 0;
          return pB - pA;
        }
        // default featured
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="catalog-section" className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'كتالوج الاشتراكات الرسمية' : 'Catalogue Officiel'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {t('allProducts')}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {lang === 'ar' 
                ? 'قارن بين الخطط والأسعار بالدينار التونسي واطلب تفعيل اشتراكك بسهولة' 
                : 'Comparez les forfaits en Dinars Tunisiens et activez votre abonnement simplement'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 end-3 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Bar & Sort Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('allCategories')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                {products.filter(p => p.isAvailable).length}
              </span>
            </button>

            {categories
              .filter((cat) => products.some((p) => p.isAvailable && p.categoryId === cat.id))
              .map((cat) => {
              const Icon = categoryIcons[cat.id] || Sparkles;
              const count = products.filter(p => p.isAvailable && p.categoryId === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? cat.nameAr : cat.nameFr}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-400">{t('sortBy')}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="featured">{t('sortFeatured')}</option>
              <option value="price-asc">{t('sortPriceAsc')}</option>
              <option value="price-desc">{t('sortPriceDesc')}</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-slate-800 bg-slate-900/30">
            <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              {lang === 'ar' ? 'لم يتم العثور على اشتراكات' : 'Aucun abonnement trouvé'}
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              {lang === 'ar' 
                ? 'جرب البحث بكلمات أخرى أو اختر فئة مختلفة' 
                : 'Essayez avec un autre mot-clé ou sélectionnez une autre catégorie'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onRequest={onRequest}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
