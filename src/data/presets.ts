import { ColorPalette, TypographyPair, StylePreset, GoogleFontOption } from "../types";

export const PRESET_PALETTES: ColorPalette[] = [
  {
    id: "pal-tech-indigo",
    name: "SaaS Indigo & Cyan Modern",
    primary: "#4F46E5",
    secondary: "#06B6D4",
    accent: "#10B981",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    description: "Ideal para startups tecnológicas, software B2B y productos digitales de alta conversión.",
  },
  {
    id: "pal-emerald-growth",
    name: "Emerald Growth & Trust",
    primary: "#059669",
    secondary: "#0284C7",
    accent: "#F59E0B",
    background: "#F0FDF4",
    surface: "#FFFFFF",
    text: "#064E3B",
    textMuted: "#047857",
    description: "Transmite confianza, crecimiento financiero, salud, sostenibilidad y ROI positivo.",
  },
  {
    id: "pal-dark-neon",
    name: "Dark Cyber & Violet Glow",
    primary: "#8B5CF6",
    secondary: "#EC4899",
    accent: "#06B6D4",
    background: "#090D16",
    surface: "#111827",
    text: "#F9FAFB",
    textMuted: "#9CA3AF",
    description: "Diseño oscuro premium de alto impacto para IA, Web3, desarrollo y productos futuristas.",
  },
  {
    id: "pal-warm-amber",
    name: "Warm Amber & Terracotta Editorial",
    primary: "#D97706",
    secondary: "#9A3412",
    accent: "#2563EB",
    background: "#FFFBEB",
    surface: "#FFFFFF",
    text: "#451A03",
    textMuted: "#78350F",
    description: "Estilo acogedor, creativo, educación, consultorías premium y marcas personales.",
  },
  {
    id: "pal-minimal-slate",
    name: "Monochrome Slate & Vibrant Blue",
    primary: "#2563EB",
    secondary: "#475569",
    accent: "#DC2626",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#64748B",
    description: "Limpio, directo al punto, minimalista estilo Stripe/Vercel de alta claridad.",
  },
  {
    id: "pal-luxury-obsidian",
    name: "Gold & Obsidian Luxury",
    primary: "#EAB308",
    secondary: "#71717A",
    accent: "#38BDF8",
    background: "#050505",
    surface: "#18181B",
    text: "#FAFAFA",
    textMuted: "#A1A1AA",
    description: "Elegancia corporativa, finanzas de alta gama, servicios inmobiliarios o asesorías VIP.",
  },
  {
    id: "pal-royal-violet",
    name: "Royal Violet & Electric Rose",
    primary: "#7C3AED",
    secondary: "#F43F5E",
    accent: "#06B6D4",
    background: "#FAF5FF",
    surface: "#FFFFFF",
    text: "#2E1065",
    textMuted: "#6B21A8",
    description: "Sofisticado e innovador. Perfecto para plataformas SaaS creativas, Creator Economy y educación digital.",
  },
  {
    id: "pal-midnight-neon-emerald",
    name: "Midnight Matrix & Lime Glow",
    primary: "#10B981",
    secondary: "#84CC16",
    accent: "#06B6D4",
    background: "#05110E",
    surface: "#0D1F1A",
    text: "#ECFDF5",
    textMuted: "#6EE7B7",
    description: "Modo oscuro futurista estilo Matrix. Ideal para ciberseguridad, DevOps, Web3, crypto y analítica.",
  },
  {
    id: "pal-crimson-power",
    name: "Crimson Peak & Graphite Impact",
    primary: "#E11D48",
    secondary: "#2563EB",
    accent: "#F59E0B",
    background: "#FFF1F2",
    surface: "#FFFFFF",
    text: "#18181B",
    textMuted: "#71717A",
    description: "Energético y de alto impacto. Diseñado para e-commerce, fitness, ofertas flash y campañas masivas.",
  },
  {
    id: "pal-nordic-frost",
    name: "Nordic Frost & Steel Blue",
    primary: "#0284C7",
    secondary: "#475569",
    accent: "#10B981",
    background: "#F0F9FF",
    surface: "#FFFFFF",
    text: "#0C4A6E",
    textMuted: "#0369A1",
    description: "Fresco, calmado y profesional. Excelente para salud, tecnología médica, fintech y seguros.",
  },
  {
    id: "pal-sunset-horizon",
    name: "Sunset Crimson & Coral Glow",
    primary: "#EA580C",
    secondary: "#DB2777",
    accent: "#FBBF24",
    background: "#FFF7ED",
    surface: "#FFFFFF",
    text: "#431407",
    textMuted: "#9A3412",
    description: "Cálido, vibrante y apasionante. Ideal para eventos, gastronomía, viajes y comunidades activas.",
  },
  {
    id: "pal-corporate-navy",
    name: "Corporate Navy & Gold Executive",
    primary: "#1E3A8A",
    secondary: "#D97706",
    accent: "#0284C7",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    text: "#0F172A",
    textMuted: "#475569",
    description: "Serio e institucional. Perfecto para firmas legales, bancos, aseguradoras y consultorías B2B.",
  },
  {
    id: "pal-cyberpunk-purple",
    name: "Deep Space Purple & Neon Cyan",
    primary: "#06B6D4",
    secondary: "#A855F7",
    accent: "#F43F5E",
    background: "#0B0B14",
    surface: "#141424",
    text: "#F8FAFC",
    textMuted: "#94A3B8",
    description: "Estilo gaming, streaming, entretenimiento interactivo y eventos tecnológicos de vanguardia.",
  },
  {
    id: "pal-sage-harmony",
    name: "Sage Organic & Natural Olive",
    primary: "#4D7C0F",
    secondary: "#0F766E",
    accent: "#D97706",
    background: "#F7FEE7",
    surface: "#FFFFFF",
    text: "#1A2E05",
    textMuted: "#3F6212",
    description: "Ecológico, orgánico y natural. Perfecto para bienestar, cosmética, productos eco y sustentabilidad.",
  },
  {
    id: "pal-charcoal-electric",
    name: "Charcoal Matte & Electric Blue",
    primary: "#3B82F6",
    secondary: "#10B981",
    accent: "#F43F5E",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#F3F4F6",
    textMuted: "#9CA3AF",
    description: "Modo oscuro mate estilo IDEs y herramientas de monitoreo, dashboards y plataformas de desarrolladores.",
  },
  {
    id: "pal-pastel-bloom",
    name: "Pastel Bloom & Lavender Soft",
    primary: "#8B5CF6",
    secondary: "#EC4899",
    accent: "#14B8A6",
    background: "#FAF5FF",
    surface: "#FFFFFF",
    text: "#3B0764",
    textMuted: "#7E22CE",
    description: "Suave, moderno y amigable. Ideal para blogs, productos de diseño, lifestyle y cuidado personal.",
  }
];

export const PRESET_TYPOGRAPHY: TypographyPair[] = [
  {
    id: "typo-modern-sans",
    name: "Plus Jakarta Sans + Inter (SaaS Modern)",
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Inter",
    styleNote: "Títulos modernos y limpios con excelente legibilidad en pantalla para productos digitales.",
  },
  {
    id: "typo-editorial-luxury",
    name: "Playfair Display + Plus Jakarta Sans (Editorial)",
    headingFont: "Playfair Display",
    bodyFont: "Plus Jakarta Sans",
    styleNote: "Perfecto para marcas premium, consultoría, diseño, bienes raíces y alta gama.",
  },
  {
    id: "typo-tech-bold",
    name: "Space Grotesk + DM Sans (Tech & AI)",
    headingFont: "Space Grotesk",
    bodyFont: "DM Sans",
    styleNote: "Geométrico, futurista y audaz. Ideal para startups de IA, herramientas dev y fintech.",
  },
  {
    id: "typo-clean-universal",
    name: "Outfit + Open Sans (Universal Conversion)",
    headingFont: "Outfit",
    bodyFont: "Open Sans",
    styleNote: "Títulos redondeados agradables combinados con cuerpo altamente legible en cualquier dispositivo.",
  },
  {
    id: "typo-syne-inter",
    name: "Syne + Inter (Creative Studio)",
    headingFont: "Syne",
    bodyFont: "Inter",
    styleNote: "Display vanguardista e innovador para agencias creativas, portafolios y productos disruptivos.",
  }
];

export const GOOGLE_FONTS_COLLECTION: GoogleFontOption[] = [
  { family: "Plus Jakarta Sans", category: "sans-serif", description: "Geométrica moderna y profesional para interfaces contemporáneas." },
  { family: "Inter", category: "sans-serif", description: "El estándar de oro para legibilidad UI y cuerpos de texto." },
  { family: "Space Grotesk", category: "sans-serif", description: "Tipografía técnica y futurista para IA y SaaS." },
  { family: "Playfair Display", category: "serif", description: "Serif elegante y con carácter para titulares de alto impacto." },
  { family: "Outfit", category: "sans-serif", description: "Amigable, geométrica y clara con personalidad." },
  { family: "DM Sans", category: "sans-serif", description: "Equilibrada, limpia y optimizada para lectura rápida." },
  { family: "Sora", category: "sans-serif", description: "Diseñada para pantallas digitales y startups fintech." },
  { family: "Syne", category: "sans-serif", description: "Display dramático e hiper-moderno para creatividad B2B." },
  { family: "Montserrat", category: "sans-serif", description: "Urbana, sólida y estructurada para titulares con autoridad." },
  { family: "Cabinet Grotesk", category: "sans-serif", description: "Neogrotesca distintiva para marcas de diseño y software." },
  { family: "Open Sans", category: "sans-serif", description: "Neutral, clara e hiper-legible en cualquier densidad de texto." },
  { family: "Lora", category: "serif", description: "Serif contemporánea y balanceada para marcas de contenido." },
];

export const INITIAL_PRESET_TEMPLATES: StylePreset[] = [
  {
    id: "preset-saas-indigo",
    name: "SaaS Conversión Pro",
    palette: PRESET_PALETTES[0],
    typography: PRESET_TYPOGRAPHY[0],
    vibe: "Tecnológico, confiable, directo y orientado al registro rápido de usuarios.",
    isCustom: false,
  },
  {
    id: "preset-dark-ai",
    name: "Dark AI & Cyberpunk",
    palette: PRESET_PALETTES[2],
    typography: PRESET_TYPOGRAPHY[2],
    vibe: "Futurista, vanguardista, con neones vibrantes y contrastes oscuros profundos.",
    isCustom: false,
  },
  {
    id: "preset-fintech-emerald",
    name: "Fintech & B2B Trust",
    palette: PRESET_PALETTES[1],
    typography: PRESET_TYPOGRAPHY[3],
    vibe: "Verde esmeralda institucional que transmite solvencia, métricas y seguridad.",
    isCustom: false,
  },
  {
    id: "preset-editorial-luxury",
    name: "Consultoría VIP / High-Ticket",
    palette: PRESET_PALETTES[3],
    typography: PRESET_TYPOGRAPHY[1],
    vibe: "Tonos cálidos y tipografía serif sofisticada para servicios de alto valor.",
    isCustom: false,
  }
];

export const DEFAULT_SECTION_TYPES = [
  {
    type: "hero" as const,
    title: "Hero Section (Principal)",
    description: "Atracción inmediata en 3 segundos con titular irresistible, prueba social implícita, imagen/mockup visual y CTA claro.",
    contentObjective: "Maximizar el 'Above the Fold' capturando atención inmediata y convirtiendo clics primarios.",
    defaultElements: [
      "Pill Badge superior con texto de novedad o logro",
      "Titular H1 masivo con palabras enfatizadas o gradiente",
      "Subtitular descriptivo de beneficios concretos",
      "Botón CTA Primario (acción directa) + Botón Secundario (Demo/Video)",
      "Mockup interactivo de producto o Dashboard preview",
      "Franja de prueba social (5 estrellas o logos de clientes)"
    ],
    defaultCopy: {
      headline: "Multiplica tus conversiones con un sistema de diseño inteligente",
      subheadline: "Crea experiencias de landing page optimizadas por psicología de ventas y componentes de alto impacto visual.",
      ctaText: "Comenzar Gratis Ahora",
      secondaryCtaText: "Ver Video de 2 Mins",
      bulletPoints: ["Sin tarjeta de crédito", "Instalación en 5 minutos", "Soporte 24/7"]
    }
  },
  {
    type: "problem_solution" as const,
    title: "Problema vs Solución (PAS)",
    description: "Muestra el dolor actual del cliente, agítalo con contexto real y presenta la solución como la alternativa superior.",
    contentObjective: "Generar empatía profunda con el dolor del cliente para justificar la necesidad del producto.",
    defaultElements: [
      "Titular de contraste del dolor",
      "Tarjeta del Método Tradicional (Frustrante / Lento)",
      "Tarjeta de Tu Solución (Rápido / Automatizado)",
      "Indicadores de ahorro de tiempo o dinero"
    ],
    defaultCopy: {
      headline: "¿Cansado de perder el 70% de tus visitantes en los primeros segundos?",
      subheadline: "Las landings genéricas no convierten. Descubre la diferencia de utilizar secciones diseñadas por conversión pura.",
      ctaText: "Descubrir la Solución",
      bulletPoints: ["Elimina la fricción visual", "Carga ultra-rápida", "Arquitectura optimizada para mobile"]
    }
  },
  {
    type: "features" as const,
    title: "Características y Funcionalidades (Bento Grid)",
    description: "Presenta las características clave organizadas visualmente con tarjetas, iconos Lucide y micro-demostraciones.",
    contentObjective: "Demostrar la capacidad técnica y el valor funcional de manera visualmente organizada.",
    defaultElements: [
      "Bento Grid de 3 o 4 tarjetas con tamaños variados",
      "Iconos de vector alineados",
      "Mini previsualizaciones gráficas dentro de las tarjetas",
      "Tags o etiquetas de estado"
    ],
    defaultCopy: {
      headline: "Todo lo que necesitas para escalar tus resultados",
      subheadline: "Diseñado meticulosamente para eliminar la fricción y aumentar la velocidad de ejecución.",
      ctaText: "Explorar Funcionalidades",
      bulletPoints: ["Panel analítico en tiempo real", "Integración con 100+ herramientas", "Automatizaciones con IA"]
    }
  },
  {
    type: "process_how_it_works" as const,
    title: "Cómo Funciona (Paso a Paso)",
    description: "Guía al visitante en 3 sencillos pasos numerados para que entienda lo fácil que es empezar.",
    contentObjective: "Reducir la fricción percibida mostrando la simplicidad del onboarding.",
    defaultElements: [
      "Paso 1: Configuración o Registro",
      "Paso 2: Personalización o Integración",
      "Paso 3: Resultados e Impacto",
      "Línea conector visual de progreso"
    ],
    defaultCopy: {
      headline: "Implementa en 3 sencillos pasos",
      subheadline: "Sin curva de aprendizaje compleja. Empieza a ver resultados desde el primer día.",
      ctaText: "Iniciar Paso 1",
      bulletPoints: ["1. Elige tu plantilla", "2. Configura los parámetros", "3. Lanza y mide"]
    }
  },
  {
    type: "social_proof_testimonials" as const,
    title: "Prueba Social y Testimonios",
    description: "Aumenta la credibilidad con opiniones reales, estrellas, avatares, cargos de clientes y métricas de satisfacción.",
    contentObjective: "Eliminar el riesgo percibido mediante validación de pares y casos de éxito reales.",
    defaultElements: [
      "Grid o carrusel de testimonios con foto de avatar",
      "Calificación de 5 estrellas",
      "Nombre, Cargo y Empresa del cliente",
      "Cita destacada en negrita",
      "Métrica cuantitativa relevante (Ej: +140% de ROI)"
    ],
    defaultCopy: {
      headline: "Lo que dicen los líderes del sector",
      subheadline: "Más de 2,500 equipos confían en nuestra plataforma para optimizar su presencia digital.",
      ctaText: "Leer Casos de Éxito",
      bulletPoints: ["Rating promedio 4.9/5", "+500 reseñas verificadas"]
    }
  },
  {
    type: "stats_counter" as const,
    title: "Métricas y Cifras Clave (Stats)",
    description: "Bloque de números masivos con etiquetas descriptivas para mostrar tracción y autoridad.",
    contentObjective: "Demostrar escala, impacto numérico e historia de éxito rápida.",
    defaultElements: [
      "4 columnas de métricas de alto impacto",
      "Número grande con sufijo (+, %, K)",
      "Descripción breve de la métrica",
      "Fondo de alto contraste"
    ],
    defaultCopy: {
      headline: "Resultados respaldados por datos reales",
      subheadline: "Cifras que demuestran el impacto continuo en nuestros clientes.",
      ctaText: "Ver Informe de Impacto",
      bulletPoints: ["$12M+ generados", "99.9% uptime", "+150k usuarios activos", "< 2s carga"]
    }
  },
  {
    type: "comparison_table" as const,
    title: "Tabla Comparativa (Tú vs Competencia)",
    description: "Tabla de cotejo clara donde resaltan tus ventajas distintivas frente a alternativas genéricas.",
    contentObjective: "Posicionar tu producto como la opción claramente ganadora e inmejorable.",
    defaultElements: [
      "Columna destacada para Tu Producto con borde de acento",
      "Columnas para Alternativas / Competencia",
      "Checks verdes y X rojas",
      "Fila de recomendación final"
    ],
    defaultCopy: {
      headline: "¿Por qué los expertos nos eligen a nosotros?",
      subheadline: "Compara de forma transparente la diferencia en funcionalidades, velocidad y soporte.",
      ctaText: "Hacer el Cambio Hoy",
      bulletPoints: ["Soporte dedicado 24/7", "Sin costos ocultos", "Actualizaciones semanales"]
    }
  },
  {
    type: "pricing" as const,
    title: "Tabla de Precios (Planes)",
    description: "Planes claros con interruptor mensual/anual, plan más popular destacado y desglose de características por nivel.",
    contentObjective: "Facilitar la decisión de compra con precios transparentes y eliminar la indecisión.",
    defaultElements: [
      "Toggle de facturación Mensual / Anual (con badge de ahorro %)",
      "3 tarjetas de precios (Básico, Pro Destacado, Enterprise)",
      "Badge 'Más Popular' en la tarjeta Pro",
      "Lista de features incluidas con checks",
      "Botones de acción diferenciados por plan"
    ],
    defaultCopy: {
      headline: "Planes simples y transparentes para cada etapa",
      subheadline: "Elige la opción que mejor se adapte al volumen de tu negocio. Cancela en cualquier momento.",
      ctaText: "Comenzar Prueba Gratuita",
      bulletPoints: ["14 días de prueba gratis", "Sin permanencia", "Descuento del 20% anual"]
    }
  },
  {
    type: "faq" as const,
    title: "Preguntas Frecuentes (FAQ Accordion)",
    description: "Acordeón interactivo para resolver objeciones de última hora sobre precio, soporte, seguridad e implementación.",
    contentObjective: "Resolver objeciones finales justo antes de la decisión de conversión.",
    defaultElements: [
      "Preguntas desplegables tipo acordeón con icono (+/-)",
      "Respuestas concisas directas a la objeción",
      "Caja de contacto secundario ('¿Aún tienes dudas? Habla con soporte')"
    ],
    defaultCopy: {
      headline: "Preguntas frecuentes",
      subheadline: "Resolvemos tus dudas principales para que des el paso con total tranquilidad.",
      ctaText: "Contactar a Ventas",
      bulletPoints: [
        "¿Necesito conocimientos de código?",
        "¿Puedo usar mi propio dominio?",
        "¿Cómo funciona la prueba gratuita?",
        "¿Qué garantía ofrecen?"
      ]
    }
  },
  {
    type: "lead_form" as const,
    title: "Formulario de Captación / Lead Magnet",
    description: "Formulario directo de alta conversión con campos optimizados, incentivo claro e indicador de privacidad.",
    contentObjective: "Capturar datos de contacto (email, teléfono, nombre) a cambio de valor o acceso inmediato.",
    defaultElements: [
      "Campo de Email con icono",
      "Botón de envío de alto contraste",
      "Incentivo destacado (Ej: Guía gratis / Acceso VIP)",
      "Garantía de cero SPAM"
    ],
    defaultCopy: {
      headline: "Obtén acceso anticipado exclusivo",
      subheadline: "Únete a la lista de espera VIP y recibe nuestra guía de optimización de landings sin costo.",
      ctaText: "Obtener Mi Guía Gratis",
      bulletPoints: ["Acceso instantáneo", "100% libre de SPAM"]
    }
  },
  {
    type: "footer" as const,
    title: "Footer (Pie de Página)",
    description: "Cierre institucional limpio con mapa del sitio, redes sociales, copyright, avisos legales y formulario newsletter.",
    contentObjective: "Navegación de respaldo, confianza legal y retención final del visitante.",
    defaultElements: [
      "Logo y descripción breve de marca",
      "Columnas de enlaces útiles (Producto, Recursos, Empresa, Legal)",
      "Redes sociales con iconos Lucide",
      "Boletín suscripción rápida",
      "Copyright y términos legales"
    ],
    defaultCopy: {
      headline: "Transforma tu presencia digital hoy mismo",
      subheadline: "Diseñado para creadores, agencias y equipos que exigen máxima precisión.",
      ctaText: "Suscribirse al Newsletter",
      bulletPoints: ["Privacidad garantizada", "© 2026 Todos los derechos reservados"]
    }
  }
];
