import React from "react";
import { Sparkles, Layers, CheckCircle, RefreshCw, Cpu, Sliders, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  currentProjectName?: string;
  isSaving?: boolean;
  lastSavedTime?: string;
  onGoToDashboard: () => void;
  onOpenGlobalPrompt?: () => void;
  onOpenStyleConfig?: () => void;
  onOpenHistory?: () => void;
  onOpenAiContext?: () => void;
  onOpenConversionVars?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProjectName,
  isSaving,
  lastSavedTime,
  onGoToDashboard,
  onOpenGlobalPrompt,
  onOpenStyleConfig,
  onOpenHistory,
  onOpenAiContext,
  onOpenConversionVars,
}) => {
  return (
    <header className="sticky top-0 z-40 h-14 bg-[#181818] border-b border-[#2A2A2A] text-[#E0E0E0] px-4 sm:px-6 flex items-center justify-between">
      <div className="w-full mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGoToDashboard}>
          <div className="w-8 h-8 rounded-xl bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center text-blue-500 shadow-sm">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                PromptLayer
              </span>
              <Badge variant="default" className="text-[9px] tracking-widest uppercase">
                PROMPT ENGINE
              </Badge>
            </div>
          </div>
        </div>

        {/* Project Context & Autosave Badge */}
        {currentProjectName ? (
          <div className="hidden md:flex items-center gap-3">
            <div className="text-xs text-[#888]">
              Proyectos / <span className="text-white font-medium">{currentProjectName}</span>
            </div>
            <Badge variant="emerald" className="normal-case tracking-normal flex items-center gap-1 py-0.5">
              {isSaving ? (
                <>
                  <RefreshCw className="w-3 h-3 text-amber-400 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>Gemini API Activo</span>
                </>
              )}
            </Badge>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="emerald" className="normal-case tracking-normal">
              Gemini API Activo
            </Badge>
          </div>
        )}

        {/* Global Actions */}
        <div className="flex items-center gap-2">
          {currentProjectName && onOpenStyleConfig && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenStyleConfig}
              className="bg-indigo-950/70 hover:bg-indigo-900/90 text-indigo-200 border-indigo-500/40 flex items-center gap-1.5 text-xs font-semibold shadow-sm"
              title="Personalizar Paleta de Colores, Fuentes Google Fonts y Visualizador"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Estilo & Tipografía</span>
            </Button>
          )}

          {currentProjectName && onOpenConversionVars && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenConversionVars}
              className="bg-[#2A2A2A] hover:bg-[#333] text-white border-[#3A3A3A] flex items-center gap-1.5 text-xs font-medium"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Conversion Vars</span>
            </Button>
          )}

          {onOpenAiContext && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAiContext}
              className="bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border-indigo-500/30 text-xs"
              title="Ver Guía de Contexto y Prompts Benchmark para IA"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Guía Contexto IA</span>
            </Button>
          )}


        </div>
      </div>
    </header>
  );
};


