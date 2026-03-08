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
    console.log('Raw language stats:', JSON.stringify(languageStats, null, 2));

    // Convert to language array with repository counts
    const languages: LanguageData[] = Object.entries(languageStats)
      .map(([name, stats]: [string, any], index: number) => ({
        name,
        value: stats.repos,
        color: GREEN_COLOR_ARRAY[index % GREEN_COLOR_ARRAY.length],
      }))
      .filter(lang => lang.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 9); // Top 9 languages

    console.log('Filtered languages:', JSON.stringify(languages, null, 2));
    console.log('Languages array length:', languages.length);

    const width = 500;
    const height = 320;
    const margin = { top: 40, right: 30, bottom: 30, left: 120 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const barHeight = chartHeight / languages.length * 0.7;
    const barSpacing = chartHeight / languages.length * 0.3;
    const maxValue = languages.length > 0 ? Math.max(...languages.map(lang => lang.value)) : 1;
    console.log('Max value:', maxValue);

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

    // Add grid lines and x-axis with dates
    const gridLines = Array.from({ length: 4 }, (_, i) => {
      const x = margin.left + (chartWidth / 3) * i;
      const value = Math.round(maxValue * (i / 3));
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

    // Add x-axis with repo counts
    const xAxisLabels = Array.from({ length: 4 }, (_, i) => {
      const x = margin.left + (chartWidth / 3) * i;
      const value = Math.round(maxValue * (i / 3));
      return `
        <text
          x="${x}"
          y="${height - margin.bottom + 15}"
          fill="#89c201"
          font-size="9"
          font-family="'Determination', 'Retro Gaming', monospace"
          text-anchor="middle"
        >
          ${value}
        </text>
      `;
    }).join("");

    const svg = `\n      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">\n        <defs>\n          <style>${SVG_FONT_CSS}</style>\n        </defs>\n        <rect width="100%" height="100%" rx="4" fill="#28370d" stroke="#000000" stroke-width="2"/>

        <text x="20" y="24" fill="#89c201" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
          REPOS PER LANGUAGE
        </text>

        ${gridLines}
        ${xAxisLabels}
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
    console.error('Repos per Language API Error:', error);
    
    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('rate limit exceeded')) {
      // Return fallback data when rate limited
      const fallbackLanguages: LanguageData[] = [
        { name: 'Python', value: 12, color: GREEN_COLOR_ARRAY[0] },
        { name: 'JavaScript', value: 8, color: GREEN_COLOR_ARRAY[1] },
        { name: 'TypeScript', value: 6, color: GREEN_COLOR_ARRAY[2] },
        { name: 'Go', value: 4, color: GREEN_COLOR_ARRAY[3] },
        { name: 'Rust', value: 3, color: GREEN_COLOR_ARRAY[4] },
        { name: 'HTML', value: 2, color: GREEN_COLOR_ARRAY[5] },
      ];

      const width = 500;
      const height = 320;
      const margin = { top: 40, right: 30, bottom: 30, left: 120 };
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;
      const barHeight = chartHeight / fallbackLanguages.length * 0.7;
      const barSpacing = chartHeight / fallbackLanguages.length * 0.3;
      const maxValue = Math.max(...fallbackLanguages.map(lang => lang.value));

      const bars = fallbackLanguages.map((lang, i) => {
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

      const gridLines = Array.from({ length: 4 }, (_, i) => {
        const x = margin.left + (chartWidth / 3) * i;
        const value = Math.round(maxValue * (i / 3));
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

      const xAxisLabels = Array.from({ length: 4 }, (_, i) => {
        const x = margin.left + (chartWidth / 3) * i;
        const value = Math.round(maxValue * (i / 3));
        return `
          <text
            x="${x}"
            y="${height - margin.bottom + 15}"
            fill="#89c201"
            font-size="9"
            font-family="'Determination', 'Retro Gaming', monospace"
            text-anchor="middle"
          >
            ${value}
          </text>
        `;
      }).join("");

      const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
          <defs>
            <style>${SVG_FONT_CSS}</style>
          </defs>
          <rect width="100%" height="100%" rx="4" fill="#28370d" stroke="#000000" stroke-width="2"/>

          <text x="20" y="24" fill="#89c201" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
            REPOS PER LANGUAGE (RATE LIMITED)
          </text>

          ${gridLines}
          ${xAxisLabels}
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

      return res.status(200).send(svg);
    }
    
    // For other errors, return error message
    const errorSvg = `
      <svg width="500" height="320" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" rx="4" fill="#28370d" stroke="#000000" stroke-width="2"/>
        <text x="20" y="24" fill="#ff0000" font-size="14" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
          REPOS PER LANGUAGE - ERROR
        </text>
        <text x="20" y="50" fill="#ffffff" font-size="12" font-family="'Determination', 'Retro Gaming', monospace">
          Failed to load data: ${(error as Error).message}
        </text>
      </svg>
    `;
    
    res.status(200).send(errorSvg);
  }
}
