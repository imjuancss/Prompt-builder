import { Project, Section } from "../types";
import { PRESET_PALETTES, PRESET_TYPOGRAPHY } from "./presets";
import { buildSectionPrompt } from "../utils/promptGenerator";

/**
 * Plantilla Maestra de Landing Page de Alta Conversión
 * Basada en las mejores prácticas de Lovable & Impeccable UI Craft:
 * 1. Above-the-fold irresistible (Hero con H1 claro, CTA primario/secundario y prueba social)
 * 2. Barra de logos para credibilidad instantánea
 * 3. Matriz Problema vs Solución (PAS: Pain, Agitation, Solution)
 * 4. Pilares de valor y Bento Grid interactivo de funcionalidades
 * 5. Proceso claro de 3 pasos (Onboarding sin fricción)
 * 6. Contador de métricas cuantificables (Stats)
 * 7. Tabla comparativa (Tú vs Competencia)
 * 8. Testimonios con avatares, cargos y ROI verificado
 * 9. Precios transparentes con toggle mensual/anual y garantía de 0 riesgo
 * 10. Acordeón FAQ para resolución de objeciones de última hora
 * 11. Lead Magnet & Formulario de captación final
 * 12. Footer de confianza y mapa del sitio
 */
export function createMasterLandingProject(id: string = "proj_master_landing_template"): Project {
  const baseProjectWithoutSections: Omit<Project, "sections"> = {
    id,
    name: "Master Landing Page (Lovable Best Practices)",
    description: "Plantilla completa de alta conversión optimizada con las mejores prácticas de arquitectura UI, psicología de ventas y directivas Impeccable Craft.",
    industry: "SaaS & Digital Product",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    conversionVars: {
      tone: "High-Conversion Direct Response",
      layoutPattern: "F-Pattern (Lectura Fluida)",
      targetAudience: "Fundadores, Directores de Marketing y Equipos de Producto",
      primaryGoal: "Captar registros de prueba gratuita y demos cualificadas",
      valueProposition: "Transforma visitas en clientes recurrentes utilizando componentes de UI optimizados por psicología de ventas.",
      socialProofDensity: "Alta (Testimonios + Logos + Métricas + Badges)",
      interactivity: "Bento Grid interactivo, Micro-animaciones, Toggle de Precios y Acordeón FAQ",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: true,
      stickyCta: true,
      impeccableCraft: true,
      targetLLM: "Universal",
    },
    styleConfig: {
      palette: PRESET_PALETTES[0], // SaaS Indigo & Cyan
      typography: PRESET_TYPOGRAPHY[0], // Plus Jakarta Sans + Inter
      globalVibe: "Moderna, limpia, confiable con alto contraste y componentes respirables.",
    },
    history: [
      {
        id: "log_init_master",
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        action: "Proyecto iniciado desde la Plantilla Maestra de Alta Conversión (Lovable Standards)",
        details: "12 secciones optimizadas pre-cargadas con copy persuasivo.",
      },
    ],
  };

  const rawSectionsData: Array<Omit<Section, "id" | "generatedPrompt" | "updatedAt">> = [
    {
      type: "hero",
      title: "1. Hero Section (Above the Fold)",
      order: 1,
      description: "Atracción masiva en los primeros 3 segundos con titular irresistibly claro, micro-badge de novedad, doble CTA y prueba social implícita.",
      contentObjective: "Aclarar de inmediato qué hace el producto, para quién es y cuál es el siguiente paso sin requerir scroll.",
      keyElements: [
        "Pill Badge superior de novedad con gradiente sutil",
        "Titular H1 masivo con palabras de alto impacto enfatizadas",
        "Subtitular descriptivo de beneficios concretos",
        "Doble CTA: Botón Primario de Acción Directa + Secundario de Demo",
        "Franja de prueba social (5 estrellas + 12k usuarios activos)",
        "Mockup visual o Dashboard interactivo de alta resolución"
      ],
      copyDraft: {
        headline: "Aumenta la conversión de tu Landing Page hasta un 48%",
        subheadline: "Crea experiencias digitales irresistibles diseñadas con psicología de ventas, componentes de alto contraste y copywriting de respuesta directa.",
        ctaText: "Comenzar Prueba Gratis (14 Días)",
        secondaryCtaText: "Ver Demo de 2 Minutos",
        bulletPoints: ["Sin tarjeta de crédito", "Instalación en 5 minutos", "Soporte priority 24/7"],
        extraNotes: "Incluye indicador de garantía de 30 días cerca del botón principal."
      },
      sectionStyleOverrides: {
        bgStyle: "Solid Surface",
        layoutVariant: "Centered Focus",
        paddingVertical: "Spacious (py-28)",
        animationStyle: "Framer Motion Fluid",
        libraryEnhancements: ["Lucide Animated Icons", "Framer AnimatePresence"]
      }
    },
    {
      type: "social_proof_testimonials",
      title: "2. Barra de Logos & Prueba Social (Trust Cloud)",
      order: 2,
      description: "Logos de marcas reconocidas para establecer credibilidad institucional en el primer scroll.",
      contentObjective: "Validación inmediata de autoridad antes de presentar los detalles de la oferta.",
      keyElements: [
        "Texto sutil superior de confianza ('Respaldado por líderes de la industria')",
        "Grid de 6 logos con acabado monocromático uniforme",
        "Efecto de brillo o opacidad al pasar el cursor"
      ],
      copyDraft: {
        headline: "Más de 12,000 equipos confían en nuestra arquitectura",
        subheadline: "Desde startups de alto crecimiento hasta empresas de la lista Fortune 500.",
        ctaText: "Unirme a las Empresas Líderes",
        bulletPoints: ["Stripe", "Vercel", "Supabase", "OpenAI", "Framer", "Figma"]
      },
      sectionStyleOverrides: {
        bgStyle: "Solid Surface",
        layoutVariant: "Centered Focus",
        paddingVertical: "Compact (py-12)"
      }
    },
    {
      type: "problem_solution",
      title: "3. Matriz Problema vs Solución (Fórmula PAS)",
      order: 3,
      description: "Estructura Pain-Agitation-Solution para contrastar los métodos antiguos frustrantes contra tu alternativa moderna.",
      contentObjective: "Crear empatía profunda con el dolor del cliente y posicionar tu producto como la única solución lógica.",
      keyElements: [
        "Titular de contraste de alto dolor",
        "Tarjeta roja/oscura del Método Tradicional (Lento, Frustrante, Costoso)",
        "Tarjeta verde/azul de Tu Solución (Rápido, Automatizado, Rentable)",
        "Indicadores cuantitativos de tiempo y dinero ahorrados"
      ],
      copyDraft: {
        headline: "¿Por qué el 85% de las landing pages genéricas fracasan?",
        subheadline: "Los maquetadores tradicionales se enfocan solo en la estética, ignorando la velocidad de carga y la psicología de compra.",
        ctaText: "Cambiar al Método Moderno",
        bulletPoints: [
          "❌ Método Antiguo: Landings pesadas, copy aburrido, 0.8% de conversión",
          "✅ Método Moderno: Componentes de alto impacto, +4.8% de tasa de conversión promedio"
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Dark Contrast",
        layoutVariant: "Split 50/50",
        paddingVertical: "Standard (py-20)"
      }
    },
    {
      type: "value_prop",
      title: "4. Pilares de Valor Principal (Unique Selling Proposition)",
      order: 4,
      description: "Los 3 pilares fundamentales de beneficios transformacionales que obtiene el usuario al usar el producto.",
      contentObjective: "Enfocarse en resultados finales y transformaciones concretas en lugar de simples listas de código.",
      keyElements: [
        "Grid de 3 tarjetas de pilares con bordes de precisión",
        "Iconos de vectores coloridos o acentuados",
        "Titular corto + párrafo explicativo de impacto"
      ],
      copyDraft: {
        headline: "Diseñado para escalar tus ingresos en 3 dimensiones",
        subheadline: "Todo lo que necesitas para construir una máquina de conversión sin fricción técnica.",
        ctaText: "Explorar Pilares",
        bulletPoints: [
          "1. Copywriting Persuasivo: Mensajes estructurados para guiar al visitante",
          "2. Rendimiento Ultrarrápido: Tiempo de carga < 1.2s para retener tráfico móvil",
          "3. Retención & Engagement: Interacciones visuales que generan confianza inmediata"
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Solid Surface",
        layoutVariant: "Bento Grid 3 Cols",
        paddingVertical: "Standard (py-20)"
      }
    },
    {
      type: "features",
      title: "5. Bento Grid de Funcionalidades Interactivas",
      order: 5,
      description: "Demostración gráfica de capacidades clave organizadas en un Bento Grid de jerarquía asimétrica.",
      contentObjective: "Demostrar la sofisticación y calidad del producto mediante vistas previas gráficas y datos vivos.",
      keyElements: [
        "Bento Grid de 4 tarjetas con tamaños asimétricos",
        "Tarjeta héroe de mayor tamaño con widget o gráfico",
        "Badges de funcionalidad (Real-time, AI Powered, Automation)",
        "Iconos vectoriales estilizados"
      ],
      copyDraft: {
        headline: "Capacidades de clase mundial en tus manos",
        subheadline: "Una suite de herramientas avanzadas diseñadas para maximizar la velocidad de ejecución de tu equipo.",
        ctaText: "Ver Todas las Funcionalidades",
        bulletPoints: [
          "Optimizador de Prompts en tiempo real con guía de IA",
          "Librería de componentes UI validados por conversión",
          "Analítica de fricción visual y mapa de calor implícito",
          "Exportación directa a código limpio y responsive"
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Solid Primary",
        layoutVariant: "Bento Grid 3 Cols",
        paddingVertical: "Spacious (py-28)",
        animationStyle: "GSAP ScrollTrigger",
        libraryEnhancements: ["Recharts Data Viz", "Radix UI / Headless"]
      }
    },
    {
      type: "process_how_it_works",
      title: "6. Cómo Funciona en 3 Pasos (Onboarding sin Fricción)",
      order: 6,
      description: "Línea de tiempo o secuencia numerada 1-2-3 que demuestra la extrema facilidad de implementación.",
      contentObjective: "Eliminar el miedo a la complejidad técnica mostrando un camino sencillo hacia el resultado.",
      keyElements: [
        "3 tarjetas de paso alineadas horizontalmente con conector visual",
        "Paso 1: Configuración inicial en 2 minutos",
        "Paso 2: Personalización de copy y variables de marca",
        "Paso 3: Publicación y aumento de conversiones"
      ],
      copyDraft: {
        headline: "Empieza a ver resultados en solo 3 sencillos pasos",
        subheadline: "Sin curvas de aprendizaje agotadoras. Diseñado para ofrecer valor inmediato.",
        ctaText: "Iniciar Paso 1 Ahora",
        bulletPoints: [
          "Paso 1: Elige la plantilla adaptada a tu industria",
          "Paso 2: Define tu propuesta de valor y audiencia objetivo",
          "Paso 3: Genera los prompts y lanza tu landing optimizada"
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Solid Surface",
        layoutVariant: "Centered Focus",
        paddingVertical: "Standard (py-20)"
      }
    },
    {
      type: "stats_counter",
      title: "7. Métricas e Impacto en Cifras Clave (Stats Counter)",
      order: 7,
      description: "Bloque de datos numéricos masivos para validar la escala y el éxito cuantitativo de la plataforma.",
      contentObjective: "Proporcionar prueba matemática incontestable de la efectividad del producto.",
      keyElements: [
        "Grid de 4 columnas de métricas destacadas",
        "Números gigantes con colores de acento vibrantes",
        "Etiquetas breves y explicativas debajo de cada cifra"
      ],
      copyDraft: {
        headline: "Resultados cuantificables respaldados por datos reales",
        subheadline: "Métricas consolidadas de las landing pages optimizadas en nuestro sistema.",
        ctaText: "Unirme a las Cifras de Éxito",
        bulletPoints: [
          "+340% de incremento en registros promedio",
          "$14.2M+ en ventas generadas para clientes",
          "< 1.2s de tiempo de respuesta y carga global",
          "99.8% de uptime y satisfacción de usuario"
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Dark Contrast",
        layoutVariant: "Centered Focus",
        paddingVertical: "Compact (py-12)"
      }
    },
    {
      type: "comparison_table",
      title: "8. Tabla Comparativa (Tú vs Métodos Tradicionales)",
      order: 8,
      description: "Tabla de cotejo directa entre tu solución, agencias costosas y builders genéricos lentos.",
      contentObjective: "Resaltar tu ventaja competitiva inalcanzable de manera objetiva e indiscutible.",
      keyElements: [
        "Columna central destacada con borde de acento e insignia 'Recomendado'",
        "Columnas para alternativas tradicionales",
        "Checks verdes (✅) vs marcas de falla (❌)",
        "Fila inferior con CTA directo"
      ],
      copyDraft: {
        headline: "¿Por qué los equipos de alto rendimiento nos eligen?",
        subheadline: "Compara de forma transparente la diferencia en velocidad, costo y tasa de conversión.",
        ctaText: "Hacer el Cambio Hoy",
        bulletPoints: [
          "Copywriting científico guiado por IA: SÍ vs NO en alternativas",
          "Velocidad de carga sub-segundo: SÍ vs Lento en maquetadores pesados",
          "Componentes con psicología de venta: SÍ vs Plantillas estéticas vacías",
          "Soporte especializado en conversión: SÍ vs Sin asistencia"
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Solid Surface",
        layoutVariant: "Split 50/50",
        paddingVertical: "Standard (py-20)"
      }
    },
    {
      type: "social_proof_testimonials",
      title: "9. Testimonios & Casos de Éxito Reales",
      order: 9,
      description: "Reseñas reales con avatares de clientes, empresas, cargos e indicadores cuantitativos de ROI.",
      contentObjective: "Eliminar las dudas finales mediante historias de éxito verificadas con personas reales.",
      keyElements: [
        "Grid de 3 tarjetas de testimonios con bordes finos y sombra suave",
        "Fotos de avatar profesionales",
        "Cita principal destacada en negrita",
        "Nombre, cargo y logo de la empresa del cliente"
      ],
      copyDraft: {
        headline: "Lo que dicen los líderes que ya están escalando",
        subheadline: "Historias reales de fundadores y directores de crecimiento que transformaron sus resultados.",
        ctaText: "Leer Más Casos de Éxito",
        bulletPoints: [
          '"Triplicamos nuestra tasa de registro en solo dos semanas. La claridad del copy es impresionante." — Sofía Martínez, CMO en TechScale',
          '"Incomparable. Pasamos de convertir el 1.1% al 4.5% reduciendo nuestro costo de adquisición a la mitad." — Carlos Mendoza, Founder en FinLab',
          '"El estándar Impeccable Craft se nota de inmediato. Las páginas se ven de un millón de dólares." — Elena Rostova, Product Lead'
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Glassmorphism Card",
        layoutVariant: "Carousel / Slider",
        paddingVertical: "Standard (py-20)"
      }
    },
    {
      type: "pricing",
      title: "10. Planes de Precios Transparentes (Garantía Cero Riesgo)",
      order: 10,
      description: "3 opciones de precio claras con toggle mensual/anual, resaltado del plan Pro y sello de garantía.",
      contentObjective: "Proporcionar claridad de precios y eliminar la indecisión con una garantía de devolución sin riesgo.",
      keyElements: [
        "Toggle interactiv de facturación Mensual / Anual (con badge -20% descuento)",
        "Tarjeta Pro 'Más Popular' con borde brillante y sombra de acento",
        "Lista de funcionalidades con checks explícitos",
        "Sello de garantía de 30 días de devolución 100% garantizada"
      ],
      copyDraft: {
        headline: "Inversión transparente adaptada a tu escala",
        subheadline: "Sin contratos ocultos ni sorpresas. Cancela o cambia de plan en cualquier momento.",
        ctaText: "Comenzar Prueba Gratuita de 14 Días",
        bulletPoints: [
          "Starter ($29/mes): Ideal para emprendedores y creadores individuales",
          "Pro Popular ($79/mes): Para startups y equipos en fase de aceleración con métricas ilimitadas",
          "Enterprise ($199/mes): Para agencias y corporativos con soporte dedicado VIP"
        ],
        extraNotes: "Incluye la frase: 'Garantía total de devolución de dinero durante 30 días si no aumenta tu conversión'."
      },
      sectionStyleOverrides: {
        bgStyle: "Solid Surface",
        layoutVariant: "Centered Focus",
        paddingVertical: "Spacious (py-28)"
      }
    },
    {
      type: "faq",
      title: "11. Acordeón FAQ (Resolución de Objeciones Finales)",
      order: 11,
      description: "Preguntas y respuestas frecuentes desplegables tipo acordeón para derribar las últimas barreras de compra.",
      contentObjective: "Resolver objeciones sobre precio, tiempo de implementación, seguridad y compatibilidad.",
      keyElements: [
        "Lista de 4 a 6 preguntas desplegables con animación suave",
        "Respuestas directas y honestas que refuerzan la garantía",
        "Caja de contacto secundario ('¿Aún tienes dudas? Chatea con un especialista')"
      ],
      copyDraft: {
        headline: "Preguntas frecuentes resueltas con claridad",
        subheadline: "Todo lo que necesitas saber antes de dar el paso con total confianza.",
        ctaText: "Hablar con un Especialista",
        bulletPoints: [
          "¿Necesito saber programar para usar la plantilla? -> No, está lista para personalizar visualmente en minutos.",
          "¿Cómo funciona la garantía de 30 días? -> Si no quedas 100% satisfecho, te devolvemos la totalidad de tu dinero.",
          "¿Puedo exportar el código a mi propio servidor? -> Sí, exportación limpia a Tailwind, React y HTML5.",
          "¿Qué tipo de soporte técnico está incluido? -> Asistencia 24/7 vía chat y canal exclusivo en Discord."
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Solid Surface",
        layoutVariant: "Centered Focus",
        paddingVertical: "Standard (py-20)"
      }
    },
    {
      type: "lead_form",
      title: "12. Lead Magnet & Captación Final (Cierre de Alta Conversión)",
      order: 12,
      description: "Cierre potente antes del footer con oferta gratuita o incentivo exclusivo para capturar emails.",
      contentObjective: "Convertir al porcentaje de visitantes que no compraron directamente pero quieren probar el valor.",
      keyElements: [
        "Caja destacada con gradiente o fondo oscuro elegante",
        "Campo de Email con icono de sobre integrando botón de un clic",
        "Garantía de cero spam e información de privacidad",
        "Incentivo inmediato (Ej: 'Descarga gratis la Guía de Copywriting de Lovable')"
      ],
      copyDraft: {
        headline: "¿Listo para duplicar las conversiones de tu próximo lanzamiento?",
        subheadline: "Recibe acceso instantáneo a la Plantilla Maestra y nuestro Blueprint exclusivo de Copywriting.",
        ctaText: "Obtener Acceso Instantáneo Gratis",
        bulletPoints: [
          "Acceso inmediato a los prompts",
          "100% libre de spam • Cancela cuando quieras"
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Dark Contrast",
        layoutVariant: "Centered Focus",
        paddingVertical: "Spacious (py-28)",
        animationStyle: "CSS Keyframes Micro-interactions",
        libraryEnhancements: ["Canvas Confetti FX"]
      }
    },
    {
      type: "footer",
      title: "13. Footer Institucional (Navegación & Legal)",
      order: 13,
      description: "Cierre limpio con mapa del sitio, redes sociales, copyright, avisos legales y certificación de seguridad.",
      contentObjective: "Proporcionar navegabilidad secundaria y cumplir con estándares de legalidad y confianza.",
      keyElements: [
        "Logo de marca y breve declaración de misión",
        "Columnas de enlaces (Producto, Recursos, Empresa, Legal)",
        "Iconos de redes sociales con efecto hover",
        "Copyright y enlaces a Política de Privacidad / Términos"
      ],
      copyDraft: {
        headline: "Landing Prompt Architect — El estándar de conversión",
        subheadline: "Construido bajo los principios de Lovable & Impeccable UI Craft.",
        ctaText: "Suscribirse al Boletín",
        bulletPoints: [
          "© 2026 Landing Prompt Architect. Todos los derechos reservados.",
          "Privacidad • Términos • Seguridad SSL 256-bit"
        ]
      },
      sectionStyleOverrides: {
        bgStyle: "Solid Surface",
        layoutVariant: "Centered Focus",
        paddingVertical: "Compact (py-12)"
      }
    }
  ];

  // Map raw section data and generate prompts
  const sections: Section[] = rawSectionsData.map((secData, idx) => {
    const secId = `sec_master_${idx + 1}_${Math.random().toString(36).substring(2, 7)}`;
    const tempSection: Section = {
      ...secData,
      id: secId,
      generatedPrompt: "",
      updatedAt: new Date().toISOString(),
    };

    // Build prompt for each section
    const generatedPrompt = buildSectionPrompt(
      { ...baseProjectWithoutSections, sections: [] } as Project,
      tempSection
    );

    return {
      ...tempSection,
      generatedPrompt,
    };
  });

  return {
    ...baseProjectWithoutSections,
    sections,
  };
}
