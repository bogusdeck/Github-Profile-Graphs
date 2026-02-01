import { NextApiRequest, NextApiResponse } from "next";

interface Skill {
  name: string;
  value: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-cache");

  const skills: Skill[] = [
    { name: "Python", value: 90 },
    { name: "Django", value: 85 },
    { name: "JS", value: 70 },
    { name: "SQL", value: 75 },
    { name: "AWS", value: 60 },
  ];

  const cx = 150;
  const cy = 150;
  const radius = 80;

  const angleStep = (2 * Math.PI) / skills.length;

  const points = skills.map((s, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (s.value / 100) * radius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  const svg = `
  <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" rx="14" fill="#020617"/>

    <polygon
      points="${points}"
      fill="rgba(56,189,248,0.4)"
      stroke="#38bdf8"
      stroke-width="2"
    />

    ${skills.map((s, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + (radius + 20) * Math.cos(angle);
      const y = cy + (radius + 20) * Math.sin(angle);
      return `
        <text x="${x}" y="${y}" fill="#e5e7eb" font-size="11"
          font-family="monospace" text-anchor="middle">
          ${s.name}
        </text>
      `;
    }).join("")}
  </svg>
  `;

  res.status(200).send(svg);
}
