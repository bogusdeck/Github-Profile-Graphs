// Custom green color palette
export const RETRO_COLORS = {
  // Primary colors
  MATRIX_GREEN: "#89c201",
  BRIGHT_YELLOW: "#FFFF00",
  CYAN: "#89c201",
  MAGENTA: "#FF00FF",
  ORANGE: "#c52f17",
  WHITE: "#FFFFFF",
  CYAN_DARK: "#6a9a0a",
  CYAN_DARKER: "#4a6a08",
  CYAN_LIGHT: "#a5d234",

  // Secondary colors
  PINK: "#FF0080",
  MINT_GREEN: "#00FF80",
  LIME_GREEN: "#89c201",
  LIGHT_YELLOW: "#FFFF80",
  ACCENT_RED: "#c52f17",

  // Background colors
  DARK_BG: "#28370d",
  BORDER_COLOR: "#2a3e0d",
  BLACK: "#1a2508",
} as const;

// Vibrant Retro Pixel Color Palette (from user's color grid)
export const VIBRANT_RETRO_COLORS = {
  // Row 1 - Reds/Oranges/Yellows
  HOT_PINK: "#FF4D6D",
  CORAL: "#FF8C42",
  ORANGE_YELLOW: "#FFB347",
  GOLD: "#FFD700",
  BRIGHT_YELLOW: "#FFFF00",

  // Row 2 - Purples/Pinks
  PURPLE: "#9D4EDD",
  MAGENTA_PINK: "#E83F6F",
  PINK: "#FF6B9D",
  SALMON: "#FF8E72",
  ORANGE: "#FFA647",

  // Row 3 - Blues/Purples/Pinks
  BLUE: "#5A4FCF",
  LAVENDER: "#B388FF",
  BABY_PINK: "#FF9FF3",
  LIGHT_PINK: "#FFC8DD",
  PEACH: "#FFE5D9",

  // Row 4 - Blues/Teals/Mints
  PERIWINKLE: "#8B8CFF",
  CYAN: "#00D9FF",
  TEAL: "#00F5D4",
  MINT: "#A0FFB0",
  LIME: "#D4FF9E",

  // Row 5 - Greens/Blues
  SKY_BLUE: "#00A8E8",
  EMERALD: "#00D68F",
  LIME_GREEN: "#4DFF00",
  BRIGHT_LIME: "#ADFF02",
  YELLOW_GREEN: "#D9FF00",
} as const;

// Green-themed color array for graphs
export const GREEN_COLOR_ARRAY = [
  "#89c201", // Light green
  "#a5d234", // Lighter green
  "#6a9a0a", // Dark green
  "#4a6a08", // Darker green
  "#1a2508", // Black green
  "#89c201", // Light green (repeat)
  "#a5d234", // Lighter green (repeat)
  "#6a9a0a", // Dark green (repeat)
  "#4a6a08", // Darker green (repeat)
  "#1a2508", // Black green (repeat)
] as const;

// Color array for cycling through in graphs
export const VIBRANT_COLOR_ARRAY = [
  VIBRANT_RETRO_COLORS.HOT_PINK,
  VIBRANT_RETRO_COLORS.CORAL,
  VIBRANT_RETRO_COLORS.ORANGE_YELLOW,
  VIBRANT_RETRO_COLORS.GOLD,
  VIBRANT_RETRO_COLORS.BRIGHT_YELLOW,
  VIBRANT_RETRO_COLORS.PURPLE,
  VIBRANT_RETRO_COLORS.MAGENTA_PINK,
  VIBRANT_RETRO_COLORS.PINK,
  VIBRANT_RETRO_COLORS.SALMON,
  VIBRANT_RETRO_COLORS.ORANGE,
  VIBRANT_RETRO_COLORS.BLUE,
  VIBRANT_RETRO_COLORS.LAVENDER,
  VIBRANT_RETRO_COLORS.BABY_PINK,
  VIBRANT_RETRO_COLORS.LIGHT_PINK,
  VIBRANT_RETRO_COLORS.PEACH,
  VIBRANT_RETRO_COLORS.PERIWINKLE,
  VIBRANT_RETRO_COLORS.CYAN,
  VIBRANT_RETRO_COLORS.TEAL,
  VIBRANT_RETRO_COLORS.MINT,
  VIBRANT_RETRO_COLORS.LIME,
  VIBRANT_RETRO_COLORS.SKY_BLUE,
  VIBRANT_RETRO_COLORS.EMERALD,
  VIBRANT_RETRO_COLORS.LIME_GREEN,
  VIBRANT_RETRO_COLORS.BRIGHT_LIME,
  VIBRANT_RETRO_COLORS.YELLOW_GREEN,
] as const;

// Language color mappings with Nokia 3310 green theme
export const LANGUAGE_COLORS = {
  TypeScript: RETRO_COLORS.LIME_GREEN,
  JavaScript: RETRO_COLORS.CYAN_DARK,
  Python: RETRO_COLORS.CYAN_LIGHT,
  HTML: RETRO_COLORS.ORANGE,
  CSS: RETRO_COLORS.MAGENTA,
  Shell: RETRO_COLORS.WHITE,
  Go: RETRO_COLORS.CYAN_DARKER,
  "C++": RETRO_COLORS.MINT_GREEN,
  Lua: RETRO_COLORS.PINK,
  Other: RETRO_COLORS.WHITE,
} as const;

// Repository color palette with Nokia 3310 green theme
export const REPO_COLORS = [
  RETRO_COLORS.LIME_GREEN,
  RETRO_COLORS.CYAN_DARK,
  RETRO_COLORS.CYAN_DARKER,
  RETRO_COLORS.CYAN_LIGHT,
  RETRO_COLORS.MAGENTA,
  RETRO_COLORS.ORANGE,
  RETRO_COLORS.WHITE,
  RETRO_COLORS.MINT_GREEN,
  RETRO_COLORS.PINK,
  RETRO_COLORS.LIGHT_YELLOW,
] as const;

// SVG embedded font CSS - Using local retro pixel fonts
export const SVG_FONT_CSS = `
  @font-face {
    font-family: 'Retro Gaming';
    src: url('https://raw.githubusercontent.com/bogusdeck/bogusdeck-graph/main/public/fonts/RetroGaming.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Determination';
    src: url('https://raw.githubusercontent.com/bogusdeck/bogusdeck-graph/main/public/fonts/determination.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Minecrafter';
    src: url('https://raw.githubusercontent.com/bogusdeck/bogusdeck-graph/main/public/fonts/Minecrafter-MA3Dw.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }
`;
