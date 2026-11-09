import React, { useState } from 'react';
import { X, History, MessageSquare, ShoppingBag, Copy, Check, Trash2, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react';
import { SavedOrder, CartItem } from '../types';
import { STORE_PHONE_DISPLAY, getCartOrderWhatsAppLink } from '../utils/whatsapp';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: SavedOrder[];
  onLoadOrderToCart: (items: CartItem[]) => void;
  onDeleteOrder: (orderId: string) => void;
  onClearAllHistory: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onLoadOrderToCart,
  onDeleteOrder,
  onClearAllHistory
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedOrderId(prev => (prev === id ? null : id));
  };

  const handleCopyOrder = (order: SavedOrder) => {
    const lines = order.items.map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (Qtd: ${item.quantity}x) - ${
          item.product.hasPrice
            ? `R$ ${(item.product.price * item.quantity).toFixed(2).replace('.', ',')}`
            : 'Sob Consulta'
        }`
    );
    let text = `📦 Orçamento ${order.id} - CONECTA CELL SHOP\nData: ${order.formattedDate}\n`;
    if (order.customerInfo?.name) text += `Cliente: ${order.customerInfo.name}\n`;
    if (order.customerInfo?.storeName) text += `Loja: ${order.customerInfo.storeName}\n`;
    text += `\nItens:\n${lines.join('\n')}\n\nTotal estimado: R$ ${order.total.toFixed(2).replace('.', ',')}`;

    navigator.clipboard.writeText(text);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Histórico de Orçamentos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registros dos pedidos gerados e enviados para o WhatsApp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {orders.length > 0 && (
              <button
                onClick={onClearAllHistory}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                title="Limpar todo o histórico salvo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpar Tudo</span>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white font-display mb-1">
                Nenhum orçamento registrado ainda
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
                Quando você adicionar peças ao carrinho e clicar em "Enviar Pedido no WhatsApp", uma cópia do orçamento será arquivada automaticamente no seu navegador para consultas futuras e recompras rápidas.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 dark:bg-emerald-600 text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Explorar Catálogo de Peças
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const whatsAppLink = getCartOrderWhatsAppLink(order.items, order.customerInfo);
              const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  {/* Summary Bar */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{order.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{order.formattedDate}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Enviado ao WhatsApp</span>
                      </div>

                      {order.customerInfo?.name || order.customerInfo?.storeName ? (
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {order.customerInfo.name && <span>{order.customerInfo.name}</span>}
                          {order.customerInfo.storeName && (
                            <span> ({order.customerInfo.storeName})</span>
                          )}
                          {order.customerInfo.city && (
                            <span className="text-slate-400"> · {order.customerInfo.city}</span>
                          )}
                        </div>
                      ) : null}

                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        <span>{itemsCount} {itemsCount === 1 ? 'peça solicitada' : 'peças solicitadas'} ({order.items.length} {order.items.length === 1 ? 'modelo' : 'modelos'})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-400 block">Total Estimado</span>
                        <span className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title={isExpanded ? 'Recolher detalhes' : 'Ver peças'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Items Details */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40">
                      <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Itens do Orçamento:
                      </h5>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => {
                          const p = item.product;
                          const subtotal = p.hasPrice
                            ? `R$ ${(p.price * item.quantity).toFixed(2).replace('.', ',')}`
                            : 'Sob Consulta';

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0"
                            >
                              <div className="min-w-0 pr-2">
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                                  {p.name}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {p.brand} · {p.category}
                                </span>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-mono text-slate-600 dark:text-slate-400">
                                  {item.quantity}x {p.hasPrice ? p.priceFormatted : ''} ={' '}
                                </span>
                                <span className="font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                                  {subtotal}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {order.customerInfo?.notes && (
                        <div className="mb-4 p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-slate-400 block mb-0.5">Observações:</span>
                          <p>{order.customerInfo.notes}</p>
                        </div>
                      )}

                      {/* Action buttons for this order */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <a
                          href={whatsAppLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Reenviar no WhatsApp ({STORE_PHONE_DISPLAY})</span>
                        </a>

                        <button
                          onClick={() => {
                            onLoadOrderToCart(order.items);
                            onClose();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Adicionar Itens ao Carrinho Atual</span>
                        </button>

                        <button
                          onClick={() => handleCopyOrder(order)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedOrderId === order.id ? 'Copiado!' : 'Copiar Texto'}</span>
                        </button>

                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer ml-auto"
                          title="Excluir este orçamento do histórico"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info note */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Dados armazenados com segurança no navegador local</span>
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:underline cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
