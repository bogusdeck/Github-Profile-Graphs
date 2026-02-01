import { NextApiRequest, NextApiResponse } from "next";
import { LANGUAGE_COLORS } from "../../lib/constants";

interface LanguageData {
  name: string;
  value: number;
  color: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

  const languages: LanguageData[] = [
    { name: "Python", value: 12, color: LANGUAGE_COLORS.Python },
    { name: "HTML", value: 8, color: LANGUAGE_COLORS.HTML },
    { name: "CSS", value: 6, color: LANGUAGE_COLORS.CSS },
    { name: "JavaScript", value: 15, color: LANGUAGE_COLORS.JavaScript },
    { name: "Lua", value: 3, color: LANGUAGE_COLORS.Lua },
    { name: "C++", value: 4, color: LANGUAGE_COLORS["C++"] },
    { name: "TypeScript", value: 7, color: LANGUAGE_COLORS.TypeScript },
    { name: "Go", value: 5, color: LANGUAGE_COLORS.Go },
    { name: "Shell", value: 9, color: LANGUAGE_COLORS.Shell },
  ];

  const width = 500;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 60, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const barWidth = chartWidth / languages.length;
  const maxValue = Math.max(...languages.map(lang => lang.value));

  const bars = languages.map((lang, i) => {
    const barHeight = (lang.value / maxValue) * chartHeight;
    const x = margin.left + i * barWidth;
    const y = margin.top + chartHeight - barHeight;

    return `
      <g>
        <rect
          x="${x + barWidth * 0.1}"
          y="${y}"
          width="${barWidth * 0.8}"
          height="${barHeight}"
          fill="${lang.color}"
          opacity="0.8"
          rx="4"
        />
        <text
          x="${x + barWidth / 2}"
          y="${height - margin.bottom + 15}"
          fill="#e5e7eb"
          font-size="10"
          font-family="monospace"
          text-anchor="middle"
          transform="rotate(-45 ${x + barWidth / 2} ${height - margin.bottom + 15})"
        >
          ${lang.name}
        </text>
        <text
          x="${x + barWidth / 2}"
          y="${y - 5}"
          fill="#9ca3af"
          font-size="9"
          font-family="monospace"
          text-anchor="middle"
        >
          ${lang.value}
        </text>
      </g>
    `;
  }).join("");

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" rx="14" fill="#020617"/>
      
      <text x="20" y="24" fill="#e5e7eb" font-size="14" font-family="monospace">
        Repos per Language
      </text>

      ${bars}
      
      <line
        x1="${margin.left}"
        y1="${margin.top + chartHeight}"
        x2="${width - margin.right}"
        y2="${margin.top + chartHeight}"
        stroke="#374151"
        stroke-width="1"
      />
    </svg>
  `;

  res.status(200).send(svg);
}
