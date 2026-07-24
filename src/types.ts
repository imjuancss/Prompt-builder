export interface ColorPalette {
  id?: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  description?: string;
}

export interface TypographyPair {
  id?: string;
  name: string;
  headingFont: string;
  bodyFont: string;
  styleNote?: string;
}

export interface StylePreset {
  id: string;
  name: string;
  palette: ColorPalette;
  typography: TypographyPair;
  vibe: string;
  isCustom?: boolean;
}

export type DesignTone =
  | "Minimalista Clean"
  | "SaaS Tech / Moderno"
  | "B2B Enterprise Corporate"
  | "High-Conversion Direct Response"
  | "Dark Mode Luxury & Neon"
  | "Playful, Creativo & Bold"
  | "Editorial & Elegante";

export type LayoutPattern =
  | "F-Pattern (Lectura Fluida)"
  | "Z-Pattern (Narrativa Visual)"
  | "Bento Grid 3x3"
  | "Split 50/50 Asimétrico"
  | "Centered Minimalist Impact";

export type SocialProofDensity =
  | "Alta (Testimonios + Logos + Métricas + Badges)"
  | "Media (Logos + Testimonios Clave)"
  | "Sutil (Logos o Badges discretos)";

export type OutputFramework =
  | "Tailwind CSS v4 + React + Lucide Icons"
  | "Tailwind CSS + HTML5 / JS Vanilla"
  | "Figma UI Kit & Design System Specs"
  | "Framer Motion + React Components";

export interface ConversionVariables {
  tone: DesignTone;
  layoutPattern: LayoutPattern;
  targetAudience: string;
  primaryGoal: string;
  valueProposition: string;
  socialProofDensity: SocialProofDensity;
  interactivity: string;
  framework: OutputFramework;
  urgencyTriggers?: boolean;
  stickyCta?: boolean;
  impeccableCraft?: boolean;
  targetLLM?: string;
}

export type SectionType =
  | "hero"
  | "problem_solution"
  | "value_prop"
  | "features"
  | "process_how_it_works"
  | "social_proof_testimonials"
  | "stats_counter"
  | "comparison_table"
  | "pricing"
  | "faq"
  | "lead_form"
  | "footer"
  | "custom";

export type SectionTextureType = "none" | "grid" | "dots";
export type GridSizeOption = "small" | "medium" | "large";
export type DotsSpacingOption = "dense" | "normal" | "sparse";

export interface SectionStyleOverrides {
  bgStyle?: "Solid Primary" | "Solid Surface" | "Gradient Accent" | "Dark Contrast" | "Glassmorphism Card";
  bgTextureType?: SectionTextureType;
  gridSize?: GridSizeOption;
  dotsSpacing?: DotsSpacingOption;
  layoutVariant?: "Split 50/50" | "Centered Focus" | "Bento Grid 3 Cols" | "Carousel / Slider" | "Sticky Sidebar";
  paddingVertical?: "Compact (py-12)" | "Standard (py-20)" | "Spacious (py-28)";
  animationStyle?: "Framer Motion Fluid" | "GSAP ScrollTrigger" | "CSS Keyframes Micro-interactions" | "Minimal Fade-In";
  libraryEnhancements?: string[];
}

export interface SectionCopyDraft {
  headline: string;
  subheadline: string;
  ctaText: string;
  secondaryCtaText?: string;
  bulletPoints?: string[];
  extraNotes?: string;
}

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  order: number;
  description: string;
  contentObjective: string;
  keyElements: string[];
  copyDraft: SectionCopyDraft;
  sectionStyleOverrides?: SectionStyleOverrides;
  generatedPrompt: string;
  updatedAt: string;
  isAiEnhanced?: boolean;
}

export interface ProjectHistoryLog {
  id: string;
  timestamp: string;
  action: string;
  details?: string;
}

export type BorderRadiusOption = "none" | "sm" | "md" | "lg" | "xl" | "full";
export type ElevationShadowOption = "none" | "subtle" | "medium" | "high" | "glow";
export type ButtonRadiusOption = "none" | "sm" | "md" | "lg" | "full";
export type ButtonPaddingOption = "compact" | "standard" | "spacious";
export type ButtonVariantOption = "solid" | "gradient" | "glass" | "outline-glow" | "3d";

export interface ComponentStyleConfig {
  borderRadius?: BorderRadiusOption;
  elevation?: ElevationShadowOption;
  buttonRadius?: ButtonRadiusOption;
  buttonPadding?: ButtonPaddingOption;
  buttonVariant?: ButtonVariantOption;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  industry: string;
  conversionVars: ConversionVariables;
  styleConfig: {
    palette: ColorPalette;
    typography: TypographyPair;
    globalVibe: string;
    componentStyles?: ComponentStyleConfig;
  };
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  history: ProjectHistoryLog[];
}

export interface GoogleFontOption {
  family: string;
  category: "sans-serif" | "serif" | "display" | "monospace";
  description: string;
}
