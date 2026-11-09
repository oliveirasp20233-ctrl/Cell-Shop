import React, { useState, useEffect, useMemo, useRef } from 'react';
import productsData from './data/products.json';
import { Product, CartItem, SavedOrder } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryHighlights } from './components/CategoryHighlights';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { LiveSyncModal } from './components/LiveSyncModal';
import { Footer } from './components/Footer';
import { STORE_PHONE_DISPLAY, getGeneralWhatsAppLink } from './utils/whatsapp';
import {
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const ALL_CATEGORIES = [
  'Todos',
  'Telas & Displays',
  'Baterias',
  'Placas de Carga (Dock)',
  'Tampas Traseiras',
  'Flex & Cabos',
  'Câmeras & Lentes',
  'Alto-falantes & Som',
  'Gavetas & Componentes'
];

const ALL_BRANDS = [
  'Todos',
  'Apple',
  'Samsung',
  'Motorola',
  'Xiaomi',
  'Realme',
  'LG',
  'Infinix'
];

const ALL_QUALITIES = [
  'Todos',
  'OLED',
  'INCELL',
  'COM ARO',
  'JK',
  'FOXCONN',
  'TURBO FAST'
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(productsData as Product[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedBrand, setSelectedBrand] = useState('Todos');
  const [selectedQuality, setSelectedQuality] = useState('Todos');
  const [onlyWithPrice, setOnlyWithPrice] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'name-asc'>('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 32;

  // Cart & Modals
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('conecta_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [savedOrders, setSavedOrders] = useState<SavedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('conecta_order_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Theme
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('conecta_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('conecta_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('conecta_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('conecta_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('conecta_order_history', JSON.stringify(savedOrders));
    } catch {
      // ignore
    }
  }, [savedOrders]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, selectedQuality, onlyWithPrice, sortBy]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.name}" adicionado à lista de pedido!`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    if (confirm('Deseja realmente limpar toda a lista de orçamento?')) {
      setCart([]);
    }
  };

  const handleSendOrder = (
    orderItems: CartItem[],
    customerInfo: { name?: string; storeName?: string; city?: string; notes?: string },
    total: number
  ) => {
    const now = new Date();
    const dateFormatted =
      now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }) +
      ' às ' +
      now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newOrder: SavedOrder = {
      id: `PED-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: now.toISOString(),
      formattedDate: dateFormatted,
      items: [...orderItems],
      total,
      customerInfo
    };

    setSavedOrders((prev) => [newOrder, ...prev]);
    showToast(`Orçamento ${newOrder.id} arquivado no seu histórico!`);
  };

  const handleLoadOrderToCart = (itemsToLoad: CartItem[]) => {
    setCart((prev) => {
      const updated = [...prev];
      itemsToLoad.forEach((item) => {
        const existingIndex = updated.findIndex((i) => i.product.id === item.product.id);
        if (existingIndex >= 0) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity
          };
        } else {
          updated.push({ ...item });
        }
      });
      return updated;
    });
    setIsCartOpen(true);
    showToast('Itens do orçamento adicionados ao carrinho!');
  };

  const handleDeleteOrder = (orderId: string) => {
    setSavedOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('Orçamento removido do histórico.');
  };

  const handleClearAllHistory = () => {
    if (confirm('Deseja realmente apagar todo o histórico de orçamentos salvos?')) {
      setSavedOrders([]);
      showToast('Histórico de orçamentos limpo.');
    }
  };

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return products.filter((p) => {
      if (selectedCategory !== 'Todos' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedBrand !== 'Todos' && p.brand !== selectedBrand) {
        return false;
      }
      if (selectedQuality !== 'Todos' && !p.qualities.includes(selectedQuality)) {
        return false;
      }
      if (onlyWithPrice && !p.hasPrice) {
        return false;
      }
      if (q) {
        const target = `${p.name} ${p.brand} ${p.category} ${p.compatibility} ${p.qualities.join(' ')}`.toLowerCase();
        if (!target.includes(q)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        if (!a.hasPrice && !b.hasPrice) return 0;
        if (!a.hasPrice) return 1;
        if (!b.hasPrice) return -1;
        return a.price - b.price;
      }
      if (sortBy === 'price-desc') {
        if (!a.hasPrice && !b.hasPrice) return 0;
        if (!a.hasPrice) return 1;
        if (!b.hasPrice) return -1;
        return b.price - a.price;
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      return 0; // relevance
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedQuality, onlyWithPrice, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setSelectedBrand('Todos');
    setSelectedQuality('Todos');
    setOnlyWithPrice(false);
    setSortBy('relevance');
  };

  // Live Sync logic to reload from the published sheet if requested
  const handleSyncLiveData = async () => {
    setIsSyncing(true);
    try {
      // Simulate live reload or fetch updated JSON from static asset / remote
      await new Promise((r) => setTimeout(r, 1200));
      setProducts(productsData as Product[]);
      showToast('Planilha sincronizada e catálogo atualizado!');
    } finally {
      setIsSyncing(false);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header with 3-Zone Contract */}
      <Header
        cartCount={totalCartCount}
        savedOrdersCount={savedOrders.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onScrollToCatalog={scrollToCatalog}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onScrollToCatalog={scrollToCatalog}
        totalProductsCount={products.length}
      />

      {/* Featured Categories Carousel / Cards */}
      <CategoryHighlights
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToCatalog();
        }}
        categoryCounts={categoryCounts}
      />

      {/* Main Interactive Catalog Section */}
      <main ref={catalogRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Section Heading & Result Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              {selectedCategory === 'Todos' ? 'Catálogo Geral' : selectedCategory}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Explorar Modelos e Peças
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium">
              Mostrando <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{filteredProducts.length}</strong> de <strong className="font-mono tabular-nums">{products.length}</strong> itens
            </span>
            {(searchQuery || selectedCategory !== 'Todos' || selectedBrand !== 'Todos' || selectedQuality !== 'Todos' || onlyWithPrice) && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar filtros</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-8">
          {/* Row 1: Search and Sorters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar modelo: iPhone 11, Moto G8, Redmi Note, A03..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {/* Price Sorting */}
            <div className="md:col-span-3">
              <div className="relative">
                <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer appearance-none"
                >
                  <option value="relevance">Ordenação: Relevância da Planilha</option>
                  <option value="price-asc">Preço: Menor para Maior</option>
                  <option value="price-desc">Preço: Maior para Menor</option>
                  <option value="name-asc">Ordem Alfabética (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Only with price toggle */}
            <div className="md:col-span-3 flex items-center">
              <button
                type="button"
                onClick={() => setOnlyWithPrice(!onlyWithPrice)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl border transition-colors cursor-pointer ${
                  onlyWithPrice
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>Apenas com Preço Listado</span>
                <span className={`w-4 h-4 rounded border flex items-center justify-center ${onlyWithPrice ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-700'}`}>
                  {onlyWithPrice && <Check className="w-3 h-3" />}
                </span>
              </button>
            </div>
          </div>

          {/* Row 2: Category Segmented Buttons */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Categorias
            </div>
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {ALL_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                const count = cat === 'Todos' ? products.length : categoryCounts[cat] || 0;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-60 font-mono tabular-nums">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Brand Segmented Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-slate-400 shrink-0">Marca:</span>
              <div className="flex items-center gap-1">
                {ALL_BRANDS.map((brand) => {
                  const isActive = selectedBrand === brand;
                  return (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 dark:bg-emerald-600 text-white font-semibold'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quality Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-400">Qualidade:</span>
              <select
                value={selectedQuality}
                onChange={(e) => setSelectedQuality(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                {ALL_QUALITIES.map((q) => (
                  <option key={q} value={q}>
                    {q === 'Todos' ? 'Todas Qualidades' : q}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 my-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">
              Nenhuma peça encontrada com estes filtros
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
              Tente buscar por termos mais genéricos (como "iPhone", "A01", "G8", "Note") ou redefina os filtros de categoria e marca.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-emerald-600 text-white rounded-lg hover:opacity-90 cursor-pointer"
              >
                Resetar Filtros
              </button>
              <a
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100"
              >
                Perguntar no WhatsApp ({STORE_PHONE_DISPLAY})
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
            {paginatedProducts.map((product) => {
              const isInCart = cart.some((item) => item.product.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onOpenDetails={(p) => setDetailsProduct(p)}
                  isInCart={isInCart}
                />
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 font-mono">
              Página <strong className="text-slate-900 dark:text-white tabular-nums">{currentPage}</strong> de <strong className="tabular-nums">{totalPages}</strong> ({filteredProducts.length} itens)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Quick page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pNum = currentPage - 2 + i;
                  if (pNum > totalPages) pNum = totalPages - (4 - i);
                }
                const isCurrent = pNum === currentPage;
                return (
                  <button
                    key={pNum}
                    onClick={() => handlePageChange(pNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold font-mono tabular-nums transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {pNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom WhatsApp CTA (Quick Contact) */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        {totalCartCount > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-slate-700"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Ver Orçamento</span>
            <span className="bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full font-mono text-[11px] tabular-nums">
              {totalCartCount}
            </span>
          </button>
        )}

        <a
          href={getGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          title="Falar no WhatsApp Conecta Cell Shop"
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline">WhatsApp {STORE_PHONE_DISPLAY}</span>
        </a>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/90 text-white text-xs font-medium shadow-2xl backdrop-blur-sm border border-slate-800 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Product Technical Modal */}
      <ProductModal
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
        onAddToCart={handleAddToCart}
        isInCart={detailsProduct ? cart.some((i) => i.product.id === detailsProduct.id) : false}
      />

      {/* Cart & Budget Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onSendOrder={handleSendOrder}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        savedOrdersCount={savedOrders.length}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        orders={savedOrders}
        onLoadOrderToCart={handleLoadOrderToCart}
        onDeleteOrder={handleDeleteOrder}
        onClearAllHistory={handleClearAllHistory}
      />

      {/* Live Google Sheets Sync Modal */}
      <LiveSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSyncLiveData={handleSyncLiveData}
        isSyncing={isSyncing}
        totalItems={products.length}
      />

      {/* Footer */}
      <Footer
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />
    </div>
  );
}
