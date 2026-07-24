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

    const systemInstruction = `Eres un Ingeniero Principal de Prompts de UI/UX y Especialista en Optimización de Tasa de Conversión (CRO).
Tu misión es generar un prompt extremadamente estructurado, preciso y técnico en español que el usuario pueda copiar y pegar en herramientas de generación de código/UI con IA (como Gemini, Claude, Cursor, v0, etc.) para crear UN COMPONENTE DE SECCIÓN DE LANDING PAGE DE ALTA CONVERSIÓN.

REGLAS CRÍTICAS DE SALIDA:
- Debe estar enfocado ÚNICAMENTE en la sección solicitada (NO generes la landing completa).
- Debe especificar detalladamente la paleta de colores (códigos HEX o variables Tailwind), la tipografía (Google Fonts), las variables de conversión, la jerarquía visual, la copia persuasiva (headlines, subheadlines, CTAs) y los micro-detalles de UI (espaciados, bordes, estados hover, iconos de Lucide, sombras y responsiveness).
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
- Framework preferido: ${projectContext.conversionVars?.framework || "Tailwind CSS + React + Lucide Icons"}

DATOS DE LA SECCIÓN ESPECÍFICA:
- Tipo de Sección: ${sectionData.type}
- Título/Nombre: ${sectionData.title}
- Objetivo de esta sección: ${sectionData.contentObjective || "Captar la atención del usuario e incitar a la acción"}
- Elementos clave requeridos: ${JSON.stringify(sectionData.keyElements || [])}
- Borrador de Copy/Texto: Headline "${sectionData.copyDraft?.headline || ""}", Subheadline "${sectionData.copyDraft?.subheadline || ""}", CTA "${sectionData.copyDraft?.ctaText || ""}", Puntos clave: ${JSON.stringify(sectionData.copyDraft?.bulletPoints || [])}
- Estilo / Disposición visual: ${JSON.stringify(sectionData.sectionStyleOverrides || {})}

Por favor, genera un prompt profesional estructurado con los siguientes bloques en Markdown claro y listo para copiar:
1. 🎯 OBJETIVO Y CONTEXTO DEL COMPONENTE
2. 🎨 SISTEMA DE DISEÑO Y ESTILOS (Colores HEX, Google Fonts, Clases de Tailwind)
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
