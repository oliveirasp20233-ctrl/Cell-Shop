import React from 'react';
import { Search, MessageSquare, ShieldCheck, Zap, Truck } from 'lucide-react';
import { HERO_IMAGE } from '../data/categoryImages';
import { STORE_PHONE_DISPLAY, getGeneralWhatsAppLink } from '../utils/whatsapp';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onScrollToCatalog: () => void;
  totalProductsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onScrollToCatalog,
  totalProductsCount
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScrollToCatalog();
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Bancada de reparo técnico de smartphone Conecta Cell Shop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-3xl">
          {/* Unboxed natural kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase mb-3">
            <span>Catálogo Oficial Conecta Cell Shop</span>
            <span aria-hidden="true">·</span>
            <span>Atacado & Varejo Técnico</span>
            <span aria-hidden="true">·</span>
            <span>{totalProductsCount.toLocaleString('pt-BR')} Itens</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display text-balance leading-tight mb-4">
            Peças, Telas e Componentes para Manutenção de Smartphones
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance mb-8">
            Encontre na ponta dos dedos telas OLED, Incell, baterias Foxconn, placas dock e flex de todas as principais marcas (Apple, Samsung, Motorola, Xiaomi e mais). Orçamentos rápidos direto no WhatsApp com negociação facilitada.
          </p>

          {/* Search Box Form */}
          <form onSubmit={handleSubmit} className="relative mb-6 max-w-2xl">
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-1.5 border border-slate-200/20">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Busque por modelo ou peça: ex. iPhone 13, A03, Moto G22, Note 12..."
                className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              >
                Buscar Peças
              </button>
            </div>
            {searchQuery && (
              <p className="text-xs text-emerald-400 mt-2">
                Filtrando catálogo por: "{searchQuery}". Role para baixo para ver os resultados.
              </p>
            )}
          </form>

          {/* Quick Contact & Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chamar no WhatsApp {STORE_PHONE_DISPLAY}</span>
            </a>
            <button
              onClick={onScrollToCatalog}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors whitespace-nowrap border border-slate-700/60 cursor-pointer"
            >
              <span>Explorar Todas as Categorias</span>
            </button>
          </div>
        </div>

        {/* 3 Proof / Trust points (unboxed) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 mt-12 border-t border-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Preço de Referência & Negociação</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                Tabela competitiva para técnicos. Valores podem ser negociados conforme quantidade do seu pedido.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Garantia para Assistência</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                Peças selecionadas com garantia de bancada para teste antes da colagem final.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Atendimento Rápido no WhatsApp</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                Envie sua lista de compras ou monte seu carrinho no site e confirme estoque no WhatsApp (11) 99989-3780.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
