import React, { useState } from "react";
import { ConversionVariables, DesignTone, LayoutPattern, SocialProofDensity, OutputFramework, Project } from "../types";
import { Sliders, Target, Sparkles, Check, HelpCircle } from "lucide-react";

interface ConversionVarsModalProps {
  project: Project;
  onSaveConversionVars: (vars: ConversionVariables) => void;
  onClose: () => void;
}

const TONE_OPTIONS: DesignTone[] = [
  "Minimalista Clean",
  "SaaS Tech / Moderno",
  "B2B Enterprise Corporate",
  "High-Conversion Direct Response",
  "Dark Mode Luxury & Neon",
  "Playful, Creativo & Bold",
  "Editorial & Elegante",
];

const LAYOUT_OPTIONS: LayoutPattern[] = [
  "F-Pattern (Lectura Fluida)",
  "Z-Pattern (Narrativa Visual)",
  "Bento Grid 3x3",
  "Split 50/50 Asimétrico",
  "Centered Minimalist Impact",
];

const PROOF_OPTIONS: SocialProofDensity[] = [
  "Alta (Testimonios + Logos + Métricas + Badges)",
  "Media (Logos + Testimonios Clave)",
  "Sutil (Logos o Badges discretos)",
];

const FRAMEWORK_OPTIONS: OutputFramework[] = [
  "Tailwind CSS v4 + React + Lucide Icons",
  "Tailwind CSS + HTML5 / JS Vanilla",
  "Figma UI Kit & Design System Specs",
  "Framer Motion + React Components",
];

const TARGET_LLM_OPTIONS = [
  "Gemini (Google GenAI)",
  "Claude 3.5 Sonnet / Haiku (Anthropic)",
  "GPT-4o / ChatGPT (OpenAI)",
  "Cursor / v0 / Bolt (Code AI Assistant)",
  "Default / Genérico",
];

export const ConversionVarsModal: React.FC<ConversionVarsModalProps> = ({
  project,
  onSaveConversionVars,
  onClose,
}) => {
  const [vars, setVars] = useState<ConversionVariables>({
    ...project.conversionVars,
    targetLLM: project.conversionVars.targetLLM || "Gemini (Google GenAI)",
    interactivity: project.conversionVars.interactivity || "Transiciones suaves con Framer Motion, hover de tarjetas y micro-interacciones responsive",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConversionVars(vars);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Variables de Conversión y CRO</h2>
              <p className="text-xs text-slate-400">Ajusta los parámetros tácticos que guiarán la generación de prompts</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tone & Archetype */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Tono de Diseño y Arquetipo Visual
            </label>
            <select
              value={vars.tone}
              onChange={(e) => setVars({ ...vars, tone: e.target.value as DesignTone })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {TONE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Layout Pattern */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Patrón de Diseño y Lectura Predominante
            </label>
            <select
              value={vars.layoutPattern}
              onChange={(e) => setVars({ ...vars, layoutPattern: e.target.value as LayoutPattern })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {LAYOUT_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience & Goal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Público Objetivo (Buyer Persona)
              </label>
              <input
                type="text"
                placeholder="Ej: CEOs, Marketers B2B, Desarrolladores"
                value={vars.targetAudience}
                onChange={(e) => setVars({ ...vars, targetAudience: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Objetivo Principal de Conversión
              </label>
              <input
                type="text"
                placeholder="Ej: Registro gratuito, Agendar demo"
                value={vars.primaryGoal}
                onChange={(e) => setVars({ ...vars, primaryGoal: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Value Prop */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              Propuesta Única de Valor (UVP)
            </label>
            <textarea
              rows={2}
              placeholder="¿Qué problema resuelve tu producto y por qué es mejor que la competencia?"
              value={vars.valueProposition}
              onChange={(e) => setVars({ ...vars, valueProposition: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Target LLM & Interactivity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Modelo de IA Objetivo (Target LLM)
              </label>
              <select
                value={vars.targetLLM || "Gemini (Google GenAI)"}
                onChange={(e) => setVars({ ...vars, targetLLM: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {TARGET_LLM_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Framework Técnico para el Código
              </label>
              <select
                value={vars.framework}
                onChange={(e) => setVars({ ...vars, framework: e.target.value as OutputFramework })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {FRAMEWORK_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Social Proof & Interactivity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Densidad de Prueba Social Requerida
              </label>
              <select
                value={vars.socialProofDensity}
                onChange={(e) => setVars({ ...vars, socialProofDensity: e.target.value as SocialProofDensity })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {PROOF_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Nivel de Interactividad y Animaciones
              </label>
              <input
                type="text"
                placeholder="Ej: Animaciones fluidas con Framer Motion, microinteracciones responsive"
                value={vars.interactivity || ""}
                onChange={(e) => setVars({ ...vars, interactivity: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Conversion Toggles */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/20 to-indigo-950/20 cursor-pointer col-span-1 sm:col-span-2">
              <input
                type="checkbox"
                checked={vars.impeccableCraft !== false}
                onChange={(e) => setVars({ ...vars, impeccableCraft: e.target.checked })}
                className="rounded text-blue-600 focus:ring-0 mt-0.5"
              />
              <div className="flex flex-col space-y-0.5">
                <span className="text-xs text-white font-bold flex items-center gap-1.5">
                  <span>💎 Protocolo Impeccable UI Craft (by Paul Bakaus)</span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded font-mono font-semibold">
                    Anti-Slop Standard
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 leading-snug">
                  Inyecta matemáticas exactas de bordes anidados (r_in = r_out - p), proporciones de botones 2:1, legibilidad WCAG AA y eliminación estricta de clichés visuales.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={!!vars.urgencyTriggers}
                onChange={(e) => setVars({ ...vars, urgencyTriggers: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span className="text-xs text-slate-300 font-medium">Incluir Triggers de Urgencia/Escasez</span>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={!!vars.stickyCta}
                onChange={(e) => setVars({ ...vars, stickyCta: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span className="text-xs text-slate-300 font-medium">Recomendar CTA Flotante / Sticky Bar</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Variables CRO</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
