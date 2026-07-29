import React, { useState, useRef } from "react";
import { Project, StylePreset } from "../types";
import { Plus, FolderKanban, Sparkles, Copy, Trash2, ArrowRight, Layers, Palette, Type, Clock, Search, Cpu, Pencil, LayoutGrid, Zap, CheckCircle2, Wand2, Bot, Loader2, AlertCircle, Upload, Download } from "lucide-react";
import { PRESET_PALETTES, PRESET_TYPOGRAPHY } from "../data/presets";
import { LANDING_PAGE_TEMPLATES, LandingPageTemplate } from "../data/landingPageTemplates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface DashboardProps {
  projects: Project[];
  templates: StylePreset[];
  onOpenProject: (projectId: string) => void;
  onCreateProject: (projectData: { name: string; description: string; industry: string; templateId?: string; useMasterTemplate?: boolean }) => void;
  onCreateProjectFromAi?: (aiData: any) => void;
  onImportProject?: (importedData: any) => void;
  onEditProject?: (project: Project) => void;
  onDuplicateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onDeleteTemplate: (templateId: string) => void;
  onOpenAiContext?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  templates,
  onOpenProject,
  onCreateProject,
  onCreateProjectFromAi,
  onImportProject,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onDeleteTemplate,
  onOpenAiContext,
}) => {

  const [activeTab, setActiveTab] = useState<"projects" | "templates">("projects");
  const [templateSubTab, setTemplateSubTab] = useState<"landings" | "styles">("landings");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Creation Mode inside modal: 'manual' vs 'ai'
  const [createMode, setCreateMode] = useState<"manual" | "ai">("manual");

  // New Project Form State (Manual)
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectIndustry, setNewProjectIndustry] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [useMasterTemplate, setUseMasterTemplate] = useState<boolean>(true);

  // AI Project Generation State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAiProject, setIsGeneratingAiProject] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // File Import Ref & Handler
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (onImportProject) {
          onImportProject(json);
        }
      } catch (err) {
        alert("El archivo seleccionado no es un JSON de proyecto válido.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const handleSelectLandingTemplate = (tmpl: LandingPageTemplate) => {
    setSelectedTemplateId(tmpl.id);
    setUseMasterTemplate(false);
    if (!newProjectName) setNewProjectName(`Mi ${tmpl.name}`);
    if (!newProjectIndustry) setNewProjectIndustry(tmpl.category);
    if (!newProjectDesc) setNewProjectDesc(tmpl.description);
    setIsCreateModalOpen(true);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    onCreateProject({
      name: newProjectName.trim(),
      description: newProjectDesc.trim(),
      industry: newProjectIndustry.trim() || "Digital & Tech",
      templateId: selectedTemplateId || undefined,
      useMasterTemplate,
    });

    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectIndustry("");
    setSelectedTemplateId("");
    setUseMasterTemplate(true);
    setIsCreateModalOpen(false);
  };

  const handleAiCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGeneratingAiProject(true);
    setAiError(null);

    try {
      const res = await fetch("/api/gemini/generate-full-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Error al comunicarse con Gemini AI.");
      }

      const aiProjectData = await res.json();

      if (onCreateProjectFromAi) {
        onCreateProjectFromAi(aiProjectData);
      }

      setIsCreateModalOpen(false);
      setAiPrompt("");
      setAiError(null);
    } catch (err: any) {
      console.error("Error generating project with AI:", err);
      setAiError(err.message || "No se pudo estructurar el proyecto con IA. Inténtalo de nuevo.");
    } finally {
      setIsGeneratingAiProject(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#121212] text-[#E0E0E0] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Top Header & Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-3.5 py-2 rounded text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === "projects"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-[#181818] text-[#888] hover:text-white border border-[#2A2A2A]"
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Proyectos ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("templates")}
              className={`px-3.5 py-2 rounded text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === "templates"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-[#181818] text-[#888] hover:text-white border border-[#2A2A2A]"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Plantillas ({templates.length})</span>
            </button>
          </div>

          {/* Actions & Search */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {activeTab === "projects" && (
              <div className="relative flex-1 md:w-64">
                <Search className="w-3.5 h-3.5 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar proyecto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181818] border border-[#2A2A2A] rounded pl-9 pr-3 py-1.5 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-[#222] hover:bg-[#2A2A2A] text-slate-300 hover:text-white border border-[#3A3A3A] font-medium text-xs rounded transition flex items-center gap-1.5"
              title="Cargar un proyecto desde un archivo JSON descargado"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Importar JSON</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Proyecto</span>
            </button>
          </div>
        </div>

        {/* Projects Tab Content */}
        {activeTab === "projects" && (
          <div>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <FolderKanban className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">No se encontraron proyectos</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {searchQuery ? "Prueba cambiando el término de búsqueda." : "Comienza creando tu primera landing page organizada por secciones."}
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition"
                >
                  Crear Primer Proyecto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const palette = project.styleConfig.palette;
                  const typography = project.styleConfig.typography;

                  return (
                    <div
                      key={project.id}
                      className="group relative bg-[#181818] border border-[#2A2A2A] hover:border-[#3A3A3A] rounded-lg p-4 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Industry Badge & Section Count */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950/60 border border-blue-500/20 text-blue-400 rounded uppercase">
                            {project.industry || "Landing Page"}
                          </span>

                          <span className="text-[10px] text-[#AAA] bg-[#222] px-2 py-0.5 rounded border border-[#333]">
                            {project.sections.length} {project.sections.length === 1 ? "Section" : "Sections"}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3
                            onClick={() => onOpenProject(project.id)}
                            className="text-base font-bold text-white group-hover:text-blue-400 cursor-pointer transition line-clamp-1"
                          >
                            {project.name}
                          </h3>
                          <p className="text-xs text-[#888] line-clamp-2 mt-1 leading-relaxed">
                            {project.description || "Sin descripción proporcionada."}
                          </p>
                        </div>

                        {/* Palette Preview bar */}
                        <div className="p-2.5 bg-[#121212] rounded border border-[#2A2A2A] space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-[#888]">
                            <span className="font-medium truncate">{palette.name || "Paleta de Colores"}</span>
                            <span className="text-[#AAA] font-mono">{typography.headingFont}</span>
                          </div>

                          <div className="flex h-4 rounded overflow-hidden p-0.5 bg-[#181818] border border-[#2A2A2A] gap-1">
                            <div className="flex-1 rounded" style={{ backgroundColor: palette.primary }} title={`Primary: ${palette.primary}`} />
                            <div className="flex-1 rounded" style={{ backgroundColor: palette.secondary }} title={`Secondary: ${palette.secondary}`} />
                            <div className="flex-1 rounded" style={{ backgroundColor: palette.accent }} title={`Accent: ${palette.accent}`} />
                            <div className="flex-1 rounded" style={{ backgroundColor: palette.background }} title={`Background: ${palette.background}`} />
                            <div className="flex-1 rounded" style={{ backgroundColor: palette.text }} title={`Text: ${palette.text}`} />
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-2 border-t border-[#2A2A2A] flex items-center justify-between text-xs text-[#888]">
                        <div className="flex items-center gap-1 text-[10px] text-[#666]">
                          <Clock className="w-3 h-3 text-[#666]" />
                          <span>Updated {new Date(project.updatedAt).toLocaleDateString("es-ES")}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {onEditProject && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditProject(project);
                              }}
                              className="p-1.5 rounded bg-[#222] hover:bg-blue-950/60 hover:text-blue-400 text-[#AAA] border border-[#333] transition"
                              title="Editar Datos del Proyecto"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicateProject(project);
                            }}
                            className="p-1.5 rounded bg-[#222] hover:bg-[#2A2A2A] text-[#AAA] border border-[#333] transition"
                            title="Duplicar Proyecto"
                          >
                            <Copy className="w-3 h-3" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(project.id);
                            }}
                            className="p-1 rounded bg-[#222] hover:bg-rose-950/50 text-[#888] hover:text-rose-400 border border-[#333] transition"
                            title="Eliminar Proyecto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => onOpenProject(project.id)}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Templates Tab Content */}
        {activeTab === "templates" && (
          <div className="space-y-6">
            {/* Sub-navigation for Templates */}
            <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-3">
              <button
                onClick={() => setTemplateSubTab("landings")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                  templateSubTab === "landings"
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-[#181818] text-[#888] hover:text-white border border-[#2A2A2A]"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-indigo-300" />
                <span>Estructuras de Landing Page ({LANDING_PAGE_TEMPLATES.length})</span>
              </button>

              <button
                onClick={() => setTemplateSubTab("styles")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                  templateSubTab === "styles"
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-[#181818] text-[#888] hover:text-white border border-[#2A2A2A]"
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-cyan-300" />
                <span>Estilos de Marca ({templates.length})</span>
              </button>
            </div>

            {/* 10 LANDING PAGE TEMPLATES GRID */}
            {templateSubTab === "landings" && (
              <div className="space-y-4">
                <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-blue-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      10 Plantillas Prediseñadas de Landing Page de Alta Conversión
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Elige entre estructuras ultracortas de captura de email, intermedias para apps y servicios, o completas para SaaS y cursos.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {LANDING_PAGE_TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      className="bg-[#181818] border border-[#2A2A2A] hover:border-indigo-500/50 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition group shadow-lg"
                    >
                      <div className="space-y-3">
                        {/* Header Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">
                            {tmpl.badge}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            {tmpl.lengthTag}
                          </span>
                        </div>

                        {/* Title & Category */}
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                            {tmpl.name}
                          </h4>
                          <span className="text-[11px] text-[#888]">{tmpl.category}</span>
                        </div>

                        <p className="text-xs text-[#AAA] leading-relaxed line-clamp-3">
                          {tmpl.description}
                        </p>

                        {/* Section List Preview */}
                        <div className="bg-[#121212] p-2.5 rounded-xl border border-[#222] space-y-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#777]">
                            Secciones incluidas ({tmpl.sectionCount}):
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tmpl.rawSections.map((sec, i) => (
                              <span
                                key={i}
                                className="text-[10px] bg-[#222] text-slate-300 px-2 py-0.5 rounded border border-[#333]"
                              >
                                {sec.title.split(". ")[1] || sec.title}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Palette Swatch */}
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-medium text-[#888] flex items-center justify-between">
                            <span>Paleta Recomendada:</span>
                            <span className="text-[10px] text-indigo-300 font-mono">{tmpl.palette.name}</span>
                          </div>
                          <div className="flex h-4 rounded border border-[#333] overflow-hidden p-0.5 bg-[#121212] gap-1">
                            <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.primary }} title={`Primario: ${tmpl.palette.primary}`} />
                            <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.secondary }} title={`Secundario: ${tmpl.palette.secondary}`} />
                            <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.accent }} title={`Acento: ${tmpl.palette.accent}`} />
                            <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.background }} title={`Fondo: ${tmpl.palette.background}`} />
                            <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.text }} title={`Texto: ${tmpl.palette.text}`} />
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#2A2A2A]">
                        <button
                          onClick={() => handleSelectLandingTemplate(tmpl)}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow"
                        >
                          <span>Crear Proyecto con esta Plantilla</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STYLE TEMPLATES GRID */}
            {templateSubTab === "styles" && (
              <div>
                {templates.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                      <Layers className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-200">No hay estilos de marca guardados aún</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Puedes guardar cualquier combinación personalizada de paleta de colores y tipografía desde la configuración de estilo de tu proyecto para reutilizarla aquí.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((tmpl) => (
                      <div
                        key={tmpl.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 relative flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-white truncate">{tmpl.name}</span>
                            {tmpl.isCustom ? (
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">
                                Personalizada
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">
                                Prediseñada
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{tmpl.vibe}</p>

                          {/* Color Swatches */}
                          <div className="space-y-2">
                            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                              <Palette className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Paleta de Colores:</span>
                            </div>
                            <div className="flex h-6 rounded-lg overflow-hidden border border-slate-800 p-0.5 bg-slate-950 gap-1">
                              <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.primary }} title={`Primario: ${tmpl.palette.primary}`} />
                              <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.secondary }} title={`Secundario: ${tmpl.palette.secondary}`} />
                              <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.accent }} title={`Acento: ${tmpl.palette.accent}`} />
                              <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.background }} title={`Fondo: ${tmpl.palette.background}`} />
                              <div className="flex-1 rounded" style={{ backgroundColor: tmpl.palette.text }} title={`Texto: ${tmpl.palette.text}`} />
                            </div>
                          </div>

                          {/* Typography */}
                          <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                              <Type className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Combinación Tipográfica:</span>
                            </div>
                            <div className="text-xs font-bold text-indigo-200">{tmpl.typography.headingFont}</div>
                            <div className="text-[11px] text-slate-400">+ {tmpl.typography.bodyFont}</div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                          {tmpl.isCustom && (
                            <button
                              onClick={() => onDeleteTemplate(tmpl.id)}
                              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Eliminar</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedTemplateId(tmpl.id);
                              setIsCreateModalOpen(true);
                            }}
                            className="ml-auto px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1"
                          >
                            <span>Usar en Proyecto</span>
                            <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Create New Project */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <DialogTitle>Nuevo Proyecto de Landing Page</DialogTitle>
                <DialogDescription>Crea tu proyecto manualmente o estructúralo automáticamente con Inteligencia Artificial</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Modal Creation Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121212] border border-[#2A2A2A] rounded-xl mt-1">
            <button
              type="button"
              onClick={() => setCreateMode("manual")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 ${
                createMode === "manual"
                  ? "bg-indigo-600 text-white shadow font-bold"
                  : "text-[#888] hover:text-white"
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Configuración Manual</span>
            </button>

            <button
              type="button"
              onClick={() => setCreateMode("ai")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 ${
                createMode === "ai"
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white shadow font-bold"
                  : "text-[#888] hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Mediante IA (Gemini)</span>
            </button>
          </div>

          {/* TAB 1: MANUAL FORM */}
          {createMode === "manual" && (
            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Proyecto <span className="text-rose-400">*</span>
                </label>
                <Input
                  required
                  placeholder="Ej: SaaS AI Analytics Landing"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Industria / Categoría
                  </label>
                  <Input
                    placeholder="Ej: B2B Software, Fintech..."
                    value={newProjectIndustry}
                    onChange={(e) => setNewProjectIndustry(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Estilo Visual (Opcional)
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Paleta por Defecto de Plantilla</option>
                    {templates.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name} ({tmpl.palette.name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Descripción / Propuesta de Valor Corta
                </label>
                <textarea
                  rows={2}
                  placeholder="Objetivos clave del producto o propuesta de valor principal..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-[#E0E0E0] placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Landing Page Structure Selector */}
              <div className="space-y-2 border-t border-[#2A2A2A] pt-3">
                <label className="block text-xs font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
                  Estructura Inicial de Secciones:
                </label>

                <select
                  value={
                    useMasterTemplate
                      ? "master"
                      : selectedTemplateId && LANDING_PAGE_TEMPLATES.some((t) => t.id === selectedTemplateId)
                      ? selectedTemplateId
                      : "blank"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "master") {
                      setUseMasterTemplate(true);
                      setSelectedTemplateId("");
                    } else if (val === "blank") {
                      setUseMasterTemplate(false);
                      setSelectedTemplateId("");
                    } else {
                      setUseMasterTemplate(false);
                      setSelectedTemplateId(val);
                    }
                  }}
                  className="w-full bg-[#121212] border border-indigo-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="master">
                    ⭐ Master Landing Page (13 Secciones Completas - Lovable Standards)
                  </option>
                  <optgroup label="--- 10 PLANTILLAS DE LANDING PAGE ---">
                    {LANDING_PAGE_TEMPLATES.map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        {tmpl.name} — {tmpl.lengthTag}
                      </option>
                    ))}
                  </optgroup>
                  <option value="blank">⚪ Proyecto en Blanco (3 Secciones Iniciales Base)</option>
                </select>

                {/* Preview Box of selected landing structure */}
                {LANDING_PAGE_TEMPLATES.some((t) => t.id === selectedTemplateId) && (
                  <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-3 text-xs space-y-1">
                    {(() => {
                      const sel = LANDING_PAGE_TEMPLATES.find((t) => t.id === selectedTemplateId);
                      if (!sel) return null;
                      return (
                        <>
                          <div className="font-bold text-indigo-200 flex items-center justify-between">
                            <span>{sel.name}</span>
                            <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full">
                              {sel.sectionCount} Secciones
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{sel.description}</p>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="default"
                >
                  Crear e Iniciar Proyecto
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* TAB 2: AI GENERATION FORM */}
          {createMode === "ai" && (
            <form onSubmit={handleAiCreateSubmit} className="space-y-4 pt-2">
              {/* Explanatory Banner */}
              <div className="bg-gradient-to-r from-purple-950/50 via-indigo-950/40 to-slate-900 border border-purple-500/30 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Wand2 className="w-4 h-4 text-purple-300" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-purple-200">Estructuración Automatizada con Gemini AI</div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Escribe tu prompt o idea de negocio. La IA diseñará el nombre del proyecto, la paleta de colores inteligente, la combinación tipográfica y organizará entre 6 y 10 secciones de alta conversión con sus borradores de copy.
                  </p>
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Prompt / Idea del Proyecto o Negocio <span className="text-rose-400">*</span>
                  </span>
                  <span className="text-[10px] text-purple-300 font-mono">Gemini 3.6 Flash</span>
                </label>
                <textarea
                  required
                  rows={4}
                  disabled={isGeneratingAiProject}
                  placeholder="Ejemplo: Una plataforma SaaS B2B de inteligencia artificial que gestiona reservas para restaurantes con chatbot en WhatsApp. Queremos captar leads para una demostración gratuita de 14 días. Incluye testimonios de chefs, calculadora de ROI, bento grid de funciones y tabla de precios..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-[#121212] border border-purple-500/30 rounded-xl p-3.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none leading-relaxed"
                />
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Bot className="w-3 h-3 text-purple-400" />
                  <span>Sugerencias de prompts (haz clic para usar):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "🚀 SaaS B2B de IA para atención al cliente con demo interactiva y precios",
                    "🏋️‍♂️ Gimnasio boutique con reservas de clases, testimonios y pase gratis",
                    "🎓 Academia online de finanzas personales e inversiones para jóvenes",
                    "☕ Ecommerce D2C de café gourmet de origen con suscripción mensual",
                    "🎨 Agencia de diseño y branding con portafolio interactivo y cotizador",
                  ].map((promptIdea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={isGeneratingAiProject}
                      onClick={() => setAiPrompt(promptIdea)}
                      className="text-[11px] bg-[#1A1A28] hover:bg-purple-900/40 text-purple-200 hover:text-white border border-purple-500/20 hover:border-purple-500/50 px-2.5 py-1 rounded-lg transition text-left"
                    >
                      {promptIdea}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Error Alert */}
              {aiError && (
                <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              {/* Loading State Indicator */}
              {isGeneratingAiProject && (
                <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-4 text-center space-y-2 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-purple-200 text-xs font-bold">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span>Estructurando proyecto con Gemini AI...</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Analizando propuesta de valor, creando paleta de colores, tipografía y organizando secciones estratégicas de alta conversión.
                  </p>
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isGeneratingAiProject}
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isGeneratingAiProject || !aiPrompt.trim()}
                  className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/40 flex items-center gap-2"
                >
                  {isGeneratingAiProject ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Estructurando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Generar Estructura Completa con IA</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
