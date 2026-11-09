import React, { useEffect, useState } from 'react';
import { X, MessageSquare, ShoppingBag, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { getProductWhatsAppLink } from '../utils/whatsapp';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isInCart: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isInCart
}) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-slate-100"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar detalhes"
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Unboxed Metadata Header */}
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase mb-2">
          <span>{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span>{product.category}</span>
          {product.qualities.length > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span>{product.qualities.join(' / ')}</span>
            </>
          )}
        </div>

        {/* Product Title */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display mb-3">
          {product.name}
        </h2>

        {/* Price & Ref Note */}
        <div className="flex items-baseline gap-3 pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
            {product.priceFormatted}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {product.hasPrice ? '(Preço de referência em atacado)' : '(Consulte valor e disponibilidade)'}
          </span>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Descrição Técnica
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Specifications grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 mb-6 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Compatibilidade</span>
            <span className="font-semibold text-slate-900 dark:text-white">{product.compatibility}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Marca Fabricante</span>
            <span className="font-semibold text-slate-900 dark:text-white">{product.brand}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Categoria</span>
            <span className="font-semibold text-slate-900 dark:text-white">{product.category}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Disponibilidade</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Em Estoque / Catálogo</span>
          </div>
        </div>

        {/* Technician bench notice */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 mb-6 text-xs text-blue-900 dark:text-blue-200">
          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Recomendação Técnica de Bancada:</p>
            <p className="mt-0.5 text-blue-800/90 dark:text-blue-300">
              Sempre realize o teste prévio da peça (imagem, toque, consumo de carga) antes de retirar os lacres de proteção ou aplicar cola.
            </p>
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-lg p-1 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-semibold text-sm cursor-pointer"
            >
              -
            </button>
            <span className="px-4 text-sm font-bold font-mono tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-semibold text-sm cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              onAddToCart(product, quantity);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 transition-colors shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isInCart ? 'Atualizar Pedido' : 'Adicionar ao Pedido'}</span>
          </button>

          <a
            href={getProductWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm text-center"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Cotar no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
