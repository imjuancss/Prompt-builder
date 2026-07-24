// Utility to dynamically load Google Fonts into the browser DOM

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontFamily: string) {
  if (!fontFamily || loadedFonts.has(fontFamily)) return;

  const fontId = `google-font-${fontFamily.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(fontId)) {
    loadedFonts.add(fontFamily);
    return;
  }

  const link = document.createElement("link");
  link.id = fontId;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontFamily);
}

export function loadGoogleFonts(fonts: string[]) {
  fonts.forEach((f) => loadGoogleFont(f));
}
