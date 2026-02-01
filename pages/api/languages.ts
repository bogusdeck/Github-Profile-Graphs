import { NextApiRequest, NextApiResponse } from "next";
import { getLanguageStats } from "../../lib/github";
import { LANGUAGE_COLORS } from "../../lib/constants";

interface Language {
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
    const languages: Language[] = Object.entries(languageStats)
      .map(([name, stats]: [string, any]) => ({
        name,
        value: Math.round((stats.totalBytes / Object.values(languageStats).reduce((sum: number, s: any) => sum + s.totalBytes, 0)) * 100),
        color: LANGUAGE_COLORS[name as keyof typeof LANGUAGE_COLORS] || LANGUAGE_COLORS.Other,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const width = 500;
    const height = 300;
    const margin = { top: 40, right: 30, bottom: 60, left: 40 };
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
            fill="#00ff41"
            font-size="10"
            font-family="monospace"
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
            font-family="monospace"
            text-anchor="middle"
            font-weight="bold"
          >
            ${lang.value}%
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
          stroke="#16213e"
          stroke-width="1"
          opacity="0.3"
        />
        <text
          x="${margin.left - 10}"
          y="${y + 3}"
          fill="#00ff41"
          font-size="9"
          font-family="monospace"
          text-anchor="end"
        >
          ${value}%
        </text>
      `;
    }).join("");

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
        <rect width="100%" height="100%" rx="4" fill="#1a1a2e" stroke="#16213e" stroke-width="2"/>
        
        <text x="20" y="24" fill="#00ff41" font-size="14" font-family="monospace" font-weight="bold">
          LANGUAGES USED
        </text>

        ${gridLines}
        ${bars}
        
        <line
          x1="${margin.left}"
          y1="${margin.top + chartHeight}"
          x2="${width - margin.right}"
          y2="${margin.top + chartHeight}"
          stroke="#00ff41"
          stroke-width="2"
        />
        <line
          x1="${margin.left}"
          y1="${margin.top}"
          x2="${margin.left}"
          y2="${margin.top + chartHeight}"
          stroke="#00ff41"
          stroke-width="2"
        />
      </svg>
    `;

    res.status(200).send(svg);
  } catch (error) {
    console.error('Languages API Error:', error);
    // Send a fallback SVG with error message
    const fallbackSvg = `
      <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" rx="4" fill="#1a1a2e" stroke="#16213e" stroke-width="2"/>
        <text x="20" y="24" fill="#ff0000" font-size="14" font-family="monospace" font-weight="bold">
          LANGUAGES USED - ERROR
        </text>
        <text x="20" y="50" fill="#ffffff" font-size="12" font-family="monospace">
          Failed to load data: ${(error as Error).message}
        </text>
      </svg>
    `;
    res.status(200).send(fallbackSvg);
  }
}
