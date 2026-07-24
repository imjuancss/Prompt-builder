import { Project, Section, SectionType } from "../types";

const SECTION_CONFIGS: Record<SectionType, { description: string; keyFocus: string[]; recommendedElements: string[]; accessibilityNotes: string[]; seoGuidelines: string[]; codeExamples?: string; }> = {
  hero: { description: "Sección principal de impacto inmediato", keyFocus: ["Propuesta clara en <5s", "CTA visible sin scroll"], recommendedElements: ["H1 único", "Subheadline", "CTA principal"], accessibilityNotes: ["Contraste 4.5:1", "Alt text en imágenes"], seoGuidelines: ["H1 con keyword principal"], codeExamples: "// Hero example" },
  features: { description: "Detalle de funcionalidades", keyFocus: ["Features vinculadas a beneficios"], recommendedElements: ["Grid de features", "Iconos distintivos"], accessibilityNotes: ["Grid responsive"], seoGuidelines: ["Keywords en H3"], codeExamples: "// Features grid" },
  pricing: { description: "Presentación de planes y precios", keyFocus: ["Transparencia total", "Plan destacado claro"], recommendedElements: ["3 planes máximo", "Precio con periodo"], accessibilityNotes: ["Precios legibles"], seoGuidelines: ["Schema Offer"], codeExamples: "// Pricing card" },
  faq: { description: "Resolución de objeciones", keyFocus: ["Preguntas reales", "Respuestas concisas"], recommendedElements: ["Accordion", "5-10 preguntas"], accessibilityNotes: ["ARIA expanded"], seoGuidelines: ["Schema FAQPage"], codeExamples: "// FAQ accordion" },
  social_proof_testimonials: { description: "Validación social", keyFocus: ["Autenticidad", "Resultados cuantificables"], recommendedElements: ["Foto + nombre + cargo", "Métricas"], accessibilityNotes: ["Alt text en fotos"], seoGuidelines: ["Schema Review"], codeExamples: "// Testimonial card" },
  problem_solution: { description: "Identifica dolor y solución", keyFocus: ["Empatía", "Contraste antes/después"], recommendedElements: ["Descripción del problema", "Presentación solución"], accessibilityNotes: ["Estructura semántica"], seoGuidelines: ["Keywords en H2"], codeExamples: "// Problem-solution" },
  value_prop: { description: "Comunica diferenciadores", keyFocus: ["Diferenciadores claros", "Beneficios medibles"], recommendedElements: ["3-4 pilares", "Métricas concretas"], accessibilityNotes: ["Listas semánticas"], seoGuidelines: ["Schema Product"], codeExamples: "// Value prop" },
  process_how_it_works: { description: "Explica paso a paso", keyFocus: ["Simplicidad", "Progreso visual"], recommendedElements: ["3-5 pasos", "Numeración"], accessibilityNotes: ["Orden de lectura"], seoGuidelines: ["Schema HowTo"], codeExamples: "// Process steps" },
  stats_counter: { description: "Métricas de tracción", keyFocus: ["Números memorables", "Contexto"], recommendedElements: ["3-5 métricas", "Iconos"], accessibilityNotes: ["Números como texto"], seoGuidelines: ["Schema Organization"], codeExamples: "// Stats counter" },
  comparison_table: { description: "Comparativa competitiva", keyFocus: ["Criterios relevantes", "Claridad visual"], recommendedElements: ["Tabla rows/columns", "Highlight tu columna"], accessibilityNotes: ["Table semántica"], seoGuidelines: ["Schema comparison"], codeExamples: "// Comparison table" },
  lead_form: { description: "Captura de leads", keyFocus: ["Minimizar fricción", "Value exchange"], recommendedElements: ["Campos mínimos", "Privacy checkbox"], accessibilityNotes: ["Labels asociados"], seoGuidelines: ["Schema ContactPoint"], codeExamples: "// Lead form" },
  footer: { description: "Navegación secundaria", keyFocus: ["Navegación clara", "Links legales"], recommendedElements: ["Logo", "Links categorías", "Copyright"], accessibilityNotes: ["Nav landmark"], seoGuidelines: ["Schema Organization"], codeExamples: "// Footer" },
  custom: { description: "Sección personalizada", keyFocus: ["Objetivo claro", "Coherencia diseño"], recommendedElements: ["Headline", "Contenido objetivo"], accessibilityNotes: ["WCAG AA mínimo"], seoGuidelines: ["Schema apropiado"], codeExamples: "// Custom section" }
};

function getLLMOptimizationHints(model?: string): string {
  const modelLower = (model || "").toLowerCase();
  if (modelLower.includes("claude")) return "- **Claude**: Estructura jerárquica clara, ejemplos concretos de código.";
  if (modelLower.includes("gpt-4") || modelLower.includes("openai")) return "- **GPT-4**: Formato conciso, ejemplos inline para precisión.";
  if (modelLower.includes("gemini")) return "- **Gemini**: Detalles visuales explícitos, descripciones multimodales.";
  return "- **Default**: Markdown estructurado, ejemplos completos, especificaciones exactas.";
}

function validateAndNormalizeData(project: Project, section: Section) {
  const warnings: string[] = [];
  const validProject = { ...project };
  const validSection = { ...section };
  
  if (!validProject.conversionVars.tone) { validProject.conversionVars.tone = "Minimalista Clean"; warnings.push("Tono no especificado"); }
  if (!validProject.conversionVars.framework) { validProject.conversionVars.framework = "Tailwind CSS v4 + React + Lucide Icons"; warnings.push("Framework no especificado"); }
  if (!validSection.copyDraft.headline?.trim()) { validSection.copyDraft.headline = "[HEADLINE PENDIENTE]"; warnings.push(`Headline faltante en ${section.title}`); }
  if (!validSection.copyDraft.ctaText?.trim()) { validSection.copyDraft.ctaText = "Comenzar Ahora"; warnings.push("CTA default usado"); }
  if (!validProject.styleConfig.palette.primary) { validProject.styleConfig.palette.primary = "#3B82F6"; warnings.push("Color primario default"); }
  
  return { validProject, validSection, warnings };
}

export const IMPECCABLE_CRAFT_DIRECTIVES = `
### 💎 REGULACIÓN DE DISEÑO Y CRAFT IMPECCABLE (By Paul Bakaus / Impeccable Standard)
1. **REGLAS ANTI-SLOP VISUAL:**
   - **Prohibido:** Gradientes cliché púrpura-a-azul por defecto, texto cian brillante flotante en fondo oscuro sin propósito funcional, tarjetas anidadas dentro de tarjetas (\`cards-in-cards\`), o grids de 3 columnas idénticas con íconos apilados sin jerarquía asimétrica.
   - **Prohibido Copy Genérico de SaaS:** Eliminar verbos clichés como "supercharge", "empower", "seamlessly", "game-changer" o "revoluciona". Usar verbos de acción concretos y métricas reales.
   - **Unificación de Línea en Badges/Píldoras:** Todo texto dentro de un botón, píldora, chip o badge DEBE permanecer en UNA sola línea (\`whitespace-nowrap\`).
2. **MATEMÁTICA DE ESPACIADO Y BORDES (CRAFT PRECISION):**
   - **Fórmula de Radio Anidado:** \`Inside Corner Radius = Outside Corner Radius - Padding\` (\`r_in = r_out - p\`). Si un contenedor tiene padding \`p-4\` (16px) y radio exterior \`rounded-2xl\` (16px), la esquina interior del hijo debe ser \`0px\` / rectilínea para encaje óptimo.
   - **Ratio de Proporción de Botón:** El padding horizontal de un botón DEBE ser exactamente el doble del padding vertical (\`px = 2 * py\`, ej: \`px-5 py-2.5\` o \`px-6 py-3\`).
   - **Ancho Máximo de Lectura:** Párrafos de texto continuo limitados a un rango óptimo de 65 a 75 caracteres por línea (\`max-w-[65ch]\` o \`max-w-prose\`).
   - **Jerarquía de Padding:** El padding exterior del contenedor (\`outer padding\`) debe ser mayor o igual que el espacio de separación interno entre hijos.
3. **COLOR & CONTRASTE RIGUROSO:**
   - **Neutros Sofisticados:** Evitar #000000 o #FFFFFF puros; aplicar tintes neutros con <5% saturación HSB en tonos cálidos o fríos.
   - **Diferencia de Brillo:** La diferencia de luminosidad entre el fondo y la tarjeta flotante debe ser ≤12% en modo oscuro y ≤7% en modo claro.
   - **WCAG AA Cumplimiento:** Mínimo 4.5:1 de ratio de contraste en todo texto de cuerpo. Mínimo 3:1 para elementos de interfaz interactivos.
4. **INTERACTIVIDAD Y ESTADOS INTERACTIVOS:**
   - Transiciones fluidas de microinteracciones (\`transition-all duration-200 ease-out\`), estados hover visualmente perceptibles, y foco accesible con anillo visible (\`focus-visible:ring-2 focus-visible:ring-blue-500\`).
`;

export function buildSectionPrompt(project: Project, section: Section, targetLLMOverride?: string): string {
  const { validProject, validSection } = validateAndNormalizeData(project, section);
  const { palette, typography, globalVibe } = validProject.styleConfig;
  const { tone, layoutPattern, targetAudience, primaryGoal, valueProposition, socialProofDensity, framework, interactivity, urgencyTriggers, stickyCta, impeccableCraft, targetLLM } = validProject.conversionVars;
  const copy = validSection.copyDraft;
  const overrides = validSection.sectionStyleOverrides || {};
  const sectionConfig = SECTION_CONFIGS[validSection.type as SectionType] || SECTION_CONFIGS.custom;
  const effectiveLLM = targetLLMOverride || targetLLM;
  const llmHints = getLLMOptimizationHints(effectiveLLM);

  return `<!-- PROMPT: ${validSection.title.toUpperCase()} | TIPO: ${validSection.type.toUpperCase()} -->

### SYSTEM DIRECTIVE
- **Precision Mode**: Números exactos, colores HEX, timing específicos como constantes estrictas
- **No AI Slop (Impeccable UI Standard)**: Sin gradientes purple-to-blue por defecto, sin placeholders sin formato
- **Framework**: ${framework || "Tailwind CSS v4 + React + Lucide Icons"}
- **Interactividad**: ${interactivity || "Animaciones fluidas y microinteracciones responsive"}
${urgencyTriggers ? "- **Urgencia / Escasez**: Incluir disparadores de urgencia o disponibilidad limitada\n" : ""}${stickyCta ? "- **Sticky Bar / CTA Flotante**: Incluir botón o barra de conversión persistente al hacer scroll\n" : ""}${impeccableCraft !== false ? "- **Modo Impeccable Craft Activo**: Reglas matemáticas estrictas de bordes, padding, WCAG AA y anti-slop habilitadas\n" : ""}${llmHints}

**⚠️ RESTRICCIONES CRÍTICAS:**
1. **SOLO esta sección**: Genera ÚNICAMENTE el componente de la sección especificada (${validSection.type.toUpperCase()})
2. **Sin secciones adicionales**: No crear headers, footers, navbars u otras secciones no solicitadas
3. **Sin contenido inventado**: Usa exclusivamente el copy proporcionado abajo, no agregues textos, features o claims no especificados
4. **Un solo componente**: Output debe ser UN archivo .tsx con la sección descrita, nada más

---

${IMPECCABLE_CRAFT_DIRECTIVES}

---

### 1. CONTEXTO Y CRO
- **Industria**: ${validProject.industry || "General Landing Page"}
- **Tipo de Sección**: ${validSection.type.toUpperCase()} - ${sectionConfig.description}
- **Objetivo Específico de Contenido**: ${validSection.contentObjective || sectionConfig.description}
- **Público Objetivo (Buyer Persona)**: ${targetAudience}
- **Meta Principal de Conversión**: ${primaryGoal}
- **Propuesta Única de Valor (UVP)**: ${valueProposition}
- **Tono Visual y Arquetipo**: ${tone}
- **Densidad de Prueba Social**: ${socialProofDensity}

**Enfoques Clave Recomendados:**
${sectionConfig.keyFocus.map(f => `- ${f}`).join("\n")}

---

### 2. SISTEMA DE DISEÑO Y STYLE OVERRIDES
**Colores Exactos (HEX):**
- Primario: \`${palette.primary}\`
- Secundario: \`${palette.secondary}\`
- Acento: \`${palette.accent}\`
- Fondo Base: \`${palette.background}\`
- Superficie / Card: \`${palette.surface}\`
- Texto Principal: \`${palette.text}\`
- Texto Secundario: \`${palette.textMuted}\`

**Especificaciones de Sección:**
- **Estilo de Fondo de Sección:** \`${overrides.bgStyle || "Solid Surface"}\`
- **Variante de Layout:** \`${overrides.layoutVariant || layoutPattern}\`
- **Espaciado Vertical:** \`${overrides.paddingVertical || "Standard (py-20)"}\` | Container: \`max-w-7xl mx-auto\`
- **Estilo de Animaciones:** \`${overrides.animationStyle || "Framer Motion Fluid"}\`
${overrides.libraryEnhancements && overrides.libraryEnhancements.length > 0 ? `- **Librerías & Componentes Especiales Solicitados:** ${overrides.libraryEnhancements.join(", ")}\n` : ""}- **Tipografía:** Headings: \`${typography.headingFont}\` | Body: \`${typography.bodyFont}\`
- **Vibe / Atmósfera Global:** ${globalVibe}

---

### 3. ELEMENTOS REQUERIDOS
${(validSection.keyElements && validSection.keyElements.length > 0 ? validSection.keyElements : sectionConfig.recommendedElements).map(el => `- [ ] ${el}`).join("\n")}

${sectionConfig.codeExamples ? `**Ejemplo Código:**\n\`\`\`tsx\n${sectionConfig.codeExamples}\n\`\`\`` : ""}

---

### 4. COPYWRITING EXACTO
- **Headline Principal:** "${copy.headline}"
- **Subheadline / Cuerpo:** "${copy.subheadline || "..."}"
- **CTA Principal:** "${copy.ctaText}"
${copy.secondaryCtaText ? `- **CTA Secundario:** "${copy.secondaryCtaText}"\n` : ""}${copy.bulletPoints?.length ? "- **Viñetas / Puntos Clave:**\n" + copy.bulletPoints.map(bp => `  * ${bp}`).join("\n") + "\n" : ""}${copy.extraNotes ? `- **Instrucciones Especiales de Copy / Notas:** ${copy.extraNotes}\n` : ""}

---

### 5. ACCESIBILIDAD (WCAG AA)
${sectionConfig.accessibilityNotes.map(n => `- ${n}`).join("\n")}
- Contraste 4.5:1 mínimo | Focus visible | ARIA labels | Keyboard nav

---

### 6. SEO
${sectionConfig.seoGuidelines.map(g => `- ${g}`).join("\n")}

---

### 7. CHECKLIST TÉCNICO
- [ ] Componente React/TypeScript único
- [ ] ${framework || "Tailwind CSS v4 + React"}
- [ ] Mobile-first responsive
- [ ] Semantic HTML5
- [ ] Sin "// todo" - código completo

**⛔ PROHIBIDO:**
- Agregar navegación, headers o footers
- Crear secciones adicionales (hero, features, pricing, etc.)
- Inventar copy, features, testimonios o datos no proporcionados
- Generar múltiples componentes en un solo archivo

**Output:** ÚNICAMENTE el archivo \`${validSection.title.replace(/\s+/g, '')}Section.tsx\` con la sección ${validSection.type.toUpperCase()} descrita arriba. Nada más.
`;
}

export function buildGlobalProjectPrompt(project: Project): string {
  const { palette, typography, globalVibe } = project.styleConfig;
  const { tone, targetAudience, primaryGoal, valueProposition, framework, socialProofDensity, interactivity, targetLLM } = project.conversionVars;

  return `<!-- SISTEMA DE DISEÑO GLOBAL: ${project.name.toUpperCase()} -->

### CONTEXTO PROYECTO
- **Nombre:** ${project.name}
- **Industria:** ${project.industry || "SaaS/Tech"}
- **Público Objetivo:** ${targetAudience}
- **Propuesta Única de Valor (UVP):** ${valueProposition}
- **Meta Principal:** ${primaryGoal}
- **Framework:** ${framework}
- **IA Objetivo:** ${targetLLM || "Cualquier Modelo de IA (Gemini, ChatGPT, Claude)"}
- **Tono Visual:** ${tone}
- **Densidad de Prueba Social:** ${socialProofDensity}
- **Nivel de Interactividad:** ${interactivity || "Animaciones fluidas con Framer Motion"}

${IMPECCABLE_CRAFT_DIRECTIVES}

### DESIGN TOKENS
**Colores:** Primary: \`${palette.primary}\` | Secondary: \`${palette.secondary}\` | Accent: \`${palette.accent}\` | Bg: \`${palette.background}\` | Surface: \`${palette.surface}\` | Text: \`${palette.text}\`
**Fonts:** Headings: \`${typography.headingFont}\` | Body: \`${typography.bodyFont}\`
**Vibe:** ${globalVibe}

### SECCIONES CONFIGURADAS (${project.sections.length})
${project.sections.map((s, i) => `${i+1}. **${s.title}** (\`${s.type}\`): ${s.contentObjective || s.description}`).join("\n")}

**REGLA:** Generar SECCIÓN POR SECCIÓN, nunca todo junto en un solo archivo.
`;
}
