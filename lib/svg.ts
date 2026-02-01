import { RETRO_COLORS } from "./constants";

export function lineChartSVG(data: number[], title: string = "Daily Coding"): string {
  const max = Math.max(...data, 1);

  const points = data.map((v, i) => {
    const x = 40 + i * 40;
    const y = 110 - (v / max) * 60;
    return `${x},${y}`;
  }).join(" ");

  return `
  <svg width="360" height="140" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
    <rect width="100%" height="100%" rx="4" fill="${RETRO_COLORS.DARK_BG}" stroke="${RETRO_COLORS.BORDER_COLOR}" stroke-width="2"/>
    <text x="20" y="24" fill="${RETRO_COLORS.MATRIX_GREEN}" font-size="12" font-family="monospace" font-weight="bold">
      ${title.toUpperCase()}
    </text>

    <polyline
      fill="none"
      stroke="${RETRO_COLORS.MATRIX_GREEN}"
      stroke-width="2"
      points="${points}"
      style="shape-rendering: crispEdges;"
    />

    ${points.split(" ").map(p => {
      const [x, y] = p.split(",");
      return `<rect x="${Number(x) - 4}" y="${Number(y) - 4}" width="8" height="8" fill="${RETRO_COLORS.MATRIX_GREEN}" style="shape-rendering: crispEdges;"/>`;
    }).join("")}
  </svg>
  `;
}

export function streakSVG(streak: number): string {
  return `
  <svg width="300" height="120" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
    <rect width="100%" height="100%" rx="4" fill="${RETRO_COLORS.DARK_BG}" stroke="${RETRO_COLORS.BORDER_COLOR}" stroke-width="2"/>

    <text x="20" y="36" fill="${RETRO_COLORS.MATRIX_GREEN}" font-size="14" font-family="monospace" font-weight="bold">
      CODING STREAK
    </text>

    <text x="20" y="80"
      font-size="24"
      font-family="monospace"
      font-weight="bold"
      fill="${RETRO_COLORS.ORANGE}">
      🔥 ${streak} DAYS
    </text>
  </svg>
  `;
}
