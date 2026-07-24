import React from "react";
import { Project } from "../types";
import { History, Clock, FileText } from "lucide-react";

interface HistoryLogModalProps {
  project: Project;
  onClose: () => void;
}

export const HistoryLogModal: React.FC<HistoryLogModalProps> = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Historial de Cambios</h2>
              <p className="text-xs text-slate-400">Registro automático de modificaciones de la versión actual</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg">
            ✕
          </button>
        </div>

        {/* History Log Timeline */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {(!project.history || project.history.length === 0) ? (
            <p className="text-xs text-slate-500 text-center py-6">No hay registros de cambios aún.</p>
          ) : (
            project.history.map((item, index) => (
              <div key={item.id || index} className="relative pl-6 pb-4 border-l border-slate-800 last:border-0 last:pb-0">
                <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-slate-900" />

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-indigo-300">{item.action}</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                  </div>
                  {item.details && <p className="text-xs text-slate-300 leading-relaxed">{item.details}</p>}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
