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
    { name: "HTML", value: 234, color: LANGUAGE_COLORS.HTML },
    { name: "Python", value: 456, color: LANGUAGE_COLORS.Python },
    { name: "JavaScript", value: 789, color: LANGUAGE_COLORS.JavaScript },
    { name: "CSS", value: 123, color: LANGUAGE_COLORS.CSS },
    { name: "Shell", value: 89, color: LANGUAGE_COLORS.Shell },
    { name: "Lua", value: 45, color: LANGUAGE_COLORS.Lua },
    { name: "C++", value: 167, color: LANGUAGE_COLORS["C++"] },
    { name: "Go", value: 234, color: LANGUAGE_COLORS.Go },
    { name: "TypeScript", value: 345, color: LANGUAGE_COLORS.TypeScript },
  ];

  const width = 520;
  const height = 320;
  const cx = width / 2;
  const cy = height / 2 + 20;
  const maxRadius = 100;

  const maxValue = Math.max(...languages.map(lang => lang.value));

  const bubbles = languages.map((lang, i) => {
    const angle = (i / languages.length) * 2 * Math.PI - Math.PI / 2;
    const radius = Math.sqrt(lang.value / maxValue) * maxRadius;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    return `
      <g>
        <circle
          cx="${x}"
          cy="${y}"
          r="${radius}"
          fill="${lang.color}"
          opacity="0.7"
        />
        <text
          x="${x}"
          y="${y}"
          fill="#ffffff"
          font-size="11"
          font-family="monospace"
          text-anchor="middle"
          font-weight="bold"
        >
          ${lang.name}
        </text>
        <text
          x="${x}"
          y="${y + 12}"
          fill="#ffffff"
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
        Commits per Language
      </text>

      ${bubbles}
    </svg>
  `;

  res.status(200).send(svg);
}
