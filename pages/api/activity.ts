import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

  const data: number[] = [3, 6, 4, 8, 5, 9, 7]; // mock activity data
  const max = Math.max(...data);

  const bars = data.map((value, i) => {
    const height = (value / max) * 80;
    const x = 20 + i * 40;
    const y = 100 - height;

    return `
      <rect
        x="${x}"
        y="${y}"
        width="24"
        height="${height}"
        rx="6"
        fill="url(#grad)"
      />
    `;
  }).join("");

  const svg = `
    <svg width="350" height="120" viewBox="0 0 350 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7c3aed"/>
          <stop offset="100%" stop-color="#22d3ee"/>
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" rx="12" fill="#0f172a"/>

      <text x="20" y="20" fill="#e5e7eb" font-size="14" font-family="'Minecrafter', 'Retro Gaming', monospace">
        Weekly Activity
      </text>

      ${bars}
    </svg>
  `;

  res.status(200).send(svg);
}
