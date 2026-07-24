import { Project, Section, SectionType } from "../types";

const SECTION_CONFIGS: Record<SectionType, { description: string; keyFocus: string[]; recommendedElements: string[]; accessibilityNotes: string[]; seoGuidelines: string[]; codeExamples?: string; }> = {
  hero: { description: "Sección principal de impacto inmediato", keyFocus: ["Propuesta clara en <5s", "CTA visible sin scroll"], recommendedElements: ["H1 único", "Subheadline", "CTA principal"], accessibilityNotes: ["Contraste 4.5:1", "Alt text en imágenes"], seoGuidelines: ["H1 con keyword principal"], codeExamples: "// Hero example" },
  features: { description: "Detalle de funcionalidades", keyFocus: ["Features vinculadas a beneficios"], recommendedElements: ["Grid de features", "Iconos distintivos"], accessibilityNotes: ["Grid responsive"], seoGuidelines: ["Keywords en H3"], codeExamples: "// Features grid" },
  pricing: { description: "Presentación de planes y precios", keyFocus: ["Transparencia total", "Plan destacado claro"], recommendedElements: ["3 planes máximo", "Precio con periodo"], accessibilityNotes: ["Precios legibles"], seoGuidelines: ["Schema Offer"], codeExamples: "// Pricing card" },
  faq: { description: "Resolución de objeciones", keyFocus: ["Preguntas reales", "Respuestas concisas"], recommendedElements: ["Accordion", "5-10 preguntas"], accessibilityNotes: ["ARIA expanded"], seoGuidelines: ["Schema FAQPage"], codeExamples: "// FAQ accordion" },
  testimonials: { description: "Validación social", keyFocus: ["Autenticidad", "Resultados cuantificables"], recommendedElements: ["Foto + nombre + cargo", "Métricas"], accessibilityNotes: ["Alt text en fotos"], seoGuidelines: ["Schema Review"], codeExamples: "// Testimonial card" },
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
  if (!validProject.conversionVars.framework) { validProject.conversionVars.framework = "Tailwind CSS v4 + React"; warnings.push("Framework no especificado"); }
  if (!validSection.copyDraft.headline?.trim()) { validSection.copyDraft.headline = "[HEADLINE PENDIENTE]"; warnings.push(`Headline faltante en ${section.title}`); }
  if (!validSection.copyDraft.ctaText?.trim()) { validSection.copyDraft.ctaText = "Comenzar Ahora"; warnings.push("CTA default usado"); }
  if (!validProject.styleConfig.palette.primary) { validProject.styleConfig.palette.primary = "#3B82F6"; warnings.push("Color primario default"); }
  
  return { validProject, validSection, warnings };
}

export function buildSectionPrompt(project: Project, section: Section, targetLLM?: string): string {
  const { validProject, validSection, warnings } = validateAndNormalizeData(project, section);
  const { palette, typography, globalVibe } = validProject.styleConfig;
  const { tone, layoutPattern, targetAudience, primaryGoal, valueProposition, socialProofDensity, framework } = validProject.conversionVars;
  const copy = validSection.copyDraft;
  const overrides = validSection.sectionStyleOverrides || {};
  const sectionConfig = SECTION_CONFIGS[validSection.type as SectionType] || SECTION_CONFIGS.custom;
  const llmHints = getLLMOptimizationHints(targetLLM);

  return `<!-- PROMPT: ${validSection.title.toUpperCase()} | TIPO: ${validSection.type.toUpperCase()} -->

### SYSTEM DIRECTIVE
- **Precision Mode**: Números exactos, colores HEX, timing específicos como constantes estrictas
- **No AI Slop**: Sin gradientes purple-to-blue por defecto, sin placeholders sin formato
- **Framework**: React + Tailwind CSS v4 + Framer Motion + Lucide Icons
${llmHints}

**⚠️ RESTRICCIONES CRÍTICAS:**
1. **SOLO esta sección**: Genera ÚNICAMENTE el componente de la sección especificada (${validSection.type.toUpperCase()})
2. **Sin secciones adicionales**: No crear headers, footers, navbars u otras secciones no solicitadas
3. **Sin contenido inventado**: Usa exclusivamente el copy proporcionado abajo, no agregues textos, features o claims no especificados
4. **Un solo componente**: Output debe ser UN archivo .tsx con la sección descrita, nada más

---

### 1. CONTEXTO DE SECCIÓN
- **Tipo**: ${validSection.type.toUpperCase()} - ${sectionConfig.description}
- **Objetivo**: ${validSection.contentObjective}
- **Público**: ${targetAudience}
- **Meta Conversión**: ${primaryGoal}

**Enfoques Clave:**
${sectionConfig.keyFocus.map(f => `- ${f}`).join("\n")}

---

### 2. SISTEMA DE DISEÑO
**Colores:** Primario: \`${palette.primary}\` | Secundario: \`${palette.secondary}\` | Acento: \`${palette.accent}\`
**Fondo:** \`${palette.background}\` ${overrides.bgStyle ? `→ ${overrides.bgStyle}` : ""}
**Tipografía:** Headings: \`${typography.headingFont}\` | Body: \`${typography.bodyFont}\`
**Spacing:** ${overrides.paddingVertical || "py-20"} | Container: max-w-7xl mx-auto

---

### 3. ELEMENTOS REQUERIDOS
${(validSection.keyElements.length > 0 ? validSection.keyElements : sectionConfig.recommendedElements).map(el => `- [ ] ${el}`).join("\n")}

${sectionConfig.codeExamples ? `**Ejemplo Código:**\n\`\`\`tsx\n${sectionConfig.codeExamples}\n\`\`\`` : ""}

---

### 4. COPYWRITING EXACTO
**Headline:** "${copy.headline}"
**Subheadline:** "${copy.subheadline || "..."}"
**CTA:** "${copy.ctaText}"
${copy.bulletPoints?.length ? "**Bullets:**\n" + copy.bulletPoints.map(bp => `- ${bp}`).join("\n") : ""}

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
- [ ] Tailwind CSS v4 clases utilitarias
- [ ] Framer Motion animations
- [ ] Lucide React icons
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
  const { tone, targetAudience, primaryGoal, valueProposition, framework } = project.conversionVars;

  return `<!-- SISTEMA DE DISEÑO GLOBAL: ${project.name.toUpperCase()} -->

### CONTEXTO PROYECTO
- **Nombre:** ${project.name}
- **Industria:** ${project.industry || "SaaS/Tech"}
- **Público:** ${targetAudience}
- **UVP:** ${valueProposition}
- **Meta:** ${primaryGoal}
- **Framework:** ${framework}

### DESIGN TOKENS
**Colores:** Primary: \`${palette.primary}\` | Secondary: \`${palette.secondary}\` | Accent: \`${palette.accent}\`
**Fonts:** Headings: \`${typography.headingFont}\` | Body: \`${typography.bodyFont}\`
**Vibe:** ${globalVibe}

### SECCIONES (${project.sections.length})
${project.sections.map((s, i) => `${i+1}. **${s.title}** (\`${s.type}\`)`).join("\n")}

**REGLA:** Generar SECCIÓN POR SECCIÓN, nunca todo junto.
`;
}
