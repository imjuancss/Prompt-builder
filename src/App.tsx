import React, { useState, useEffect } from "react";
import { Project, Section, StylePreset, ColorPalette, TypographyPair, ConversionVariables } from "./types";
import {
  loadProjects,
  saveProject,
  deleteProject,
  addHistoryLog,
  loadStyleTemplates,
  addStyleTemplate,
  deleteStyleTemplate,
  generateId,
} from "./utils/storage";
import { DEFAULT_SECTION_TYPES, PRESET_PALETTES, PRESET_TYPOGRAPHY } from "./data/presets";
import { createMasterLandingProject } from "./data/masterLandingTemplate";
import { LANDING_PAGE_TEMPLATES, createProjectFromLandingTemplate } from "./data/landingPageTemplates";
import { buildSectionPrompt } from "./utils/promptGenerator";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Components
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { ProjectWorkspace } from "./components/ProjectWorkspace";
import { StyleConfigView } from "./components/StyleConfigView";
import { ConversionVarsModal } from "./components/ConversionVarsModal";
import { AddSectionModal } from "./components/AddSectionModal";
import { GlobalPromptModal } from "./components/GlobalPromptModal";
import { HistoryLogModal } from "./components/HistoryLogModal";
import { AiContextGuideModal } from "./components/AiContextGuideModal";
import { EditProjectModal } from "./components/EditProjectModal";
import { Toast } from "./components/Toast";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<StylePreset[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Autosave State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>("");

  // Modals
  const [activeModal, setActiveModal] = useState<
    "style_config" | "conversion_vars" | "add_section" | "global_prompt" | "history_log" | "ai_context" | null
  >(null);


  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedProjs = loadProjects();
    const loadedTmpls = loadStyleTemplates();
    setProjects(loadedProjs);
    setTemplates(loadedTmpls);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  // Save Project with Autosave indication
  const handleUpdateActiveProject = (updatedProject: Project, actionLogMessage?: string) => {
    setIsSaving(true);

    let finalProject = updatedProject;
    if (actionLogMessage) {
      finalProject = addHistoryLog(updatedProject, actionLogMessage);
    } else {
      saveProject(updatedProject);
    }

    setProjects((prev) => prev.map((p) => (p.id === finalProject.id ? finalProject : p)));

    setTimeout(() => {
      setIsSaving(false);
      setLastSavedTime(
        new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
      );
    }, 300);
  };

  // Save Edited Project Details
  const handleSaveEditedProject = (updatedProj: Project) => {
    // Regenerate generated prompts for all sections using updated project info
    const updatedSections = updatedProj.sections.map((sec) => ({
      ...sec,
      generatedPrompt: buildSectionPrompt(updatedProj, sec),
      updatedAt: new Date().toISOString(),
    }));

    const finalProject: Project = {
      ...updatedProj,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    };

    handleUpdateActiveProject(
      finalProject,
      `Datos del proyecto actualizados: '${finalProject.name}'`
    );
    showToast(`Proyecto '${finalProject.name}' actualizado correctamente.`);
    setEditingProject(null);
  };

  // Create Project
  const handleCreateProject = ({
    name,
    description,
    industry,
    templateId,
    useMasterTemplate = true,
  }: {
    name: string;
    description: string;
    industry: string;
    templateId?: string;
    useMasterTemplate?: boolean;
  }) => {
    const matchedTmpl = templates.find((t) => t.id === templateId);

    const initialPalette = matchedTmpl ? matchedTmpl.palette : PRESET_PALETTES[0];
    const initialTypography = matchedTmpl ? matchedTmpl.typography : PRESET_TYPOGRAPHY[0];

    const newProjId = generateId("proj");

    // Check if a specific landing page template was selected
    const landingTmpl = LANDING_PAGE_TEMPLATES.find((t) => t.id === templateId);
    if (landingTmpl) {
      const createdFromLanding = createProjectFromLandingTemplate(
        landingTmpl.id,
        name,
        description,
        industry,
        newProjId
      );

      if (createdFromLanding) {
        // Apply style override if a custom style template was matched too
        if (matchedTmpl) {
          createdFromLanding.styleConfig = {
            palette: matchedTmpl.palette,
            typography: matchedTmpl.typography,
            globalVibe: matchedTmpl.vibe,
          };
          createdFromLanding.sections = createdFromLanding.sections.map((sec) => ({
            ...sec,
            generatedPrompt: buildSectionPrompt(createdFromLanding, sec),
          }));
        }

        const updatedProjects = [createdFromLanding, ...projects];
        setProjects(updatedProjects);
        saveProject(createdFromLanding);
        setActiveProjectId(newProjId);
        showToast(`Proyecto '${name}' creado desde plantilla '${landingTmpl.name}' (${landingTmpl.sectionCount} secciones).`);
        return;
      }
    }

    if (useMasterTemplate) {
      // Create from full 13-section master template
      const masterTemplate = createMasterLandingProject(newProjId);
      const newProject: Project = {
        ...masterTemplate,
        name,
        description: description || masterTemplate.description,
        industry: industry || masterTemplate.industry,
        styleConfig: {
          palette: initialPalette,
          typography: initialTypography,
          globalVibe: matchedTmpl?.vibe || masterTemplate.styleConfig.globalVibe,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [
          {
            id: generateId("log"),
            timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            action: "Proyecto creado desde la Plantilla Maestra de Conversión (Lovable Standards)",
            details: `Inicializado con 13 secciones de alta conversión y estilo '${matchedTmpl?.name || "SaaS Indigo"}'.`,
          },
        ],
      };

      // Regenerate prompts for all 13 sections with project details
      newProject.sections = newProject.sections.map((sec) => ({
        ...sec,
        generatedPrompt: buildSectionPrompt(newProject, sec),
        updatedAt: new Date().toISOString(),
      }));

      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      saveProject(newProject);
      setActiveProjectId(newProjId);
      showToast(`Proyecto '${name}' creado con 13 secciones maestras de alta conversión.`);
      return;
    }

    const newProject: Project = {
      id: newProjId,
      name,
      description,
      industry,
      conversionVars: {
        tone: "SaaS Tech / Moderno",
        layoutPattern: "F-Pattern (Lectura Fluida)",
        targetAudience: "Clientes potenciales y tomadores de decisión",
        primaryGoal: "Conseguir registros o ventas directas",
        valueProposition: description || "Solución innovadora para impulsar conversiones.",
        socialProofDensity: "Alta (Testimonios + Logos + Métricas + Badges)",
        interactivity: "Transiciones suaves con Framer Motion y hover de tarjetas",
        framework: "Tailwind CSS v4 + React + Lucide Icons",
        urgencyTriggers: true,
        stickyCta: true,
      },
      styleConfig: {
        palette: initialPalette,
        typography: initialTypography,
        globalVibe: matchedTmpl?.vibe || "Moderno, limpio y profesional",
      },
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [],
    };

    // Add 3 default initial sections (Hero, Features, Pricing)
    const heroDef = DEFAULT_SECTION_TYPES[0];
    const featDef = DEFAULT_SECTION_TYPES[2];
    const priceDef = DEFAULT_SECTION_TYPES[7];

    const sec1 = {
      id: generateId("sec"),
      type: heroDef.type,
      title: heroDef.title,
      order: 1,
      description: heroDef.description,
      contentObjective: heroDef.contentObjective,
      keyElements: heroDef.defaultElements,
      copyDraft: heroDef.defaultCopy,
      sectionStyleOverrides: { bgStyle: "Solid Surface" as const, layoutVariant: "Split 50/50" as const },
      generatedPrompt: "",
      updatedAt: new Date().toISOString(),
    };

    const sec2 = {
      id: generateId("sec"),
      type: featDef.type,
      title: featDef.title,
      order: 2,
      description: featDef.description,
      contentObjective: featDef.contentObjective,
      keyElements: featDef.defaultElements,
      copyDraft: featDef.defaultCopy,
      sectionStyleOverrides: { bgStyle: "Solid Primary" as const, layoutVariant: "Bento Grid 3 Cols" as const },
      generatedPrompt: "",
      updatedAt: new Date().toISOString(),
    };

    const sec3 = {
      id: generateId("sec"),
      type: priceDef.type,
      title: priceDef.title,
      order: 3,
      description: priceDef.description,
      contentObjective: priceDef.contentObjective,
      keyElements: priceDef.defaultElements,
      copyDraft: priceDef.defaultCopy,
      sectionStyleOverrides: { bgStyle: "Solid Surface" as const, layoutVariant: "Centered Focus" as const },
      generatedPrompt: "",
      updatedAt: new Date().toISOString(),
    };

    sec1.generatedPrompt = buildSectionPrompt(newProject, sec1);
    sec2.generatedPrompt = buildSectionPrompt(newProject, sec2);
    sec3.generatedPrompt = buildSectionPrompt(newProject, sec3);

    newProject.sections = [sec1, sec2, sec3];
    newProject.history = [
      {
        id: generateId("log"),
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        action: "Proyecto creado exitosamente",
        details: `Inicializado con 3 secciones base y plantilla '${matchedTmpl?.name || "SaaS Base"}'.`,
      },
    ];

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    saveProject(newProject);
    setActiveProjectId(newProjId);
    showToast(`Proyecto '${name}' creado correctamente.`);
  };

  // Create Project From AI Generated Data
  const handleCreateProjectFromAi = (aiData: any) => {
    const newProjId = generateId("proj");
    const now = new Date().toISOString();

    const rawSections = Array.isArray(aiData.sections) ? aiData.sections : [];

    const newProject: Project = {
      id: newProjId,
      name: aiData.name || "Landing Page IA",
      description: aiData.description || "",
      industry: aiData.industry || "SaaS / Digital",
      conversionVars: {
        tone: aiData.conversionVars?.tone || "SaaS Tech / Moderno",
        layoutPattern: aiData.conversionVars?.layoutPattern || "F-Pattern (Lectura Fluida)",
        targetAudience: aiData.conversionVars?.targetAudience || "Clientes potenciales y tomadores de decisión",
        primaryGoal: aiData.conversionVars?.primaryGoal || "Conseguir registros o ventas directas",
        valueProposition: aiData.conversionVars?.valueProposition || aiData.description || "Solución innovadora para impulsar conversiones.",
        socialProofDensity: aiData.conversionVars?.socialProofDensity || "Alta (Testimonios + Logos + Métricas + Badges)",
        interactivity: aiData.conversionVars?.interactivity || "Transiciones fluidas y microinteracciones responsive",
        framework: "Tailwind CSS v4 + React + Lucide Icons",
        urgencyTriggers: aiData.conversionVars?.urgencyTriggers ?? true,
        stickyCta: aiData.conversionVars?.stickyCta ?? true,
        impeccableCraft: true,
      },
      styleConfig: {
        palette: {
          name: aiData.styleConfig?.palette?.name || "Paleta Personalizada IA",
          primary: aiData.styleConfig?.palette?.primary || "#4F46E5",
          secondary: aiData.styleConfig?.palette?.secondary || "#06B6D4",
          accent: aiData.styleConfig?.palette?.accent || "#F59E0B",
          background: aiData.styleConfig?.palette?.background || "#0F172A",
          surface: aiData.styleConfig?.palette?.surface || "#1E293B",
          text: aiData.styleConfig?.palette?.text || "#F8FAFC",
          textMuted: aiData.styleConfig?.palette?.textMuted || "#94A3B8",
        },
        typography: {
          name: aiData.styleConfig?.typography?.name || "Tipografía Gemini AI",
          headingFont: aiData.styleConfig?.typography?.headingFont || "Plus Jakarta Sans",
          bodyFont: aiData.styleConfig?.typography?.bodyFont || "Inter",
        },
        globalVibe: aiData.styleConfig?.globalVibe || "Generado por Inteligencia Artificial según prompt",
      },
      sections: [],
      createdAt: now,
      updatedAt: now,
      history: [
        {
          id: generateId("log"),
          timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          action: "Proyecto estructurado con Inteligencia Artificial (Gemini)",
          details: `Estructura generada con ${rawSections.length} secciones personalizadas y paleta de colores inteligente.`,
        },
      ],
    };

    // Format and calculate generatedPrompt for each section
    const formattedSections: Section[] = rawSections.map((sec: any, idx: number) => {
      const secId = generateId("sec");
      const sectionObj: Section = {
        id: secId,
        type: sec.type || "custom",
        title: sec.title || `${idx + 1}. Sección`,
        order: idx + 1,
        description: sec.description || "",
        contentObjective: sec.contentObjective || "",
        keyElements: Array.isArray(sec.keyElements) ? sec.keyElements : [],
        copyDraft: {
          headline: sec.copyDraft?.headline || "",
          subheadline: sec.copyDraft?.subheadline || "",
          ctaText: sec.copyDraft?.ctaText || "Comenzar Ahora",
          secondaryCtaText: sec.copyDraft?.secondaryCtaText || "",
          bulletPoints: Array.isArray(sec.copyDraft?.bulletPoints) ? sec.copyDraft.bulletPoints : [],
        },
        sectionStyleOverrides: sec.sectionStyleOverrides || {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)",
        },
        generatedPrompt: "",
        updatedAt: now,
        isAiEnhanced: true,
      };

      sectionObj.generatedPrompt = buildSectionPrompt(newProject, sectionObj);
      return sectionObj;
    });

    newProject.sections = formattedSections;

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    saveProject(newProject);
    setActiveProjectId(newProjId);
    showToast(`✨ Proyecto '${newProject.name}' estructurado con IA (${formattedSections.length} secciones).`);
  };

  // Duplicate Project
  const handleDuplicateProject = (proj: Project) => {
    const dupId = generateId("proj");
    const dupProject: Project = {
      ...proj,
      id: dupId,
      name: `${proj.name} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          id: generateId("log"),
          timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          action: "Proyecto duplicado desde copia previa",
        },
      ],
    };

    const updated = [dupProject, ...projects];
    setProjects(updated);
    saveProject(dupProject);
    showToast(`Proyecto duplicado como '${dupProject.name}'.`);
  };

  // Delete Project
  const handleDeleteProject = (projId: string) => {
    const remaining = deleteProject(projId);
    setProjects(remaining);
    if (activeProjectId === projId) {
      setActiveProjectId(null);
    }
    setProjectToDeleteId(null);
    showToast("Proyecto eliminado correctamente.");
  };

  // Add Section
  const handleAddSection = (secData: {
    type: any;
    title: string;
    description: string;
    contentObjective: string;
    keyElements: string[];
    copyDraft: any;
  }) => {
    if (!activeProject) return;

    const newSecId = generateId("sec");
    const newOrder = activeProject.sections.length + 1;

    const rawSec = {
      id: newSecId,
      type: secData.type,
      title: secData.title,
      order: newOrder,
      description: secData.description,
      contentObjective: secData.contentObjective,
      keyElements: secData.keyElements,
      copyDraft: secData.copyDraft,
      sectionStyleOverrides: { bgStyle: "Solid Surface" as const, layoutVariant: "Centered Focus" as const },
      generatedPrompt: "",
      updatedAt: new Date().toISOString(),
    };

    const promptText = buildSectionPrompt(activeProject, rawSec);
    const finalSec = { ...rawSec, generatedPrompt: promptText };

    const updatedProject = {
      ...activeProject,
      sections: [...activeProject.sections, finalSec],
      updatedAt: new Date().toISOString(),
    };

    handleUpdateActiveProject(updatedProject, `Nueva sección '${finalSec.title}' agregada`);
    showToast(`Sección '${finalSec.title}' agregada al proyecto.`);
  };

  // Save Style Config
  const handleSaveStyleConfig = (styleConfig: Project["styleConfig"]) => {
    if (!activeProject) return;

    // Regenerate all section prompts with the new style rules
    const updatedSections = activeProject.sections.map((sec) => {
      const updatedSec = { ...sec, updatedAt: new Date().toISOString() };
      return {
        ...updatedSec,
        generatedPrompt: buildSectionPrompt({ ...activeProject, styleConfig }, updatedSec),
      };
    });

    const updatedProject = {
      ...activeProject,
      styleConfig,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    };

    handleUpdateActiveProject(updatedProject, "Paleta de colores y fuentes actualizadas");
    showToast("¡Estilos visuales actualizados en todas las secciones!");
  };

  // Save as Template
  const handleSaveAsTemplate = (
    name: string,
    palette: ColorPalette,
    typography: TypographyPair,
    vibe: string
  ) => {
    const updated = addStyleTemplate({
      name,
      palette,
      typography,
      vibe,
    });
    setTemplates(updated);
    showToast(`Plantilla '${name}' guardada exitosamente.`);
  };

  // Delete Custom Template
  const handleDeleteTemplate = (tmplId: string) => {
    const remaining = deleteStyleTemplate(tmplId);
    setTemplates(remaining);
    showToast("Plantilla eliminada.");
  };

  // Save Conversion Variables
  const handleSaveConversionVars = (vars: ConversionVariables) => {
    if (!activeProject) return;

    const updatedSections = activeProject.sections.map((sec) => ({
      ...sec,
      generatedPrompt: buildSectionPrompt({ ...activeProject, conversionVars: vars }, sec),
    }));

    const updatedProject = {
      ...activeProject,
      conversionVars: vars,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    };

    handleUpdateActiveProject(updatedProject, "Variables de conversión CRO actualizadas");
    showToast("Variables CRO y tono de diseño guardados.");
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* App Header */}
      <Header
        currentProjectName={activeProject?.name}
        isSaving={isSaving}
        lastSavedTime={lastSavedTime}
        onGoToDashboard={() => setActiveProjectId(null)}
        onOpenConversionVars={() => setActiveModal("conversion_vars")}
        onOpenGlobalPrompt={() => setActiveModal("global_prompt")}
        onOpenStyleConfig={() => setActiveModal("style_config")}
        onOpenHistory={() => setActiveModal("history_log")}
        onOpenAiContext={() => setActiveModal("ai_context")}
      />

      {/* Main Content Area */}
      <main>
        {activeModal === "style_config" && activeProject ? (
          <StyleConfigView
            project={activeProject}
            onSaveStyle={handleSaveStyleConfig}
            onSaveAsTemplate={handleSaveAsTemplate}
            onClose={() => setActiveModal(null)}
          />
        ) : activeProject ? (
          <ProjectWorkspace
            project={activeProject}
            onUpdateProject={(up, actionMsg) => handleUpdateActiveProject(up, actionMsg)}
            onOpenStyleConfig={() => setActiveModal("style_config")}
            onOpenConversionVars={() => setActiveModal("conversion_vars")}
            onOpenGlobalPrompt={() => setActiveModal("global_prompt")}
            onOpenHistory={() => setActiveModal("history_log")}
            onOpenAddSectionModal={() => setActiveModal("add_section")}
            onShowToast={showToast}
            onOpenAiContext={() => setActiveModal("ai_context")}
            onOpenEditProject={() => setEditingProject(activeProject)}
            onDeleteProject={() => setProjectToDeleteId(activeProject.id)}
          />
        ) : (
          <Dashboard
            projects={projects}
            templates={templates}
            onOpenProject={(pId) => setActiveProjectId(pId)}
            onCreateProject={handleCreateProject}
            onCreateProjectFromAi={handleCreateProjectFromAi}
            onEditProject={(proj) => setEditingProject(proj)}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={(pId) => setProjectToDeleteId(pId)}
            onDeleteTemplate={handleDeleteTemplate}
            onOpenAiContext={() => setActiveModal("ai_context")}
          />
        )}
      </main>

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveEditedProject}
      />

      {/* MODALS */}
      {projectToDeleteId && (
        <Dialog open={!!projectToDeleteId} onOpenChange={() => setProjectToDeleteId(null)}>
          <DialogContent className="bg-[#181818] border-[#2A2A2A] text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-rose-400 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                <span>Eliminar Proyecto</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-300 pt-2">
                ¿Estás seguro de que deseas eliminar permanentemente el proyecto{" "}
                <strong className="text-white font-semibold">
                  "{projects.find((p) => p.id === projectToDeleteId)?.name || "este proyecto"}"
                </strong>
                ? Esta acción eliminará el proyecto y sus secciones de forma permanente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProjectToDeleteId(null)}
                className="bg-[#222] border-[#333] text-slate-300 hover:text-white"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteProject(projectToDeleteId)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Sí, eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {activeModal === "ai_context" && (
        <AiContextGuideModal
          onClose={() => setActiveModal(null)}
          onShowToast={showToast}
        />
      )}

      {activeModal === "conversion_vars" && activeProject && (
        <ConversionVarsModal
          project={activeProject}
          onSaveConversionVars={handleSaveConversionVars}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "add_section" && (
        <AddSectionModal
          onAddSection={handleAddSection}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === "global_prompt" && activeProject && (
        <GlobalPromptModal
          project={activeProject}
          onClose={() => setActiveModal(null)}
          onShowToast={showToast}
        />
      )}

      {activeModal === "history_log" && activeProject && (
        <HistoryLogModal
          project={activeProject}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}
