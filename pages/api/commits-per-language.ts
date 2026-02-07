import { NextApiRequest, NextApiResponse } from "next";
import { getCommitsPerLanguage } from "../../lib/github";
import { RETRO_COLORS, VIBRANT_COLOR_ARRAY } from "../../lib/constants";

interface LanguageData {
  name: string;
  value: number;
  color: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  try {
    const commitsData = await getCommitsPerLanguage();

    // Convert to language array with commit counts
    const languages: LanguageData[] = Object.entries(commitsData)
      .map(([name, value]: [string, number], index: number) => ({
        name,
        value,
        color: VIBRANT_COLOR_ARRAY[index % VIBRANT_COLOR_ARRAY.length],
      }))
      .filter(lang => lang.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 9); // Top 9 languages

    const width = 520;
    const height = 320;
    const margin = { top: 40, right: 30, bottom: 60, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const barWidth = chartWidth / languages.length * 0.7;
    const barSpacing = chartWidth / languages.length * 0.3;
    const maxValue = Math.max(...languages.map(lang => lang.value));

    const bars = languages.map((lang, i) => {
      const barHeight = (lang.value / maxValue) * chartHeight;
      const x = margin.left + i * (barWidth + barSpacing) + barSpacing / 2;
      const y = margin.top + chartHeight - barHeight;

      return `
        <g>
          <rect
            x="${x}"
            y="${y}"
            width="${barWidth}"
            height="${barHeight}"
            fill="${lang.color}"
            opacity="0.9"
            style="shape-rendering: crispEdges;"
          />
          <text
            x="${x + barWidth / 2}"
            y="${height - margin.bottom + 15}"
            fill="${RETRO_COLORS.MATRIX_GREEN}"
            font-size="10"
            font-family="'Minecrafter', 'Retro Gaming', monospace"
            text-anchor="middle"
            font-weight="bold"
          >
            ${lang.name}
          </text>
          <text
            x="${x + barWidth / 2}"
            y="${y - 5}"
            fill="${RETRO_COLORS.WHITE}"
            font-size="11"
            font-family="'Minecrafter', 'Retro Gaming', monospace"
            text-anchor="middle"
            font-weight="bold"
          >
            ${lang.value}
          </text>
        </g>
      `;
    }).join("");

    // Add grid lines
    const gridLines = Array.from({ length: 5 }, (_, i) => {
      const y = margin.top + (chartHeight / 4) * i;
      const value = Math.round(maxValue * (1 - i / 4));
      return `
        <line
          x1="${margin.left}"
          y1="${y}"
          x2="${width - margin.right}"
          y2="${y}"
          stroke="${RETRO_COLORS.BORDER_COLOR}"
          stroke-width="1"
          opacity="0.3"
        />
        <text
          x="${margin.left - 10}"
          y="${y + 3}"
          fill="${RETRO_COLORS.MATRIX_GREEN}"
          font-size="9"
          font-family="'Minecrafter', 'Retro Gaming', monospace"
          text-anchor="end"
        >
          ${value}
        </text>
      `;
    }).join("");

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
        <rect width="100%" height="100%" rx="4" fill="${RETRO_COLORS.DARK_BG}" stroke="${RETRO_COLORS.BORDER_COLOR}" stroke-width="2"/>

        <text x="20" y="24" fill="${RETRO_COLORS.MATRIX_GREEN}" font-size="14" font-family="'Minecrafter', 'Retro Gaming', monospace" font-weight="bold">
          COMMITS PER LANGUAGE
        </text>

        ${gridLines}
        ${bars}

        <line
          x1="${margin.left}"
          y1="${margin.top + chartHeight}"
          x2="${width - margin.right}"
          y2="${margin.top + chartHeight}"
          stroke="${RETRO_COLORS.MATRIX_GREEN}"
          stroke-width="2"
        />
        <line
          x1="${margin.left}"
          y1="${margin.top}"
          x2="${margin.left}"
          y2="${margin.top + chartHeight}"
          stroke="${RETRO_COLORS.MATRIX_GREEN}"
          stroke-width="2"
        />
      </svg>
    `;

    res.status(200).send(svg);
  } catch (error) {
    res.status(200).send("<!-- Error loading real data -->");
  }
}
