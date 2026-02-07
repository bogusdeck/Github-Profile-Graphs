import { NextApiRequest, NextApiResponse } from "next";
import { getLanguageStats } from "../../lib/github";
import { VIBRANT_COLOR_ARRAY } from "../../lib/constants";

interface LanguageData {
  name: string;
  value: number;
  color: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  try {
    const languageStats = await getLanguageStats();
    
    // Convert to language array with repository counts
    const languages: LanguageData[] = Object.entries(languageStats)
      .map(([name, stats]: [string, any], index: number) => ({
        name,
        value: stats.repos,
        color: VIBRANT_COLOR_ARRAY[index % VIBRANT_COLOR_ARRAY.length],
      }))
      .filter(lang => lang.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 9); // Top 9 languages

    const width = 500;
    const height = 320;
    const margin = { top: 40, right: 30, bottom: 30, left: 120 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const barHeight = chartHeight / languages.length * 0.7;
    const barSpacing = chartHeight / languages.length * 0.3;
    const maxValue = Math.max(...languages.map(lang => lang.value));

    const bars = languages.map((lang, i) => {
      const barWidth = (lang.value / maxValue) * chartWidth;
      const y = margin.top + i * (barHeight + barSpacing) + barSpacing / 2;

      return `
        <g>
          <rect
            x="${margin.left}"
            y="${y}"
            width="${barWidth}"
            height="${barHeight}"
            fill="${lang.color}"
            opacity="0.9"
            style="shape-rendering: crispEdges;"
          />
          <text
            x="${margin.left - 10}"
            y="${y + barHeight / 2 + 4}"
            fill="#00ff41"
            font-size="11"
            font-family="'Minecrafter', 'Retro Gaming', monospace"
            text-anchor="end"
            font-weight="bold"
          >
            ${lang.name}
          </text>
          <text
            x="${margin.left + barWidth + 10}"
            y="${y + barHeight / 2 + 4}"
            fill="#ffffff"
            font-size="11"
            font-family="'Minecrafter', 'Retro Gaming', monospace"
            font-weight="bold"
          >
            ${lang.value}
          </text>
        </g>
      `;
    }).join("");

    // Add grid lines
    const gridLines = Array.from({ length: 4 }, (_, i) => {
      const x = margin.left + (chartWidth / 3) * i;
      const value = Math.round(maxValue * (i / 3));
      return `
        <line
          x1="${x}"
          y1="${margin.top}"
          x2="${x}"
          y2="${height - margin.bottom}"
          stroke="#16213e"
          stroke-width="1"
          opacity="0.3"
        />
        <text
          x="${x}"
          y="${height - margin.bottom + 15}"
          fill="#00ff41"
          font-size="9"
          font-family="'Minecrafter', 'Retro Gaming', monospace"
          text-anchor="middle"
        >
          ${value}
        </text>
      `;
    }).join("");

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
        <rect width="100%" height="100%" rx="4" fill="#1a1a2e" stroke="#16213e" stroke-width="2"/>
        
        <text x="20" y="24" fill="#00ff41" font-size="14" font-family="'Minecrafter', 'Retro Gaming', monospace" font-weight="bold">
          REPOS PER LANGUAGE
        </text>

        ${gridLines}
        ${bars}
        
        <line
          x1="${margin.left}"
          y1="${margin.top}"
          x2="${margin.left}"
          y2="${height - margin.bottom}"
          stroke="#00ff41"
          stroke-width="2"
        />
        <line
          x1="${margin.left}"
          y1="${height - margin.bottom}"
          x2="${width - margin.right}"
          y2="${height - margin.bottom}"
          stroke="#00ff41"
          stroke-width="2"
        />
      </svg>
    `;

    res.status(200).send(svg);
  } catch (error) {
    res.status(200).send("<!-- Error loading real data -->");
  }
}
