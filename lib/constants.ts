// Retro 8-bit color palette for terminal theme
export const RETRO_COLORS = {
  // Primary colors
  MATRIX_GREEN: "#00ff41",
  BRIGHT_YELLOW: "#ffff00", 
  CYAN: "#00ffff",
  MAGENTA: "#ff00ff",
  ORANGE: "#ff5500",
  WHITE: "#ffffff",
  
  // Secondary colors
  PINK: "#ff0080",
  MINT_GREEN: "#00ff80",
  LIME_GREEN: "#80ff00",
  LIGHT_YELLOW: "#ffff80",
  
  // Background colors
  DARK_BG: "#1a1a2e",
  BORDER_COLOR: "#16213e",
  BLACK: "#000000",
} as const;

// Language color mappings
export const LANGUAGE_COLORS = {
  TypeScript: RETRO_COLORS.MATRIX_GREEN,
  JavaScript: RETRO_COLORS.BRIGHT_YELLOW,
  Python: RETRO_COLORS.CYAN,
  HTML: RETRO_COLORS.ORANGE,
  CSS: RETRO_COLORS.MAGENTA,
  Shell: RETRO_COLORS.WHITE,
  Go: RETRO_COLORS.LIME_GREEN,
  "C++": RETRO_COLORS.MINT_GREEN,
  Lua: RETRO_COLORS.PINK,
  Other: RETRO_COLORS.WHITE,
} as const;

// Repository color palette for variety
export const REPO_COLORS = [
  RETRO_COLORS.CYAN,
  RETRO_COLORS.BRIGHT_YELLOW,
  RETRO_COLORS.MATRIX_GREEN,
  RETRO_COLORS.MAGENTA,
  RETRO_COLORS.ORANGE,
  RETRO_COLORS.WHITE,
  RETRO_COLORS.LIME_GREEN,
  RETRO_COLORS.PINK,
  RETRO_COLORS.MINT_GREEN,
  RETRO_COLORS.LIGHT_YELLOW,
] as const;
