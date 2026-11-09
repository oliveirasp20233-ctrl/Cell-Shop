import React from 'react';
import { MessageSquare, Phone, MapPin, ExternalLink } from 'lucide-react';
import { STORE_NAME, STORE_PHONE_DISPLAY, getGeneralWhatsAppLink } from '../utils/whatsapp';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenSyncModal: () => void;
  onOpenHistory?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop, onOpenSyncModal, onOpenHistory }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-lg font-display mb-3">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>{STORE_NAME}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mb-4">
              Distribuição e fornecimento de peças de reposição, telas frontais com aro e sem aro, baterias de alto rendimento, conectores de carga e componentes técnicos para assistência técnica de smartphones.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>São Paulo - SP · Envios e entregas rápidas</span>
            </div>
          </div>

          {/* Col 2: Atendimento WhatsApp */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Central de Atendimento
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp: {STORE_PHONE_DISPLAY}</span>
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contato direto: 11 99989-3780</span>
                </span>
              </li>
              <li className="text-slate-400 pt-1">
                Segunda a Sexta: 08:30 às 18:00
              </li>
              <li className="text-slate-400">
                Sábado: 08:30 às 13:00
              </li>
            </ul>
          </div>

          {/* Col 3: Planilha & Transparência */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Origem dos Dados
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Tabela de referência integrada à planilha CoronelParts com atualização contínua de preços e peças.
            </p>
            <div className="space-y-2">
              {onOpenHistory && (
                <button
                  onClick={onOpenHistory}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Histórico de Orçamentos</span>
                </button>
              )}
              <button
                onClick={onOpenSyncModal}
                className="text-xs text-slate-400 hover:text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Sincronização & Informações</span>
              </button>
              <a
                href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRcHTVJw6SrIt2sQQBa0JgSZQFU4VsIarduz1wo-cE8ia3jkFGpnYnJin719jUSmB4WU5KxOTVVHizF/pubhtml#gid=1017962458"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                <span>Abrir Planilha Original</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Quiet bottom copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {STORE_NAME}. Todos os direitos reservados.</p>
          <button
            onClick={onScrollToTop}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Voltar ao topo ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
