import { RETRO_COLORS } from "./constants";

export function lineChartSVG(data: number[], title: string = "Daily Coding"): string {
  const max = Math.max(...data, 1);
  const width = 450;
  const height = 180;
  const margin = { top: 40, right: 30, bottom: 40, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const points = data.map((v, i) => {
    const x = margin.left + (i / (data.length - 1)) * chartWidth;
    const y = margin.top + chartHeight - (v / max) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  // Generate dates for x-axis (last 7 days)
  const dates = Array.from({ length: data.length }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (data.length - 1 - i));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Generate vertical grid lines
  const gridLines = Array.from({ length: data.length }, (_, i) => {
    const x = margin.left + (i / (data.length - 1)) * chartWidth;
    return `
      <line
        x1="${x}"
        y1="${margin.top}"
        x2="${x}"
        y2="${height - margin.bottom}"
        stroke="#6a9a0a"
        stroke-width="1"
        opacity="0.3"
      />
    `;
  }).join("");

  // Generate x-axis labels
  const xAxisLabels = dates.map((date, i) => {
    const x = margin.left + (i / (data.length - 1)) * chartWidth;
    return `
      <text
        x="${x}"
        y="${height - margin.bottom + 20}"
        fill="#89c201"
        font-size="9"
        font-family="'Determination', 'Retro Gaming', monospace"
        text-anchor="middle"
      >
        ${date}
      </text>
    `;
  }).join("");

  return `
  <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
    <rect width="100%" height="100%" rx="4" fill="#28370d" stroke="#000000" stroke-width="2"/>

    <text x="20" y="24" fill="#89c201" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
      ${title.toUpperCase()}
    </text>

    ${gridLines}

    <polyline
      fill="none"
      stroke="#89c201"
      stroke-width="2"
      points="${points}"
      style="shape-rendering: crispEdges;"
    />

    ${points.split(" ").map(p => {
    const [x, y] = p.split(",");
    return `<rect x="${Number(x) - 4}" y="${Number(y) - 4}" width="8" height="8" fill="#a5d234" style="shape-rendering: crispEdges;"/>`;
  }).join("")}

    ${xAxisLabels}

    <!-- X-axis line -->
    <line
      x1="${margin.left}"
      y1="${height - margin.bottom}"
      x2="${width - margin.right}"
      y2="${height - margin.bottom}"
      stroke="#89c201"
      stroke-width="2"
    />
  </svg>
  `;
}

export function streakSVG(streak: number): string {
  return `
  <svg width="100%" height="100%" viewBox="0 0 400 160" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
    <rect width="100%" height="100%" rx="4" fill="transparent" stroke="#000000" stroke-width="2"/>

    <text x="20" y="36" fill="#89c201" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
      CODING STREAK
    </text>

    <text x="20" y="120"
      font-size="36"
      font-family="'Determination', 'Retro Gaming', monospace"
      font-weight="bold"
      fill="#c52f17">
      ${streak} DAYS
    </text>
  </svg>
  `;
}
