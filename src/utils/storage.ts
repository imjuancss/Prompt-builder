import { Project, StylePreset, ProjectHistoryLog } from "../types";
import { INITIAL_PRESET_TEMPLATES, PRESET_PALETTES, PRESET_TYPOGRAPHY, DEFAULT_SECTION_TYPES } from "../data/presets";
import { buildSectionPrompt } from "./promptGenerator";

const PROJECTS_STORAGE_KEY = "landing_prompt_architect_projects_v3";
const TEMPLATES_STORAGE_KEY = "landing_prompt_architect_templates_v3";

// Helper: Generate a unique ID
export function generateId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
}

// Storage Operations: Projects
export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error loading projects from storage:", err);
    return [];
  }
}

export function saveProjects(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error("Error saving projects to storage:", err);
  }
}

export function saveProject(project: Project): Project[] {
  const all = loadProjects();
  const existingIdx = all.findIndex((p) => p.id === project.id);
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    all[existingIdx] = updatedProject;
  } else {
    all.unshift(updatedProject);
  }

  saveProjects(all);
  return all;
}

export function deleteProject(projectId: string): Project[] {
  const all = loadProjects();
  const filtered = all.filter((p) => p.id !== projectId);
  saveProjects(filtered);
  return filtered;
}

export function addHistoryLog(project: Project, action: string, details?: string): Project {
  const newLog: ProjectHistoryLog = {
    id: generateId("log"),
    timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    action,
    details,
  };

  const updatedHistory = [newLog, ...(project.history || [])].slice(0, 30); // Keep last 30 logs
  const updatedProject = {
    ...project,
    history: updatedHistory,
    updatedAt: new Date().toISOString(),
  };

  saveProject(updatedProject);
  return updatedProject;
}

// Storage Operations: Style Templates
export function loadStyleTemplates(): StylePreset[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Error loading style templates:", err);
    return [];
  }
}

export function saveStyleTemplates(templates: StylePreset[]): void {
  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  } catch (err) {
    console.error("Error saving style templates:", err);
  }
}

export function addStyleTemplate(template: Omit<StylePreset, "id">): StylePreset[] {
  const all = loadStyleTemplates();
  const newTmpl: StylePreset = {
    ...template,
    id: generateId("tmpl"),
    isCustom: true,
  };
  const updated = [newTmpl, ...all];
  saveStyleTemplates(updated);
  return updated;
}

export function deleteStyleTemplate(templateId: string): StylePreset[] {
  const all = loadStyleTemplates();
  const filtered = all.filter((t) => t.id !== templateId);
  saveStyleTemplates(filtered);
  return filtered;
}
