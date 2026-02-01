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
    
    // Calculate total bytes and convert to percentages
    const totalBytes = Object.values(languageStats).reduce(
      (sum: number, stats: any) => sum + stats.totalBytes, 
      0
    );

    // Convert to language array with percentages
    const languages: Language[] = Object.entries(languageStats)
      .map(([name, stats]: [string, any]) => ({
        name,
        value: Math.round((stats.totalBytes / totalBytes) * 100),
        color: LANGUAGE_COLORS[name as keyof typeof LANGUAGE_COLORS] || LANGUAGE_COLORS.Other,
      }))
      .filter(lang => lang.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 languages

    const width = 500;
    const height = 240;
    const barHeight = 20;
    const barSpacing = 10;
    const maxValue = Math.max(...languages.map(lang => lang.value));

    const bars = languages.map((lang, i) => {
      const barWidth = (lang.value / maxValue) * 250;
      const y = 40 + i * (barHeight + barSpacing);

      return `
        <g>
          <rect
            x="120"
            y="${y}"
            width="${barWidth}"
            height="${barHeight}"
            fill="${lang.color}"
            style="shape-rendering: crispEdges;"
          />
          <text
            x="110"
            y="${y + barHeight - 2}"
            fill="#ffffff"
            font-size="12"
            font-family="monospace"
            text-anchor="end"
            font-weight="bold"
          >
            ${lang.name.toUpperCase()}
          </text>
          <text
            x="${120 + barWidth + 10}"
            y="${y + barHeight - 2}"
            fill="#ffffff"
            font-size="11"
            font-family="monospace"
          >
            ${lang.value}%
          </text>
        </g>
      `;
    }).join("");

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
        <rect width="100%" height="100%" rx="4" fill="#1a1a2e" stroke="#16213e" stroke-width="2"/>
        
        <text x="20" y="24" fill="#00ff41" font-size="14" font-family="monospace" font-weight="bold">
          LANGUAGES USED
        </text>

        ${bars}
      </svg>
    `;

    res.status(200).send(svg);
  } catch (error) {
    // Fallback to demo data if API fails
    const languages: Language[] = [
      { name: "TypeScript", value: 35, color: LANGUAGE_COLORS.TypeScript },
      { name: "JavaScript", value: 25, color: LANGUAGE_COLORS.JavaScript },
      { name: "Python", value: 20, color: LANGUAGE_COLORS.Python },
      { name: "CSS", value: 10, color: LANGUAGE_COLORS.CSS },
      { name: "HTML", value: 6, color: LANGUAGE_COLORS.HTML },
      { name: "Other", value: 4, color: LANGUAGE_COLORS.Other },
    ];

    // Generate fallback SVG...
    res.status(200).send("<!-- Error loading real data -->");
  }
}
