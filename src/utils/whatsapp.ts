import { CartItem, Product } from '../types';

export const STORE_PHONE = '5511999893780';
export const STORE_PHONE_DISPLAY = '(11) 99989-3780';
export const STORE_NAME = 'CONECTA CELL SHOP';

/**
 * Creates a direct WhatsApp link for general contact
 */
export function getGeneralWhatsAppLink(): string {
  const text = encodeURIComponent(
    `Olá ${STORE_NAME}! Gostaria de tirar dúvidas sobre peças e disponibilidade de estoque.`
  );
  return `https://wa.me/${STORE_PHONE}?text=${text}`;
}

/**
 * Creates a WhatsApp link to quote or buy a specific product
 */
export function getProductWhatsAppLink(product: Product): string {
  const priceInfo = product.hasPrice ? `por ${product.priceFormatted}` : 'para cotação';
  const text = encodeURIComponent(
    `Olá ${STORE_NAME}! Tenho interesse no seguinte item do catálogo:\n\n` +
    `📦 *Produto:* ${product.name}\n` +
    `🏷️ *Categoria:* ${product.category}\n` +
    `📱 *Marca/Modelo:* ${product.brand} - ${product.compatibility}\n` +
    `💰 *Valor de Referência:* ${product.priceFormatted}\n\n` +
    `Gostaria de confirmar a disponibilidade e prazo de envio/retirada.`
  );
  return `https://wa.me/${STORE_PHONE}?text=${text}`;
}

/**
 * Creates a WhatsApp link for a batch cart order / budget quote
 */
export function getCartOrderWhatsAppLink(
  items: CartItem[],
  customerInfo?: { name?: string; storeName?: string; city?: string; notes?: string }
): string {
  const total = items.reduce((sum, item) => sum + (item.product.hasPrice ? item.product.price * item.quantity : 0), 0);
  const itemsText = items
    .map((item, idx) => {
      const p = item.product;
      const unit = p.hasPrice ? p.priceFormatted : 'Sob Consulta';
      const sub = p.hasPrice ? `R$ ${(p.price * item.quantity).toFixed(2).replace('.', ',')}` : 'Sob Consulta';
      return `${idx + 1}. *${p.name}*\n   Qtd: ${item.quantity}x | Unit: ${unit} | Subtotal: ${sub}`;
    })
    .join('\n\n');

  let message = `🛒 *NOVO PEDIDO / ORÇAMENTO - ${STORE_NAME}*\n\n`;

  if (customerInfo?.name) {
    message += `👤 *Cliente:* ${customerInfo.name}\n`;
  }
  if (customerInfo?.storeName) {
    message += `🏢 *Assistência / Loja:* ${customerInfo.storeName}\n`;
  }
  if (customerInfo?.city) {
    message += `📍 *Cidade / Região:* ${customerInfo.city}\n`;
  }
  if (customerInfo?.notes) {
    message += `📝 *Observações:* ${customerInfo.notes}\n`;
  }

  message += `\n📋 *ITENS SOLICITADOS (${items.length}):*\n`;
  message += `${itemsText}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 *VALOR TOTAL ESTIMADO:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
  message += `_(Preços sujeitos a confirmação de disponibilidade e negociação por quantidade)_\n\n`;
  message += `Por favor, confirmem os valores finais e as opções de pagamento / envio. Obrigado!`;

  return `https://wa.me/${STORE_PHONE}?text=${encodeURIComponent(message)}`;
}
