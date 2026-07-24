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
} from "lucide-react";

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
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-white">{project.name}</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950/60 text-blue-400 border border-blue-500/20 rounded uppercase tracking-wider">
                  {project.industry || "Landing Page"}
                </span>
              </div>
              <p className="text-[11px] text-[#888] truncate max-w-xl">
                Tone: {project.conversionVars.tone} • Headings: {project.styleConfig.typography.headingFont} • {project.sections.length} Sections
              </p>
            </div>
          </div>

          {/* Quick Config Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenConversionVars}
              className="px-2.5 py-1 bg-[#2A2A2A] hover:bg-[#333] text-[#E0E0E0] text-xs font-medium rounded border border-[#3A3A3A] transition flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Conversion Vars</span>
            </button>

            <button
              onClick={onOpenStyleConfig}
              className="px-2.5 py-1 bg-[#2A2A2A] hover:bg-[#333] text-[#E0E0E0] text-xs font-medium rounded border border-[#3A3A3A] transition flex items-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Visual Config</span>
            </button>

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
              const statusTag = idx === 0 ? "Ready" : idx === 1 ? "Draft" : "Pending";
              const statusColor = idx === 0 ? "text-green-500" : idx === 1 ? "text-[#666]" : "text-blue-500";

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
                    <span className={`text-[10px] uppercase font-bold ${statusColor}`}>
                      {statusTag}
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

          {/* Left Sidebar Footer: Global Palette Preview */}
          <div className="p-4 bg-[#181818] border-t border-[#2A2A2A] space-y-2">
            <div className="text-[10px] text-[#666] uppercase font-bold">Global Style Palette</div>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border border-white/10"
                style={{ backgroundColor: project.styleConfig.palette.primary }}
                title={`Primary: ${project.styleConfig.palette.primary}`}
              />
              <div
                className="w-6 h-6 rounded border border-white/10"
                style={{ backgroundColor: project.styleConfig.palette.secondary }}
                title={`Secondary: ${project.styleConfig.palette.secondary}`}
              />
              <div
                className="w-6 h-6 rounded border border-white/10"
                style={{ backgroundColor: project.styleConfig.palette.accent }}
                title={`Accent: ${project.styleConfig.palette.accent}`}
              />
              <div
                className="w-6 h-6 rounded border border-white/10"
                style={{ backgroundColor: project.styleConfig.palette.background }}
                title={`Background: ${project.styleConfig.palette.background}`}
              />
              <button
                onClick={onOpenStyleConfig}
                className="w-6 h-6 rounded border border-dashed border-[#444] text-[10px] flex items-center justify-center text-[#888] hover:text-white hover:border-[#666]"
                title="Edit Style Config"
              >
                +
              </button>
            </div>
            <div className="text-[10px] text-[#AAA] truncate">
              Headings: {project.styleConfig.typography.headingFont} / Body: {project.styleConfig.typography.bodyFont}
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

                {/* TAB 1: PROMPT PREVIEW WITH HIGH DENSITY TERMINAL STYLING */}
                <TabsContent value="prompt" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Controls Column */}
                    <div className="space-y-6">
                      {/* Conversion Focus Control */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold uppercase text-[#666]">
                          <span>Conversion Focus</span>
                          <span className="text-blue-500 font-mono">High Direct Response</span>
                        </div>
                        <div className="p-3 bg-[#181818] border border-[#2A2A2A] rounded space-y-2">
                          <div className="text-xs text-[#AAA]">Goal: {project.conversionVars.primaryGoal}</div>
                          <div className="text-xs text-[#666]">Audience: {project.conversionVars.targetAudience}</div>
                        </div>
                      </div>

                      {/* Visual Complexity Controls */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold uppercase text-[#666]">
                          <span>Visual Variant</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() =>
                              handleUpdateSection({
                                ...activeSection,
                                sectionStyleOverrides: {
                                  ...activeSection.sectionStyleOverrides,
                                  layoutVariant: "Centered Focus" as any,
                                },
                              })
                            }
                            className={`py-2 rounded text-[10px] font-bold tracking-wider ${
                              activeSection.sectionStyleOverrides?.layoutVariant === "Centered Focus"
                                ? "bg-blue-600 text-white"
                                : "bg-[#1A1A1A] border border-[#333] text-[#666] hover:text-[#AAA]"
                            }`}
                          >
                            CLEAN
                          </button>

                          <button
                            onClick={() =>
                              handleUpdateSection({
                                ...activeSection,
                                sectionStyleOverrides: {
                                  ...activeSection.sectionStyleOverrides,
                                  layoutVariant: "Split 50/50" as any,
                                },
                              })
                            }
                            className={`py-2 rounded text-[10px] font-bold tracking-wider ${
                              activeSection.sectionStyleOverrides?.layoutVariant === "Split 50/50"
                                ? "bg-blue-600 text-white"
                                : "bg-[#1A1A1A] border border-[#333] text-[#666] hover:text-[#AAA]"
                            }`}
                          >
                            SPLIT 50/50
                          </button>

                          <button
                            onClick={() =>
                              handleUpdateSection({
                                ...activeSection,
                                sectionStyleOverrides: {
                                  ...activeSection.sectionStyleOverrides,
                                  layoutVariant: "Bento Grid 3 Cols" as any,
                                },
                              })
                            }
                            className={`py-2 rounded text-[10px] font-bold tracking-wider ${
                              activeSection.sectionStyleOverrides?.layoutVariant === "Bento Grid 3 Cols"
                                ? "bg-blue-600 text-white"
                                : "bg-[#1A1A1A] border border-[#333] text-[#666] hover:text-[#AAA]"
                            }`}
                          >
                            BENTO GRID
                          </button>
                        </div>
                      </div>

                      {/* Asset Suggestions Select */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold uppercase text-[#666]">
                          <span>Asset Type</span>
                        </div>
                        <select
                          value={activeSection.sectionStyleOverrides?.bgStyle || "Solid Surface"}
                          onChange={(e) =>
                            handleUpdateSection({
                              ...activeSection,
                              sectionStyleOverrides: {
                                ...activeSection.sectionStyleOverrides,
                                bgStyle: e.target.value as any,
                              },
                            })
                          }
                          className="w-full bg-[#1A1A1A] border border-[#333] rounded p-2 text-xs text-[#AAA] focus:outline-none focus:border-blue-500"
                        >
                          <option value="Solid Surface">Solid Neutral Surface</option>
                          <option value="Solid Primary">Primary Color Accent Surface</option>
                          <option value="Dark Contrast">Dark High Contrast Background</option>
                          <option value="Gradient Accent">Subtle Gradient Glow</option>
                        </select>
                      </div>
                    </div>

                    {/* Right High Density Prompt Preview Box */}
                    <div className="flex flex-col border border-[#333] rounded-lg bg-[#050505] overflow-hidden min-h-[360px]">
                      <div className="p-3 border-b border-[#333] bg-[#1A1A1A] flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#AAA]">
                          PROMPT PREVIEW
                        </span>
                        <button
                          onClick={handleCopySectionPrompt}
                          className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded hover:bg-white/10 text-white transition"
                        >
                          {copiedPrompt ? "Copied!" : "Copy Text"}
                        </button>
                      </div>

                      <div className="flex-1 p-4 font-mono text-[11px] leading-relaxed text-[#00FF00] opacity-80 overflow-y-auto max-h-[420px]">
                        {activeSection.generatedPrompt || buildSectionPrompt(project, activeSection)}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* TAB 2: EDIT COPY & SPECIFICS */}
                <TabsContent value="edit" className="mt-0">
                  <div className="space-y-4">
                    <div className="p-4 bg-[#181818] border border-[#2A2A2A] rounded-lg space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Headline & Copy Draft</h4>

                      <div>
                        <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                          Headline
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
                          Subheadline / Body Text
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
                          className="w-full bg-[#121212] border border-[#333] rounded p-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-[#888] font-bold mb-1 uppercase">
                            Primary CTA Text
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
                            Secondary CTA Text
                          </label>
                          <input
                            type="text"
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
