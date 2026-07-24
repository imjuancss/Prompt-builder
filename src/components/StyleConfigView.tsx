import React, { useState, useEffect } from "react";
import { ColorPalette, TypographyPair, Project } from "../types";
import { PRESET_PALETTES, PRESET_TYPOGRAPHY, GOOGLE_FONTS_COLLECTION } from "../data/presets";
import { Sparkles, Palette, Type, RefreshCw, BookmarkPlus, Check, Eye, ArrowLeft, Save, Type as TypeIcon } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"palette" | "typography" | "templates">("palette");

  // Local Editable Palette
  const [palette, setPalette] = useState<ColorPalette>({ ...project.styleConfig.palette });

  // Local Editable Typography
  const [typography, setTypography] = useState<TypographyPair>({ ...project.styleConfig.typography });

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
          {/* LEFT COLUMN: Configuration Controls (Tabs: Colors, Typography) */}
          <div className="lg:col-span-7 space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "palette" | "typography")}
              className="w-full"
            >
              <TabsList className="bg-[#181818] border border-[#2A2A2A] p-1 rounded-xl mb-6 w-full grid grid-cols-2">
                <TabsTrigger value="palette" className="flex items-center justify-center gap-2 text-xs font-bold">
                  <Palette className="w-4 h-4" />
                  <span>Paleta de Colores</span>
                </TabsTrigger>
                <TabsTrigger value="typography" className="flex items-center justify-center gap-2 text-xs font-bold">
                  <Type className="w-4 h-4" />
                  <span>Tipografía (Google Fonts)</span>
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

              {/* Simulated UI Section Frame */}
              <div
                className="p-5 sm:p-6 rounded-2xl border transition-all duration-300 space-y-4 shadow-xl"
                style={{ backgroundColor: palette.background, color: palette.text, borderColor: `${palette.text}20` }}
              >
                {/* Badge Pill */}
                <div>
                  <span
                    className="inline-block px-2.5 py-1 text-[11px] rounded-full font-bold shadow-sm"
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
                  className="p-3 rounded-xl border flex items-center justify-between"
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
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: palette.accent, color: "#FFFFFF" }}
                  >
                    🚀
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-bold shadow transition"
                    style={{ backgroundColor: palette.primary, color: "#FFFFFF", fontFamily: typography.bodyFont }}
                  >
                    Botón CTA Primario
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition"
                    style={{
                      backgroundColor: "transparent",
                      color: palette.text,
                      borderColor: `${palette.text}30`,
                      fontFamily: typography.bodyFont,
                    }}
                  >
                    Saber Más
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
