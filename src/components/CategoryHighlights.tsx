import React from 'react';
import { Smartphone, BatteryCharging, Cpu, Shield, ArrowRight } from 'lucide-react';
import { CATEGORY_METADATA } from '../data/categoryImages';

interface CategoryHighlightsProps {
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
  categoryCounts: Record<string, number>;
}

export const CategoryHighlights: React.FC<CategoryHighlightsProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts
}) => {
  const cards = [
    {
      key: 'Telas & Displays',
      meta: CATEGORY_METADATA['Telas & Displays'],
      icon: <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    },
    {
      key: 'Baterias',
      meta: CATEGORY_METADATA['Baterias'],
      icon: <BatteryCharging className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    },
    {
      key: 'Placas de Carga (Dock)',
      meta: CATEGORY_METADATA['Placas de Carga (Dock)'],
      icon: <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    },
    {
      key: 'Tampas Traseiras',
      meta: CATEGORY_METADATA['Tampas Traseiras'],
      icon: <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
    }
  ];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-1">
              Principais Linhas de Reposição
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Categorias em Destaque
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('Todos')}
            className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Ver catálogo completo (5.400+ itens)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => {
            const count = categoryCounts[c.key] || 0;
            const isSelected = activeCategory === c.key;

            return (
              <div
                key={c.key}
                onClick={() => onSelectCategory(c.key)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-white dark:bg-slate-900 p-5 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  {c.meta.image ? (
                    <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 mb-4">
                      <img
                        src={c.meta.image}
                        alt={c.meta.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-4">
                      {c.icon}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>{c.meta.badge}</span>
                    <span className="font-mono tabular-nums">{count} itens</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1.5">
                    {c.meta.name}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {c.meta.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Filtrar esta categoria</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
