import { Project, Section } from "../types";

/**
 * Generates an ultra-detailed structured prompt for a single landing page section
 * adhering strictly to the project's global design rules, conversion variables, and section copy.
 */
export function buildSectionPrompt(project: Project, section: Section): string {
  const { palette, typography, globalVibe } = project.styleConfig;
  const { tone, layoutPattern, targetAudience, primaryGoal, valueProposition, socialProofDensity, framework } = project.conversionVars;
  const copy = section.copyDraft;
  const overrides = section.sectionStyleOverrides || {};

  return `<!-- ==================================================================== -->
<!-- PROMPT ESTRUCTURADO DE COMPONENTE - SECCIÓN: ${section.title.toUpperCase()} -->
<!-- PROYECTO LANDING: ${project.name.toUpperCase()} -->
<!-- ==================================================================== -->

### SYSTEM DIRECTIVE FOR AI CODE GENERATOR (LLM CONTEXT):
- **Precision Mode**: Execute pixel-perfect component architecture. Treat all explicit numbers, color hexes, keyframes, and timing parameters as strict constants.
- **No AI Slop Constraint**: Avoid random purple-to-blue default gradients, unformatted text placeholders, or floating glassmorphism overlays unless requested. Use clean mathematical spacing and high-contrast WCAG AA styling.
- **Framework Constraint**: Build an isolated React Functional Component using **${framework}** with Framer Motion animations (\`initial\`, \`whileInView\`, \`transition\`).

---

### 1. 🎯 OBJETIVO Y ROL DEL COMPONENTE DE SECCIÓN
- **Tipo de Sección**: ${section.type.toUpperCase()}
- **Nombre del Componente**: \`${section.title}\`
- **Objetivo de Conversión de la Sección**: ${section.contentObjective || "Captar la atención e incitar a la conversión"}
- **Público Objetivo**: ${targetAudience}
- **Meta Global de Conversión**: ${primaryGoal}
- **Propuesta de Valor de la Marca**: ${valueProposition}

---

### 2. 🎨 SISTEMA DE DISEÑO Y GUÍA DE ESTILOS (OBLIGATORIO)
Aplica estrictamente las siguientes especificaciones visuales usando **${framework}**:

- **Paleta de Colores (Códigos HEX / Clases Tailwind)**:
  - Color Primario (Acción / Marca): \`${palette.primary}\` (Usar en botones de conversión, énfasis de texto y bordes clave)
  - Color Secundario: \`${palette.secondary}\` (Usar en elementos de apoyo, badges y gradientes)
  - Color de Acento / Highlight: \`${palette.accent}\` (Usar en alertas, badges de oferta y detalles de atención)
  - Fondo de la Sección (Background): \`${palette.background}\` (${overrides.bgStyle ? `Preferencia: ${overrides.bgStyle}` : "Fondo limpio que resalte la sección"})
  - Superficie de Tarjetas / Contenedores: \`${palette.surface}\`
  - Color de Texto Principal: \`${palette.text}\` (Contraste mínimo WCAG AA)
  - Color de Texto Mapeado / Secundario: \`${palette.textMuted}\`

- **Tipografía (Google Fonts)**:
  - Fuentes a importar e implementar:
    - **Títulos (Headings H1-H3)**: \`${typography.headingFont}\` (weights: 600, 700, 800; font-bold / font-extrabold)
    - **Cuerpo de Texto / Párrafos**: \`${typography.bodyFont}\` (weights: 400, 500; tracking-normal, leading-relaxed)
  - Vibe Visual General: *${globalVibe || tone}*

- **Espaciados y Jerarquía Visual**:
  - Padding Vertical de Sección: \`${overrides.paddingVertical || "Standard (py-20)"}\` con \`px-4 sm:px-6 lg:px-8\` en contenedor máximo \`max-w-7xl mx-auto\`.
  - Bordes y Esquinas: Usar \`rounded-2xl\` o \`rounded-3xl\` para tarjetas y \`rounded-xl\` o \`rounded-full\` para botones/pills.

---

### 3. 📐 MAQUETACIÓN VISUAL Y ESTRUCTURA DE COMPONENTE
- **Variante de Layout**: \`${overrides.layoutVariant || layoutPattern}\`
- **Patrón de Lectura Recomendado**: ${layoutPattern}
- **Elementos Clave OBLIGATORIOS en este Componente**:
${section.keyElements.map((el) => `  - [ ] ${el}`).join("\n")}

---

### 4. ✍️ COPYWRITING Y TEXTOS PERSUASIVOS EXACTOS
Renderiza con precisión quirúrgica los siguientes textos y estructura de copia:

- **Titular Principal (H1/H2)**:
  > "${copy.headline || "Insertar titular persuasivo"}"
- **Subtitular / Descripción**:
  > "${copy.subheadline || "Insertar subtítulo descriptivo enfocado en beneficios"}"
- **Texto de Botón CTA Principal**:
  > "${copy.ctaText || "Comenzar Ahora"}"
${copy.secondaryCtaText ? `- **Texto de Botón CTA Secundario**: "${copy.secondaryCtaText}"` : ""}
${copy.bulletPoints && copy.bulletPoints.length > 0 ? `- **Puntos Clave / Beneficios (Bullets)**:\n${copy.bulletPoints.map((bp) => `  * ${bp}`).join("\n")}` : ""}
${copy.extraNotes ? `- **Micro-copia / Garantía**: "${copy.extraNotes}"` : ""}

---

### 5. ⚡ INTERACTIVIDAD, ESTADOS Y MICRO-ANIMACIONES
- **Efectos Hover en Botones**: \`transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]\`
- **Tarjetas / Cards**: Sombras suaves (\`shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300\`)
- **Entradas con Framer Motion**: \`initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}\`
- **Densidad de Prueba Social**: ${socialProofDensity}

---

### 6. 🧩 RECOMENDACIÓN DE ASSETS E ICONOS (LUCIDE-REACT)
- Utiliza iconos limpios de la librería \`lucide-react\` (ej: \`CheckCircle2\`, \`ArrowRight\`, \`Sparkles\`, \`ShieldCheck\`, \`Star\`, \`Zap\`, \`ChevronDown\`, \`Users\`).
- Asegura que los iconos tengan el color de acento o primario y tamaño adecuado (\`w-5 h-5\` o \`w-6 h-6\`).

---

### 7. 🛠️ INSTRUCCIONES TÉCNICAS DE CÓDIGO
1. Genera el código para un **único componente de React funcional en TypeScript** que represente SOLO esta sección.
2. Utiliza **Tailwind CSS v4** con clases de utilidad directamente en los JSX elementos.
3. No dependas de APIs externas para imágenes; usa placeholders o gradientes elegantes con SVG cuando aplique.
4. Asegura compatibilidad mobile-first (\`sm:\`, \`md:\`, \`lg:\`).
5. Estructura el código de forma modular, limpia y completamente terminada sin comentarios como "// todo".
`;
}

/**
 * Generates the global project prompt context establish the overall design system
 * and sections roadmap before building individual section components.
 */
export function buildGlobalProjectPrompt(project: Project): string {
  const { palette, typography, globalVibe } = project.styleConfig;
  const { tone, targetAudience, primaryGoal, valueProposition, framework } = project.conversionVars;

  return `<!-- ==================================================================== -->
<!-- SISTEMA DE DISEÑO GLOBAL Y CONTEXTO DEL PROYECTO LANDING PAGE -->
<!-- PROYECTO: ${project.name.toUpperCase()} -->
<!-- ==================================================================== -->

### SYSTEM DIRECTIVE FOR LLM / AI ENGINE:
- Store this design tokens state and layout hierarchy in conversation memory.
- When generating individual section components, enforce these exact Hex color codes, Google Font declarations, and brand voice guidelines.

---

### 🚀 CONTEXTO GENERAL DEL PROYECTO Y MARCA
- **Nombre de la Landing / Producto**: ${project.name}
- **Descripción**: ${project.description || "Landing page de alta conversión"}
- **Industria**: ${project.industry || "SaaS / Tecnología / Digital"}
- **Público Objetivo**: ${targetAudience}
- **Propuesta Única de Valor (UVP)**: ${valueProposition}
- **Objetivo Principal de Conversión**: ${primaryGoal}
- **Tono Visual**: ${tone}
- **Vibe de Marca**: ${globalVibe}
- **Framework de Código**: ${framework}

---

### 🎨 SISTEMA DE DISEÑO GLOBAL DE LA LANDING PAGE

1. **PALETA DE COLORES OFICIAL**:
   - Color Primario (Acción Principal): \`${palette.primary}\`
   - Color Secundario (Soporte / Badges): \`${palette.secondary}\`
   - Color de Acento (Destacados / Ofertas): \`${palette.accent}\`
   - Fondo Base (Canvas): \`${palette.background}\`
   - Superficie de Contenedores / Cards: \`${palette.surface}\`
   - Texto Principal (Alta legibilidad): \`${palette.text}\`
   - Texto Secundario / Desactivado: \`${palette.textMuted}\`

2. **COMBINACIÓN TIPOGRÁFICA OFICIAL**:
   - **Títulos / Encabezados (H1 - H4)**: \`${typography.headingFont}\`
   - **Cuerpo de Texto / Párrafos**: \`${typography.bodyFont}\`

---

### 📋 ESTRUCTURA DE SECCIONES DEL PROYECTO (${project.sections.length} SECCIONES REGISTRADAS)
Esta landing page está estructurada modularmente en las siguientes secciones secuenciales:

${project.sections.length === 0 ? "*(No se han agregado secciones aún. Agrega secciones al proyecto para listar la secuencia completa)*" : project.sections.map((sec, idx) => `${idx + 1}. **${sec.title}** (Tipo: \`${sec.type}\`) -> ${sec.description}`).join("\n")}

---

### ⚡ REGLA FUNDAMENTAL DE GENERACIÓN
*Nota para el Asistente de IA / Modelo de Código*:
Esta landing page **SE DEBE GENERAR SECCIÓN POR SECCIÓN**, nunca en un solo prompt completo, para garantizar la máxima precisión técnica, detalle en copywriting y perfección en el diseño de interfaz de cada componente.

Utiliza este Prompt Global para guardar el Sistema de Diseño en la memoria del modelo y luego solicita cada sección individualmente con sus prompts dedicados.
`;
}
