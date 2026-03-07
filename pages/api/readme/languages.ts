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

    // Convert to language array with percentages
    const languages: LanguageData[] = Object.entries(languageStats)
      .map(([name, stats]: [string, any], index: number) => ({
        name,
        value: Math.round((stats.totalBytes / Object.values(languageStats).reduce((sum: number, s: any) => sum + s.totalBytes, 0)) * 100),
        color: GREEN_COLOR_ARRAY[index % GREEN_COLOR_ARRAY.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 for README

    const width = 480;
    const height = 280;
    const margin = { top: 30, right: 20, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const barWidth = chartWidth / languages.length * 0.7;
    const maxValue = languages.length > 0 ? Math.max(...languages.map(lang => lang.value)) : 1;

    const bars = languages.map((lang, i) => {
      const barHeight = (lang.value / maxValue) * chartHeight;
      const x = margin.left + i * (chartWidth / languages.length) + (chartWidth / languages.length - barWidth) / 2;
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
            fill="#89c201"
            font-size="10"
            font-family="'Determination', 'Retro Gaming', monospace"
            text-anchor="middle"
            font-weight="bold"
          >
            ${lang.name}
          </text>
          <text
            x="${x + barWidth / 2}"
            y="${y - 5}"
            fill="#ffffff"
            font-size="11"
            font-family="'Determination', 'Retro Gaming', monospace"
            text-anchor="middle"
            font-weight="bold"
          >
            ${lang.value}%
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
          📊 LANGUAGES USED
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
