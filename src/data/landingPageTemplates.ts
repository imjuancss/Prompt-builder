import { Project, Section, ColorPalette, TypographyPair, ConversionVariables } from "../types";
import { PRESET_PALETTES, PRESET_TYPOGRAPHY } from "./presets";
import { buildSectionPrompt } from "../utils/promptGenerator";

export interface LandingPageTemplate {
  id: string;
  name: string;
  category: string;
  badge: string;
  lengthTag: string;
  sectionCount: number;
  description: string;
  palette: ColorPalette;
  typography: TypographyPair;
  globalVibe: string;
  conversionVars: ConversionVariables;
  rawSections: Array<Omit<Section, "id" | "generatedPrompt" | "updatedAt">>;
}

export const LANDING_PAGE_TEMPLATES: LandingPageTemplate[] = [
  // 1. Waitlist & Pre-Lanzamiento (Ultra Corta - 2 Secciones)
  {
    id: "tmpl-waitlist-stealth",
    name: "Waitlist & Pre-Lanzamiento (Stealth Mode)",
    category: "Startups & Products",
    badge: "Captación Viral",
    lengthTag: "Ultra Corta (2 Secciones)",
    sectionCount: 2,
    description: "Diseñada para captar correos electrónicos antes de lanzar. Súper directa, con contador de personas inscritas y preguntas frecuentes esenciales.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-midnight-neon-emerald") || PRESET_PALETTES[2],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-geist-inter") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Modo oscuro futurista, sobrio, enfocado en exclusividad y urgencia de acceso anticipado.",
    conversionVars: {
      tone: "Dark Mode Luxury & Neon",
      layoutPattern: "Centered Minimalist Impact",
      targetAudience: "Early adopters, desarrolladores y entusiastas de la tecnología",
      primaryGoal: "Capturar el mayor número de emails en lista de espera",
      valueProposition: "Sé el primero en acceder al nuevo estándar de automatización sin código.",
      socialProofDensity: "Sutil (Logos o Badges discretos)",
      interactivity: "Formulario instantáneo con animación de éxito y contador en vivo",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: true,
      stickyCta: false,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Captura de Waitlist & Lanzamiento",
        order: 1,
        description: "Encabezado minimalista de alto impacto visual con badge de acceso beta y formulario de correo en 1 clic.",
        contentObjective: "Convertir visitantes casuales en registros de lista de espera en menos de 5 segundos.",
        keyElements: [
          "Pill Badge superior: '🔒 Acceso Beta Privado - Plazas Limitadas'",
          "Titular H1 masivo con palabra resaltada en neón",
          "Subtitular descriptivo de la promesa principal",
          "Formulario integrado: Input Email + Botón 'Unirme al Acceso VIP'",
          "Contador de prueba social: '+2,480 profesionales ya están en lista'"
        ],
        copyDraft: {
          headline: "El futuro de la productividad con IA está a punto de llegar",
          subheadline: "Automatiza flujos de trabajo complejos con lenguaje natural. Sin configuración previa, sin fricción.",
          ctaText: "Obtener Acceso Anticipado Gratis",
          bulletPoints: ["100% libre de spam", "Acceso prioritario al lanzamiento", "Descuento de por vida para Early Adopters"],
          extraNotes: "Incluir micro-animación de gradiente en el botón de captura."
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "faq",
        title: "2. Preguntas Frecuentes de la Beta",
        order: 2,
        description: "Acordeón corto para resolver dudas de privacidad y fechas de disponibilidad.",
        contentObjective: "Eliminar la fricción de dejar el correo respondiendo dudas inmediatas.",
        keyElements: [
          "Acordeón desplegable con 3 preguntas clave",
          "Información sobre la fecha estimada de lanzamiento",
          "Aclaración de costos (gratis durante la beta)"
        ],
        copyDraft: {
          headline: "Preguntas Frecuentes",
          subheadline: "Todo lo que necesitas saber sobre nuestro acceso anticipado.",
          ctaText: "Unirme a la Waitlist",
          bulletPoints: [
            "¿Cuándo se enviarán las invitaciones? Comenzaremos la distribución por lotes el próximo mes.",
            "¿Tendrá algún costo la beta? No, el acceso durante la fase de prueba es 100% gratuito.",
            "¿Puedo invitar a mi equipo? Sí, los usuarios seleccionados recibirán 3 pases de invitación extra."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      }
    ]
  },

  // 2. Lead Magnet & E-Book (Corta - 3 Secciones)
  {
    id: "tmpl-lead-magnet",
    name: "Lead Magnet & E-Book de Alta Conversión",
    category: "Marketing & Lead Gen",
    badge: "Lead Generation",
    lengthTag: "Corta (3 Secciones)",
    sectionCount: 3,
    description: "Ideal para regalar un e-book, guía en PDF o plantilla en formato descargable a cambio del correo electrónico del prospecto.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-emerald-growth") || PRESET_PALETTES[1],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-bricolage-jakarta") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Fresco, profesional y orientado a ofrecer valor masivo e inmediato.",
    conversionVars: {
      tone: "Minimalista Clean",
      layoutPattern: "Split 50/50 Asimétrico",
      targetAudience: "Líderes de equipo, directores de marketing y emprendedores",
      primaryGoal: "Generar descargas del recurso gratuito y captar MQLs",
      valueProposition: "Descarga la guía práctica con las estrategias probadas para escalar tu negocio.",
      socialProofDensity: "Media (Logos + Testimonios Clave)",
      interactivity: "Descarga instantánea previa verificación de correo",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: true,
      stickyCta: true,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Presentación de la Guía & Descarga",
        order: 1,
        description: "Layout dividido con la portada del libro o PDF a la derecha y el formulario de descarga directa a la izquierda.",
        contentObjective: "Generar interés inmediato resaltando el título del libro y el formato descargable gratuito.",
        keyElements: [
          "Badge superior: 'E-Book Gratuito 2026'",
          "Titular H1 enfocado en el aprendizaje principal",
          "Mockup 3D de la portada del E-Book/Guía",
          "Formulario corto: Nombre + Email corporativo + Botón de descarga",
          "Indicador de páginas y tiempo de lectura (Ej: '48 Páginas - Lectura de 15 min')"
        ],
        copyDraft: {
          headline: "Guía Definitiva: Cómo duplicar tus conversiones sin aumentar tu presupuesto",
          subheadline: "Descubre el framework paso a paso utilizado por las empresas de mayor crecimiento para optimizar cada punto de contacto.",
          ctaText: "Descargar Guía Gratis (PDF)",
          bulletPoints: ["100% Gratuito", "Descarga inmediata en PDF", "+15,000 copias descargadas"],
          extraNotes: "Incluir garantía de no spam cerca del botón."
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Split 50/50",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "value_prop",
        title: "2. Lo que Aprenderás (Temario)",
        order: 2,
        description: "Desglose visual de los capítulos o módulos incluidos en el recurso.",
        contentObjective: "Demostrar la calidad y el valor práctico del contenido antes de la descarga.",
        keyElements: [
          "Grid de 4 tarjetas con los capítulos principales",
          "Iconos de verificación o número de capítulo",
          "Extractos de ejemplos concretos dentro del libro"
        ],
        copyDraft: {
          headline: "Lo que encontrarás dentro de esta guía exclusiva",
          subheadline: "Contenido 100% práctico sin rodeos ni teoría aburrida.",
          ctaText: "Obtener Mi Copia Ahora",
          bulletPoints: [
            "Capítulo 1: Los 5 errores mortales en el copywriting de tu landing page.",
            "Capítulo 2: Psicología del color y jerarquía visual para dirigir la mirada.",
            "Capítulo 3: Cómo construir una oferta irresistible con garantía de valor.",
            "Capítulo 4: Checklist interactiva de auditoría en 10 minutos."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Primary",
          layoutVariant: "Bento Grid 3 Cols",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "lead_form",
        title: "3. Captura Final & Envío Instantáneo",
        order: 3,
        description: "Bloque final de cierre para asegurar que el visitante no se vaya sin descargar el material.",
        contentObjective: "Reinforzar la urgencia de la descarga gratuita y capturar el lead.",
        keyElements: [
          "Caja de destacado con fondo contrastante",
          "Formulario de un solo paso",
          "Mensaje de confirmación instantánea"
        ],
        copyDraft: {
          headline: "¿Listo para transformar la tasa de conversión de tu sitio?",
          subheadline: "Ingresa tu correo y recibe el enlace de descarga directamente en tu bandeja de entrada en menos de 10 segundos.",
          ctaText: "Enviar Guía a Mi Email",
          bulletPoints: ["Sin costo", "Acceso de por vida"]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Compact (py-12)"
        }
      }
    ]
  },

  // 3. App Mobile Showcase (Corta - 3 Secciones)
  {
    id: "tmpl-app-showcase",
    name: "App Mobile Showcase & Micro-SaaS",
    category: "Mobile Apps & B2C",
    badge: "App Store Direct",
    lengthTag: "Corta (3 Secciones)",
    sectionCount: 3,
    description: "Diseño centrado en la aplicación móvil con botones oficiales de App Store / Google Play, capturas de pantalla y valoraciones de usuarios.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-royal-violet") || PRESET_PALETTES[0],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-sora-manrope") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Vibrante, moderno, enfocado en experiencia móvil y descargas rápidas.",
    conversionVars: {
      tone: "Playful, Creativo & Bold",
      layoutPattern: "Z-Pattern (Narrativa Visual)",
      targetAudience: "Usuarios de smartphone, jóvenes profesionales y entusiastas de la productividad",
      primaryGoal: "Dirigir tráfico a las tiendas de aplicaciones para descargas directas",
      valueProposition: "Toma el control de tu rutina diaria con una interfaz intuitiva y hermosa.",
      socialProofDensity: "Alta (Testimonios + Logos + Métricas + Badges)",
      interactivity: "Mockup de smartphone interactivo con cambio de pantallas",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: false,
      stickyCta: true,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Hero con Smartphone & App Stores",
        order: 1,
        description: "Mockup centrado de teléfono móvil rodeado de insignias oficiales de descarga y valoración de estrellas.",
        contentObjective: "Incentivar la descarga en App Store y Google Play mediante prueba social clara.",
        keyElements: [
          "Rating badge: '★★★★★ 4.9/5 en App Store (Más de 10k reseñas)'",
          "Titular H1 dinámico sobre el hábito o problema que resuelve la app",
          "Botones oficiales de App Store & Google Play Store",
          "Mockup 3D de iPhone mostrando la interfaz principal de la app"
        ],
        copyDraft: {
          headline: "Tu rutina diaria organizada en un solo toque",
          subheadline: "La aplicación diseñada para ayudarte a construir hábitos saludables, eliminar distracciones y alcanzar tus metas.",
          ctaText: "Descargar en App Store",
          secondaryCtaText: "Consíguelo en Google Play",
          bulletPoints: ["Gratis para siempre", "Sin anuncios molestos", "Sincronización en la nube"],
          extraNotes: "Colocar los botones de las tiendas lado a lado."
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Split 50/50",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "features",
        title: "2. Bento Grid de Pantallas & Funciones",
        order: 2,
        description: "Demostración de las características principales de la app mediante capturas elegantes.",
        contentObjective: "Mostrar lo fácil y atractiva que es la interfaz antes de que el usuario descargue.",
        keyElements: [
          "Grid de 3 tarjetas con vistas previas móviles",
          "Iconos de notificaciones, estadísticas y widgets",
          "Puntos de valor clave (Modo Oscuro, Recordatorios, Modo Offline)"
        ],
        copyDraft: {
          headline: "Todo lo que necesitas para tu día a día",
          subheadline: "Funcionalidades pensadas al detalle para acompañarte en cada momento.",
          ctaText: "Probar la App Ahora",
          bulletPoints: [
            "Smart Reminders: Notificaciones inteligentes adaptadas a tu horario.",
            "Visual Stats: Gráficos claros de progreso semanal y mensual.",
            "Widgets de Pantalla: Acceso rápido desde la pantalla de inicio de tu teléfono."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Primary",
          layoutVariant: "Bento Grid 3 Cols",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "social_proof_testimonials",
        title: "3. Reseñas Destacadas de la App Store",
        order: 3,
        description: "Tarjetas de comentarios reales formateadas al estilo de opiniones de tienda de aplicaciones.",
        contentObjective: "Cerrar la venta dando confianza a través de experiencias de usuarios reales.",
        keyElements: [
          "Tarjetas estilo review con 5 estrellas e iniciales de usuario",
          "Etiqueta de 'Comprador Verificado'",
          "Badge de 'App del Día'"
        ],
        copyDraft: {
          headline: "Lo que dicen nuestros usuarios",
          subheadline: "Sumate a miles de personas que han transformado sus hábitos.",
          ctaText: "Descargar Gratis Ahora",
          bulletPoints: [
            "\"Simplemente la mejor app de hábitos que he probado. La interfaz es impecable.\" - Camila R.",
            "\"Me ayudó a organizarme en la universidad y el trabajo. 10/10.\" - Mateo S."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      }
    ]
  },

  // 4. Evento & Webinar Live (Mediana - 4 Secciones)
  {
    id: "tmpl-event-webinar",
    name: "Evento Live, Webinar & Masterclass",
    category: "Events & Education",
    badge: "Reserva Urgente",
    lengthTag: "Mediana (4 Secciones)",
    sectionCount: 4,
    description: "Estructura urgente con temporizador de cuenta regresiva, fotos de ponentes de alto nivel, agenda del evento y formulario de reserva de plaza.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-crimson-power") || PRESET_PALETTES[0],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-bricolage-jakarta") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Energético, de alto impacto, con urgencia de tiempo limitado e invitados especiales.",
    conversionVars: {
      tone: "Playful, Creativo & Bold",
      layoutPattern: "F-Pattern (Lectura Fluida)",
      targetAudience: "Profesionales, emprendedores y estudiantes de la industria",
      primaryGoal: "Registros en directo para la transmisión online",
      valueProposition: "Participa en el evento en vivo con los mayores referentes del sector.",
      socialProofDensity: "Alta (Testimonios + Logos + Métricas + Badges)",
      interactivity: "Contador regresivo en vivo + integración con Google Calendar",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: true,
      stickyCta: true,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Anuncio del Evento & Countdown",
        order: 1,
        description: "Encabezado con temporizador de cuenta regresiva, fecha/hora exacta y botón de inscripción directa.",
        contentObjective: "Crear urgencia extrema para asegurar que el visitante reserve su plaza antes de que se agoten los cupos.",
        keyElements: [
          "Badge superior: '🔴 Transmisión en Vivo - Acceso Gratuito con Registro'",
          "Widget de Cuenta Regresiva (Días : Horas : Minutos : Segundos)",
          "Titular H1 del evento o masterclass",
          "Detalles del evento: Fecha, Hora (en tu zona horaria) y Duración",
          "Botón de acción: 'Reservar Mi Asiento Gratuito'"
        ],
        copyDraft: {
          headline: "Masterclass en Vivo: Estrategias de Growth para 2026",
          subheadline: "Aprende los métodos exactos que están utilizando las empresas líderes para escalar sus ventas de forma predecible.",
          ctaText: "Reservar Mi Asiento Gratis",
          bulletPoints: ["Cupos limitados a 1,000 participantes", "Incluye sesión de Preguntas y Respuestas en vivo", "Regalo exclusivo para asistentes en directo"],
          extraNotes: "Incluir indicador visual de '84% de cupos reservados'."
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "value_prop",
        title: "2. Ponentes & Invitados Especiales",
        order: 2,
        description: "Tarjetas de perfil con foto, cargo y empresa de los speakers.",
        contentObjective: "Establecer autoridad indiscutible mostrando la trayectoria de los ponentes.",
        keyElements: [
          "Grid de tarjetas de speakers con fotografía profesional",
          "Badges con logos de las empresas donde han trabajado (Ex-Google, OpenAI, Vercel)",
          "Breve biografía de logros clave"
        ],
        copyDraft: {
          headline: "Aprende directamente de quienes ya lo lograron",
          subheadline: "Un panel de expertos con experiencia comprobada en empresas globales.",
          ctaText: "Ver Agenda Completa",
          bulletPoints: [
            "Dra. Sofía Méndez - VP de Growth en TechGlobal",
            "Carlos Benítez - Fundador y CEO de ScaleAI",
            "Valeria Torres - Directora de Producto en SaaSFlow"
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Bento Grid 3 Cols",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "process_how_it_works",
        title: "3. Agenda & Temario del Evento",
        order: 3,
        description: "Cronograma por bloques de tiempo explicando lo que se cubrirá en la sesión.",
        contentObjective: "Dar claridad sobre el valor educativo y la estructuración del contenido.",
        keyElements: [
          "Línea de tiempo por horas o bloques",
          "Puntos destacados de cada temática",
          "Mención de la sesión final de networking/Q&A"
        ],
        copyDraft: {
          headline: "Programa del Evento (2 Horas Intensivas)",
          subheadline: "Diseñado para darte pasos de acción concretos desde el primer minuto.",
          ctaText: "Asegurar Mi Plaza",
          bulletPoints: [
            "18:00 - Apertura & Tendencias del Mercado en 2026",
            "18:30 - Caso de Estudio: De 0 a 10k usuarios en 90 días",
            "19:15 - Taller Práctico de Optimizaciones UI/UX",
            "19:45 - Preguntas en Vivo & Entrega de Recursos Exclusivos"
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Primary",
          layoutVariant: "Split 50/50",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "lead_form",
        title: "4. Formulario de Inscripción Final",
        order: 4,
        description: "Cierre de registro urgente con confirmación y recordatorio.",
        contentObjective: "Capturar los datos del participante y ofrecer el botón de agregar a Google Calendar.",
        keyElements: [
          "Formulario de registro sencillo (Nombre, Email, WhatsApp opcional para recordatorio)",
          "Botón de confirmación",
          "Indicador de plazas restantes"
        ],
        copyDraft: {
          headline: "No te quedes fuera de esta masterclass exclusiva",
          subheadline: "Completa tus datos para recibir el enlace directo a la sala virtual.",
          ctaText: "Confirmar Mi Registro Gratuito",
          bulletPoints: ["Recibirás un recordatorio antes del evento", "Acceso directo por Zoom / YouTube Live"]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      }
    ]
  },

  // 5. Servicio Profesional & Negocio Local (Mediana - 4 Secciones)
  {
    id: "tmpl-local-service",
    name: "Servicio Profesional, Consultoría & Negocio Local",
    category: "Services & Local B2B",
    badge: "Citas & Presupuestos",
    lengthTag: "Mediana (4 Secciones)",
    sectionCount: 4,
    description: "Para bufetes de abogados, consultoras, clínicas, estudios de arquitectura o inmobiliarias. Destaca experiencia, casos de éxito y botón de agendar consulta.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-corporate-navy") || PRESET_PALETTES[0],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-instrument-inter") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Institucional, elegante, transmite máxima solidez, seriedad y confianza inmediata.",
    conversionVars: {
      tone: "B2B Enterprise Corporate",
      layoutPattern: "F-Pattern (Lectura Fluida)",
      targetAudience: "Empresarios, directivos y clientes que buscan servicios de alta gama",
      primaryGoal: "Generar llamadas de consulta o solicitudes de presupuesto",
      valueProposition: "Asesoría especializada de primer nivel con atención personalizada para tu empresa.",
      socialProofDensity: "Media (Logos + Testimonios Clave)",
      interactivity: "Formulario de reserva de cita previa y contacto directo telefónico",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: false,
      stickyCta: true,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Presentación Institucional & Asesoría",
        order: 1,
        description: "Cabecera distinguida con propuesta de valor clara, años de trayectoria e indicador de contacto directo.",
        contentObjective: "Transmitir la máxima autoridad en la materia y fomentar la solicitud de una primera consulta.",
        keyElements: [
          "Insignia de reputación: '🏛️ Más de 15 años de excelencia profesional'",
          "Titular H1 sobrio y enfocado en la solución jurídica o consultiva",
          "Subtitular sobre la atención personalizada",
          "Botón de acción: 'Solicitar Primera Consulta'",
          "Línea de contacto directo con número telefónico y WhatsApp corporativo"
        ],
        copyDraft: {
          headline: "Soluciones estratégicas para proteger y hacer crecer tu patrimonio",
          subheadline: "Brindamos asesoramiento integral personalizado a empresas y particulares con altos estándares de rigor y confidencialidad.",
          ctaText: "Agendar Consulta Privada",
          secondaryCtaText: "Llamar Ahora: +54 11 4000-0000",
          bulletPoints: ["Primera evaluación confidencial", "Atención personalizada por socios seniors", "Más de 500 casos resueltos favorablemente"],
          extraNotes: "Incluir logo institucional o sello de colegiatura médica/legal."
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Split 50/50",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "value_prop",
        title: "2. Áreas de Especialización / Servicios",
        order: 2,
        description: "Grid elegante de servicios principales ofrecidos.",
        contentObjective: "Detallar la cobertura de servicios para que el cliente identifique su necesidad exacta.",
        keyElements: [
          "Tarjetas estructuradas por especialidad",
          "Iconos vectoriales limpios",
          "Breve descripción del alcance de cada servicio"
        ],
        copyDraft: {
          headline: "Nuestras Áreas de Práctica",
          subheadline: "Un equipo multidisciplinario listo para abordar tus desafíos más complejos.",
          ctaText: "Consultar por un Servicio",
          bulletPoints: [
            "Derecho Corporativo & Fusiones: Asesoramiento en transacciones y estructuración de negocios.",
            "Fiscalidad & Planificación Tributaria: Optimización de cargas impositivas cumpliendo la normativa.",
            "Gestión Patrimonial & Sucesiones: Protección de activos familiares e inversiones estratégicas.",
            "Auditoría & Compliance: Cumplimiento regulatorio y prevención de riesgos normativos."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Primary",
          layoutVariant: "Bento Grid 3 Cols",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "social_proof_testimonials",
        title: "3. Casos de Éxito & Testimonios Institucionales",
        order: 3,
        description: "Reseñas de clientes destacados o resultados en cifras.",
        contentObjective: "Demostrar que la firma ha entregado resultados tangibles en situaciones similares.",
        keyElements: [
          "Citas de directivos de empresas cliente",
          "Estadísticas de casos resueltos",
          "Logos de corporaciones que confían en el estudio"
        ],
        copyDraft: {
          headline: "La confianza de nuestros clientes es nuestro mejor respaldo",
          subheadline: "Relaciones a largo plazo basadas en la transparencia y los resultados.",
          ctaText: "Ver Casos de Estudio",
          bulletPoints: [
            "\"Un equipo excepcionalmente profesional que resolvió nuestra reestructuración corporativa impecablemente.\" - Roberto G., CEO de Grupo Industrial",
            "\"Su asesoría estratégica fue clave para la expansión de nuestras operaciones.\" - María E., Directora Financiera"
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
        title: "4. Formulario de Contacto & Ubicación",
        order: 4,
        description: "Formulario para dejar datos de contacto, dirección física del despacho y horarios de atención.",
        contentObjective: "Facilitar el agendamiento de citas y el primer contacto directo.",
        keyElements: [
          "Formulario con campos de Nombre, Teléfono, Email y Consulta breve",
          "Dirección de las oficinas con mapa explicativo",
          "Horarios de atención presencial y telefónica"
        ],
        copyDraft: {
          headline: "Solicita tu evaluación personalizada hoy",
          subheadline: "Déjanos tus datos y un especialista senior se pondrá en contacto contigo a la brevedad.",
          ctaText: "Enviar Solicitud de Cita",
          bulletPoints: ["Dirección: Av. Principal 1234, Piso 8, Centro Financiero", "Horario: Lunes a Viernes de 9:00 a 18:00 hs"]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Split 50/50",
          paddingVertical: "Standard (py-20)"
        }
      }
    ]
  },

  // 6. E-Commerce Single Product (Mediana - 5 Secciones)
  {
    id: "tmpl-ecommerce-single",
    name: "E-Commerce Producto Estrella / D2C Gadget",
    category: "E-Commerce & D2C",
    badge: "Venta Directa",
    lengthTag: "Mediana (5 Secciones)",
    sectionCount: 5,
    description: "Centrada en la venta de un solo producto físico o gadget destacado. Incluye galería, especificaciones, comparativa y ofertas con descuento.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-nordic-frost") || PRESET_PALETTES[0],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-urbanist-dm") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Limpio, moderno, con estética de diseño de producto nórdico e incentivos de compra rápida.",
    conversionVars: {
      tone: "Minimalista Clean",
      layoutPattern: "Z-Pattern (Narrativa Visual)",
      targetAudience: "Compradores online, entusiastas de la tecnología y estilo de vida",
      primaryGoal: "Generar compras directas del producto con envío a domicilio",
      valueProposition: "Diseño de vanguardia y máxima calidad para tu vida diaria.",
      socialProofDensity: "Alta (Testimonios + Logos + Métricas + Badges)",
      interactivity: "Selector de variantes de color, contador de stock restante e imanes de compra",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: true,
      stickyCta: true,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Galería de Producto & Oferta Principal",
        order: 1,
        description: "Layout de tienda D2C con imágenes de producto en alta definición, precio en oferta con descuento, selector de color y botón de compra urgente.",
        contentObjective: "Atracción visual inmediata del producto con incentivo de precio y envío gratis.",
        keyElements: [
          "Badge de oferta: '🔥 30% OFF por Lanzamiento + Envío Gratis hoy'",
          "Fotografía en alta resolución del producto en ángulo principal",
          "Titular H1 con la característica distintiva clave",
          "Muestra de precio original tachado vs precio de oferta",
          "Botón de compra principal: 'Comprar Ahora (Envío Gratis 24/48h)'",
          "Garantía de satisfacción de 30 días con devolución sin preguntas"
        ],
        copyDraft: {
          headline: "Sonido de nivel profesional en un diseño ultraligero",
          subheadline: "Los nuevos auriculares ergonómicos con cancelación activa de ruido por IA y hasta 40 horas de batería continua.",
          ctaText: "Comprar Ahora con 30% Descuento",
          secondaryCtaText: "Ver Especificaciones",
          bulletPoints: ["Envío rápido en 24/48 hs", "Garantía oficial de 2 años", "Pago seguro en cuotas"],
          extraNotes: "Agregar insignias de pago seguro (Visa, Mastercard, PayPal)."
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Split 50/50",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "features",
        title: "2. Especificaciones Técnicas & Materiales",
        order: 2,
        description: "Detalle visual de la ingeniería, materiales y batería del producto.",
        contentObjective: "Demostrar la superioridad técnica del producto justificando su precio.",
        keyElements: [
          "Grid con iconos de características técnicas (Batería, Resistencia al agua, Conectividad)",
          "Imagen despiezada o en detalle del producto",
          "Tabla de especificaciones de dimensiones y peso"
        ],
        copyDraft: {
          headline: "Ingeniería de precisión en cada componente",
          subheadline: "Construido con materiales de primera calidad pensados para durar años.",
          ctaText: "Elegir Mi Color",
          bulletPoints: [
            "Cancelación Activa de Ruido (ANC): Filtra el 98.5% del ruido ambiente.",
            "Batería de Carga Rápida: 10 minutos de carga proporcionan 4 horas de reproducción.",
            "Resistencia IPX5: Protegido contra agua, lluvia y sudor intenso.",
            "Bluetooth 5.3: Conexión instantánea sin latencia."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Primary",
          layoutVariant: "Bento Grid 3 Cols",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "comparison_table",
        title: "3. Comparativa: Nuestro Producto vs Genéricos",
        order: 3,
        description: "Tabla lado a lado comparando las características de nuestro producto contra las alternativas baratas del mercado.",
        contentObjective: "Resaltar el valor superior del producto frente a la competencia de baja calidad.",
        keyElements: [
          "Tabla de 2 columnas con marcas de verificación (✓) y cruces (✗)",
          "Comparación de batería, materiales y garantía",
          "Llamado a la acción para elegir calidad"
        ],
        copyDraft: {
          headline: "¿Por qué elegirnos frente a las marcas convencionales?",
          subheadline: "Compara la calidad de construcción y la experiencia antes de comprar.",
          ctaText: "Aprovechar la Oferta",
          bulletPoints: [
            "Cancelación de Ruido AI: ✅ Nuestro Producto | ❌ Genéricos (Ruido básico)",
            "Duración de Batería: ✅ 40 Horas | ❌ 8-12 Horas promedio",
            "Garantía de Cambio: ✅ 2 Años Oficial | ❌ Sin garantía real"
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "social_proof_testimonials",
        title: "4. Opiniones Verificadas de Compradores",
        order: 4,
        description: "Reseñas con fotos reales de clientes satisfechos mostrando el producto en uso.",
        contentObjective: "Aumentar la confianza de conversión mediante testimonios de compradores auténticos.",
        keyElements: [
          "Muestra de puntuación global (4.8 / 5 basado en 1,200+ compras)",
          "Tarjetas de testimonio con estrellas y fotos",
          "Etiqueta de 'Compra Verificada'"
        ],
        copyDraft: {
          headline: "Lo que opinan nuestros compradores",
          subheadline: "Más de 10,000 unidades entregadas este año.",
          ctaText: "Quiero el Mío",
          bulletPoints: [
            "\"Increíble calidad de sonido. La batería realmente dura días sin cargarlo.\" - Nicolás P.",
            "\"Llegó al día siguiente de pedirlo. El empaque y la calidad se sienten de lujo.\" - Lucía M."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "pricing",
        title: "5. Paquetes de Oferta & Compra Final",
        order: 5,
        description: "Opciones de compra individual o pack duo con descuento adicional.",
        contentObjective: "Cerrar la venta ofreciendo opciones de ahorro al llevar más de una unidad.",
        keyElements: [
          "Tarjetas de precio: 1 Unidad (30% OFF) vs Pack Duo (45% OFF)",
          "Botón de pago directo con carrito o checkout rápido",
          "Sello de Garantía y Envío Gratis"
        ],
        copyDraft: {
          headline: "Elige tu paquete y ahorra hoy",
          subheadline: "Promoción disponible únicamente hasta agotar stock de la primera tirada.",
          ctaText: "Comprar Pack Duo (Ahorra Más)",
          secondaryCtaText: "Comprar 1 Unidad",
          bulletPoints: ["Envío Gratis a todo el país", "Pago seguro en cuotas sin interés", "Garantía de 30 días"]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Spacious (py-28)"
        }
      }
    ]
  },

  // 7. SaaS B2B Freemium & PLG (Completa - 6 Secciones)
  {
    id: "tmpl-saas-plg",
    name: "SaaS B2B Freemium & Product-Led Growth",
    category: "SaaS & B2B Software",
    badge: "Escalabilidad B2B",
    lengthTag: "Completa (6 Secciones)",
    sectionCount: 6,
    description: "Estructura estándar de conversión para software SaaS B2B. Incluye prueba gratuita, barra de logos, matriz de dolor, Bento Grid, precios mensuales/anuales y FAQ.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-tech-indigo") || PRESET_PALETTES[0],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-geist-inter") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Tecnológico, limpio, confiable, con excelente legibilidad y jerarquía visual impecable.",
    conversionVars: {
      tone: "SaaS Tech / Moderno",
      layoutPattern: "F-Pattern (Lectura Fluida)",
      targetAudience: "Equipos de tecnología, directores de producto y empresas en crecimiento",
      primaryGoal: "Captar registros en la versión gratuita e impulsar conversiones a planes Pro",
      valueProposition: "Simplifica la gestión operativa de tu equipo con automatizaciones inteligentes.",
      socialProofDensity: "Alta (Testimonios + Logos + Métricas + Badges)",
      interactivity: "Bento Grid interactivo, Toggle de Precios mensual/anual y prueba gratuita sin tarjeta",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: true,
      stickyCta: true,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Hero Section con Interactive Preview",
        order: 1,
        description: "Cabecera principal con titular claro, CTA de prueba gratuita de 14 días y captura del panel de software.",
        contentObjective: "Aclarar en segundos la propuesta de valor del software e incentivar el registro sin tarjeta.",
        keyElements: [
          "Pill Badge: '✨ Nueva Versión 3.0 con IA Integrada'",
          "Titular H1 masivo sobre eficiencia de equipo",
          "Subtitular descriptivo de integración en 5 minutos",
          "CTA Principal: 'Comenzar Prueba Gratis (14 Días)' + Secundario: 'Ver Demo'",
          "Mockup interactivo del software o Dashboard preview",
          "Garantía: 'Sin tarjeta de crédito requerida'"
        ],
        copyDraft: {
          headline: "La plataforma de gestión que impulsa el rendimiento de tu equipo",
          subheadline: "Centraliza proyectos, automatiza tareas repetitivas y visualiza métricas en tiempo real desde una sola pantalla.",
          ctaText: "Crear Cuenta Gratuita",
          secondaryCtaText: "Ver Demo interactiva",
          bulletPoints: ["Instalación en 2 minutos", "Sin tarjeta de crédito", "Soporte 24/7"]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "social_proof_testimonials",
        title: "2. Trust Cloud de Logos Enterprise",
        order: 2,
        description: "Fila de logos de empresas reconocidas que utilizan el software.",
        contentObjective: "Validación inmediata de autoridad institucional.",
        keyElements: [
          "Texto: 'Utilizado por más de 10,000 equipos en todo el mundo'",
          "Grid de 6 logos corporativos en acabado monocromático"
        ],
        copyDraft: {
          headline: "Empresas líderes confían en nuestro software",
          subheadline: "Desde startups prometedoras hasta grandes corporaciones.",
          ctaText: "Ver Casos de Éxito",
          bulletPoints: ["Vercel", "Stripe", "Supabase", "Figma", "OpenAI", "Linear"]
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
        description: "Contraste entre los procesos manuales caóticos y el sistema automatizado moderno.",
        contentObjective: "Hacer evidente el dolor de mantener sistemas obsoletos.",
        keyElements: [
          "Tarjeta del Método Antiguo (Caos de hojas de cálculo, mensajes perdidos)",
          "Tarjeta de la Solución Moderna (Flujos automatizados, tablero central)"
        ],
        copyDraft: {
          headline: "Deja de perder tiempo en tareas administrativas manuales",
          subheadline: "Los equipos promedio gastan el 40% de su semana organizando reuniones y actualizando archivos manuales.",
          ctaText: "Automatizar Mi Flujo de Trabajo",
          bulletPoints: [
            "❌ Antes: Múltiples aplicaciones desconectadas, datos duplicados y falta de visibilidad.",
            "✅ Ahora: Un único espacio de trabajo con métricas en tiempo real y sincronización automática."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Split 50/50",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "features",
        title: "4. Bento Grid de Funcionalidades Clave",
        order: 4,
        description: "Grid asimétrico demostrando las capacidades principales del software.",
        contentObjective: "Mostrar la potencia y versatilidad técnica de las herramientas internas.",
        keyElements: [
          "Bento Grid de 4 bloques interactivos",
          "Tarjetas de visualización de datos con gráficos simples",
          "Badges de funcionalidad (AI Powered, Real-Time Sync, Integraciones)"
        ],
        copyDraft: {
          headline: "Todo lo que necesitas para operar a máxima velocidad",
          subheadline: "Herramientas diseñadas para eliminar cuellos de botella.",
          ctaText: "Explorar Todas las Funcionalidades",
          bulletPoints: [
            "Asistente de IA Integrado: Genera informes automáticos en segundos.",
            "Integraciones Nativas: Conecta con Slack, GitHub, Google Drive y Notion.",
            "Seguridad de Nivel Enterprise: Encriptación de extremo a extremo y cumplimiento SOC2."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Primary",
          layoutVariant: "Bento Grid 3 Cols",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "pricing",
        title: "5. Tabla de Precios Transparente con Toggle",
        order: 5,
        description: "Tabla de 3 planes (Starter, Pro, Enterprise) con selector de pago mensual o anual con descuento.",
        contentObjective: "Facilitar la decisión de compra mostrando claramente las opciones y beneficios de cada plan.",
        keyElements: [
          "Toggle de pago: Mensual vs Anual (20% OFF)",
          "3 Tarjetas de planes con el plan 'Pro' destacado como el más popular",
          "Listado de funciones incluidas por nivel",
          "Botones de contratación directa"
        ],
        copyDraft: {
          headline: "Planes transparentes adaptados al tamaño de tu equipo",
          subheadline: "Comienza gratis y escala a medida que tu negocio crece.",
          ctaText: "Iniciar Prueba del Plan Pro",
          secondaryCtaText: "Contactar a Ventas",
          bulletPoints: [
            "Starter (Gratis): Hasta 3 usuarios, funciones básicas.",
            "Pro ($29/mes): Usuarios ilimitados, IA avanzada y soporte prioritario.",
            "Enterprise (Custom): Servidores dedicados, SLA y gestor de cuenta asignado."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "faq",
        title: "6. Preguntas Frecuentes de la Plataforma",
        order: 6,
        description: "Acordeón desplegable para resolver objeciones de facturación, seguridad y migración.",
        contentObjective: "Eliminar las dudas finales antes de la conversión.",
        keyElements: [
          "Acordeón de 4 preguntas de soporte técnico y comercial",
          "Cierre con botón de soporte 24/7"
        ],
        copyDraft: {
          headline: "Preguntas Frecuentes",
          subheadline: "¿Tienes dudas? Estamos aquí para ayudarte.",
          ctaText: "Probar Gratis Ahora",
          bulletPoints: [
            "¿Puedo cambiar de plan en cualquier momento? Sí, puedes cancelar o actualizar tu suscripción desde tu panel.",
            "¿Cómo funciona la prueba gratuita de 14 días? Tienes acceso total a todas las funciones Pro sin ingresar tarjeta de crédito.",
            "¿Mis datos están seguros? Cumplimos con las regulaciones GDPR y utilizamos encriptación AES-256."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      }
    ]
  },

  // 8. Agencia Creativa & Estudio de Diseño (Mediana - 5 Secciones)
  {
    id: "tmpl-agency-portfolio",
    name: "Agencia Creativa, Branding & Estudio Web",
    category: "Agency & Design",
    badge: "High-Ticket Portfolio",
    lengthTag: "Mediana (5 Secciones)",
    sectionCount: 5,
    description: "Para estudios de diseño, agencias de marketing o freelancers de alto valor. Destaca casos de estudio, filosofía de trabajo, proceso y agenda de reuniones.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-charcoal-electric") || PRESET_PALETTES[2],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-syne-inter") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Modo oscuro mate, sofisticado, tipografía display audaz y estética de agencia de diseño de autor.",
    conversionVars: {
      tone: "Editorial & Elegante",
      layoutPattern: "Split 50/50 Asimétrico",
      targetAudience: "Fundadores, VPs de Marketing y empresas que buscan servicios de diseño premium",
      primaryGoal: "Conseguir llamadas de descubrimiento para proyectos de alto presupuesto",
      valueProposition: "Transformamos marcas en experiencias digitales memorables de alta conversión.",
      socialProofDensity: "Media (Logos + Testimonios Clave)",
      interactivity: "Showcase interactivo de proyectos con vista detallada de casos de estudio",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: false,
      stickyCta: true,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Titular Audaz & Filosofía de Agencia",
        order: 1,
        description: "Impacto tipográfico de gran escala con declaración de intenciones y proyectos destacados.",
        contentObjective: "Posicionar al estudio como una referencia creativa de alta gama.",
        keyElements: [
          "Badge superior: '✦ Estudio Creativo & Estrategia Digital'",
          "Titular H1 masivo en tipografía Display",
          "Párrafo de manifiesto de diseño",
          "Botón de acción: 'Agendar Llamada de Proyecto'",
          "Muestra de premios o reconocimientos (Awwwards, FWA)"
        ],
        copyDraft: {
          headline: "Diseñamos marcas digitales que dominan su industria",
          subheadline: "Combinamos estrategia de negocios, identidad de marca de vanguardia y desarrollo web de precisión para empresas ambiciosas.",
          ctaText: "Iniciar un Proyecto",
          secondaryCtaText: "Explorar Portafolio",
          bulletPoints: ["Proyectos a medida", "Acompañamiento directivo", "Entregas en tiempo récord"]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "features",
        title: "2. Portafolio & Casos de Estudio",
        order: 2,
        description: "Grid visual de proyectos seleccionados con métricas de impacto de marca.",
        contentObjective: "Demostrar la calidad estética y los resultados comerciales entregados a clientes previos.",
        keyElements: [
          "Grid de 4 proyectos destacados con imágenes de gran formato",
          "Etiquetas de industria y servicio (Branding, Web Design, CRO)",
          "Indicadores cuantitativos de impacto (+120% en conversiones)"
        ],
        copyDraft: {
          headline: "Trabajos Recientes Seleccionados",
          subheadline: "Una muestra de las marcas que hemos ayudado a redefinir.",
          ctaText: "Ver Todos los Proyectos",
          bulletPoints: [
            "Proyect 01: Rediseño completo de marca y plataforma Web3 para FinTech Global.",
            "Proyect 02: Sistema de diseño modular y landing page de alta conversión para SaaS B2B.",
            "Proyect 03: Experiencia e-commerce D2C con aumento del 85% en tasa de checkout."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Bento Grid 3 Cols",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "value_prop",
        title: "3. Servicios de Especialidad",
        order: 3,
        description: "Líneas de servicio principales ofrecidas por el estudio.",
        contentObjective: "Aclarar exactamente qué alcance pueden contratar los clientes.",
        keyElements: [
          "Listado interactivo de servicios",
          "Descripción de entregables y metodologías"
        ],
        copyDraft: {
          headline: "Nuestras Capacidades Core",
          subheadline: "Todo lo necesario para elevar la percepción de tu marca.",
          ctaText: "Solicitar Propuesta",
          bulletPoints: [
            "Identidad de Marca & Branding: Estrategia de posición, logotipos, tipografía y sistemas de marca.",
            "Diseño UI/UX & Web Systems: Creación de interfaces digitales elegantes y altamente funcionales.",
            "Optimización de Conversión (CRO): Auditoría de fricción y rediseño enfocado en ventas."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Split 50/50",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "process_how_it_works",
        title: "4. Nuestro Proceso de Trabajo en 4 Etapas",
        order: 4,
        description: "Estructura clara de cómo se ejecuta un proyecto desde el briefing hasta el lanzamiento.",
        contentObjective: "Transmitir certidumbre y profesionalismo sobre los plazos y métodos de entrega.",
        keyElements: [
          "4 Pasos secuenciales (01. Descubrimiento, 02. Estrategia, 03. Diseño & Dev, 04. Lanzamiento)",
          "Tiempos estimados por fase"
        ],
        copyDraft: {
          headline: "Un proceso estructurado para resultados predecibles",
          subheadline: "Sin sorpresas, sin demoras injustificadas.",
          ctaText: "Reservar Mi Fecha",
          bulletPoints: [
            "01. Discovery: Análisis de negocio, competencia y definición de objetivos.",
            "02. Architecture: Prototipos de baja fidelidad y estructura de contenidos.",
            "03. Crafting: Diseño de interfaz en alta fidelidad y desarrollo limpio.",
            "04. Launch: Pruebas de rendimiento, optimización mobile y entrega."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "lead_form",
        title: "5. Agendamiento de Sesión Estratégica",
        order: 5,
        description: "Formulario de contacto para calificar clientes y agendar reunión.",
        contentObjective: "Capturar solicitudes de proyecto con presupuesto estimado.",
        keyElements: [
          "Formulario con selector de rango de presupuesto (Ej: $5k - $10k, $10k+)",
          "Campo para describir el proyecto",
          "Botón de agendar llamada en Calendly/Cal.com"
        ],
        copyDraft: {
          headline: "¿Tienes un proyecto en mente? Hablemos.",
          subheadline: "Cuéntanos sobre tus objetivos y agendaremos una llamada inicial sin compromiso.",
          ctaText: "Agendar Llamada de Estrategia",
          bulletPoints: ["Respuesta en menos de 24 horas", "Presupuestos personalizados"]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Spacious (py-28)"
        }
      }
    ]
  },

  // 9. Curso Online & Masterclass High-Ticket (Completa - 7 Secciones)
  {
    id: "tmpl-course-masterclass",
    name: "Curso Online, Academia & Formación High-Ticket",
    category: "Education & Courses",
    badge: "Educación Digital",
    lengthTag: "Completa (7 Secciones)",
    sectionCount: 7,
    description: "Diseño para vender infoproductos, bootcamps o cursos digitales. Incluye video trailer, temario semana a semana, autoridad del instructor, testimonios de alumnos y bonus exclusivos.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-warm-amber") || PRESET_PALETTES[0],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-poppins-jakarta") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Cálido, inspirador, con alta autoridad de enseñanza y estructura de venta directa sólida.",
    conversionVars: {
      tone: "High-Conversion Direct Response",
      layoutPattern: "F-Pattern (Lectura Fluida)",
      targetAudience: "Estudiantes, profesionales buscando reconversión laboral y creadores de contenido",
      primaryGoal: "Inscripciones directas al curso o membresía académica",
      valueProposition: "Aprende las habilidades más demandadas del mercado con un método 100% práctico.",
      socialProofDensity: "Alta (Testimonios + Logos + Métricas + Badges)",
      interactivity: "Acordeón desplegable de módulos del curso y video reproductor de trailer",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: true,
      stickyCta: true,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Presentación del Curso & Video Trailer",
        order: 1,
        description: "Cabecera con reproductor de vídeo trailer del programa, insignia de certificación y botón de inscripción urgente.",
        contentObjective: "Enganchar al visitante con la promesa de transformación profesional mediante el curso.",
        keyElements: [
          "Badge superior: '🎓 Inscripciones Abiertas - Cohorte 2026'",
          "Titular H1 enfocado en la habilidad adquirida",
          "Reproductor de vídeo o vista previa del curso",
          "Botón de acción principal: 'Inscribirme al Programa'",
          "Badge de garantía: '100% Garantía de devolución de 14 días'"
        ],
        copyDraft: {
          headline: "Domina el Desarrollo Web y la Inteligencia Artificial de 0 a Senior",
          subheadline: "El programa intensivo paso a paso diseñado para ayudarte a construir proyectos reales y conseguir tu próximo empleo tech.",
          ctaText: "Inscribirme Ahora al Programa",
          secondaryCtaText: "Ver Video de Presentación",
          bulletPoints: ["Acceso de por vida", "Comunidad privada en Discord", "Certificado de finalización"],
          extraNotes: "Incluir indicador de 'Quedan 12 plazas disponibles para esta cohorte'."
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Split 50/50",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "problem_solution",
        title: "2. ¿Para Quién es Este Curso?",
        order: 2,
        description: "Definición del perfil ideal del alumno y los obstáculos que resolverá.",
        contentObjective: "Filtrar al público objetivo adecuado y crear identificación inmediata con sus frustraciones actuales.",
        keyElements: [
          "Sección 'Si estás estancado en...' vs 'Al finalizar el curso serás capaz de...'",
          "Lista de requisitos previos (ninguno necesario o básico)"
        ],
        copyDraft: {
          headline: "¿Sientes que los tutoriales dispersos no te llevan a ningún lado?",
          subheadline: "Diseñamos este método para eliminar la confusión y darte una hoja de ruta clara.",
          ctaText: "Ver Plan de Estudios",
          bulletPoints: [
            "❌ Antes: Copiando código sin entender la lógica profunda tras cada decisión.",
            "✅ Después: Construyendo aplicaciones de producción escalables por ti mismo."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Split 50/50",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "process_how_it_works",
        title: "3. Temario Semana a Semana (Plan de Estudios)",
        order: 3,
        description: "Acordeón detallado de todos los módulos del curso.",
        contentObjective: "Demostrar la profundidad y organización profesional del temario.",
        keyElements: [
          "Desglose por Módulos (Módulo 1 a Módulo 8)",
          "Lista de lecciones y proyectos prácticos por módulo",
          "Duración total en horas de contenido"
        ],
        copyDraft: {
          headline: "Plan de Estudios Estructurado",
          subheadline: "8 Módulos prácticos enfocados en proyectos reales de mercado.",
          ctaText: "Quiero Inscribirme",
          bulletPoints: [
            "Módulo 1: Fundamentos de Arquitectura Moderna & TypeScript.",
            "Módulo 2: Componentes Avanzados de UI con React & Tailwind v4.",
            "Módulo 3: Integración de APIs de Inteligencia Artificial (Gemini API).",
            "Módulo 4: Proyecto Final: Despliegue en producción y optimización."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "social_proof_testimonials",
        title: "4. Biografía & Autoridad del Instructor",
        order: 4,
        description: "Sección dedicada a la trayectoria del creador del programa.",
        contentObjective: "Generar confianza absoluta en que el profesor tiene la experiencia práctica para enseñar.",
        keyElements: [
          "Fotografía profesional del instructor",
          "Cifras de experiencia (Años en la industria, Alumnos formados)",
          "Empresas previas donde ha trabajado"
        ],
        copyDraft: {
          headline: "Conoce a tu mentor",
          subheadline: "Más de 10 años desarrollando software para startups en Silicon Valley.",
          ctaText: "Unirme a sus Alumnos",
          bulletPoints: [
            "Ing. Gabriel Morales - Lead Software Architect",
            "Ha formado a más de 8,000 desarrolladores que hoy trabajan en empresas globales."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Primary",
          layoutVariant: "Split 50/50",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "social_proof_testimonials",
        title: "5. Casos de Éxito & Testimonios de Graduados",
        order: 5,
        description: "Capturas de pantalla de comentarios de alumnos, aumentos de sueldo y puestos conseguidos.",
        contentObjective: "Inspirar al visitante mostrando el resultado final al graduarse del programa.",
        keyElements: [
          "Tarjetas de alumnos con foto, nombre y puesto laboral actual",
          "Historias de éxito de reconversión laboral"
        ],
        copyDraft: {
          headline: "Resultados reales de nuestros estudiantes",
          subheadline: "Ellos ya dieron el paso. Conoce sus historias.",
          ctaText: "Comenzar Mi Transformación",
          bulletPoints: [
            "\"Gracias a este bootcamp conseguí mi primer trabajo como desarrollador Frontend en 3 meses.\" - David L.",
            "\"El módulo de IA me permitió duplicar el valor de mis servicios como freelancer.\" - Andrea P."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "pricing",
        title: "6. Precios, Opciones de Pago & Bonus Exclusivos",
        order: 6,
        description: "Caja de precio con desglose de bonus (Comunidad, Plantillas, Sesiones 1 a 1) e incentivo de descuento.",
        contentObjective: "Maximizar el valor percibido ofreciendo bonus adicionales.",
        keyElements: [
          "Opción de Pago Único (con descuento extra) vs Pago en Cuotas",
          "Lista de Bonus de Regalo valorados en $500",
          "Botón de pago seguro e insignia de garantía de satisfacción"
        ],
        copyDraft: {
          headline: "Invierte en tu futuro profesional hoy",
          subheadline: "Inscripción con acceso ilimitado de por vida y todas las actualizaciones futuras.",
          ctaText: "Inscribirme por $199 (Pago Único)",
          secondaryCtaText: "Ver Plan de 3 Cuotas",
          bulletPoints: [
            "✅ Acceso de por vida a los 8 Módulos ($499 valor)",
            "🎁 BONUS 1: Librería de Plantillas UI Listas para usar ($150 valor)",
            "🎁 BONUS 2: Acceso a la Comunidad VIP de Discord ($200 valor)",
            "🛡️ Garantía incondicional de devolución de 14 días"
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "faq",
        title: "7. Preguntas Frecuentes del Alumnado",
        order: 7,
        description: "Dudas sobre tiempos, certificados y formato de las clases.",
        contentObjective: "Cerrar las objeciones finales del proceso de compra.",
        keyElements: [
          "Acordeón desplegable con 4 respuestas rápidas"
        ],
        copyDraft: {
          headline: "Preguntas Frecuentes",
          subheadline: "Todo lo que necesitas saber antes de inscribirte.",
          ctaText: "Inscribirme Ahora",
          bulletPoints: [
            "¿Las clases son en vivo o grabadas? El contenido principal está grabado en alta definición para que estudies a tu ritmo, con sesiones de tutoría en vivo semanales.",
            "¿Necesito conocimientos previos? No, comenzamos desde los conceptos fundamentales.",
            "¿Obtendré un certificado al finalizar? Sí, recibirás un certificado verificable para adjuntar a tu perfil de LinkedIn."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Standard (py-20)"
        }
      }
    ]
  },

  // 10. High-Value B2B Enterprise & Whitepaper (Completa - 6 Secciones)
  {
    id: "tmpl-b2b-enterprise",
    name: "High-Value B2B Enterprise & Reporte de Industria",
    category: "Enterprise & Security",
    badge: "MQL Enterprise",
    lengthTag: "Completa (6 Secciones)",
    sectionCount: 6,
    description: "Captación de clientes corporativos de alto valor mediante un reporte o whitepaper de industria. Formulario con filtro de email de empresa y cargos directivos.",
    palette: PRESET_PALETTES.find((p) => p.id === "pal-minimal-slate") || PRESET_PALETTES[0],
    typography: PRESET_TYPOGRAPHY.find((t) => t.id === "typo-tech-bold") || PRESET_TYPOGRAPHY[0],
    globalVibe: "Minimalista, corporativo de alta precisión, serio y orientado a datos de mercado.",
    conversionVars: {
      tone: "B2B Enterprise Corporate",
      layoutPattern: "F-Pattern (Lectura Fluida)",
      targetAudience: "CISOs, VPs de Tecnología, Directores de Operaciones y Decision-Makers",
      primaryGoal: "Capturar MQLs cualificados para el equipo de ventas Enterprise",
      valueProposition: "Accede a los datos más recientes sobre ciberseguridad y eficiencia en grandes organizaciones.",
      socialProofDensity: "Alta (Testimonios + Logos + Métricas + Badges)",
      interactivity: "Visualizador de extracto de reporte PDF y formulario de calificación corporativa",
      framework: "Tailwind CSS v4 + React + Lucide Icons",
      urgencyTriggers: false,
      stickyCta: true,
    },
    rawSections: [
      {
        type: "hero",
        title: "1. Descarga del Informe Ejecutivo B2B",
        order: 1,
        description: "Cabecera sobria presentando el informe de investigación con formulario corporativo.",
        contentObjective: "Atraer a tomadores de decisiones que buscan datos para justificar presupuestos.",
        keyElements: [
          "Insignia: '📊 Informe de Investigación Enterprise 2026'",
          "Titular H1 enfocado en las métricas de mercado",
          "Formulario corporativo (Email corporativo, Nombre, Tamaño de empresa, Cargo)",
          "Vista previa de la portada del informe en PDF"
        ],
        copyDraft: {
          headline: "Estado de la Ciberseguridad e Inteligencia Artificial en Empresas Fortune 500",
          subheadline: "Un análisis exhaustivo basado en encuestas a más de 300 líderes de tecnología sobre riesgos, inversiones y ROI.",
          ctaText: "Descargar Informe PDF Completo",
          bulletPoints: ["Acceso inmediato", "Exclusivo para correo corporativo", "Incluye gráficos ejecutivos en alta resolución"]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Split 50/50",
          paddingVertical: "Spacious (py-28)"
        }
      },
      {
        type: "social_proof_testimonials",
        title: "2. Empresas Participantes en el Estudio",
        order: 2,
        description: "Logos de corporaciones que colaboraron en el reporte.",
        contentObjective: "Demostrar que los datos provienen de empresas líderes reales.",
        keyElements: [
          "Texto: 'Datos recopilados en colaboración con directivos de:'",
          "Grid de logos de empresas multinacionales"
        ],
        copyDraft: {
          headline: "Respaldo institucional de nivel global",
          subheadline: "Perspectivas de líderes en ciberseguridad y cloud computing.",
          ctaText: "Ver Metodología del Estudio",
          bulletPoints: ["Microsoft", "IBM", "AWS", "Cisco", "PwC", "Oracle"]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Surface",
          layoutVariant: "Centered Focus",
          paddingVertical: "Compact (py-12)"
        }
      },
      {
        type: "stats_counter",
        title: "3. Hallazgos & Métricas Clave del Informe",
        order: 3,
        description: "Bloque numérico de alto impacto con estadísticas clave descubiertas en la investigación.",
        contentObjective: "Generar curiosidad revelando datos cuantitativos impactantes.",
        keyElements: [
          "4 Contadores estadísticos masivos (Ej: '73%', '$2.4M', '4.2x', '99.9%')",
          "Etiquetas explicativas de cada estadística"
        ],
        copyDraft: {
          headline: "Los datos que están redefiniendo las inversiones en 2026",
          subheadline: "Extracto de los indicadores más relevantes del estudio.",
          ctaText: "Descargar el Informe Completo",
          bulletPoints: [
            "73% de los CISOs han aumentado su presupuesto en IA defensiva este año.",
            "$2.4M es el costo promedio ahorrado al automatizar la detección de amenazas.",
            "4.2x mayor velocidad de respuesta ante incidentes en arquitecturas modernas."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Bento Grid 3 Cols",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "features",
        title: "4. Muestra de Temas Cubiertos en el PDF",
        order: 4,
        description: "Resumen de las 4 secciones principales del informe.",
        contentObjective: "Dar un adelanto del contenido técnico y estratégico que se descargará.",
        keyElements: [
          "Grid de 4 tarjetas con extractos de gráficos y resúmenes ejecutivos"
        ],
        copyDraft: {
          headline: "Estructura del Informe de Investigación",
          subheadline: "Conclusiones accionables divididas en 4 ejes clave.",
          ctaText: "Solicitar Muestra Ejecutiva",
          bulletPoints: [
            "Sección 1: Panorama Global de Amenazas en Entornos Multi-cloud.",
            "Sección 2: Estrategias de Retención de Talento Técnico Senior.",
            "Sección 3: Justificación de Presupuesto ante la Junta Directiva.",
            "Sección 4: Hoja de Ruta de Implementación de Arquitectura Zero-Trust."
          ]
        },
        sectionStyleOverrides: {
          bgStyle: "Solid Primary",
          layoutVariant: "Bento Grid 3 Cols",
          paddingVertical: "Standard (py-20)"
        }
      },
      {
        type: "social_proof_testimonials",
        title: "5. Valoraciones de CISOs & VPs de Tecnología",
        order: 5,
        description: "Citas de ejecutivos de nivel C que ya leyeron el informe.",
        contentObjective: "Validación entre pares de alto nivel directivo.",
        keyElements: [
          "Citas de CISOs y CTOs con su cargo y empresa"
        ],
        copyDraft: {
          headline: "Lo que opinan los líderes de la industria sobre este reporte",
          subheadline: "Lectura imprescindible para la planificación estratégica anual.",
          ctaText: "Obtener Mi Copia",
          bulletPoints: [
            "\"Este informe nos proporcionó los datos clave para fundamentar nuestro plan de ciberseguridad ante el directorio.\" - Ing. Fernando S., CISO en Banco Internacional",
            "\"Análisis impecables y 100% basados en evidencias de mercado reales.\" - Patricia M., VP de Infraestructura"
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
        title: "6. Formulario de Captura Corporativo Cierre",
        order: 6,
        description: "Formulario final de descarga e invitación a una sesión de briefing con un consultor senior.",
        contentObjective: "Convertir la descarga en un contacto directo para el equipo de ventas Enterprise.",
        keyElements: [
          "Formulario con validación de correo de empresa",
          "Opción adicional: 'Solicitar briefing personalizado de 15 minutos con un consultor'"
        ],
        copyDraft: {
          headline: "Descarga la guía completa para tu equipo ejecutivo",
          subheadline: "Completa el formulario corporativo y accede instantáneamente al documento en PDF.",
          ctaText: "Descargar Informe PDF Ahora",
          bulletPoints: ["Privacidad de datos garantizada", "Uso exclusivo para profesionales corporativos"]
        },
        sectionStyleOverrides: {
          bgStyle: "Dark Contrast",
          layoutVariant: "Centered Focus",
          paddingVertical: "Spacious (py-28)"
        }
      }
    ]
  }
];

/**
 * Genera un proyecto completo a partir de una de las 10 plantillas de landing page.
 */
export function createProjectFromLandingTemplate(
  templateId: string,
  projectName: string,
  description: string,
  industry: string,
  newProjId: string = `proj_${Date.now()}`
): Project | null {
  const tmpl = LANDING_PAGE_TEMPLATES.find((t) => t.id === templateId);
  if (!tmpl) return null;

  const project: Project = {
    id: newProjId,
    name: projectName,
    description: description || tmpl.description,
    industry: industry || tmpl.category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    conversionVars: {
      ...tmpl.conversionVars,
      valueProposition: description || tmpl.conversionVars.valueProposition,
    },
    styleConfig: {
      palette: tmpl.palette,
      typography: tmpl.typography,
      globalVibe: tmpl.globalVibe,
    },
    sections: [],
    history: [
      {
        id: `log_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        action: `Proyecto creado desde la Plantilla '${tmpl.name}'`,
        details: `Estructura inicial de ${tmpl.sectionCount} secciones pre-configuradas (${tmpl.lengthTag}).`,
      },
    ],
  };

  project.sections = tmpl.rawSections.map((secData, idx) => {
    const secId = `sec_${Date.now()}_${idx + 1}`;
    const section: Section = {
      id: secId,
      ...secData,
      generatedPrompt: "",
      updatedAt: new Date().toISOString(),
    };
    section.generatedPrompt = buildSectionPrompt(project, section);
    return section;
  });

  return project;
}
