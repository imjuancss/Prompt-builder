import React, { useState, useEffect } from "react";
import { Project } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, FolderKanban, Building2, FileText, Target } from "lucide-react";

interface EditProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onSave: (updatedProject: Project) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  project,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setIndustry(project.industry || "");
      setDescription(project.description || "");
      setValueProposition(project.conversionVars?.valueProposition || "");
      setTargetAudience(project.conversionVars?.targetAudience || "");
    }
  }, [project, isOpen]);

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedProject: Project = {
      ...project,
      name: name.trim(),
      industry: industry.trim() || "Digital & Tech",
      description: description.trim(),
      conversionVars: {
        ...project.conversionVars,
        valueProposition: valueProposition.trim() || project.conversionVars.valueProposition,
        targetAudience: targetAudience.trim() || project.conversionVars.targetAudience,
      },
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedProject);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#181818] border-[#2A2A2A] text-[#E0E0E0]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Pencil className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-white text-base font-bold">Editar Información del Proyecto</DialogTitle>
              <DialogDescription className="text-xs text-[#888]">
                Modifica el nombre, categoría, descripción y propuesta de valor inicial
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Nombre del Proyecto */}
          <div>
            <label className="block text-xs font-semibold text-[#CCC] mb-1 flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
              <span>Nombre del Proyecto</span>
              <span className="text-rose-400">*</span>
            </label>
            <Input
              required
              placeholder="Ej: SaaS AI Analytics Landing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#121212] border-[#2A2A2A] text-white focus:border-blue-500 text-xs"
            />
          </div>

          {/* Industria / Categoría */}
          <div>
            <label className="block text-xs font-semibold text-[#CCC] mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Industria / Categoría</span>
            </label>
            <Input
              placeholder="Ej: B2B Software, Fintech, Salud, Educación"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="bg-[#121212] border-[#2A2A2A] text-white focus:border-blue-500 text-xs"
            />
          </div>

          {/* Descripción Corta */}
          <div>
            <label className="block text-xs font-semibold text-[#CCC] mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Descripción del Proyecto</span>
            </label>
            <textarea
              rows={2}
              placeholder="Objetivos clave del producto o propuesta de valor principal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#121212] border border-[#2A2A2A] rounded-md px-3 py-2 text-xs text-[#E0E0E0] placeholder-[#666] focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Propuesta de Valor */}
          <div>
            <label className="block text-xs font-semibold text-[#CCC] mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Propuesta de Valor Principal</span>
            </label>
            <Input
              placeholder="Ej: Automatiza tus reportes financieros en tiempo real"
              value={valueProposition}
              onChange={(e) => setValueProposition(e.target.value)}
              className="bg-[#121212] border-[#2A2A2A] text-white focus:border-blue-500 text-xs"
            />
          </div>

          {/* Público Objetivo */}
          <div>
            <label className="block text-xs font-semibold text-[#CCC] mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span>Público Objetivo</span>
            </label>
            <Input
              placeholder="Ej: Directores de Finanzas y CFOs de startups"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="bg-[#121212] border-[#2A2A2A] text-white focus:border-blue-500 text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-[#222] hover:bg-[#2A2A2A] text-[#CCC] border-[#333] text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
