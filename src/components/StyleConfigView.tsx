import React, { useState, useEffect } from "react";
import { ColorPalette, TypographyPair, ComponentStyleConfig, Project } from "../types";
import { PRESET_PALETTES, PRESET_TYPOGRAPHY, GOOGLE_FONTS_COLLECTION } from "../data/presets";
import { Sparkles, Palette, Type, RefreshCw, BookmarkPlus, Check, Eye, ArrowLeft, Save, Square, Layers, MousePointerClick, Radius, Shapes, Box, Sliders } from "lucide-react";
import { loadGoogleFont, loadGoogleFonts } from "../utils/fontLoader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface StyleConfigViewProps {
  project: Project;
  onSaveStyle: (styleConfig: Project["styleConfig"]) => void;
  onSaveAsTemplate: (name: string, palette: ColorPalette, typography: TypographyPair, vibe: string) => void;
  onClose: () => void;
}

export const StyleConfigView: React.FC<StyleConfigViewProps> = ({
  project,
  onSaveStyle,
  onSaveAsTemplate,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"palette" | "typography" | "components">("palette");

  // Local Editable Palette
  const [palette, setPalette] = useState<ColorPalette>({ ...project.styleConfig.palette });

  // Local Editable Typography
  const [typography, setTypography] = useState<TypographyPair>({ ...project.styleConfig.typography });

  // Local Editable Component & Geometrics Style
  const [componentStyles, setComponentStyles] = useState<ComponentStyleConfig>({
    borderRadius: project.styleConfig.componentStyles?.borderRadius || "lg",
    elevation: project.styleConfig.componentStyles?.elevation || "medium",
    buttonRadius: project.styleConfig.componentStyles?.buttonRadius || "lg",
    buttonPadding: project.styleConfig.componentStyles?.buttonPadding || "standard",
    buttonVariant: project.styleConfig.componentStyles?.buttonVariant || "solid",
  });

  // Custom Editable Preview Text
  const [customPreviewHeadline, setCustomPreviewHeadline] = useState("Titular de Ejemplo con Google Fonts");
  const [customPreviewBody, setCustomPreviewBody] = useState("Este bloque demuestra cómo armonizan la tipografía seleccionada y los colores de superficie y texto principal en tus futuras secciones.");

  // Preload Google Fonts for real rendering
  useEffect(() => {
    if (typography.headingFont) loadGoogleFont(typography.headingFont);
    if (typography.bodyFont) loadGoogleFont(typography.bodyFont);

    if (activeTab === "typography") {
      const allFonts = GOOGLE_FONTS_COLLECTION.map((f) => f.family);
      loadGoogleFonts(allFonts);
    }
  }, [typography.headingFont, typography.bodyFont, activeTab]);

  const [globalVibe, setGlobalVibe] = useState(project.styleConfig.globalVibe || "");

  // AI Prompt State
  const [aiBrandPrompt, setAiBrandPrompt] = useState("");
  const [aiMoodPrompt, setAiMoodPrompt] = useState("Moderno y Limpio");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Template Save State
  const [templateName, setTemplateName] = useState("");
  const [showSaveTemplateForm, setShowSaveTemplateForm] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleColorChange = (key: keyof ColorPalette, value: string) => {
    setPalette((prev) => ({ ...prev, [key]: value }));
  };

  const handleAiSuggest = async () => {
    try {
      setIsAiLoading(true);
      setAiError(null);

      const res = await fetch("/api/gemini/suggest-palette-font", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandDescription: aiBrandPrompt || project.industry || project.name,
          mood: aiMoodPrompt,
        }),
      });

      if (!res.ok) {
        throw new Error("Error al consultar la API de sugerencias.");
      }

      const data = await res.json();
      if (data.palette) {
        setPalette(data.palette);
      }
      if (data.typography) {
        setTypography(data.typography);
      }
      if (data.palette?.description) {
        setGlobalVibe(data.palette.description);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "No se pudo generar la paleta con IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyAndSave = () => {
    onSaveStyle({
      palette,
      typography,
      globalVibe,
      componentStyles,
    });
    onClose();
  };

  const handleSaveAsTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim()) return;

    onSaveAsTemplate(
      templateName.trim(),
      palette,
      typography,
      globalVibe || "Plantilla personalizada de diseño"
    );

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setShowSaveTemplateForm(false);
    setTemplateName("");
  };

  // Helper mappings for real-time visual rendering
  const getBorderRadiusClass = (radius?: string) => {
    switch (radius) {
      case "none": return "rounded-none";
      case "sm": return "rounded-md";
      case "md": return "rounded-xl";
      case "lg": return "rounded-2xl";
      case "xl": return "rounded-3xl";
      case "full": return "rounded-[2rem]";
      default: return "rounded-2xl";
    }
  };

  const getElevationClass = (elevation?: string) => {
    switch (elevation) {
      case "none": return "shadow-none border border-[#2A2A2A]";
      case "subtle": return "shadow-md border border-[#2A2A2A]";
      case "medium": return "shadow-xl border border-[#3A3A3A]";
      case "high": return "shadow-2xl border border-[#4A4A4A]";
      case "glow": return "shadow-[0_0_25px_rgba(99,102,241,0.45)] border border-indigo-500/50";
      default: return "shadow-xl border border-[#3A3A3A]";
    }
  };

  const getButtonRadiusClass = (radius?: string) => {
    switch (radius) {
      case "none": return "rounded-none";
      case "sm": return "rounded-md";
      case "md": return "rounded-xl";
      case "lg": return "rounded-2xl";
      case "full": return "rounded-full";
      default: return "rounded-xl";
    }
  };

  const getButtonPaddingClass = (padding?: string) => {
    switch (padding) {
      case "compact": return "px-3.5 py-1.5 text-[11px] font-bold";
      case "standard": return "px-5 py-2.5 text-xs font-bold";
      case "spacious": return "px-7 py-3.5 text-sm font-extrabold";
      default: return "px-5 py-2.5 text-xs font-bold";
    }
  };

  const getButtonVariantStyle = (
    variant?: string,
    primaryColor = "#4F46E5",
    secondaryColor = "#06B6D4",
    textColor = "#FFFFFF",
    isSecondary = false
  ) => {
    if (!isSecondary) {
      switch (variant) {
        case "gradient":
          return {
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            color: "#FFFFFF",
            border: "none",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          };
        case "glass":
          return {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(12px)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          };
        case "outline-glow":
          return {
            backgroundColor: "transparent",
            color: textColor,
            border: `2px solid ${primaryColor}`,
            boxShadow: `0 0 15px ${primaryColor}66`,
          };
        case "3d":
          return {
            backgroundColor: primaryColor,
            color: "#FFFFFF",
            borderBottom: "4px solid rgba(0,0,0,0.4)",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          };
        case "solid":
        default:
          return {
            backgroundColor: primaryColor,
            color: "#FFFFFF",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.18)",
          };
      }
    } else {
      // SECONDARY BUTTON: Shares identical physical dimensions, radius, and padding, adapted color treatment
      switch (variant) {
        case "gradient":
          return {
            background: `linear-gradient(135deg, ${secondaryColor}25, ${primaryColor}15)`,
            color: textColor,
            border: `1.5px solid ${secondaryColor}77`,
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          };
        case "glass":
          return {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(12px)",
            color: textColor,
            border: `1px solid ${textColor}25`,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          };
        case "outline-glow":
          return {
            backgroundColor: "transparent",
            color: textColor,
            border: `2px solid ${secondaryColor}`,
            boxShadow: `0 0 12px ${secondaryColor}44`,
          };
        case "3d":
          return {
            backgroundColor: "transparent",
            color: textColor,
            border: `2px solid ${textColor}40`,
            borderBottom: `4px solid ${textColor}60`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          };
        case "solid":
        default:
          return {
            backgroundColor: `${secondaryColor}20`,
            color: textColor,
            border: `1.5px solid ${secondaryColor}50`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          };
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#121212] text-[#E0E0E0] p-4 sm:p-6 lg:p-8 font-sans pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#2A2A2A] text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Volver al Proyecto</span>
            </button>

            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-400" />
                <span>Configuración de Estilos Visuales</span>
              </h1>
              <p className="text-xs text-slate-400">
                Proyecto: <span className="text-indigo-300 font-semibold">{project.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSaveTemplateForm(!showSaveTemplateForm)}
              className="px-3.5 py-1.5 bg-[#181818] hover:bg-[#252525] border border-[#2A2A2A] text-indigo-400 hover:text-indigo-300 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>Guardar Plantilla</span>
            </button>

            <button
              type="button"
              onClick={handleApplyAndSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Aplicar al Proyecto</span>
            </button>
          </div>
        </div>

        {/* Save Template Inline Drawer if toggled */}
        {showSaveTemplateForm && (
          <form
            onSubmit={handleSaveAsTemplateSubmit}
            className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl space-y-3 animate-in fade-in"
          >
            <h4 className="text-xs font-bold text-indigo-200">
              Guardar Configuración Actual como Plantilla Reutilizable
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                placeholder="Nombre de la plantilla (Ej: Mi Marca Neon SaaS)..."
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="flex-1 bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shrink-0"
              >
                Guardar Plantilla
              </button>
            </div>
          </form>
        )}

        {savedSuccess && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>¡Plantilla guardada exitosamente para futuros proyectos!</span>
          </div>
        )}

        {/* AI Generator Bar */}
        <div className="bg-gradient-to-r from-[#181818] via-indigo-950/30 to-[#181818] p-5 rounded-2xl border border-indigo-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Generar Sistema de Estilos con IA Google Gemini</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Escribe el concepto o marca (Ej: Fintech para startups B2B)..."
              value={aiBrandPrompt}
              onChange={(e) => setAiBrandPrompt(e.target.value)}
              className="sm:col-span-2 bg-[#121212] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              onClick={handleAiSuggest}
              disabled={isAiLoading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Paleta & Fonts</span>
                </>
              )}
            </button>
          </div>

          {aiError && <p className="text-xs text-rose-400">{aiError}</p>}
        </div>

        {/* Two-Column Frame: Left Config Controls | Right Always-Visible Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Configuration Controls (Tabs: Colors, Typography, Components & Geometry) */}
          <div className="lg:col-span-7 space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "palette" | "typography" | "components")}
              className="w-full"
            >
              <TabsList className="bg-[#181818] border border-[#2A2A2A] p-1 rounded-xl mb-6 w-full grid grid-cols-3">
                <TabsTrigger value="palette" className="flex items-center justify-center gap-1.5 text-xs font-bold">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Colores</span>
                </TabsTrigger>
                <TabsTrigger value="typography" className="flex items-center justify-center gap-1.5 text-xs font-bold">
                  <Type className="w-3.5 h-3.5" />
                  <span>Tipografía</span>
                </TabsTrigger>
                <TabsTrigger value="components" className="flex items-center justify-center gap-1.5 text-xs font-bold">
                  <Shapes className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Botones & Forma</span>
                </TabsTrigger>
              </TabsList>

              {/* TAB 1: PALETTE EDITOR */}
              <TabsContent value="palette" className="mt-0">
                <div className="space-y-6">
                  {/* Color Pickers Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Primary */}
                    <div className="bg-[#181818] border border-[#2A2A2A] p-3 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 block">Primario</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={palette.primary}
                          onChange={(e) => handleColorChange("primary", e.target.value)}
                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                        />
                        <input
                          type="text"
                          value={palette.primary}
                          onChange={(e) => handleColorChange("primary", e.target.value)}
                          className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Secondary */}
                    <div className="bg-[#181818] border border-[#2A2A2A] p-3 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 block">Secundario</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={palette.secondary}
                          onChange={(e) => handleColorChange("secondary", e.target.value)}
                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                        />
                        <input
                          type="text"
                          value={palette.secondary}
                          onChange={(e) => handleColorChange("secondary", e.target.value)}
                          className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Accent */}
                    <div className="bg-[#181818] border border-[#2A2A2A] p-3 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 block">Acento</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={palette.accent}
                          onChange={(e) => handleColorChange("accent", e.target.value)}
                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                        />
                        <input
                          type="text"
                          value={palette.accent}
                          onChange={(e) => handleColorChange("accent", e.target.value)}
                          className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Background */}
                    <div className="bg-[#181818] border border-[#2A2A2A] p-3 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 block">Fondo Sección</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={palette.background}
                          onChange={(e) => handleColorChange("background", e.target.value)}
                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                        />
                        <input
                          type="text"
                          value={palette.background}
                          onChange={(e) => handleColorChange("background", e.target.value)}
                          className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="bg-[#181818] border border-[#2A2A2A] p-3 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 block">Texto Principal</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={palette.text}
                          onChange={(e) => handleColorChange("text", e.target.value)}
                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                        />
                        <input
                          type="text"
                          value={palette.text}
                          onChange={(e) => handleColorChange("text", e.target.value)}
                          className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vibe / Style Note */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      Descripción de Atmósfera & Estilo Global (Vibe)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Apariencia limpia, tecnológica, con alto contraste y acentos cyan neón..."
                      value={globalVibe}
                      onChange={(e) => setGlobalVibe(e.target.value)}
                      className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Presets List */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Paletas Prediseñadas Sugeridas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PRESET_PALETTES.map((p) => (
                        <button
                          key={p.name}
                          onClick={() => setPalette(p)}
                          className="text-left bg-[#181818] hover:bg-[#222] p-3.5 rounded-2xl border border-[#2A2A2A] hover:border-indigo-500/50 transition space-y-2 group"
                        >
                          <div className="text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                            {p.name}
                          </div>

                          <div className="flex h-5 rounded-lg overflow-hidden border border-[#2A2A2A] p-0.5 bg-[#121212] gap-1">
                            <div className="flex-1 rounded" style={{ backgroundColor: p.primary }} />
                            <div className="flex-1 rounded" style={{ backgroundColor: p.secondary }} />
                            <div className="flex-1 rounded" style={{ backgroundColor: p.accent }} />
                            <div className="flex-1 rounded" style={{ backgroundColor: p.background }} />
                            <div className="flex-1 rounded" style={{ backgroundColor: p.text }} />
                          </div>

                          <p className="text-[10px] text-slate-400 line-clamp-1">{p.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 2: TYPOGRAPHY EDITOR */}
              <TabsContent value="typography" className="mt-0">
                <div className="space-y-6">
                  {/* Font Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Heading Font Select */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-300">
                          Fuente Títulos (Headings)
                        </label>
                        <span
                          className="text-[11px] font-bold text-indigo-400 font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20"
                          style={{ fontFamily: typography.headingFont }}
                        >
                          {typography.headingFont}
                        </span>
                      </div>
                      <select
                        value={typography.headingFont}
                        onChange={(e) => setTypography((prev) => ({ ...prev, headingFont: e.target.value }))}
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        {GOOGLE_FONTS_COLLECTION.map((font) => (
                          <option key={font.family} value={font.family}>
                            {font.family} ({font.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Body Font Select */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-300">
                          Fuente Cuerpo (Body Text)
                        </label>
                        <span
                          className="text-[11px] font-bold text-cyan-400 font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20"
                          style={{ fontFamily: typography.bodyFont }}
                        >
                          {typography.bodyFont}
                        </span>
                      </div>
                      <select
                        value={typography.bodyFont}
                        onChange={(e) => setTypography((prev) => ({ ...prev, bodyFont: e.target.value }))}
                        className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        {GOOGLE_FONTS_COLLECTION.map((font) => (
                          <option key={font.family} value={font.family}>
                            {font.family} ({font.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Presets & Font Gallery */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Combinaciones Recomendadas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PRESET_TYPOGRAPHY.map((preset) => {
                        const isSelected =
                          typography.headingFont === preset.headingFont &&
                          typography.bodyFont === preset.bodyFont;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => setTypography(preset)}
                            className={`text-left p-3 rounded-xl border transition space-y-1.5 group ${
                              isSelected
                                ? "bg-indigo-950/60 border-indigo-500 text-white shadow-md"
                                : "bg-[#181818] hover:bg-[#222] border-[#2A2A2A] text-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold group-hover:text-indigo-300">{preset.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                            </div>

                            <div className="space-y-1 bg-[#121212] p-2 rounded-lg border border-[#2A2A2A]">
                              <div
                                className="text-xs font-bold text-white truncate"
                                style={{ fontFamily: preset.headingFont }}
                              >
                                {preset.headingFont}
                              </div>
                              <div
                                className="text-[11px] text-slate-400 truncate"
                                style={{ fontFamily: preset.bodyFont }}
                              >
                                {preset.bodyFont}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Google Fonts Visual Collection Picker */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Colección Google Fonts
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {GOOGLE_FONTS_COLLECTION.map((font) => {
                        const isHeading = typography.headingFont === font.family;
                        const isBody = typography.bodyFont === font.family;
                        return (
                          <div
                            key={font.family}
                            className="bg-[#181818] border border-[#2A2A2A] p-3 rounded-xl space-y-2 flex flex-col justify-between hover:border-slate-700 transition"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold text-slate-500 uppercase">{font.category}</span>
                                {(isHeading || isBody) && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    {isHeading && isBody ? "Ambos" : isHeading ? "Títulos" : "Cuerpo"}
                                  </span>
                                )}
                              </div>
                              <div
                                className="text-sm font-bold text-white mt-1"
                                style={{ fontFamily: font.family }}
                              >
                                {font.family}
                              </div>
                            </div>

                            <div className="flex gap-1.5 pt-2 border-t border-[#2A2A2A]">
                              <button
                                onClick={() => setTypography((prev) => ({ ...prev, headingFont: font.family }))}
                                className={`flex-1 py-1 text-[10px] font-bold rounded transition border ${
                                  isHeading
                                    ? "bg-indigo-600 text-white border-indigo-500"
                                    : "bg-[#121212] text-slate-400 hover:text-white border-[#2A2A2A]"
                                }`}
                              >
                                Títulos
                              </button>
                              <button
                                onClick={() => setTypography((prev) => ({ ...prev, bodyFont: font.family }))}
                                className={`flex-1 py-1 text-[10px] font-bold rounded transition border ${
                                  isBody
                                    ? "bg-cyan-600 text-white border-cyan-500"
                                    : "bg-[#121212] text-slate-400 hover:text-white border-[#2A2A2A]"
                                }`}
                              >
                                Cuerpo
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: COMPONENTS, GEOMETRY & BUTTON STYLING */}
              <TabsContent value="components" className="mt-0 space-y-8">
                {/* SECTION 1: Redondeado General de Tarjetas (Border Radius) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Square className="w-4 h-4 text-indigo-400" />
                      <span>Redondeado General de Contenedores y Tarjetas</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-indigo-300 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {componentStyles.borderRadius || "lg"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: "none", label: "Plano / Rectangular", px: "0px", class: "rounded-none" },
                      { id: "sm", label: "Sutil", px: "6px", class: "rounded-md" },
                      { id: "md", label: "Estándar", px: "12px", class: "rounded-xl" },
                      { id: "lg", label: "Suave Moderno", px: "16px", class: "rounded-2xl" },
                      { id: "xl", label: "Amplio", px: "24px", class: "rounded-3xl" },
                      { id: "full", label: "Cápsula Orgánica", px: "32px", class: "rounded-[2rem]" },
                    ].map((item) => {
                      const isSelected = componentStyles.borderRadius === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setComponentStyles((prev) => ({ ...prev, borderRadius: item.id as any }))}
                          className={`p-3 text-left border transition flex flex-col justify-between gap-2.5 group ${
                            isSelected
                              ? "bg-indigo-950/60 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500"
                              : "bg-[#181818] hover:bg-[#222] border-[#2A2A2A] text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold group-hover:text-indigo-300">{item.label}</span>
                            <span className="text-[10px] font-mono text-slate-500">{item.px}</span>
                          </div>

                          {/* Visual Shape Miniature */}
                          <div className="w-full h-8 bg-[#121212] border border-indigo-500/30 flex items-center justify-center">
                            <div className={`w-full h-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-400/40 ${item.class}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 2: Elevación & Sombras (Shadows) */}
                <div className="space-y-3 pt-2 border-t border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Elevación & Sombras de Elementos</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      {componentStyles.elevation || "medium"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: "none", label: "Plano / Sin Sombra", style: "Sin elevación Z-axis", shadowClass: "shadow-none border border-[#333]" },
                      { id: "subtle", label: "Sombra Sutil", style: "Flotación discreta", shadowClass: "shadow-md border border-[#333]" },
                      { id: "medium", label: "Sombra Media", style: "Profundidad equilibrada", shadowClass: "shadow-xl border border-indigo-500/20" },
                      { id: "high", label: "Flotante Elevada", style: "Gran relieve visual", shadowClass: "shadow-2xl border border-indigo-500/40" },
                      { id: "glow", label: "Resplandor Neon Glow", style: "Aura ambiental de acento", shadowClass: "shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-indigo-500" },
                    ].map((item) => {
                      const isSelected = componentStyles.elevation === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setComponentStyles((prev) => ({ ...prev, elevation: item.id as any }))}
                          className={`p-3 rounded-2xl text-left border transition space-y-2 group ${
                            isSelected
                              ? "bg-indigo-950/60 border-indigo-500 text-white ring-1 ring-indigo-500"
                              : "bg-[#181818] hover:bg-[#222] border-[#2A2A2A] text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold group-hover:text-indigo-300">{item.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </div>

                          <div className={`p-2 bg-[#121212] rounded-xl text-[10px] text-slate-400 ${item.shadowClass}`}>
                            {item.style}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 3: Redondeado del Botón (Button Radius) */}
                <div className="space-y-3 pt-2 border-t border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Radius className="w-4 h-4 text-purple-400" />
                      <span>Redondeado del Botón (Button Radius)</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-purple-300 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {componentStyles.buttonRadius || "lg"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: "none", label: "Rectangular", class: "rounded-none" },
                      { id: "sm", label: "Sutil 6px", class: "rounded-md" },
                      { id: "md", label: "Redondeado", class: "rounded-xl" },
                      { id: "full", label: "Cápsula / Pill", class: "rounded-full" },
                    ].map((item) => {
                      const isSelected = componentStyles.buttonRadius === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setComponentStyles((prev) => ({ ...prev, buttonRadius: item.id as any }))}
                          className={`p-3 text-center border transition flex flex-col items-center justify-center gap-2 group ${
                            isSelected
                              ? "bg-purple-950/60 border-purple-500 text-white ring-1 ring-purple-500"
                              : "bg-[#181818] hover:bg-[#222] border-[#2A2A2A] text-slate-300"
                          }`}
                        >
                          <span className="text-xs font-bold group-hover:text-purple-300">{item.label}</span>
                          <div
                            className={`px-4 py-1.5 text-[10px] font-bold text-white transition shadow-sm ${item.class}`}
                            style={{ backgroundColor: palette.primary }}
                          >
                            Botón
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 4: Espaciado Interno de Botones (Button Padding) */}
                <div className="space-y-3 pt-2 border-t border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <MousePointerClick className="w-4 h-4 text-amber-400" />
                      <span>Espaciado Interno / Densidad del Botón (Button Padding)</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-amber-300 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {componentStyles.buttonPadding || "standard"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "compact", label: "Compacto", paddingClass: "px-3.5 py-1.5 text-[11px]", desc: "Ideal para cabeceras y UI densa" },
                      { id: "standard", label: "Estándar Balanceado", paddingClass: "px-5 py-2.5 text-xs", desc: "Equilibrio perfecto de conversión" },
                      { id: "spacious", label: "Generoso / Hero CTA", paddingClass: "px-7 py-3.5 text-sm font-extrabold", desc: "Atracción inmediata en secciones Hero" },
                    ].map((item) => {
                      const isSelected = componentStyles.buttonPadding === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setComponentStyles((prev) => ({ ...prev, buttonPadding: item.id as any }))}
                          className={`p-3.5 rounded-2xl text-left border transition space-y-2 flex flex-col justify-between group ${
                            isSelected
                              ? "bg-amber-950/40 border-amber-500 text-white ring-1 ring-amber-500"
                              : "bg-[#181818] hover:bg-[#222] border-[#2A2A2A] text-slate-300"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold group-hover:text-amber-300">{item.label}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{item.desc}</p>
                          </div>

                          <div className="pt-2 flex items-center justify-center gap-2">
                            <span
                              className={`inline-block text-white font-bold transition ${getButtonRadiusClass(componentStyles.buttonRadius)} ${item.paddingClass}`}
                              style={{ backgroundColor: palette.primary }}
                            >
                              Primario
                            </span>
                            <span
                              className={`inline-block font-bold transition ${getButtonRadiusClass(componentStyles.buttonRadius)} ${item.paddingClass}`}
                              style={{ backgroundColor: `${palette.secondary}25`, color: palette.text, border: `1px solid ${palette.secondary}50` }}
                            >
                              Secundario
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SECTION 5: Tipo & Efecto Visual del Botón (Button Variant) */}
                <div className="space-y-3 pt-2 border-t border-[#2A2A2A]">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Efecto & Variante Visual del Botón (Aplica a Primario y Secundario)</span>
                    </label>
                    <span className="text-[11px] font-mono font-bold text-emerald-300 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {componentStyles.buttonVariant || "solid"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "solid", label: "Sólido Clásico", desc: "Primario relleno pleno y secundario con tinte y borde suave" },
                      { id: "gradient", label: "Gradiente Dinámico", desc: "Primario degradado e intenso y secundario con tinte gradiente traslúcido" },
                      { id: "glass", label: "Cristal Translucido / Glass", desc: "Efecto vidrio esmerilado con bisel de cristal coincidente" },
                      { id: "outline-glow", label: "Borde Neón / Glow Outline", desc: "Mismo grosor y efecto resplandor neón en ambos botones" },
                      { id: "3d", label: "Efecto 3D / Táctil Pressed", desc: "Misma elevación y sombra extruida inferior con respuesta táctil" },
                    ].map((item) => {
                      const isSelected = componentStyles.buttonVariant === item.id;
                      const primaryStyle = getButtonVariantStyle(item.id, palette.primary, palette.secondary, palette.text, false);
                      const secondaryStyle = getButtonVariantStyle(item.id, palette.primary, palette.secondary, palette.text, true);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setComponentStyles((prev) => ({ ...prev, buttonVariant: item.id as any }))}
                          className={`p-3.5 rounded-2xl text-left border transition space-y-2.5 group ${
                            isSelected
                              ? "bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500"
                              : "bg-[#181818] hover:bg-[#222] border-[#2A2A2A] text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold group-hover:text-emerald-300">{item.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400">{item.desc}</p>

                          <div className="pt-1 flex items-center justify-center gap-2">
                            <span
                              className={`inline-block font-bold transition ${getButtonRadiusClass(componentStyles.buttonRadius)} ${getButtonPaddingClass(componentStyles.buttonPadding)}`}
                              style={primaryStyle}
                            >
                              Primario
                            </span>
                            <span
                              className={`inline-block font-bold transition ${getButtonRadiusClass(componentStyles.buttonRadius)} ${getButtonPaddingClass(componentStyles.buttonPadding)}`}
                              style={secondaryStyle}
                            >
                              Secundario
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT COLUMN: Always-Visible Sticky Live Preview Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-6 space-y-4">
            <div className="bg-[#181818] border border-[#2A2A2A] rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl">
              {/* Preview Box Header */}
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>Previsualización en Tiempo Real</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span className="text-indigo-300 font-bold">{typography.headingFont}</span>
                  <span>/</span>
                  <span className="text-cyan-300 font-bold">{typography.bodyFont}</span>
                </div>
              </div>

              {/* Color Swatch Bar */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Paleta Activa</span>
                <div className="flex h-6 rounded-xl overflow-hidden border border-[#2A2A2A] p-0.5 bg-[#121212] gap-1">
                  <div className="flex-1 rounded flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-sm" style={{ backgroundColor: palette.primary }} title={`Primario: ${palette.primary}`}>P</div>
                  <div className="flex-1 rounded flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-sm" style={{ backgroundColor: palette.secondary }} title={`Secundario: ${palette.secondary}`}>S</div>
                  <div className="flex-1 rounded flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-sm" style={{ backgroundColor: palette.accent }} title={`Acento: ${palette.accent}`}>A</div>
                  <div className="flex-1 rounded flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-sm border border-white/10" style={{ backgroundColor: palette.background }} title={`Fondo: ${palette.background}`}>B</div>
                  <div className="flex-1 rounded flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-sm" style={{ backgroundColor: palette.text }} title={`Texto: ${palette.text}`}>T</div>
                </div>
              </div>

              {/* Editable Text Sample Inputs */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Texto de Prueba</span>
                </div>
                <input
                  type="text"
                  value={customPreviewHeadline}
                  onChange={(e) => setCustomPreviewHeadline(e.target.value)}
                  placeholder="Escribe un titular..."
                  className="w-full bg-[#121212] border border-[#2A2A2A] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Simulated UI Section Frame - Dynamic Radius, Shadow & Button Styles! */}
              <div
                className={`p-5 sm:p-6 transition-all duration-300 space-y-4 ${getBorderRadiusClass(componentStyles.borderRadius)} ${getElevationClass(componentStyles.elevation)}`}
                style={{ backgroundColor: palette.background, color: palette.text, borderColor: `${palette.text}20` }}
              >
                {/* Badge Pill */}
                <div>
                  <span
                    className={`inline-block px-2.5 py-1 text-[11px] font-bold shadow-sm ${getButtonRadiusClass(componentStyles.buttonRadius)}`}
                    style={{
                      backgroundColor: `${palette.secondary}20`,
                      color: palette.secondary,
                      border: `1px solid ${palette.secondary}40`,
                      fontFamily: typography.bodyFont,
                    }}
                  >
                    ★ Propuesta de Valor
                  </span>
                </div>

                {/* Headline */}
                <h3
                  className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight"
                  style={{ fontFamily: typography.headingFont, color: palette.text }}
                >
                  {customPreviewHeadline || "Titular de Ejemplo con Google Fonts"}
                </h3>

                {/* Body Paragraph */}
                <p
                  className="text-xs leading-relaxed opacity-85"
                  style={{ fontFamily: typography.bodyFont, color: palette.text }}
                >
                  {customPreviewBody || "Este bloque demuestra cómo armonizan la tipografía seleccionada y los colores de superficie y texto principal en tus futuras secciones."}
                </p>

                {/* Stat Box Mockup */}
                <div
                  className={`p-3 border flex items-center justify-between ${getBorderRadiusClass(componentStyles.borderRadius)}`}
                  style={{
                    backgroundColor: `${palette.primary}0D`,
                    borderColor: `${palette.primary}30`,
                  }}
                >
                  <div>
                    <div
                      className="text-lg font-black"
                      style={{ fontFamily: typography.headingFont, color: palette.accent }}
                    >
                      +140%
                    </div>
                    <div
                      className="text-[10px] opacity-75"
                      style={{ fontFamily: typography.bodyFont, color: palette.text }}
                    >
                      Conversión proyectada
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 flex items-center justify-center font-bold text-xs ${getButtonRadiusClass(componentStyles.buttonRadius)}`}
                    style={{ backgroundColor: palette.accent, color: "#FFFFFF" }}
                  >
                    🚀
                  </div>
                </div>

                {/* Action Buttons with Real Selected Radius, Padding & Variant! */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    className={`transition ${getButtonRadiusClass(componentStyles.buttonRadius)} ${getButtonPaddingClass(componentStyles.buttonPadding)}`}
                    style={{
                      fontFamily: typography.bodyFont,
                      ...getButtonVariantStyle(componentStyles.buttonVariant, palette.primary, palette.secondary, palette.text, false),
                    }}
                  >
                    Botón Primario
                  </button>
                  <button
                    className={`transition ${getButtonRadiusClass(componentStyles.buttonRadius)} ${getButtonPaddingClass(componentStyles.buttonPadding)}`}
                    style={{
                      fontFamily: typography.bodyFont,
                      ...getButtonVariantStyle(componentStyles.buttonVariant, palette.primary, palette.secondary, palette.text, true),
                    }}
                  >
                    Botón Secundario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Bar for Quick Apply */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#181818]/90 backdrop-blur-md border-t border-[#2A2A2A] p-3 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-semibold text-slate-200">Modificando estilo para:</span>
          <span className="text-indigo-400 font-bold">{project.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#222] hover:bg-[#2A2A2A] text-slate-300 font-semibold text-xs rounded-xl transition"
          >
            Volver sin Guardar
          </button>
          <button
            type="button"
            onClick={handleApplyAndSave}
            className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Aplicar Cambios al Proyecto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
