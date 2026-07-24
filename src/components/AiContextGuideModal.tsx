import React, { useState } from "react";
import { AI_PROMPT_COGNITIVE_GUIDE, BENCHMARK_EXAMPLES } from "../data/aiPromptContext";
import { IMPECCABLE_CRAFT_DIRECTIVES } from "../utils/promptGenerator";
import { Cpu, BookOpen, Copy, Check, Search, Sparkles, Layers, Code, Zap, X, ShieldCheck, Palette, Scale, Sliders } from "lucide-react";

interface AiContextGuideModalProps {
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const AiContextGuideModal: React.FC<AiContextGuideModalProps> = ({
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<"guide" | "examples" | "llm_behavior" | "impeccable">("impeccable");
  const [selectedExampleId, setSelectedExampleId] = useState<string>(BENCHMARK_EXAMPLES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedExample =
    BENCHMARK_EXAMPLES.find((ex) => ex.id === selectedExampleId) || BENCHMARK_EXAMPLES[0];

  const filteredExamples = BENCHMARK_EXAMPLES.filter(
    (ex) =>
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast(`¡${label} copiado al portapapeles!`);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-5xl w-full my-6 space-y-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-cyan-400 flex items-center justify-center shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Guía de Contexto & Prompts para IA</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full">
                  LLM Execution Spec
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cómo leen los modelos de IA los prompts y biblioteca de ejemplos de reproducción Awwwards
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 gap-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("impeccable")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                activeTab === "impeccable"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>💎 Impeccable Craft (Paul Bakaus)</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shrink-0 ${
                activeTab === "guide"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>🧠 Arquitectura Cognitiva LLM</span>
            </button>

            <button
              onClick={() => setActiveTab("examples")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shrink-0 ${
                activeTab === "examples"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📚 Prompts Benchmark ({BENCHMARK_EXAMPLES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("llm_behavior")}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shrink-0 ${
                activeTab === "llm_behavior"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>⚡ Comportamiento IA</span>
            </button>
          </div>

          {activeTab === "examples" && (
            <button
              onClick={() => handleCopyText(selectedExample.fullPromptText, `Prompt ${selectedExample.title}`)}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copiar Prompt Seleccionado</span>
            </button>
          )}

          {activeTab === "impeccable" && (
            <button
              onClick={() => handleCopyText(IMPECCABLE_CRAFT_DIRECTIVES, "Regulación de Diseño Impeccable")}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copiar Directivas Impeccable</span>
            </button>
          )}
        </div>

        {/* TAB: IMPECCABLE CRAFT (PAUL BAKAUS) */}
        {activeTab === "impeccable" && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs text-slate-300">
            {/* Banner Header */}
            <div className="p-4 bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/30 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">Estándar de Diseño Impeccable (by Paul Bakaus)</h3>
                  <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] rounded-full font-semibold">
                    Anti-Slop UI Spec
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Impeccable es el protocolo de generación UI más avanzado para eliminar clichés de IA (gradientes púrpura/azul genéricos, tarjetas anidadas, textos repetitivos de SaaS) introduciendo matemáticas exactas de bordes, proporciones de botones y reglas WCAG AA.
                </p>
              </div>
            </div>

            {/* Key Pillar Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <Palette className="w-4 h-4" />
                  <span>1. Regla Anti-Slop Visual</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Cero gradientes cliché púrpura/azul, cero tarjetas dentro de tarjetas, sin verbos trillados de SaaS ("supercharge", "empower").
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Scale className="w-4 h-4" />
                  <span>2. Radio Anidado: r_in = r_out - p</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  El radio interno del elemento hijo equivale al radio exterior menos el padding. Previene esquinas que chocan visualmente.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Sliders className="w-4 h-4" />
                  <span>3. Ratio de Botón px = 2 * py</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  El padding horizontal del botón es siempre el doble del vertical (<code className="text-emerald-300">px-5 py-2.5</code>). Labels en 1 línea.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>4. Contraste & WCAG AA</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Neutros con &lt;5% saturación, contraste mínimo 4.5:1 en cuerpo y límite de 65-75 caracteres por línea (<code className="text-indigo-300">max-w-[65ch]</code>).
                </p>
              </div>
            </div>

            {/* Directives Raw Text Code Block */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span>Directiva Inyectada Automáticamente en Todos tus Prompts</span>
                </span>
                <button
                  onClick={() => handleCopyText(IMPECCABLE_CRAFT_DIRECTIVES, "Directivas de Craft Impeccable")}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar Directivas</span>
                </button>
              </div>

              <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto">
                {IMPECCABLE_CRAFT_DIRECTIVES}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 1: COGNITIVE GUIDE */}
        {activeTab === "guide" && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="p-4 bg-indigo-950/30 border border-indigo-500/20 rounded-2xl flex items-start gap-3 text-xs text-indigo-300">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">Principios de Atención en Modelos de Lenguaje para Código</p>
                <p className="leading-relaxed text-slate-300">
                  Los modelos LLM (Gemini, Claude, GPT-4o) asignan mayor peso de atención a parámetros numéricos específicos, vectores de keyframes de Framer Motion, coordenadas exactas de Z-Index y bloques declarativos de código sobre instrucciones descriptivas abstractas.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 overflow-y-auto max-h-[50vh]">
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {AI_PROMPT_COGNITIVE_GUIDE}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleCopyText(AI_PROMPT_COGNITIVE_GUIDE, "Guía de Arquitectura Cognitiva")}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>Copiar Guía Cognitiva</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: BENCHMARK EXAMPLES */}
        {activeTab === "examples" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden flex-1">
            {/* Sidebar list of examples */}
            <div className="lg:col-span-4 flex flex-col space-y-3 overflow-y-auto pr-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar ejemplo benchmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[420px]">
                {filteredExamples.map((ex) => {
                  const isSelected = ex.id === selectedExampleId;
                  return (
                    <div
                      key={ex.id}
                      onClick={() => setSelectedExampleId(ex.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col space-y-1.5 ${
                        isSelected
                          ? "bg-indigo-950/60 border-indigo-500/50 shadow-md"
                          : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 truncate max-w-[180px]">
                          {ex.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{ex.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {ex.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prompt Code Display */}
            <div className="lg:col-span-8 flex flex-col space-y-3 bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedExample.title}</h3>
                  <span className="text-[10px] text-cyan-400">{selectedExample.category}</span>
                </div>

                <button
                  onClick={() =>
                    handleCopyText(selectedExample.fullPromptText, `Prompt ${selectedExample.title}`)
                  }
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded-lg transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar Texto</span>
                </button>
              </div>

              <div className="overflow-y-auto flex-1 max-h-[380px]">
                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedExample.fullPromptText}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LLM BEHAVIOR ANALYSIS */}
        {activeTab === "llm_behavior" && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs leading-relaxed text-slate-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Code className="w-4 h-4" />
                  <span>1. Parseo de Código Verbatim vs Prosa</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Cuando se incluye código CSS, arrays de keyframe de Framer Motion o estructuras JSX dentro del prompt, los LLMs cambian su modo de decodificación de "generación creativa" a "ejecución de especificación estricta". Esto elimina la improvisación de maquetación.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Layers className="w-4 h-4" />
                  <span>2. Jerarquía de Capas Z-Index</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Al declarar explícitamente los niveles de capas (z-0 fondo, z-10 contenido, z-20 stickers/badging, z-50 navegación fija), la IA no comete errores de solapamiento u ocultamiento de elementos interactivos.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Mapeo de Assets CDN</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Definir una constante objeto de URLs CDN previene alucinaciones donde el LLM inventa componentes vacíos o rutas relativas inexistentes. Cada imagen o video tiene un identificador exacto.
                </p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>4. Timings y Curvas Bezier</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Pasar curvas de aceleración como <code className="bg-slate-900 px-1 rounded text-amber-300">[0.22, 1, 0.36, 1]</code> fuerzan al motor de animación a replicar físicas de diseño editorial de grado Awwwards.
                </p>
              </div>
            </div>

            <div className="p-4 bg-indigo-950/40 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
              <span className="text-xs text-indigo-300 font-medium">
                ¿Listo para usar estos patrones en tus prompts?
              </span>
              <button
                onClick={() => setActiveTab("examples")}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
              >
                Ver Prompts Ejemplo
              </button>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            Optimizado para Gemini 1.5/2.0, Claude 3.5 Sonnet, GPT-4o y AI Studio Build
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};
