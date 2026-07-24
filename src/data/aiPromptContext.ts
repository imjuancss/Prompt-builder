export interface BenchmarkPromptExample {
  id: string;
  title: string;
  category: string;
  description: string;
  fullPromptText: string;
}

export const AI_PROMPT_COGNITIVE_GUIDE = `<!-- ==================================================================== -->
<!-- GUÍA DE ARQUITECTURA COGNITIVA: CÓMO LOS LLMs LEEN Y EJECUTAN PROMPTS -->
<!-- ==================================================================== -->

### 1. 🧠 MECANISMO DE ATENCIÓN Y PARSEO DE TOKENS EN LLMs
Un modelo de lenguaje para código (como Gemini, Claude o GPT-4o) lee los prompts a través de mecanismos de atención que priorizan **parámetros numéricos exactos y estructuras sintácticas directas** por encima de prosas vagas.

- **Prosa Vaga (Ineficiente)**: *"Haz que la tarjeta aparezca suavemente con una animación bonita."*
  → *Resultado*: El modelo genera animaciones genéricas con valores aleatorios (ej: duration: 0.3, ease: 'ease').
- **Especificación Parámetrica (Óptima)**: 
  \`\`\`
  initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
  viewport={{ once: true, margin: "-50px" }}
  \`\`\`
  → *Resultado*: El modelo copia y compila la lógica exacta sin invitar discrepancias estéticas.

---

### 2. 📐 REGLAS DE ORO PARA PROMPTS DE CÓDIGO DE ALTA DENSIDAD

1. **Jerarquía Visual y Capas en Z-Index**:
   Especifica la estructura de capas de forma explícita (p. ej., \`Hero Background: z-0\`, \`Parallax Overlay: z-10\`, \`Floating Content: z-20\`, \`Custom Cursor: z-50\`).

2. **Sistemas de Assets mediante Mapeo CDN**:
   No permitas que el LLM intente cargar imágenes locales no existentes o invente rutas ficticias. Declara un objeto de constantes de assets CDN:
   \`\`\`ts
   const ASSETS = {
     heroVideo: "https://qclay.design/lovable/.../video.mp4",
     cardBg: "https://qclay.design/lovable/.../bg.png"
   };
   \`\`\`

3. **Cero Alucinaciones en Copywriting**:
   Encierra los textos reales en bloques declarativos para que el LLM los renderice literalmente sin paraphrasing.

4. **Micro-interacciones y Estados Hover Explicitos**:
   Instruye los estados de entrada (\`initial\`), vista en pantalla (\`whileInView\`), hover (\`whileHover\`) y keyframes de scroll (\`useScroll\`, \`useTransform\`).

5. **Definición Estricta de Fuentes y Tipografía**:
   Especifica los pesos exactos y el emparejamiento tipográfico (ej. *Inter Tight* para UI limpia + *Instrument Serif* para términos de acento o *Playfair Display* en itálica).
`;

export const BENCHMARK_EXAMPLES: BenchmarkPromptExample[] = [
  {
    id: "qclay-bags",
    title: "QClay Bags Landing (Sections 1, 2, 3)",
    category: "Awwwards / Editorial Motion",
    description: "Prompt detallado con secuencias de framer-motion keyframes, animación 'tubular curl', revelación de sobre por scroll e interacción orbital en 3D.",
    fullPromptText: `Below is the complete reproduction prompt for the entire page (Sections 1, 2, and 3). Bold without markdown. Code is reserved only for keyframes, scroll-mapped values, and geometry where prose would be ambiguous.

---

GLOBAL / PAGE LEVEL

Stack and dependencies. React + Vite + TypeScript + TailwindCSS. All animations use framer-motion (motion, useScroll, useTransform, MotionValue) plus React's useRef, useState, useEffect. No router-driven logic, no backend, no global state.

Fonts. Loaded once in index.html via Google Fonts: Inter Tight (weights 300, 400, 500, 600, 700, 800, 900) and Instrument Serif (italic and roman). Inter Tight is the entire UI and display sans. Instrument Serif is reserved for the four signature serif accent words — "your" (Hero), "elegance" (Hero sticker), "new" (Section 2 header), "match" (Section 3 title) — plus the bracketed numerals "(01)…(06)" used as labels in Hero and Section 3, and the watermark "(01)" in the bottom-right of Hero.

Page structure. A single Index page renders three sections with no wrappers between them: Hero (warm cream), Collection (true black, 4× viewport-tall scroll stage), PerfectMatch (light grey paper). Section 2 → Section 3 is bridged by a torn-paper graphic that bleeds upward over the black.

Brand color (TEXT_COLOR). A muted warm grey, exact value #545454, used for almost all body and headline text on light backgrounds and as the soft fill behind the yellow-green serif glow.

Signature serif glow technique. Every Instrument Serif accent word ("your", "elegance", "new", "match") uses the exact same dual-layer construction: an absolutely positioned aria-hidden span behind, with color: #EAFE79, WebkitTextStrokeWidth between 10 and 20px (sized to the word), and WebkitTextStrokeColor: #EAFE79 — producing a soft fluorescent yellow-green halo. On top of it, a relatively positioned span renders the same word in solid #545454. The two layers share font-size, line-height and letter-spacing exactly, so the fill sits centered inside the glow.

Signature "tubular curl" entrance (used on every signature serif word). A motion.span with transformPerspective: 600, transformOrigin: "top center", animating from { rotateX: -110, scaleY: 0.15, scaleX: 0.7, opacity: 0 } to keyframed:

rotateX:  [-110, -70, -20,  5, -2, 0]
scaleY:   [0.15, 0.4,  0.8, 1.04, 0.98, 1]
scaleX:   [0.7,  0.85, 0.95, 1.02, 1, 1]
opacity:  [0,    0.4,  0.85, 1, 1, 1]
duration: 0.7, ease: [0.22, 1, 0.36, 1], times: [0, 0.2, 0.55, 0.75, 0.88, 1]

The delay differs per occurrence: 0.5 in Hero ("your"), 1.35 for "elegance", 0.5 inView in Section 2 header ("new"), 0.5 inView in Section 3 title ("match"). It reads as a sticker unfurling forward off the page.

Asset host. All imagery is fetched from https://qclay.design/lovable/bags, joined as \${ASSET}/\${file}. No asset is bundled locally.

---

SECTION 1 — HERO

Container. A relative, full-viewport, overflow-hidden div with background: #EEEAE3 (warm parchment cream) and fontFamily: 'Inter Tight'. Min-height 100vh.

Navbar. A fixed top bar (top: 0, left: 0, right: 0, zIndex: 50), padding 20px 32px, transparent background, justified to the right with 32px gaps. Three plain text links — "Catalog", "Favorites", "Cart (0)" — Inter Tight 14 / 400 / #545454, with a 200ms hover:opacity-60. To their right, a borderless icon button containing burger.svg (42×30) with hover:opacity-70. No logo.

Heading block. Absolutely positioned at top: 32, left: 40, maxWidth: 500, zIndex: 10. Three lines stacked.
Line 1: "Bags crafted" — Inter Tight, 87.999 / 500 / line-height 80 / letter-spacing -3.52 / #545454. Enters from { opacity:0, filter: blur(14px) } to crisp over 0.8s easeOut, delay 0.1s.
Line 2: "to move with" — same exact type, delay 0.28s.
Line 3 row: a flex row with alignItems: baseline, gap: 12, marginTop: -2 containing the signature serif word "your" then the sans word "story".

---

SECTION 2 — COLLECTION (envelope reveal scroll stage)

Container. A div with background: #111111 (true black), position: relative, height: 400vh, fontFamily: 'Inter Tight'. A useScroll is attached with target: containerRef, offset: ["start start", "end end"]. Inside, a sticky div is top: 0, height: 100vh, overflow: hidden, flex column, items + content centered — the entire envelope choreography happens here while the page is scrolled through 4 viewports.

Photos. Six cards from [photo-1…photo-6].png named ["Terra", "Love Bag", "Amélie", "Belle", "Mira", "Adele"]. Z-stack across the row is [2, 4, 6, 6, 4, 2] so the middle two photos read on top, fanning down toward the edges.

Mid-stage peek positions (just escaping the V opening, [x, y, rotateDeg]):
[-90, -30, -12], [-40, -60, -6], [-15, -78, -2],
[ 20, -76,   3], [ 55, -58,  7], [ 95, -28, 12]

Final row positions (single horizontal row across the viewport):
[-625, 0, 0], [-375, 0, 0], [-125, 0, 0],
[ 125, 0, 0], [ 375, 0, 0], [ 625, 0, 0]

---

SECTION 3 — PERFECTMATCH (paper-bridge orbit)

Orbit center. A 0×0 absolute element at the geometric center (top: 50%, left: 50%). Six bag elements rotate around it in real time.
Continuous rotation engine. A useState named angle is incremented by 0.12 every requestAnimationFrame frame (≈7.2°/sec — slow, calm). A useState paused flag freezes the increment when true.`
  },
  {
    id: "ground-ai",
    title: "GroundAI Interior Design AI Landing Page",
    category: "SaaS & AI Tooling",
    description: "Landing page completa para aplicación de IA con TanStack Start, carrusel de pills animado, marquee infinito y burbuja morph con temporizadores.",
    fullPromptText: `Build a single-page TanStack Start v1 landing page for a product called "GroundAI" (interior design AI). Use React 19, TypeScript, Tailwind v4, framer-motion and lucide-react. Page lives at src/routes/index.tsx and is composed of four stacked sections in this exact order: Hero, TrustedBy, CraftExperiences, Testimonials.

ASSETS. Create src/lib/assets.ts that exports a single object A with a BASE constant equal to "https://qclay.design/lovable/groundai" and these keys: Hero=hero1.mp4, backgroundCard=backgroundCard.png, bottomWonem=bottomWonem.png, womem=womem.png, logo=logo.svg, ArrowUp=ArrowUp.svg, GreenFlag=GreenFlag.svg, Nueral=Nueral.svg, Orinya=Orinya.svg, Skodia=Skodia.svg, SkodiaSkodia=SkodiaSkodia.svg, Wids=Wids.svg, Xyreion=Xyreion.svg.

FONTS. In the route head(), inject Google Fonts stylesheet for Inter Tight (wght 400;500) and Playfair Display (ital 1). Inline styles use 'Inter Tight' for headings, 'Playfair Display' italic for accent words, and 'SF Pro Rounded' for body buttons.

GLOBAL CSS:
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.animate-marquee { animation: marquee 35s linear infinite; }

HERO SECTION:
Header (motion.header) animates initial {y:"45vh", opacity:0} to {y:0, opacity:1} over 1s with ease [0.22,1,0.36,1]. Navigation pill with smooth layout transition.
Center hero content: H1 text-white 64px Inter Tight composed of three motion.span blocks with staggered delay (0.3s, 0.5s, 0.7s). Button "Start free decoration".

TRUSTEDBY COMPONENT:
Infinite scrolling logo marquee with 7 brand logos, smooth opacity 0.4, gradient fade masks on left and right edges.

CRAFTEXPERIENCES COMPONENT:
Card 1: Interactive style carousel cycling through 7 design styles with spring physics (stiffness 260, damping 28).
Card 2: Interactive chat morph bubble transitioning from skeleton placeholder to filled user prompt after 1100ms.
Card 3: Adaptable list featuring expandable category items with smooth stagger reveal.`
  },
  {
    id: "geptral-nature",
    title: "Geptral Nature-Driven Landing Master Prompt",
    category: "Dark Mode Luxury / Environmental Tech",
    description: "Reconstrucción pixel-perfect con grid 3D interactivo WaveGrid (@react-three/fiber), tipografía dinámica HoverLetter por ejes X, y contador incremental animado.",
    fullPromptText: `Build a premium, dark, cinematic, Awwwards-level landing page for Geptral — a nature-driven innovation company. All section code is provided verbatim — DO NOT modify logic, class names, timings, easings, opacities, or magic numbers.

1. TECH STACK & SETUP
- Framework: TanStack Start v1 + React 19 + Vite 7 + TypeScript.
- Styling: Tailwind CSS v4.
- Animation: framer-motion.
- 3D: @react-three/fiber + three (WaveGrid component).
- Font: Google Font "Inter Tight" (weights 200–900).
- Global background: #1b1b1b, Global text: white.

2. ASSETS (CDN BASE)
Base URL: https://qclay.design/lovable/ceptral/
Images: BGCard.png, Card.png, FirstCard.png, Noise.png, Side-Image-Container.png, imageTower.png, Flower.png, SolarPaner.png, Stone.png, image-1.png to image-39.png.

3. SPECIAL INTERACTIONS & BEHAVIOR
- Section 2 Drag Collage: Desktop animated collage + drag-to-shift + glass cursor that activates on card hover. Mobile/tablet shows 2x2 grid.
- Section 5 Grid & Counter: Sticky 105vh container, 10-column dynamic image grid with crossfade animation every 2000ms, and count-up animation from 0.0 to 3.2 HA in 1.5s.
- Section 7 Typography Weight Morph: HoverLetter start at weight 900. Moving mouse right (movementX > 0) sets font-weight to 300; moving left (movementX < 0) sets font-weight to 900.`
  },
  {
    id: "codeba-endless",
    title: "Codeba E-Endless Designer Landing Page",
    category: "Design Tool / Developer Experience",
    description: "Recreación exacta de herramienta de diseño AI con simulación de macOS window, efecto clip-path sweep, cursor multijugador animado y typewriter CSS.",
    fullPromptText: `Recreate this exact website pixel-perfectly using TanStack Start v1 + React 19 + Vite 7 + Tailwind CSS v4 + framer-motion. Background is pure black (#000), text Inter Tight / Inter.

ASSETS BASE: https://qclay.design/lovable/codeba/
Images: Bg.png, woman.png, Card.png, 01.svg, dash02.svg, Line.svg, Card_3.png, Card_3pink.png, Card_4.png, Card_5.png.

LAYER HIERARCHY & KEY ANIMATIONS:
1. Hero Header & Macbook Frame: Window background #0F0D0F with MacDots, 5 tool icons, share button, and stacked avatars.
2. Search & Typing Input: Input container clip-path reveal-right at 1620ms. TypingPlaceholderInput types "Write your prompt/" character by character at 70ms step.
3. Dashboard Preview Cards:
   - Beige Card1 (#D0C9B9): Clip-path line sweep reveal duration 0.72s, CountUp counter to 93%.
   - Pink Card2: CountUp to 8000 components.
4. Stats Multiplayer Card: White sweep bar expands (scaleX 0 -> 1) while black text overlay reveals via clip-path simultaneously. Cursor "Manager" follows 5-keyframe path over 2.6s.
5. Code Typewriter Block: Types out exact CSS code block character-by-character at 18ms/char with pulsing caret.`
  },
  {
    id: "kubric-hero",
    title: "Kubric™ Hero Landing Master Prompt",
    category: "Minimalist High-Impact Hero",
    description: "Hero full-viewport con 8 capas de blur progresivo en degradado, logo SVG con arcos animados, y revelado tipográfico carácter por carácter.",
    fullPromptText: `Goal: Create a single-page dark hero landing called "Kubric™". Full-viewport hero (min 1024px wide) with looping background video, progressive blur overlay, animated SVG logo, glass nav pill, and 3-line italic-accent headline.

ASSETS:
- Video: https://qclay.design/lovable/kubric/body.mp4
- Card Image: https://qclay.design/lovable/kubric/card-image.png

PROGRESSIVE BLUR STACK (8 LAYERS):
Stacking 8 backdrop-filter layers with stepped blur radii (0.6px to 8px) and stepped linear-gradient masks from 0% to 100% to create an ultra-smooth cinematic transition at the bottom of the video.

LOGO ANIMATION TIMELINE:
- 0.10s logo circle: scale(0->1) spring ease.
- 0.55s outer arcs: stroke-dashoffset 100->0 + translateX.
- 1.25s far arcs + text group: opacity 0->1 + filter blur(10px->0).

HEADLINE CHARACTER REVEAL:
Each character inside the 3-line headline is wrapped in a span and slides up from translateY(110%) with calculated stagger delay (lineDelay + charIndex * 0.038s).`
  },
  {
    id: "valmax-photography",
    title: "Valmax Photography Studio Master Prompt",
    category: "Creative Portfolio / Fashion Photography",
    description: "Landing de fotografía cinemática con StarField canvas interactivo, LineField SVG con marcadores de coordenadas y secuencia de intro coordinada.",
    fullPromptText: `Build a single-page React + Vite + TypeScript + Tailwind v4 app that recreates the VALMAX photography landing page.

ASSET CDN: qclay.design/lovable/valmax/

KEY COMPONENTS:
1. IntroSequence: Fullscreen 3.6s opener with triple concentric expanding circles, 9 SVG radial rays, and logo container scale snap to TopBar slot.
2. StarField Canvas: Dynamic HTML5 Canvas rendering twinkling background stars and an optional central constellation ring with Box-Muller Gaussian distribution.
3. LineField SVG: Vector grid lines with animated pathLength and floating coordinate star markers with monospaced label tags.
4. Floating Photo Collage: 7 parallax photo cards with mouse coordinate tracking, custom badges, and 'View Album' glowing spotlight overlay.`
  }
];
