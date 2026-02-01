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
    { name: "HTML", value: 45, color: LANGUAGE_COLORS.HTML },
    { name: "Shell", value: 38, color: LANGUAGE_COLORS.Shell },
    { name: "JavaScript", value: 62, color: LANGUAGE_COLORS.JavaScript },
    { name: "Python", value: 51, color: LANGUAGE_COLORS.Python },
    { name: "TypeScript", value: 28, color: LANGUAGE_COLORS.TypeScript },
    { name: "CSS", value: 19, color: LANGUAGE_COLORS.CSS },
  ];

  const width = 500;
  const height = 280;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 80;
  const innerRadius = 40;

  const total = languages.reduce((sum, lang) => sum + lang.value, 0);
  let currentAngle = -Math.PI / 2;

  const arcs = languages.map((lang) => {
    const angle = (lang.value / total) * 2 * Math.PI;
    const endAngle = currentAngle + angle;
    
    const x1 = cx + radius * Math.cos(currentAngle);
    const y1 = cy + radius * Math.sin(currentAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    
    const x3 = cx + innerRadius * Math.cos(currentAngle);
    const y3 = cy + innerRadius * Math.sin(currentAngle);
    const x4 = cx + innerRadius * Math.cos(endAngle);
    const y4 = cy + innerRadius * Math.sin(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;

    const path = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x3} ${y3}
      Z
    `;

    const labelAngle = currentAngle + angle / 2;
    const labelX = cx + (radius + 20) * Math.cos(labelAngle);
    const labelY = cy + (radius + 20) * Math.sin(labelAngle);

    currentAngle = endAngle;

    return `
      <g>
        <path d="${path}" fill="${lang.color}" opacity="0.8"/>
        <text
          x="${labelX}"
          y="${labelY}"
          fill="#e5e7eb"
          font-size="10"
          font-family="monospace"
          text-anchor="middle"
        >
          ${lang.name}
        </text>
      </g>
    `;
  }).join("");

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" rx="14" fill="#020617"/>
      
      <text x="20" y="24" fill="#e5e7eb" font-size="14" font-family="monospace">
        Stars per Language
      </text>

      ${arcs}
    </svg>
  `;

  res.status(200).send(svg);
}
