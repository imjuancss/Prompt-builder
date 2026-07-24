import React, { useState } from "react";
import { Project, StylePreset } from "../types";
import { Plus, FolderKanban, Sparkles, Copy, Trash2, ArrowRight, Layers, Palette, Type, Clock, Search, Cpu } from "lucide-react";
import { PRESET_PALETTES, PRESET_TYPOGRAPHY } from "../data/presets";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface DashboardProps {
  projects: Project[];
  templates: StylePreset[];
  onOpenProject: (projectId: string) => void;
  onCreateProject: (projectData: { name: string; description: string; industry: string; templateId?: string }) => void;
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
  onDuplicateProject,
  onDeleteProject,
  onDeleteTemplate,
  onOpenAiContext,
}) => {

  const [activeTab, setActiveTab] = useState<"projects" | "templates">("projects");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project Form State
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectIndustry, setNewProjectIndustry] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

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
    });

    setNewProjectName("");
    setNewProjectDesc("");
    setNewProjectIndustry("");
    setSelectedTemplateId("");
    setIsCreateModalOpen(false);
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

            {onOpenAiContext && (
              <button
                onClick={onOpenAiContext}
                className="px-3 py-1.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-500/30 font-medium text-xs rounded transition flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Guía IA</span>
              </button>
            )}

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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicateProject(project);
                            }}
                            className="p-1 rounded bg-[#222] hover:bg-[#2A2A2A] text-[#AAA] border border-[#333] transition"
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
          <div>
            {templates.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Layers className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">No hay plantillas guardadas aún</h3>
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

      {/* Modal: Create New Project */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle>Nuevo Proyecto de Landing Page</DialogTitle>
                <DialogDescription>Define los parámetros iniciales de la landing page</DialogDescription>
              </div>
            </div>
          </DialogHeader>

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

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Industria / Categoría
              </label>
              <Input
                placeholder="Ej: B2B Software, Fintech, Salud, Educación"
                value={newProjectIndustry}
                onChange={(e) => setNewProjectIndustry(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descripción Corta
              </label>
              <textarea
                rows={2}
                placeholder="Objetivos clave del producto o propuesta de valor principal..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-[#E0E0E0] placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Plantilla de Estilo Inicial (Opcional)
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Usar Paleta SaaS Predeterminada</option>
                {templates.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.name} ({tmpl.palette.name})
                  </option>
                ))}
              </select>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};
