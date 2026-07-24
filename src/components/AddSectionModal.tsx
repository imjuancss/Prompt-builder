import React, { useState } from "react";
import { DEFAULT_SECTION_TYPES } from "../data/presets";
import { SectionType } from "../types";
import { Plus, LayoutGrid, Check, Sparkles } from "lucide-react";

interface AddSectionModalProps {
  onAddSection: (sectionData: {
    type: SectionType;
    title: string;
    description: string;
    contentObjective: string;
    keyElements: string[];
    copyDraft: { headline: string; subheadline: string; ctaText: string; secondaryCtaText?: string; bulletPoints?: string[] };
  }) => void;
  onClose: () => void;
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  onAddSection,
  onClose,
}) => {
  const [selectedType, setSelectedType] = useState<SectionType | "custom">("hero");

  // Custom Form Fields if custom or for fine tuning
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customObjective, setCustomObjective] = useState("");

  const handleSelectTemplate = (type: SectionType) => {
    const tmpl = DEFAULT_SECTION_TYPES.find((t) => t.type === type);
    if (!tmpl) return;

    onAddSection({
      type: tmpl.type,
      title: tmpl.title,
      description: tmpl.description,
      contentObjective: tmpl.contentObjective,
      keyElements: tmpl.defaultElements,
      copyDraft: tmpl.defaultCopy,
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    onAddSection({
      type: "custom",
      title: customTitle.trim(),
      description: customDesc.trim() || "Sección personalizada según requerimientos de la landing page.",
      contentObjective: customObjective.trim() || "Capturar la atención del cliente con contenido dedicado.",
      keyElements: ["Componente personalizado con jerarquía clara", "Llamado a la acción o bloque informativo"],
      copyDraft: {
        headline: customTitle.trim(),
        subheadline: customDesc.trim() || "Subtítulo descriptivo de la sección.",
        ctaText: "Saber Más",
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl w-full my-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Agregar Nueva Sección a la Landing Page</h2>
              <p className="text-xs text-slate-400">Selecciona un patrón de sección optimizado por conversión</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-lg">
            ✕
          </button>
        </div>

        {/* Section Grid Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
          {DEFAULT_SECTION_TYPES.map((sec) => (
            <button
              key={sec.type}
              onClick={() => handleSelectTemplate(sec.type)}
              className="text-left p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition space-y-2 group relative flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-md">
                  {sec.type}
                </span>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition pt-1">
                  {sec.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                  {sec.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end text-[11px] text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Agregar Sección →</span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Section Toggle Form */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">¿Necesitas un tipo de sección diferente?</span>
            <button
              onClick={() => setSelectedType(selectedType === "custom" ? "hero" : "custom")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
            >
              {selectedType === "custom" ? "Ver Secciones Prediseñadas" : "Crear Sección Personalizada"}
            </button>
          </div>

          {selectedType === "custom" && (
            <form onSubmit={handleCustomSubmit} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Detalles de la Sección Personalizada</span>
              </h4>

              <div className="space-y-2">
                <input
                  type="text"
                  required
                  placeholder="Nombre de la sección (Ej: Calculadora Interactiva de ROI, Mapa de Casos)..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="text"
                  placeholder="Descripción y propósito visual..."
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="text"
                  placeholder="Objetivo principal de conversión para esta sección..."
                  value={customObjective}
                  onChange={(e) => setCustomObjective(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Agregar Sección Personalizada
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
