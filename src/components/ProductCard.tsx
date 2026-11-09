import React from 'react';
import { ShoppingBag, MessageSquare, Info, Smartphone, Battery, Cpu, Shield, Layers, Camera, Volume2, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { getProductWhatsAppLink } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenDetails: (product: Product) => void;
  isInCart: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetails,
  isInCart
}) => {
  const getCategoryIcon = () => {
    switch (product.category) {
      case 'Telas & Displays':
        return <Smartphone className="w-5 h-5" />;
      case 'Baterias':
        return <Battery className="w-5 h-5" />;
      case 'Placas de Carga (Dock)':
        return <Cpu className="w-5 h-5" />;
      case 'Tampas Traseiras':
        return <Shield className="w-5 h-5" />;
      case 'Câmeras & Lentes':
        return <Camera className="w-5 h-5" />;
      case 'Alto-falantes & Som':
        return <Volume2 className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  const getBrandBadgeColor = (brand: string) => {
    switch (brand) {
      case 'Apple':
        return 'text-slate-800 dark:text-slate-200';
      case 'Samsung':
        return 'text-blue-600 dark:text-blue-400';
      case 'Motorola':
        return 'text-indigo-600 dark:text-indigo-400';
      case 'Xiaomi':
        return 'text-orange-600 dark:text-orange-400';
      case 'Realme':
        return 'text-amber-600 dark:text-amber-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700">
      <div>
        {/* Top visual banner with Category Icon and Brand */}
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors">
              {getCategoryIcon()}
            </div>
            {/* Clean unboxed metadata */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span className={`font-semibold ${getBrandBadgeColor(product.brand)}`}>{product.brand}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="truncate max-w-[120px] inline-block align-bottom">{product.category}</span>
            </div>
          </div>

          <button
            onClick={() => onOpenDetails(product)}
            title="Ver detalhes técnicos"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-1"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onOpenDetails(product)}
          className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white line-clamp-2 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors leading-snug mb-2"
        >
          {product.name}
        </h3>

        {/* Quality text labels (clean text, no pill sandwiches) */}
        {product.qualities.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mb-3">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>{product.qualities.join(' · ')}</span>
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>
      </div>

      <div>
        {/* Price & Status Section */}
        <div className="flex items-baseline justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 mb-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              {product.hasPrice ? 'Valor de referência' : 'Disponibilidade'}
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {product.priceFormatted}
            </span>
          </div>

          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            {product.hasPrice ? 'Sob consulta de lote' : 'Consulte no WhatsApp'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={getProductWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors text-center whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
            <span>Cotar WhatsApp</span>
          </a>

          <button
            onClick={() => onAddToCart(product)}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              isInCart
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>{isInCart ? 'No Pedido' : '+ Pedido'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
