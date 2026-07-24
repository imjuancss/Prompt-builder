import React, { useState } from "react";
import { Project } from "../types";
import { buildGlobalProjectPrompt } from "../utils/promptGenerator";
import { Layers, Copy, Check, Info } from "lucide-react";

interface GlobalPromptModalProps {
  project: Project;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const GlobalPromptModal: React.FC<GlobalPromptModalProps> = ({
  project,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const promptText = buildGlobalProjectPrompt(project);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    onShowToast("¡Prompt Global del proyecto copiado al portapapeles!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full my-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Prompt Global del Proyecto</h2>
              <p className="text-xs text-slate-400">Contexto del Sistema de Diseño y Arquitectura General para la IA</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg">
            ✕
          </button>
        </div>

        <div className="p-3 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl flex items-start gap-2 text-xs text-indigo-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Pega este Prompt Global primero en tu herramienta de IA o modelo para fijar la paleta de colores, fuentes, tono y mapa de secciones antes de pedir los componentes individuales.
          </p>
        </div>

        {/* Prompt Output Code Box */}
        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-4 max-h-[50vh] overflow-y-auto">
          <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {promptText}
          </pre>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
          <span className="text-xs text-slate-400">
            {project.sections.length} Secciones configuradas
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
            >
              Cerrar
            </button>
            <button
              onClick={handleCopy}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Prompt Global</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
