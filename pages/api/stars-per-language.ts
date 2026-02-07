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

    // Convert to language array with star counts
    const languages: LanguageData[] = Object.entries(languageStats)
      .map(([name, stats]: [string, any], index: number) => ({
        name,
        value: stats.stars,
        color: VIBRANT_COLOR_ARRAY[index % VIBRANT_COLOR_ARRAY.length],
      }))
      .filter(lang => lang.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6); // Top 6 languages

    const width = 500;
    const height = 320;
    const cx = width / 2;
    const cy = height / 2 + 20;
    const radius = 90;
    const innerRadius = 45;

    const total = languages.reduce((sum, lang) => sum + lang.value, 0);
    let currentAngle = -Math.PI / 2;

    const segments = languages.map((lang, i) => {
      const angle = (lang.value / total) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      
      const x3 = cx + innerRadius * Math.cos(startAngle);
      const y3 = cy + innerRadius * Math.sin(startAngle);
      const x4 = cx + innerRadius * Math.cos(endAngle);
      const y4 = cy + innerRadius * Math.sin(endAngle);
      
      const largeArcFlag = angle > Math.PI ? 1 : 0;
      
      const path = `
        M ${x3} ${y3}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${x4} ${y4}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x3} ${y3}
      `;
      
      // Calculate label position
      const labelAngle = startAngle + angle / 2;
      const labelRadius = (radius + innerRadius) / 2;
      const labelX = cx + labelRadius * Math.cos(labelAngle);
      const labelY = cy + labelRadius * Math.sin(labelAngle);
      
      currentAngle = endAngle;

      return `
        <g>
          <path
            d="${path}"
            fill="${lang.color}"
            opacity="0.9"
            style="shape-rendering: crispEdges;"
          />
          ${lang.value > total * 0.05 ? `
            <text
              x="${labelX}"
              y="${labelY + 3}"
              fill="#ffffff"
              font-size="10"
              font-family="'Determination', 'Retro Gaming', monospace"
              text-anchor="middle"
              font-weight="bold"
            >
              ${lang.name}
            </text>
            <text
              x="${labelX}"
              y="${labelY + 15}"
              fill="#ffffff"
              font-size="9"
              font-family="'Determination', 'Retro Gaming', monospace"
              text-anchor="middle"
            >
              ${lang.value}
            </text>
          ` : ''}
        </g>
      `;
    }).join("");

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
        <rect width="100%" height="100%" rx="4" fill="#1a1a2e" stroke="#16213e" stroke-width="2"/>
        
        <text x="20" y="24" fill="#00ff41" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
          STARS PER LANGUAGE
        </text>

        ${segments}
      </svg>
    `;

    res.status(200).send(svg);
  } catch (error) {
    res.status(200).send("<!-- Error loading real data -->");
  }
}
