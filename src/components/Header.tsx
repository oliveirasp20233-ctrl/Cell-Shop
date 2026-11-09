import React from 'react';
import { ShoppingBag, Sun, Moon, MessageSquare, History } from 'lucide-react';
import { STORE_NAME, getGeneralWhatsAppLink } from '../utils/whatsapp';

interface HeaderProps {
  cartCount: number;
  savedOrdersCount: number;
  onOpenCart: () => void;
  onOpenHistory: () => void;
  onSelectCategory: (cat: string) => void;
  onScrollToCatalog: () => void;
  onOpenSyncModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  savedOrdersCount,
  onOpenCart,
  onOpenHistory,
  onSelectCategory,
  onScrollToCatalog,
  darkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
          <span>{STORE_NAME}</span>
        </a>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              onSelectCategory('Telas & Displays');
              onScrollToCatalog();
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Telas & Displays
          </button>
          <button
            onClick={() => {
              onSelectCategory('Baterias');
              onScrollToCatalog();
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Baterias
          </button>
          <button
            onClick={() => {
              onSelectCategory('Placas de Carga (Dock)');
              onScrollToCatalog();
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Placas de Carga
          </button>
          <button
            onClick={() => {
              onSelectCategory('Todos');
              onScrollToCatalog();
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Todos os 5.400+ Itens
          </button>
          <button
            onClick={onOpenHistory}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Histórico</span>
            {savedOrdersCount > 0 && (
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                ({savedOrdersCount})
              </span>
            )}
          </button>
          <a
            href={getGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>(11) 99989-3780</span>
          </a>
        </nav>

        {/* Zone 3: 1 primary action cluster */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenHistory}
            aria-label="Ver histórico de orçamentos"
            title="Histórico de Orçamentos"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Histórico</span>
            {savedOrdersCount > 0 && (
              <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono tabular-nums">
                {savedOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleDarkMode}
            aria-label="Alternar tema"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Orçamento</span>
            {cartCount > 0 && (
              <span className="bg-emerald-500 dark:bg-white text-white dark:text-slate-900 text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
