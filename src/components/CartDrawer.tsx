import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageSquare, Copy, Check, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { STORE_PHONE_DISPLAY, getCartOrderWhatsAppLink } from '../utils/whatsapp';
import { History } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onSendOrder: (
    items: CartItem[],
    customerInfo: { name?: string; storeName?: string; city?: string; notes?: string },
    total: number
  ) => void;
  onOpenHistory: () => void;
  savedOrdersCount: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSendOrder,
  onOpenHistory,
  savedOrdersCount
}) => {
  const [customerName, setCustomerName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + (item.product.hasPrice ? item.product.price * item.quantity : 0),
    0
  );

  const handleCopyList = () => {
    const textLines = items.map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (Qtd: ${item.quantity}x) - ${
          item.product.hasPrice
            ? `R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}`
            : 'Sob Consulta'
        }`
    );
    const text = `Lista de Orçamento CONECTA CELL SHOP:\n\n${textLines.join('\n')}\n\nTotal estimado: R$ ${total.toFixed(2).replace('.', ',')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsAppLink = getCartOrderWhatsAppLink(items, {
    name: customerName,
    storeName,
    city,
    notes
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-900 dark:text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Lista de Orçamento
              </h3>
              <span className="text-xs text-slate-500 font-mono tabular-nums">
                ({items.length})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {savedOrdersCount > 0 && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenHistory();
                  }}
                  className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer"
                  title="Ver orçamentos anteriores salvos"
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Histórico</span>
                  <span className="font-mono tabular-nums">({savedOrdersCount})</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">
                Sua lista está vazia
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                Navegue pelas telas, baterias e conectores de carga e clique em "+ Pedido" para montar sua cotação rápida.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Voltar ao Catálogo
                </button>
                {savedOrdersCount > 0 && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenHistory();
                    }}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Ver Histórico de Orçamentos ({savedOrdersCount})</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => {
                  const p = item.product;
                  const itemTotal = p.hasPrice
                    ? `R$ ${(p.price * item.quantity).toFixed(2).replace('.', ',')}`
                    : 'Sob Consulta';

                  return (
                    <div key={p.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-slate-400 font-medium">
                          {p.brand} · {p.category}
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {p.name}
                        </h4>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium mt-0.5">
                          {p.hasPrice ? p.priceFormatted : 'Sob Consulta'} cada
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md">
                          <button
                            onClick={() => onUpdateQuantity(p.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold font-mono tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(p.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                            {itemTotal}
                          </span>
                          <button
                            onClick={() => onRemoveItem(p.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer p-0.5"
                            title="Remover item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Buyer Information Section */}
                <div className="pt-4 space-y-2.5">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white font-display">
                    Identificação para Atendimento (Opcional)
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Loja / Assistência"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Bairro / Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Observações (ex: preferências de cores, prazo urgente)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Footer / Submission */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total Estimado</span>
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Preços de atacado sujeitos a negociação e confirmação de estoque no momento do envio.
                </p>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      onSendOrder(items, { name: customerName, storeName, city, notes }, total);
                    }}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md text-center active:scale-98"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Enviar Pedido no WhatsApp {STORE_PHONE_DISPLAY}</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyList}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Lista Copiada!' : 'Copiar Texto da Lista'}</span>
                    </button>

                    <button
                      onClick={onClearCart}
                      className="p-2 text-slate-400 hover:text-red-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Limpar todos os itens"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
