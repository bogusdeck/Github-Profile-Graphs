import { NextApiRequest, NextApiResponse } from "next";
import { getLanguageStats } from "../../../lib/github";
import { GREEN_COLOR_ARRAY, SVG_FONT_CSS } from "../../../lib/constants";

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
        color: GREEN_COLOR_ARRAY[index % GREEN_COLOR_ARRAY.length],
      }))
      .filter(lang => lang.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 for README

    const width = 480;
    const height = 280;
    const margin = { top: 30, right: 20, bottom: 30, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const barHeight = chartHeight / languages.length * 0.7;
    const barSpacing = chartHeight / languages.length * 0.3;
    const maxValue = languages.length > 0 ? Math.max(...languages.map(lang => lang.value)) : 1;

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
            fill="#89c201"
            font-size="11"
            font-family="'Determination', 'Retro Gaming', monospace"
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
            font-family="'Determination', 'Retro Gaming', monospace"
            font-weight="bold"
          >
            ${lang.value}
          </text>
        </g>
      `;
    }).join("");

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
        <defs>
          <style>${SVG_FONT_CSS}</style>
        </defs>
        <rect width="100%" height="100%" rx="4" fill="#28370d" stroke="#000000" stroke-width="2"/>
        
        <text x="20" y="20" fill="#89c201" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
          🗂️ REPOS PER LANGUAGE
        </text>

        ${bars}
        
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

    res.status(200).send(svg);
  } catch (error) {
    res.status(200).send("<!-- Error loading real data -->");
  }
}
