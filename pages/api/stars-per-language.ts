import { NextApiRequest, NextApiResponse } from "next";
import { getLanguageStats } from "../../lib/github";
import { GREEN_COLOR_ARRAY, SVG_FONT_CSS } from "../../lib/constants";

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
        color: GREEN_COLOR_ARRAY[index % GREEN_COLOR_ARRAY.length],
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
      const endAngle = startAngle + angle;
      currentAngle = endAngle;

      const largeArcFlag = angle > Math.PI ? 1 : 0;

      // Calculate points for the donut segment
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);
      const x3 = cx + innerRadius * Math.cos(endAngle);
      const y3 = cy + innerRadius * Math.sin(endAngle);
      const x4 = cx + innerRadius * Math.cos(startAngle);
      const y4 = cy + innerRadius * Math.sin(startAngle);

      const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;

      // Calculate label position
      const labelAngle = startAngle + angle / 2;
      const labelRadius = (radius + innerRadius) / 2;
      const labelX = cx + labelRadius * Math.cos(labelAngle);
      const labelY = cy + labelRadius * Math.sin(labelAngle);

      return `
        <g>
          <path
            d="${pathData}"
            fill="${lang.color}"
            opacity="0.9"
            stroke="#000000"
            stroke-width="1"
          />
          ${lang.value > total * 0.05 ? `
          <text
            x="${labelX}"
            y="${labelY}"
            fill="#89c201"
            font-size="10"
            font-family="'Determination', 'Retro Gaming', monospace"
            text-anchor="middle"
            font-weight="bold"
          >
            ${lang.name}
          </text>
          <text
            x="${labelX}"
            y="${labelY + 12}"
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
        <defs>
          <style>${SVG_FONT_CSS}</style>
        </defs>
        <rect width="100%" height="100%" rx="4" fill="#28370d" stroke="#000000" stroke-width="2"/>

        <text x="20" y="24" fill="#89c201" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
          STARS PER LANGUAGE
        </text>

        ${segments}
      </svg>
    `;

    res.status(200).send(svg);
  } catch (error) {
    console.error('Stars per Language API Error:', error);

    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('rate limit exceeded')) {
      // Return fallback data when rate limited
      const fallbackLanguages: LanguageData[] = [
        { name: 'Python', value: 234, color: GREEN_COLOR_ARRAY[0] },
        { name: 'JavaScript', value: 189, color: GREEN_COLOR_ARRAY[1] },
        { name: 'TypeScript', value: 156, color: GREEN_COLOR_ARRAY[2] },
        { name: 'Go', value: 123, color: GREEN_COLOR_ARRAY[3] },
        { name: 'Rust', value: 98, color: GREEN_COLOR_ARRAY[4] },
        { name: 'HTML', value: 67, color: GREEN_COLOR_ARRAY[5] },
      ];

      const width = 500;
      const height = 320;
      const cx = width / 2;
      const cy = height / 2 + 20;
      const radius = 90;
      const innerRadius = 45;

      const total = fallbackLanguages.reduce((sum, lang) => sum + lang.value, 0);
      let currentAngle = -Math.PI / 2;

      const segments = fallbackLanguages.map((lang, i) => {
        const angle = (lang.value / total) * 2 * Math.PI;
        const startAngle = currentAngle;
        const endAngle = startAngle + angle;
        currentAngle = endAngle;

        const largeArcFlag = angle > Math.PI ? 1 : 0;

        // Calculate points for the donut segment
        const x1 = cx + radius * Math.cos(startAngle);
        const y1 = cy + radius * Math.sin(startAngle);
        const x2 = cx + radius * Math.cos(endAngle);
        const y2 = cy + radius * Math.sin(endAngle);
        const x3 = cx + innerRadius * Math.cos(endAngle);
        const y3 = cy + innerRadius * Math.sin(endAngle);
        const x4 = cx + innerRadius * Math.cos(startAngle);
        const y4 = cy + innerRadius * Math.sin(startAngle);

        const pathData = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;

        const labelAngle = startAngle + angle / 2;
        const labelRadius = (radius + innerRadius) / 2;
        const labelX = cx + labelRadius * Math.cos(labelAngle);
        const labelY = cy + labelRadius * Math.sin(labelAngle);

        return `
          <g>
            <path
              d="${pathData}"
              fill="${lang.color}"
              opacity="0.9"
              stroke="#000000"
              stroke-width="1"
            />
            ${lang.value > total * 0.05 ? `
            <text
              x="${labelX}"
              y="${labelY}"
              fill="#89c201"
              font-size="10"
              font-family="'Determination', 'Retro Gaming', monospace"
              text-anchor="middle"
              font-weight="bold"
            >
              ${lang.name}
            </text>
            <text
              x="${labelX}"
              y="${labelY + 12}"
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
          <defs>
            <style>${SVG_FONT_CSS}</style>
          </defs>
          <rect width="100%" height="100%" rx="4" fill="#28370d" stroke="#000000" stroke-width="2"/>

          <text x="20" y="24" fill="#89c201" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
            STARS PER LANGUAGE (RATE LIMITED)
          </text>

          ${segments}
        </svg>
      `;

      return res.status(200).send(svg);
    }

    // For other errors, return error message
    const errorSvg = `
      <svg width="500" height="320" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" rx="4" fill="#28370d" stroke="#000000" stroke-width="2"/>
        <text x="20" y="24" fill="#ff0000" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
          STARS PER LANGUAGE - ERROR
        </text>
        <text x="20" y="50" fill="#ffffff" font-size="12" font-family="'Determination', 'Retro Gaming', monospace">
          Failed to load data: ${(error as Error).message}
        </text>
      </svg>
    `;

    res.status(200).send(errorSvg);
  }
}
