import React, { useState } from "react";
import { Project, Section, SectionStyleOverrides } from "../types";
import { buildSectionPrompt } from "../utils/promptGenerator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Sparkles,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sliders,
  History,
  Palette,
  Layers,
  Wand2,
  FileCode,
  Edit3,
  Lightbulb,
  ImageIcon,
  CheckCircle2,
  ArrowRight,
  Info,
  RefreshCw,
  Cpu,
  LayoutGrid,
  Pencil,
  Code,
  Zap,
} from "lucide-react";

/* --- VISUAL CARD CONFIGURATIONS FOR SECTION OVERRIDES --- */
export const getTextureBgStyle = (
  textureType?: "none" | "grid" | "dots",
  gridSize?: "small" | "medium" | "large",
  dotsSpacing?: "dense" | "normal" | "sparse"
): React.CSSProperties => {
  if (textureType === "grid") {
    let sizePx = "24px 24px";
    if (gridSize === "small") sizePx = "12px 12px";
    if (gridSize === "large") sizePx = "40px 40px";
    return {
      backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
      backgroundSize: sizePx,
    };
  }
  if (textureType === "dots") {
    let sizePx = "20px 20px";
    let dotRadius = "1.2px";
    if (dotsSpacing === "dense") {
      sizePx = "10px 10px";
      dotRadius = "1px";
    }
    if (dotsSpacing === "sparse") {
      sizePx = "36px 36px";
      dotRadius = "1.5px";
    }
    return {
      backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.22) ${dotRadius}, transparent ${dotRadius})`,
      backgroundSize: sizePx,
    };
  }
  return {};
};

const LAYOUT_VARIANTS = [
  {
    id: "Centered Focus",
    title: "Centered Focus",
    description: "Titular y contenido centrados en el eje vertical",
    renderPreview: () => (
      <div className="w-full h-11 bg-[#0D0D0D] rounded border border-[#222] p-1.5 flex flex-col items-center justify-center gap-1">
        <div className="w-10 h-1.5 bg-blue-500 rounded-full" />
        <div className="w-14 h-1 bg-[#444] rounded-full" />
        <div className="flex gap-1 mt-0.5">
          <div className="w-4 h-2.5 bg-[#1F1F1F] rounded border border-[#333]" />
          <div className="w-4 h-2.5 bg-[#1F1F1F] rounded border border-[#333]" />
          <div className="w-4 h-2.5 bg-[#1F1F1F] rounded border border-[#333]" />
        </div>
      </div>
    ),
  },
  {
    id: "Split 50/50",
    title: "Split 50/50",
    description: "Layout de 2 columnas (texto + media/preview)",
    renderPreview: () => (
      <div className="w-full h-11 bg-[#0D0D0D] rounded border border-[#222] p-1.5 flex items-center justify-between gap-1.5">
        <div className="flex-1 flex flex-col gap-1">
          <div className="w-full h-1.5 bg-blue-500 rounded-full" />
          <div className="w-3/4 h-1 bg-[#444] rounded-full" />
          <div className="w-6 h-2 bg-blue-600/60 rounded" />
        </div>
        <div className="w-10 h-full bg-[#1A1A1A] rounded border border-[#333] flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-blue-500/30 border border-blue-400/50" />
        </div>
      </div>
    ),
  },
  {
    id: "Bento Grid 3 Cols",
    title: "Bento Grid",
    description: "Grilla modular asimétrica de tarjetas",
    renderPreview: () => (
      <div className="w-full h-11 bg-[#0D0D0D] rounded border border-[#222] p-1 grid grid-cols-3 gap-1">
        <div className="col-span-2 bg-[#1A1A1A] rounded border border-[#333] p-1 flex flex-col justify-between">
          <div className="w-8 h-1.5 bg-blue-500 rounded-full" />
          <div className="w-full h-1 bg-[#444] rounded-full" />
        </div>
        <div className="col-span-1 bg-[#1A1A1A] rounded border border-[#333] flex flex-col justify-between p-1">
          <div className="w-full h-1 bg-[#444] rounded-full" />
          <div className="w-full h-2 bg-blue-600/40 rounded" />
        </div>
      </div>
    ),
  },
  {
    id: "Carousel / Slider",
    title: "Carousel / Slider",
    description: "Tarjetas horizontales desplegables",
    renderPreview: () => (
      <div className="w-full h-11 bg-[#0D0D0D] rounded border border-[#222] p-1 flex items-center gap-1 overflow-hidden">
        <div className="w-1/3 shrink-0 h-full bg-[#1A1A1A] rounded border border-[#333] p-1 flex flex-col justify-between">
          <div className="w-4 h-1 bg-blue-500 rounded-full" />
        </div>
        <div className="w-1/3 shrink-0 h-full bg-[#1A1A1A] rounded border border-blue-500 p-1 flex flex-col justify-between">
          <div className="w-5 h-1 bg-blue-400 rounded-full" />
        </div>
        <div className="w-1/3 shrink-0 h-full bg-[#1A1A1A] rounded border border-[#333] p-1 flex flex-col justify-between opacity-50">
          <div className="w-4 h-1 bg-[#444] rounded-full" />
        </div>
      </div>
    ),
  },
  {
    id: "Sticky Sidebar",
    title: "Sticky Sidebar",
    description: "Navegación fija izquierda + tarjetas",
    renderPreview: () => (
      <div className="w-full h-11 bg-[#0D0D0D] rounded border border-[#222] p-1 flex gap-1">
        <div className="w-1/3 h-full bg-blue-950/40 border border-blue-800/40 rounded p-1 flex flex-col gap-1">
          <div className="w-full h-1.5 bg-blue-400 rounded-full" />
          <div className="w-2/3 h-1 bg-blue-300/40 rounded-full" />
        </div>
        <div className="flex-1 h-full flex flex-col gap-1">
          <div className="w-full h-3.5 bg-[#1A1A1A] rounded border border-[#333]" />
          <div className="w-full h-3.5 bg-[#1A1A1A] rounded border border-[#333]" />
        </div>
      </div>
    ),
  },
];

const BG_STYLES = [
  {
    id: "Solid Surface",
    title: "Superficie Neutra",
    description: "Fondo oscuro/claro neutro refinado",
    renderPreview: () => (
      <div className="w-full h-10 rounded border border-[#333] bg-[#181818] p-2 flex items-center justify-between">
        <div className="w-12 h-1.5 bg-[#555] rounded" />
        <div className="w-3.5 h-3.5 rounded bg-[#222] border border-[#444]" />
      </div>
    ),
  },
  {
    id: "Solid Primary",
    title: "Color Primario",
    description: "Destacado vibrante con tono primario",
    renderPreview: () => (
      <div className="w-full h-10 rounded border border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 p-2 flex items-center justify-between">
        <div className="w-12 h-1.5 bg-white/90 rounded" />
        <div className="w-3.5 h-3.5 rounded bg-white/20 border border-white/40" />
      </div>
    ),
  },
  {
    id: "Dark Contrast",
    title: "Oscuro Contraste",
    description: "Negro alto impacto",
    renderPreview: () => (
      <div className="w-full h-10 rounded border border-[#444] bg-[#050505] p-2 flex items-center justify-between">
        <div className="w-12 h-1.5 bg-white rounded" />
        <div className="w-3.5 h-3.5 rounded bg-white/10 border border-white/30" />
      </div>
    ),
  },
  {
    id: "Gradient Accent",
    title: "Gradiente Resplandor",
    description: "Malla de gradiente ambiental",
    renderPreview: () => (
      <div className="w-full h-10 rounded border border-purple-500/40 bg-gradient-to-tr from-slate-950 via-indigo-950 to-purple-950 p-2 flex items-center justify-between relative overflow-hidden">
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-500/30 rounded-full blur-md" />
        <div className="w-12 h-1.5 bg-purple-200/80 rounded relative z-10" />
        <div className="w-3.5 h-3.5 rounded bg-purple-500/30 border border-purple-400/50 relative z-10" />
      </div>
    ),
  },
  {
    id: "Glassmorphism Card",
    title: "Glassmorphism",
    description: "Efecto translúcido esmerilado",
    renderPreview: () => (
      <div className="w-full h-10 rounded border border-white/20 bg-white/10 backdrop-blur-md p-2 flex items-center justify-between">
        <div className="w-12 h-1.5 bg-cyan-200/80 rounded" />
        <div className="w-3.5 h-3.5 rounded bg-cyan-500/20 border border-cyan-300/40" />
      </div>
    ),
  },
];

const PADDING_OPTIONS = [
  {
    id: "Compact (py-12)",
    title: "Compacto",
    badge: "py-12",
    description: "Espaciado ceñido y denso",
    renderPreview: () => (
      <div className="w-full h-10 bg-[#0F0F0F] rounded border border-[#222] flex flex-col justify-between p-1">
        <div className="w-full border-b border-dashed border-red-500/40 text-[9px] text-red-400/80 text-center leading-none py-0.5">py-12</div>
        <div className="w-full h-2 bg-[#222] rounded flex items-center justify-center">
          <div className="w-8 h-1 bg-blue-400/80 rounded-full" />
        </div>
        <div className="w-full border-t border-dashed border-red-500/40" />
      </div>
    ),
  },
  {
    id: "Standard (py-20)",
    title: "Estándar",
    badge: "py-20",
    description: "Equilibrio visual recomendado",
    renderPreview: () => (
      <div className="w-full h-10 bg-[#0F0F0F] rounded border border-[#222] flex flex-col justify-between p-0.5">
        <div className="w-full border-b border-dashed border-blue-500/50 text-[9px] text-blue-400 text-center leading-none py-0.5">py-20</div>
        <div className="w-full h-2 bg-[#222] rounded flex items-center justify-center">
          <div className="w-8 h-1 bg-blue-400/80 rounded-full" />
        </div>
        <div className="w-full border-t border-dashed border-blue-500/50" />
      </div>
    ),
  },
  {
    id: "Spacious (py-28)",
    title: "Espacioso",
    badge: "py-28",
    description: "Máxima respiración visual",
    renderPreview: () => (
      <div className="w-full h-10 bg-[#0F0F0F] rounded border border-[#222] flex flex-col justify-between p-0">
        <div className="w-full border-b border-dashed border-emerald-500/50 text-[9px] text-emerald-400 text-center leading-none py-0.5">py-28</div>
        <div className="w-full h-2 bg-[#222] rounded flex items-center justify-center">
          <div className="w-8 h-1 bg-blue-400/80 rounded-full" />
        </div>
        <div className="w-full border-t border-dashed border-emerald-500/50" />
      </div>
    ),
  },
];

interface ProjectWorkspaceProps {
  project: Project;
  onUpdateProject: (updatedProject: Project, actionLogMessage?: string) => void;
  onOpenStyleConfig: () => void;
  onOpenConversionVars: () => void;
  onOpenGlobalPrompt: () => void;
  onOpenHistory: () => void;
  onOpenAddSectionModal: () => void;
  onShowToast: (msg: string) => void;
  onOpenAiContext?: () => void;
  onOpenEditProject?: () => void;
  onDeleteProject?: () => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  project,
  onUpdateProject,
  onOpenStyleConfig,
  onOpenConversionVars,
  onOpenGlobalPrompt,
  onOpenHistory,
  onOpenAddSectionModal,
  onShowToast,
  onOpenAiContext,
  onOpenEditProject,
  onDeleteProject,
}) => {

  const [activeSectionId, setActiveSectionId] = useState<string>(
    project.sections[0]?.id || ""
  );
  const [activeTab, setActiveTab] = useState<"prompt" | "edit" | "ai_assets">("prompt");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // AI Prompt Generating State
  const [isAiPromptLoading, setIsAiPromptLoading] = useState(false);

  // AI Assets State for active section
  const [isAiAssetsLoading, setIsAiAssetsLoading] = useState(false);
  const [aiAssetSuggestions, setAiAssetSuggestions] = useState<{
    suggestedIcons?: string[];
    imagePrompts?: string[];
    croTips?: string[];
    copyHooks?: { headline?: string; subheadline?: string; ctaText?: string };
  } | null>(null);

  const activeSection = project.sections.find((s) => s.id === activeSectionId) || project.sections[0];

  // Helper to sync updated section in project
  const handleUpdateSection = (updatedSec: Section, logAction?: string) => {
    // Re-generate prompt text
    const newPromptText = buildSectionPrompt(project, updatedSec);
    const finalSec = {
      ...updatedSec,
      generatedPrompt: newPromptText,
      updatedAt: new Date().toISOString(),
    };

    const updatedSections = project.sections.map((s) => (s.id === finalSec.id ? finalSec : s));
    const updatedProject: Project = {
      ...project,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    };

    onUpdateProject(updatedProject, logAction || `Sección '${finalSec.title}' actualizada`);
  };

  // 1-Click Copy Section Prompt
  const handleCopySectionPrompt = () => {
    if (!activeSection) return;
    navigator.clipboard.writeText(activeSection.generatedPrompt);
    setCopiedPrompt(true);
    onShowToast(`¡Prompt de la sección '${activeSection.title}' copiado!`);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // Reorder Sections
  const handleMoveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= project.sections.length) return;

    const sections = [...project.sections];
    const [moved] = sections.splice(index, 1);
    sections.splice(targetIdx, 0, moved);

    // Re-index orders
    const reordered = sections.map((s, idx) => ({ ...s, order: idx + 1 }));
    onUpdateProject(
      { ...project, sections: reordered, updatedAt: new Date().toISOString() },
      "Orden de secciones actualizado"
    );
  };

  // Delete Section
  const handleDeleteSection = (secId: string) => {
    if (project.sections.length <= 1) {
      alert("La landing page debe tener al menos una sección.");
      return;
    }
    const filtered = project.sections.filter((s) => s.id !== secId);
    const deletedName = project.sections.find((s) => s.id === secId)?.title || "Sección";

    onUpdateProject(
      { ...project, sections: filtered, updatedAt: new Date().toISOString() },
      `Sección '${deletedName}' eliminada`
    );

    if (activeSectionId === secId && filtered.length > 0) {
      setActiveSectionId(filtered[0].id);
    }
  };

  // Call Gemini API to Regenerate / Polish Prompt
  const handleAiRefinePrompt = async () => {
    if (!activeSection) return;
    try {
      setIsAiPromptLoading(true);
      const res = await fetch("/api/gemini/generate-section-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectContext: project,
          sectionData: activeSection,
        }),
      });

      if (!res.ok) throw new Error("Error en la respuesta del servidor");

      const data = await res.json();
      if (data.prompt) {
        const updatedSec = {
          ...activeSection,
          generatedPrompt: data.prompt,
          isAiEnhanced: true,
          updatedAt: new Date().toISOString(),
        };

        const updatedSections = project.sections.map((s) => (s.id === updatedSec.id ? updatedSec : s));
        onUpdateProject(
          { ...project, sections: updatedSections, updatedAt: new Date().toISOString() },
          `Prompt de '${activeSection.title}' perfeccionado con IA`
        );
        onShowToast("¡Prompt de sección optimizado por Gemini IA!");
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo regenerar el prompt con IA.");
    } finally {
      setIsAiPromptLoading(false);
    }
  };

  // Call Gemini API to Suggest Assets & Icons
  const handleAiSuggestAssets = async () => {
    if (!activeSection) return;
    try {
      setIsAiAssetsLoading(true);
      const res = await fetch("/api/gemini/suggest-assets-icons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType: activeSection.type,
          industry: project.industry,
          goal: project.conversionVars.primaryGoal,
        }),
      });

      if (!res.ok) throw new Error("Error obteniendo sugerencias de assets");

      const data = await res.json();
      setAiAssetSuggestions(data);
    } catch (err) {
      console.error(err);
      alert("Error al cargar sugerencias de la API de Google.");
    } finally {
      setIsAiAssetsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#121212] text-[#E0E0E0] flex flex-col font-sans">
      {/* Top Project Workspace Quick Config Bar */}
      <div className="bg-[#181818] border-b border-[#2A2A2A] px-4 py-2.5 sm:px-6">
        <div className="w-full mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm font-bold text-white">{project.name}</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950/60 text-blue-400 border border-blue-500/20 rounded uppercase tracking-wider">
                  {project.industry || "Landing Page"}
                </span>
                {project.conversionVars.impeccableCraft !== false && (
                  <button
                    onClick={onOpenAiContext}
                    className="px-2 py-0.5 text-[10px] font-bold bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 rounded flex items-center gap-1 shadow-sm transition"
                    title="Click para ver la Guía de Craft e Impeccable UI (Paul Bakaus)"
                  >
                    <span>💎 Impeccable UI Craft</span>
                  </button>
                )}
                {onOpenEditProject && (
                  <button
                    onClick={onOpenEditProject}
                    className="p-1 px-2 text-[11px] font-medium bg-[#222] hover:bg-blue-950/60 text-[#AAA] hover:text-blue-400 border border-[#333] hover:border-blue-500/30 rounded transition flex items-center gap-1"
                    title="Editar información y datos del proyecto"
                  >
                    <Pencil className="w-3 h-3 text-blue-400" />
                    <span>Editar Proyecto</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#888] truncate max-w-xl">
                LLM: <span className="text-blue-400 font-medium">{project.conversionVars.targetLLM || "Gemini"}</span> • Tone: {project.conversionVars.tone} • Headings: {project.styleConfig.typography.headingFont} • {project.sections.length} Sections
              </p>
            </div>
          </div>

          {/* Quick Config Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGlobalPrompt}
              className="px-2.5 py-1 bg-[#2A2A2A] hover:bg-[#333] text-[#E0E0E0] text-xs font-medium rounded border border-[#3A3A3A] transition flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Copy Global Prompt</span>
            </button>

            <button
              onClick={onOpenHistory}
              className="px-2.5 py-1 bg-[#2A2A2A] hover:bg-[#333] text-[#E0E0E0] text-xs font-medium rounded border border-[#3A3A3A] transition flex items-center gap-1.5"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>History</span>
            </button>

            {onDeleteProject && (
              <button
                onClick={onDeleteProject}
                className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium rounded border border-rose-800/40 transition flex items-center gap-1.5"
                title="Eliminar este proyecto"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Borrar Proyecto</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Body: Sidebar + Main Section Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Section List */}
        <div className="w-72 border-r border-[#2A2A2A] flex flex-col bg-[#151515] shrink-0">
          <div className="p-4 flex items-center justify-between border-b border-[#2A2A2A]">
            <h2 className="text-xs font-bold text-[#666] uppercase tracking-widest">SECTIONS</h2>
            <button
              onClick={onOpenAddSectionModal}
              className="text-blue-500 text-[10px] hover:underline font-bold flex items-center gap-1"
            >
              Add New +
            </button>
          </div>

          {/* Section Cards List */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {project.sections.map((sec, idx) => {
              const isActive = sec.id === activeSectionId;

              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#222] border border-[#333]"
                      : "border border-transparent hover:bg-[#1A1A1A]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isActive ? "text-white" : "text-[#AAA]"}`}>
                      0{idx + 1}. {sec.title}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#888] truncate">
                    {sec.type} • {sec.sectionStyleOverrides?.layoutVariant || "Standard"}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A]/40 mt-2 text-[10px] text-[#555]">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSection(idx, "up");
                        }}
                        disabled={idx === 0}
                        className="p-0.5 hover:text-white disabled:opacity-30"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveSection(idx, "down");
                        }}
                        disabled={idx === project.sections.length - 1}
                        className="p-0.5 hover:text-white disabled:opacity-30"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(sec.id);
                      }}
                      className="p-0.5 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left Sidebar Footer: Global Palette Preview & Style Visualizer Trigger */}
          <div
            onClick={onOpenStyleConfig}
            className="p-3.5 bg-gradient-to-br from-[#1E1E28] to-[#121218] border-t border-[#2A2A38] hover:border-indigo-500/50 cursor-pointer group transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-300">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Palette className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                Estilo & Tipografía
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold group-hover:underline">
                Editar →
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-md border border-white/10 shadow-sm"
                style={{ backgroundColor: project.styleConfig.palette.primary }}
                title={`Primario: ${project.styleConfig.palette.primary}`}
              />
              <div
                className="w-5 h-5 rounded-md border border-white/10 shadow-sm"
                style={{ backgroundColor: project.styleConfig.palette.secondary }}
                title={`Secundario: ${project.styleConfig.palette.secondary}`}
              />
              <div
                className="w-5 h-5 rounded-md border border-white/10 shadow-sm"
                style={{ backgroundColor: project.styleConfig.palette.accent }}
                title={`Acento: ${project.styleConfig.palette.accent}`}
              />
              <div
                className="w-5 h-5 rounded-md border border-white/10 shadow-sm"
                style={{ backgroundColor: project.styleConfig.palette.background }}
                title={`Fondo: ${project.styleConfig.palette.background}`}
              />
              <div
                className="w-5 h-5 rounded-md border border-white/10 shadow-sm"
                style={{ backgroundColor: project.styleConfig.palette.text }}
                title={`Texto: ${project.styleConfig.palette.text}`}
              />
            </div>

            <div className="text-[10px] text-slate-400 truncate">
              <span className="font-semibold text-slate-300">{project.styleConfig.typography.headingFont}</span> +{" "}
              <span className="text-slate-400">{project.styleConfig.typography.bodyFont}</span>
            </div>
          </div>
        </div>

        {/* Main Area: Active Section Parameters & Prompt Preview */}
        <div className="flex-1 flex flex-col p-6 bg-[#0E0E0E] overflow-y-auto">
          {activeSection ? (
            <div className="space-y-6 max-w-5xl w-full mx-auto">
              {/* Section Active Top Info */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 font-mono text-[10px] uppercase tracking-wider font-bold">
                      CONFIGURING SECTION 0{activeSection.order}
                    </span>
                    {activeSection.isAiEnhanced && (
                      <span className="text-cyan-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Refined
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">{activeSection.title} Parameters</h3>
                  <p className="text-sm text-[#888]">{activeSection.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAiRefinePrompt}
                    disabled={isAiPromptLoading}
                    className="p-2 bg-[#222] border border-[#333] text-[#AAA] hover:text-white rounded hover:bg-[#2A2A2A] transition"
                    title="Polishing Prompt with Gemini AI"
                  >
                    <Wand2 className={`w-4 h-4 text-cyan-400 ${isAiPromptLoading ? "animate-spin" : ""}`} />
                  </button>

                  <button
                    onClick={handleCopySectionPrompt}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition flex items-center gap-1.5"
                  >
                    {copiedPrompt ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-300" />
                        <span>Copied Prompt</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* View Selector Tabs using Shadcn UI Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as "prompt" | "edit" | "ai_assets")}
                className="w-full space-y-6"
              >
                <TabsList className="bg-[#181818] border border-[#2A2A2A] p-1 rounded-xl">
                  <TabsTrigger value="prompt" className="flex items-center gap-1.5 text-xs font-semibold">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Prompt Preview</span>
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="flex items-center gap-1.5 text-xs font-semibold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Copy & Layout Config</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai_assets" className="flex items-center gap-1.5 text-xs font-semibold">
                    <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Asset Suggestions</span>
                  </TabsTrigger>
                </TabsList>

                {/* TAB 1: PROMPT PREVIEW WITH HIGH DENSITY TERMINAL STYLING & CONTEXT OPTIMIZERS */}
                <TabsContent value="prompt" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Controls Column */}
                    <div className="space-y-5">
                      {/* Conversion Focus Control */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold uppercase text-[#666]">
                          <span>Conversion Focus</span>
                          <span className="text-blue-500 font-mono">High Direct Response</span>
                        </div>
                        <div className="p-3 bg-[#181818] border border-[#2A2A2A] rounded space-y-2">
                          <div className="text-xs text-[#AAA] flex items-center justify-between">
                            <span>Goal: {project.conversionVars.primaryGoal}</span>
                            <span className="text-[10px] bg-blue-950/80 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                              {project.conversionVars.tone}
                            </span>
                          </div>
                          <div className="text-xs text-[#666]">
                            Target Audience: {project.conversionVars.targetAudience}
                          </div>
                        </div>
                      </div>

                      {/* Animation & Micro-Interactions Customizer */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#888]">
                          <span className="flex items-center gap-1.5 text-cyan-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Animaciones & Interacción</span>
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">
                            {activeSection.sectionStyleOverrides?.animationStyle || "Framer Motion Fluid"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "Framer Motion Fluid", label: "Framer Motion Fluid", desc: "Viewport trigger & stagger" },
                            { id: "GSAP ScrollTrigger", label: "GSAP ScrollTrigger", desc: "High-impact scroll FX" },
                            { id: "CSS Keyframes Micro-interactions", label: "CSS Micro-Interactions", desc: "Hover scale & glow keyframes" },
                            { id: "Minimal Fade-In", label: "Minimal Fade-In", desc: "Clean & accessible transitions" },
                          ].map((anim) => {
                            const isSelected =
                              (activeSection.sectionStyleOverrides?.animationStyle || "Framer Motion Fluid") === anim.id;
                            return (
                              <button
                                key={anim.id}
                                type="button"
                                onClick={() =>
                                  handleUpdateSection({
                                    ...activeSection,
                                    sectionStyleOverrides: {
                                      ...activeSection.sectionStyleOverrides,
                                      animationStyle: anim.id as any,
                                    },
                                  })
                                }
                                className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                                  isSelected
                                    ? "bg-cyan-950/60 border-cyan-500 text-white ring-1 ring-cyan-500/40"
                                    : "bg-[#141414] border-[#2A2A2A] hover:bg-[#1C1C1C] text-[#888]"
                                }`}
                              >
                                <div className="text-xs font-bold text-slate-200">{anim.label}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{anim.desc}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Special Libraries & Components Integration */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#888]">
                          <span className="flex items-center gap-1.5 text-indigo-400">
                            <Code className="w-3.5 h-3.5" />
                            <span>Librerías & Assets de IA Solicitados</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            "Recharts Data Viz",
                            "Lucide Animated Icons",
                            "Canvas Confetti FX",
                            "Radix UI / Headless",
                            "3D Tilt & Glassmorphism",
                            "Framer AnimatePresence",
                          ].map((lib) => {
                            const currentLibs = activeSection.sectionStyleOverrides?.libraryEnhancements || [];
                            const isSelected = currentLibs.includes(lib);
                            return (
                              <button
                                key={lib}
                                type="button"
                                onClick={() => {
                                  const updated = isSelected
                                    ? currentLibs.filter((l) => l !== lib)
                                    : [...currentLibs, lib];
                                  handleUpdateSection({
                                    ...activeSection,
                                    sectionStyleOverrides: {
                                      ...activeSection.sectionStyleOverrides,
                                      libraryEnhancements: updated,
                                    },
                                  });
                                }}
                                className={`p-2 rounded-lg border text-left text-xs font-semibold flex items-center justify-between transition ${
                                  isSelected
                                    ? "bg-indigo-950/80 border-indigo-500 text-indigo-200"
                                    : "bg-[#141414] border-[#2A2A2A] text-[#777] hover:text-[#BBB]"
                                }`}
                              >
                                <span>{lib}</span>
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                                ) : (
                                  <span className="text-[10px] text-slate-600">+ Add</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Target LLM Tuning Selector */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#888]">
                          <span className="flex items-center gap-1.5 text-amber-400">
                            <Zap className="w-3.5 h-3.5" />
                            <span>Optimización de Prompt para IA (Model Tuning)</span>
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: "Gemini", label: "Gemini 1.5/2.0", desc: "Instrucciones multimodales & UI Specs" },
                            { id: "Claude", label: "Claude 3.5 Sonnet", desc: "Arquitectura limpia & TS estricto" },
                            { id: "GPT-4o", label: "OpenAI GPT-4o", desc: "Respuesta concisa & modular" },
                            { id: "Universal", label: "Universal / Cualquier IA", desc: "Markdown estándar optimizado" },
                          ].map((llm) => {
                            const currentLLM = project.conversionVars.targetLLM || "Universal";
                            const isSelected = currentLLM.toLowerCase().includes(llm.id.toLowerCase());
                            return (
                              <button
                                key={llm.id}
                                type="button"
                                onClick={() => {
                                  const updatedVars = { ...project.conversionVars, targetLLM: llm.id };
                                  const updatedProj = { ...project, conversionVars: updatedVars };
                                  onUpdateProject(updatedProj, `Target LLM set to ${llm.id}`);
                                }}
                                className={`p-2.5 rounded-lg border text-left transition ${
                                  isSelected
                                    ? "bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500/40"
                                    : "bg-[#141414] border-[#2A2A2A] text-[#777] hover:text-[#BBB]"
                                }`}
                              >
                                <div className="text-xs font-bold text-slate-200">{llm.label}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{llm.desc}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right High Density Prompt Preview Box */}
                    <div className="flex flex-col border border-[#333] rounded-lg bg-[#050505] overflow-hidden min-h-[360px]">
                      <div className="p-3 border-b border-[#333] bg-[#1A1A1A] flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#AAA]">
                          PROMPT PREVIEW (IMPECCABLE CRAFT STANDARD)
                        </span>
                        <button
                          onClick={handleCopySectionPrompt}
                          className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded hover:bg-white/10 text-white transition font-semibold flex items-center gap-1.5"
                        >
                          {copiedPrompt ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-300" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed text-[#00FF00] opacity-80 overflow-y-auto max-h-[520px]">
                        {activeSection.generatedPrompt || buildSectionPrompt(project, activeSection)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 2: EDIT COPY & SPECIFICS */}
                <TabsContent value="edit" className="mt-0">
                  <div className="space-y-4">
                    {/* Section General Info & Objectives */}
                    <div className="p-4 bg-[#181818] border border-[#2A2A2A] rounded-lg space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Configuración de Sección & Objetivos</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                            Título de la Sección
                          </label>
                          <input
                            type="text"
                            value={activeSection.title}
                            onChange={(e) =>
                              handleUpdateSection({
                                ...activeSection,
                                title: e.target.value,
                              })
                            }
                            className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                            Objetivo Específico de Contenido
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Capturar leads calificados reduciendo la fricción..."
                            value={activeSection.contentObjective || ""}
                            onChange={(e) =>
                              handleUpdateSection({
                                ...activeSection,
                                contentObjective: e.target.value,
                              })
                            }
                            className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                          Elementos Requeridos Específicos (Un elemento por línea)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Ej:&#10;Grid de 3 columnas con iconos&#10;Insignias de clientes de confianza&#10;Calculadora interactiva o formulario desplegable"
                          value={(activeSection.keyElements || []).join("\n")}
                          onChange={(e) =>
                            handleUpdateSection({
                              ...activeSection,
                              keyElements: e.target.value.split("\n"),
                            })
                          }
                          className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono resize-y"
                        />
                      </div>
                    </div>

                    {/* Copywriting & Text Draft */}
                    <div className="p-4 bg-[#181818] border border-[#2A2A2A] rounded-lg space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Headline & Copywriting Exacto</h4>

                      <div>
                        <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                          Headline Principal
                        </label>
                        <input
                          type="text"
                          value={activeSection.copyDraft.headline}
                          onChange={(e) =>
                            handleUpdateSection({
                              ...activeSection,
                              copyDraft: { ...activeSection.copyDraft, headline: e.target.value },
                            })
                          }
                          className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                          Subheadline / Cuerpo Descriptivo
                        </label>
                        <textarea
                          rows={2}
                          value={activeSection.copyDraft.subheadline}
                          onChange={(e) =>
                            handleUpdateSection({
                              ...activeSection,
                              copyDraft: { ...activeSection.copyDraft, subheadline: e.target.value },
                            })
                          }
                          className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-y"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                            Texto CTA Principal
                          </label>
                          <input
                            type="text"
                            value={activeSection.copyDraft.ctaText}
                            onChange={(e) =>
                              handleUpdateSection({
                                ...activeSection,
                                copyDraft: { ...activeSection.copyDraft, ctaText: e.target.value },
                              })
                            }
                            className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                            Texto CTA Secundario
                          </label>
                          <input
                            type="text"
                            placeholder="Ej: Ver demostración de 2 min"
                            value={activeSection.copyDraft.secondaryCtaText || ""}
                            onChange={(e) =>
                              handleUpdateSection({
                                ...activeSection,
                                copyDraft: { ...activeSection.copyDraft, secondaryCtaText: e.target.value },
                              })
                            }
                            className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                          Viñetas / Puntos Clave (Un punto por línea)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Ej:&#10;Sin tarjeta de crédito requerida&#10;Implementación en menos de 5 minutos&#10;Soporte prioritario 24/7"
                          value={(activeSection.copyDraft.bulletPoints || []).join("\n")}
                          onChange={(e) =>
                            handleUpdateSection({
                              ...activeSection,
                              copyDraft: {
                                ...activeSection.copyDraft,
                                bulletPoints: e.target.value.split("\n"),
                              },
                            })
                          }
                          className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500 font-sans resize-y"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                          Notas Adicionales de Copy / Instrucciones Especiales
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Ej: Resaltar la métrica del 99.8% de uptime en color verde brillante..."
                          value={activeSection.copyDraft.extraNotes || ""}
                          onChange={(e) =>
                            handleUpdateSection({
                              ...activeSection,
                              copyDraft: { ...activeSection.copyDraft, extraNotes: e.target.value },
                            })
                          }
                          className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-y"
                        />
                      </div>
                    </div>

                    {/* Section Style & Layout Overrides */}
                    <div className="p-4 bg-[#181818] border border-[#2A2A2A] rounded-lg space-y-5">
                      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
                          <span>Estilo & Layout de Sección</span>
                        </h4>
                        <span className="text-[11px] text-[#888]">Selección visual interactiva para la arquitectura de sección</span>
                      </div>

                      {/* 1. LAYOUT VARIANT CARDS */}
                      <div className="space-y-2">
                        <label className="block text-[11px] text-[#AAA] font-bold uppercase tracking-wide">
                          Variante de Layout Visual
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                          {LAYOUT_VARIANTS.map((item) => {
                            const isSelected =
                              (activeSection.sectionStyleOverrides?.layoutVariant || "Centered Focus") === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  handleUpdateSection({
                                    ...activeSection,
                                    sectionStyleOverrides: {
                                      ...activeSection.sectionStyleOverrides,
                                      layoutVariant: item.id as any,
                                    },
                                  })
                                }
                                className={`group relative p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 ${
                                  isSelected
                                    ? "bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500"
                                    : "bg-[#121212] border-[#2C2C2C] hover:bg-[#1A1A1A] hover:border-[#444] text-[#AAA]"
                                }`}
                              >
                                {isSelected && (
                                  <span className="absolute top-1.5 right-1.5 bg-blue-500 text-white p-0.5 rounded-full shadow-sm">
                                    <CheckCircle2 className="w-3 h-3" />
                                  </span>
                                )}
                                {item.renderPreview()}
                                <div>
                                  <div className="text-xs font-semibold text-white leading-tight">{item.title}</div>
                                  <div className="text-[10px] text-[#888] leading-tight mt-0.5 group-hover:text-[#CCC]">
                                    {item.description}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. SECTION BACKGROUND STYLE CARDS */}
                      <div className="space-y-2">
                        <label className="block text-[11px] text-[#AAA] font-bold uppercase tracking-wide">
                          Fondo de Sección
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                          {BG_STYLES.map((item) => {
                            const isSelected =
                              (activeSection.sectionStyleOverrides?.bgStyle || "Solid Surface") === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  handleUpdateSection({
                                    ...activeSection,
                                    sectionStyleOverrides: {
                                      ...activeSection.sectionStyleOverrides,
                                      bgStyle: item.id as any,
                                    },
                                  })
                                }
                                className={`group relative p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between gap-2 ${
                                  isSelected
                                    ? "bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500"
                                    : "bg-[#121212] border-[#2C2C2C] hover:bg-[#1A1A1A] hover:border-[#444] text-[#AAA]"
                                }`}
                              >
                                {isSelected && (
                                  <span className="absolute top-1.5 right-1.5 bg-blue-500 text-white p-0.5 rounded-full shadow-sm z-20">
                                    <CheckCircle2 className="w-3 h-3" />
                                  </span>
                                )}
                                {item.renderPreview()}
                                <div>
                                  <div className="text-xs font-semibold text-white leading-tight">{item.title}</div>
                                  <div className="text-[10px] text-[#888] leading-tight mt-0.5 group-hover:text-[#CCC]">
                                    {item.description}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2.5. SECTION BACKGROUND TEXTURE OVERLAY CONTROLS */}
                      <div className="space-y-3.5 p-3.5 bg-[#141417] border border-[#2A2A35] rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <label className="text-xs font-bold text-white uppercase tracking-wider">
                              Textura Decorativa de Sección (Overlay)
                            </label>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-full font-semibold">
                            Capa Decorativa Acompañante
                          </span>
                        </div>

                        <p className="text-[11px] text-[#888] leading-relaxed">
                          Selecciona una textura decorativa sutil (Cuadrícula o Point Grid) que se superpone de manera armoniosa sobre el fondo base de la sección sin reemplazar su color.
                        </p>

                        {/* Dropdown Selectors for Texture Type & Specific Parameters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-[#AAA] font-bold mb-1 uppercase">
                              Tipo de Textura
                            </label>
                            <select
                              value={activeSection.sectionStyleOverrides?.bgTextureType || "none"}
                              onChange={(e) =>
                                handleUpdateSection({
                                  ...activeSection,
                                  sectionStyleOverrides: {
                                    ...activeSection.sectionStyleOverrides,
                                    bgTextureType: e.target.value as any,
                                    gridSize: activeSection.sectionStyleOverrides?.gridSize || "medium",
                                    dotsSpacing: activeSection.sectionStyleOverrides?.dotsSpacing || "normal",
                                  },
                                })
                              }
                              className="w-full bg-[#1A1A22] border border-[#333] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
                            >
                              <option value="none">Sin Textura (Fondo Plano / Limpio)</option>
                              <option value="grid">Cuadrícula (Grid Pattern Overlay)</option>
                              <option value="dots">Point Grid (Matriz de Puntos Decorativa)</option>
                            </select>
                          </div>

                          {/* Secondary Dropdown for Sub-parameters */}
                          {activeSection.sectionStyleOverrides?.bgTextureType === "grid" && (
                            <div>
                              <label className="block text-[11px] text-cyan-400 font-bold mb-1 uppercase">
                                Tamaño de Cuadrícula
                              </label>
                              <select
                                value={activeSection.sectionStyleOverrides?.gridSize || "medium"}
                                onChange={(e) =>
                                  handleUpdateSection({
                                    ...activeSection,
                                    sectionStyleOverrides: {
                                      ...activeSection.sectionStyleOverrides,
                                      gridSize: e.target.value as any,
                                    },
                                  })
                                }
                                className="w-full bg-[#1A1A22] border border-cyan-500/50 rounded-lg p-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 font-medium"
                              >
                                <option value="large">Cuadrícula con Cuadros Grandes (~40px)</option>
                                <option value="medium">Cuadrícula con Cuadros Medianos (~24px)</option>
                                <option value="small">Cuadrícula con Cuadros Pequeños (~12px)</option>
                              </select>
                            </div>
                          )}

                          {activeSection.sectionStyleOverrides?.bgTextureType === "dots" && (
                            <div>
                              <label className="block text-[11px] text-cyan-400 font-bold mb-1 uppercase">
                                Tamaño & Espaciado de Puntos
                              </label>
                              <select
                                value={activeSection.sectionStyleOverrides?.dotsSpacing || "normal"}
                                onChange={(e) =>
                                  handleUpdateSection({
                                    ...activeSection,
                                    sectionStyleOverrides: {
                                      ...activeSection.sectionStyleOverrides,
                                      dotsSpacing: e.target.value as any,
                                    },
                                  })
                                }
                                className="w-full bg-[#1A1A22] border border-cyan-500/50 rounded-lg p-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-400 font-medium"
                              >
                                <option value="dense">Point Grid - Puntos Muy Cercanos (~10px)</option>
                                <option value="normal">Point Grid - Puntos Normales (~20px)</option>
                                <option value="sparse">Point Grid - Puntos Alejados (~36px)</option>
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Interactive Visual Cards for Texture Selection */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          {[
                            {
                              id: "none",
                              title: "Sin Textura",
                              subtitle: "Fondo Limpio",
                              previewStyle: {},
                            },
                            {
                              id: "grid",
                              title: "Cuadrícula",
                              subtitle: "Grid Overlay",
                              previewStyle: getTextureBgStyle(
                                "grid",
                                activeSection.sectionStyleOverrides?.gridSize || "medium"
                              ),
                            },
                            {
                              id: "dots",
                              title: "Point Grid",
                              subtitle: "Matriz de Puntos",
                              previewStyle: getTextureBgStyle(
                                "dots",
                                undefined,
                                activeSection.sectionStyleOverrides?.dotsSpacing || "normal"
                              ),
                            },
                          ].map((item) => {
                            const isSelected =
                              (activeSection.sectionStyleOverrides?.bgTextureType || "none") === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  handleUpdateSection({
                                    ...activeSection,
                                    sectionStyleOverrides: {
                                      ...activeSection.sectionStyleOverrides,
                                      bgTextureType: item.id as any,
                                      gridSize: activeSection.sectionStyleOverrides?.gridSize || "medium",
                                      dotsSpacing: activeSection.sectionStyleOverrides?.dotsSpacing || "normal",
                                    },
                                  })
                                }
                                className={`group relative p-2.5 rounded-xl border text-left transition-all duration-200 overflow-hidden flex flex-col justify-between h-20 ${
                                  isSelected
                                    ? "bg-cyan-950/40 border-cyan-500 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500"
                                    : "bg-[#181820] border-[#2C2C38] hover:bg-[#20202C] text-[#AAA]"
                                }`}
                              >
                                <div
                                  className="absolute inset-0 opacity-40 pointer-events-none transition-opacity"
                                  style={item.previewStyle}
                                />
                                <div className="relative z-10 flex items-center justify-between">
                                  <span className="text-xs font-bold text-white">{item.title}</span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                                </div>
                                <div className="relative z-10 text-[10px] text-[#888] group-hover:text-[#CCC]">
                                  {item.subtitle}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Live Overlay Preview Canvas */}
                        {(activeSection.sectionStyleOverrides?.bgTextureType === "grid" ||
                          activeSection.sectionStyleOverrides?.bgTextureType === "dots") && (
                          <div className="mt-2 p-3.5 rounded-xl border border-cyan-500/30 bg-[#0E0E14] relative overflow-hidden flex flex-col gap-2 shadow-inner">
                            <div
                              className="absolute inset-0 opacity-60 pointer-events-none"
                              style={getTextureBgStyle(
                                activeSection.sectionStyleOverrides?.bgTextureType,
                                activeSection.sectionStyleOverrides?.gridSize,
                                activeSection.sectionStyleOverrides?.dotsSpacing
                              )}
                            />
                            <div className="relative z-10 flex items-center justify-between text-[11px]">
                              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                Previsualización de Textura Superpuesta
                              </span>
                              <span className="text-[10px] text-slate-300 font-mono bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                                {activeSection.sectionStyleOverrides?.bgTextureType === "grid"
                                  ? `Grid: ${
                                      activeSection.sectionStyleOverrides?.gridSize === "small"
                                        ? "Pequeña (~12px)"
                                        : activeSection.sectionStyleOverrides?.gridSize === "large"
                                        ? "Grande (~40px)"
                                        : "Mediana (~24px)"
                                    }`
                                  : `Point Grid: ${
                                      activeSection.sectionStyleOverrides?.dotsSpacing === "dense"
                                        ? "Muy Cercanos (~10px)"
                                        : activeSection.sectionStyleOverrides?.dotsSpacing === "sparse"
                                        ? "Alejados (~36px)"
                                        : "Normales (~20px)"
                                    }`}
                              </span>
                            </div>
                            <div className="relative z-10 p-3 rounded-lg bg-[#181822]/90 border border-[#333344] flex items-center justify-between gap-2 shadow-sm backdrop-blur-xs">
                              <div>
                                <p className="text-xs font-bold text-white">Vista Previa de Sección con Textura</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  La textura se superpone suavemente en el fondo sin alterar el color seleccionado.
                                </p>
                              </div>
                              <span className="px-3 py-1 text-[10px] font-bold bg-cyan-500 text-slate-950 rounded-md shrink-0 shadow-sm">
                                CTA Demo
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[11px] text-[#AAA] font-bold uppercase tracking-wide">
                          Espaciado Vertical (Padding)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {PADDING_OPTIONS.map((item) => {
                            const isSelected =
                              (activeSection.sectionStyleOverrides?.paddingVertical || "Standard (py-20)") === item.id;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                  handleUpdateSection({
                                    ...activeSection,
                                    sectionStyleOverrides: {
                                      ...activeSection.sectionStyleOverrides,
                                      paddingVertical: item.id as any,
                                    },
                                  })
                                }
                                className={`group relative p-2.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
                                  isSelected
                                    ? "bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500"
                                    : "bg-[#121212] border-[#2C2C2C] hover:bg-[#1A1A1A] hover:border-[#444] text-[#AAA]"
                                }`}
                              >
                                <div className="w-16 shrink-0">{item.renderPreview()}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#222] border border-[#333] text-[#CCC] font-mono">
                                      {item.badge}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-[#888] truncate mt-0.5 group-hover:text-[#CCC]">
                                    {item.description}
                                  </div>
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 3: AI ASSETS & ICONS */}
                <TabsContent value="ai_assets" className="mt-0">
                  <div className="space-y-4">
                    <div className="p-4 bg-[#181818] border border-[#2A2A2A] rounded-lg flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>Google Gemini Asset Suggestions</span>
                        </h4>
                        <p className="text-[11px] text-[#888]">
                          Generate icons, image prompts, and CRO tips for this specific section.
                        </p>
                      </div>

                      <button
                        onClick={handleAiSuggestAssets}
                        disabled={isAiAssetsLoading}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isAiAssetsLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Fetching...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Generate Suggestions</span>
                          </>
                        )}
                      </button>
                    </div>

                    {aiAssetSuggestions ? (
                      <div className="space-y-4">
                        {aiAssetSuggestions.suggestedIcons && (
                          <div className="p-3 bg-[#181818] border border-[#2A2A2A] rounded space-y-2">
                            <span className="text-[10px] font-bold uppercase text-[#666]">Recommended Lucide Icons</span>
                            <div className="flex flex-wrap gap-2">
                              {aiAssetSuggestions.suggestedIcons.map((ic) => (
                                <span key={ic} className="px-2 py-1 bg-[#222] border border-[#333] text-xs font-mono text-blue-400 rounded">
                                  {ic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiAssetSuggestions.imagePrompts && (
                          <div className="p-3 bg-[#181818] border border-[#2A2A2A] rounded space-y-2">
                            <span className="text-[10px] font-bold uppercase text-[#666]">Image Prompts</span>
                            <div className="space-y-2">
                              {aiAssetSuggestions.imagePrompts.map((ip, i) => (
                                <p key={i} className="text-xs font-mono text-[#AAA] p-2 bg-[#121212] border border-[#2A2A2A] rounded">
                                  {ip}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-xs text-[#666] border border-dashed border-[#333] rounded">
                        Click "Generate Suggestions" to retrieve Gemini AI asset prompts and icon recommendations.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#666]">Select a section to view parameters.</div>
          )}
        </div>
      </div>
    </div>
  );
};
