import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Route: Generate or Refine Structured Prompt for a Landing Section
app.post("/api/gemini/generate-section-prompt", async (req, res) => {
  try {
    const { projectContext, sectionData } = req.body;

    if (!projectContext || !sectionData) {
      return res.status(400).json({ error: "Missing projectContext or sectionData" });
    }

    const ai = getGeminiClient();

    const textureType = sectionData.sectionStyleOverrides?.bgTextureType || "none";
    let textureDesc = "Sin textura adicional (Fondo Limpio / Plano)";
    if (textureType === "grid") {
      const sizeMap: Record<string, string> = { small: "Cuadrícula Pequeña (~12px / ~16px)", medium: "Cuadrícula Mediana (~24px / ~32px)", large: "Cuadrícula Grande (~40px / ~48px)" };
      textureDesc = `Textura de Cuadrícula / Grid Pattern Overlay (${sizeMap[sectionData.sectionStyleOverrides?.gridSize || "medium"] || "Mediana"}). Debe incluirse explícitamente como una capa decorativa sutil superpuesta en CSS background (ej. linear-gradient de líneas semitransparentes) o patrón SVG que acompaña el fondo base.`;
    } else if (textureType === "dots") {
      const spacingMap: Record<string, string> = { dense: "Puntos Muy Cercanos (~10px)", normal: "Puntos Normales (~20px)", sparse: "Puntos Alejados (~36px)" };
      textureDesc = `Textura de Matriz de Puntos / Point Grid Overlay (${spacingMap[sectionData.sectionStyleOverrides?.dotsSpacing || "normal"] || "Normales"}). Debe incluirse explícitamente como una trama decorativa sutil de puntos superpuestos en CSS background (ej. radial-gradient) o patrón SVG que acompaña el fondo base.`;
    }

    const systemInstruction = `Eres un Ingeniero Principal de Prompts de UI/UX y Especialista en Optimización de Tasa de Conversión (CRO).
Tu misión es generar un prompt extremadamente estructurado, preciso y técnico en español que el usuario pueda copiar y pegar en herramientas de generación de código/UI con IA (como Gemini, Claude, Cursor, v0, etc.) para crear UN COMPONENTE DE SECCIÓN DE LANDING PAGE DE ALTA CONVERSIÓN.

REGLAS CRÍTICAS DE SALIDA:
- Debe estar enfocado ÚNICAMENTE en la sección solicitada (NO generes la landing completa).
- Debe especificar detalladamente la paleta de colores (códigos HEX o variables Tailwind), la tipografía (Google Fonts), las variables de conversión, la TEXTURA DE FONDO DECORATIVA (Grid o Point Grid si fue configurada, especificando cómo implementarla), los estilos de botón (redondeado, padding, variante) y la coherencia física entre botones primario y secundario.
- Incluye directivas de código limpio para Tailwind CSS y React con TypeScript.`;

    const userPrompt = `
Genera un prompt altamente detallado para la siguiente sección de landing page:

CONTEXTO GLOBAL DE LA LANDING:
- Nombre del Proyecto: ${projectContext.name}
- Industria / Categoria: ${projectContext.industry || "SaaS / Digital"}
- Propuesta de Valor: ${projectContext.valueProposition || "Solución innovadora para impulsar conversiones"}
- Público Objetivo: ${projectContext.conversionVars?.targetAudience || "Usuarios finales y tomadores de decisión"}
- Objetivo Principal de Conversión: ${projectContext.conversionVars?.primaryGoal || "Captación de leads / Registros"}
- Tono Visual y CRO: ${projectContext.conversionVars?.tone || "Moderno y Profesional"}
- Patrón de Diseño: ${projectContext.conversionVars?.layoutPattern || "F-Pattern"}
- Densidad de Prueba Social: ${projectContext.conversionVars?.socialProofDensity || "Alta"}
- Paleta de Colores: Primario ${projectContext.styleConfig?.palette?.primary}, Secundario ${projectContext.styleConfig?.palette?.secondary}, Acento ${projectContext.styleConfig?.palette?.accent}, Fondo ${projectContext.styleConfig?.palette?.background}, Texto ${projectContext.styleConfig?.palette?.text}
- Tipografías: Títulos '${projectContext.styleConfig?.typography?.headingFont}', Cuerpos '${projectContext.styleConfig?.typography?.bodyFont}'
- Estilos de Componentes Globale: Redondeado tarjetas '${projectContext.styleConfig?.componentStyles?.borderRadius || "lg"}', Sombras '${projectContext.styleConfig?.componentStyles?.elevation || "medium"}', Redondeado botones '${projectContext.styleConfig?.componentStyles?.buttonRadius || "lg"}', Padding interno botones '${projectContext.styleConfig?.componentStyles?.buttonPadding || "standard"}', Variante de botón '${projectContext.styleConfig?.componentStyles?.buttonVariant || "solid"}'
- Framework preferido: ${projectContext.conversionVars?.framework || "Tailwind CSS + React + Lucide Icons"}

DATOS DE LA SECCIÓN ESPECÍFICA:
- Tipo de Sección: ${sectionData.type}
- Título/Nombre: ${sectionData.title}
- Objetivo de esta sección: ${sectionData.contentObjective || "Captar la atención del usuario e incitar a la acción"}
- Elementos clave requeridos: ${JSON.stringify(sectionData.keyElements || [])}
- Borrador de Copy/Texto: Headline "${sectionData.copyDraft?.headline || ""}", Subheadline "${sectionData.copyDraft?.subheadline || ""}", CTA "${sectionData.copyDraft?.ctaText || ""}", CTA Secundario "${sectionData.copyDraft?.secondaryCtaText || ""}", Puntos clave: ${JSON.stringify(sectionData.copyDraft?.bulletPoints || [])}
- Estilo de Fondo de Sección: ${sectionData.sectionStyleOverrides?.bgStyle || "Solid Surface"}
- Textura Decorativa de Fondo (Overlay): ${textureDesc}
- Variante de Layout: ${sectionData.sectionStyleOverrides?.layoutVariant || "Centered Focus"}
- Espaciado Vertical: ${sectionData.sectionStyleOverrides?.paddingVertical || "Standard (py-20)"}
- Estilo de Animación: ${sectionData.sectionStyleOverrides?.animationStyle || "Framer Motion Fluid"}
- Librerías / Componentes Especiales: ${JSON.stringify(sectionData.sectionStyleOverrides?.libraryEnhancements || [])}

Por favor, genera un prompt profesional estructurado con los siguientes bloques en Markdown claro y listo para copiar:
1. 🎯 OBJETIVO Y CONTEXTO DEL COMPONENTE
2. 🎨 SISTEMA DE DISEÑO Y ESTILOS (Colores HEX, Google Fonts, Textura Decorativa Overlay, Estilos de Botón y Tarjetas)
3. 📐 ESTRUCTURA Y MAQUETACIÓN VISUAL (Layout responsive, Grid/Flexbox, Alineación)
4. ✍️ COPYWRITING Y CONTENIDO PERSUASIVO (Texto exacto a renderizar, titulares, CTAs)
5. ⚡ INTERACTIVIDAD, ESTADOS Y MICRO-ANIMACIONES (Hover, focus, transiciones suaves)
6. 🧩 RECOMENDACIÓN DE ASSETS E ICONOS (Lucide Icons específicos)
7. 🛠️ ESPECIFICACIONES TÉCNICAS Y RESTRICCIONES DE CÓDIGO (Tailwind CSS puro, TypeScript, semántica HTML5)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ prompt: response.text });
  } catch (error: any) {
    console.error("Error generating section prompt:", error);
    return res.status(500).json({ error: error.message || "Error generating section prompt" });
  }
});

// API Route: AI Palette & Fonts Generator
app.post("/api/gemini/suggest-palette-font", async (req, res) => {
  try {
    const { brandDescription, mood } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `Eres un diseñador UI/UX experto en teoría del color y tipografía web.
Devuelve SIEMPRE la respuesta estrictamente en formato JSON válido.
El JSON debe coincidir con la estructura especificada sin bloques de texto adicional fuera del JSON.`;

    const prompt = `Genera una paleta de colores profesional de 6 valores HEX y una combinación armoniosa de Google Fonts adecuada para una landing page de tipo: "${brandDescription || "Startup de tecnología B2B"}", con un estilo/mood: "${mood || "Moderno y elegante"}".

Estructura JSON requerida:
{
  "palette": {
    "name": "Nombre descriptivo de la paleta",
    "primary": "#HEX",
    "secondary": "#HEX",
    "accent": "#HEX",
    "background": "#HEX",
    "surface": "#HEX",
    "text": "#HEX",
    "textMuted": "#HEX",
    "description": "Breve explicación de la psicología del color aplicada"
  },
  "typography": {
    "name": "Nombre de la combinación",
    "headingFont": "Nombre exacto en Google Fonts para títulos",
    "bodyFont": "Nombre exacto en Google Fonts para texto base",
    "styleNote": "Consejo de uso de peso y espaciado"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating palette/font:", error);
    return res.status(500).json({ error: error.message || "Error generating palette/font" });
  }
});

// API Route: Suggest Assets, Icons, and CRO Copy hooks for a Section
app.post("/api/gemini/suggest-assets-icons", async (req, res) => {
  try {
    const { sectionType, industry, goal } = req.body;

    const ai = getGeminiClient();

    const prompt = `Genera recomendaciones inteligentes para una sección de landing page de tipo "${sectionType}" en la industria "${industry || "SaaS digital"}", cuyo objetivo es "${goal || "Convertir visitantes"}".

Devuelve la respuesta en formato JSON con la siguiente estructura:
{
  "suggestedIcons": ["NombreLucideIcono1", "NombreLucideIcono2", "NombreLucideIcono3", "NombreLucideIcono4"],
  "imagePrompts": [
    "Prompt detallado para generar una imagen/mockup visual representativo con IA (Midjourney/DALL-E/Unsplash style)",
    "Segunda opción de imagen/ilustración"
  ],
  "croTips": [
    "Consejo táctico 1 para aumentar la tasa de conversión en esta sección",
    "Consejo táctico 2 de jerarquía o lectura visual"
  ],
  "copyHooks": {
    "headline": "Sugerencia de titular de alto impacto",
    "subheadline": "Sugerencia de subtítulo claro y orientado a beneficios",
    "ctaText": "Texto de botón CTA de acción inmediata"
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (error: any) {
    console.error("Error suggesting assets:", error);
    return res.status(500).json({ error: error.message || "Error suggesting assets" });
  }
});

// API Route: AI Full Project Generator from Natural Language Prompt
app.post("/api/gemini/generate-full-project", async (req, res) => {
  try {
    const { prompt: userIdea } = req.body;

    if (!userIdea || typeof userIdea !== "string" || !userIdea.trim()) {
      return res.status(400).json({ error: "El prompt del proyecto es requerido." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Eres un Arquitecto de Software Principal, Diseñador UI/UX Senior y Especialista en Optimización de Conversiones (CRO).
Tu misión es recibir una idea o prompt del usuario y transformarlo en la estructura completa de un Proyecto de Landing Page de Alta Conversión.
Devuelve SIEMPRE la respuesta estrictamente en formato JSON válido acorde al schema solicitado, sin texto antes ni después.`;

    const prompt = `Analiza la siguiente idea de proyecto o negocio y genera una estructura de landing page de alta conversión personalizada:

IDEA DEL USUARIO: "${userIdea.trim()}"

Estructura JSON requerida (Escribe todos los textos en español claro, profesional y persuasivo):
{
  "name": "Nombre conciso y profesional para el proyecto o producto (máx 4 palabras)",
  "description": "Descripción clara de la propuesta en 1-2 oraciones",
  "industry": "Categoría o Industria (ej: SaaS B2B, Fitness & Wellness, Fintech, E-commerce, EdTech, Agencia Creativa)",
  "conversionVars": {
    "tone": "SaaS Tech / Moderno",
    "layoutPattern": "F-Pattern (Lectura Fluida)",
    "targetAudience": "Descripción concisa del público objetivo",
    "primaryGoal": "Objetivo principal de conversión",
    "valueProposition": "Propuesta Única de Valor (UVP) directa",
    "socialProofDensity": "Alta (Testimonios + Logos + Métricas + Badges)",
    "interactivity": "Descripción corta de animaciones e interactividad deseada",
    "framework": "Tailwind CSS v4 + React + Lucide Icons",
    "urgencyTriggers": true,
    "stickyCta": true,
    "impeccableCraft": true
  },
  "styleConfig": {
    "palette": {
      "name": "Nombre descriptivo de la paleta de colores",
      "primary": "#HEX",
      "secondary": "#HEX",
      "accent": "#HEX",
      "background": "#HEX (Neutro elegante con matiz sutil)",
      "surface": "#HEX",
      "text": "#HEX",
      "textMuted": "#HEX"
    },
    "typography": {
      "name": "Nombre del combo tipográfico",
      "headingFont": "Nombre exacto de fuente en Google Fonts para títulos (ej: Plus Jakarta Sans, Outfit, Inter, Syne, Cabinet Grotesk, Space Grotesk, Playfair Display)",
      "bodyFont": "Nombre exacto de fuente en Google Fonts para cuerpo (ej: Plus Jakarta Sans, Inter, DM Sans, Roboto)"
    },
    "globalVibe": "Atmósfera e identidad de marca en 1 frase"
  },
  "sections": [
    {
      "type": "hero",
      "title": "1. Hero Above-the-Fold",
      "description": "Sección principal con propuesta de valor y CTA de conversión inmediata",
      "contentObjective": "Captar la atención en menos de 5 segundos y guiar hacia la acción principal",
      "keyElements": ["Headline de alto impacto", "Subheadline con beneficios cuantitativos", "CTA principal y secundario", "Social proof badge"],
      "copyDraft": {
        "headline": "Titular enérgico y persuasivo específico para la idea",
        "subheadline": "Subtitular claro explicando cómo resuelve el problema principal",
        "ctaText": "Texto del botón principal de acción",
        "secondaryCtaText": "Texto del botón secundario",
        "bulletPoints": ["Beneficio clave 1", "Beneficio clave 2", "Beneficio clave 3"]
      },
      "sectionStyleOverrides": {
        "bgStyle": "Solid Surface",
        "layoutVariant": "Split 50/50",
        "paddingVertical": "Standard (py-20)"
      }
    }
  ]
}

REGLAS DE SECCIONES:
Genera entre 6 y 10 secciones organizadas en un flujo de conversión óptimo. Por ejemplo:
1. 'hero': Hero principal
2. 'social_proof_testimonials': Logos de marcas o métricas rápidas de tracción
3. 'problem_solution': Matriz de agitación de problemas y solución
4. 'features': Bento grid o lista de características principales
5. 'process_how_it_works': Paso a paso de cómo funciona en 3 simples pasos
6. 'social_proof_testimonials': Testimonios reales y casos de éxito
7. 'pricing': Tabla de planes / precios con la opción más recomendada destacada
8. 'faq': Preguntas frecuentes respondiendo objeciones típicas
9. 'lead_form': Formulario final de captación de leads / prueba gratis
10. 'footer': Navegación y copyright

Los campos 'type' deben ser exactamente alguno de: 'hero', 'problem_solution', 'value_prop', 'features', 'process_how_it_works', 'social_proof_testimonials', 'stats_counter', 'comparison_table', 'pricing', 'faq', 'lead_form', 'footer', 'custom'.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const projectData = JSON.parse(response.text || "{}");
    return res.json(projectData);
  } catch (error: any) {
    console.error("Error generating full project with AI:", error);
    return res.status(500).json({ error: error.message || "Error al estructurar proyecto con IA" });
  }
});

// Serve frontend with Vite middleware or static dist
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Landing Prompt Architect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
