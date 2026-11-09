import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle, ExternalLink, Database, AlertCircle } from 'lucide-react';

interface LiveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncLiveData: () => Promise<void>;
  isSyncing: boolean;
  totalItems: number;
}

export const LiveSyncModal: React.FC<LiveSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncLiveData,
  isSyncing,
  totalItems
}) => {
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSync = async () => {
    try {
      setSyncStatus('Carregando dados das abas do Google Sheets...');
      await onSyncLiveData();
      setSyncStatus('Sincronização concluída com sucesso!');
      setTimeout(() => setSyncStatus(null), 3500);
    } catch {
      setSyncStatus('Erro ao conectar com Google Sheets. Mantendo base em cache.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 text-slate-900 dark:text-slate-100"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Integração com Google Sheets
            </h3>
            <p className="text-xs text-slate-500">Planilha Catálogo_CoronelParts</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Este catálogo interativo foi construído diretamente a partir da planilha pública fornecida. O aplicativo já carrega instantaneamente com alta performance todos os <strong>{totalItems.toLocaleString('pt-BR')} itens</strong>.
        </p>

        {/* Sheet Quote Note */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 mb-5">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="italic">
              "Os preços são uma referência e podem ser negociados conforme o seu pedido. Confirme também a disponibilidade dos itens — é só mandar sua lista no WhatsApp."
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span>Telas & Displays</span>
            <span className="font-mono font-semibold tabular-nums">1.288 peças</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span>Baterias Foxconn / Premium</span>
            <span className="font-mono font-semibold tabular-nums">277 peças</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span>Placas de Carga (Dock)</span>
            <span className="font-mono font-semibold tabular-nums">326 peças</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span>Componentes, Flex, Câmeras & Tampas</span>
            <span className="font-mono font-semibold tabular-nums">3.592 peças</span>
          </div>
        </div>

        {syncStatus && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Atualizando...' : 'Recarregar Planilha Online'}</span>
          </button>

          <a
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRcHTVJw6SrIt2sQQBa0JgSZQFU4VsIarduz1wo-cE8ia3jkFGpnYnJin719jUSmB4WU5KxOTVVHizF/pubhtml#gid=1017962458"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <span>Ver Planilha</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
