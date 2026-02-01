import { NextApiRequest, NextApiResponse } from "next";
import { REPO_COLORS } from "../../lib/constants";

interface RepoData {
  name: string;
  value: number;
  color: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");

  const repos: RepoData[] = [
    { name: "VDAY", value: 142, color: REPO_COLORS[0] },
    { name: "Kitty-dotfiles", value: 98, color: REPO_COLORS[1] },
    { name: "Tamely", value: 76, color: REPO_COLORS[2] },
    { name: "bogusdeck.github.io", value: 65, color: REPO_COLORS[3] },
    { name: "Digital-apology-letter", value: 54, color: REPO_COLORS[4] },
    { name: "flask-portfolio", value: 43, color: REPO_COLORS[5] },
    { name: "Selenium-prac", value: 32, color: REPO_COLORS[6] },
  ];

  const width = 480;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2 + 20;
  const maxRadius = 60;

  const maxValue = Math.max(...repos.map(repo => repo.value));

  const stars = repos.map((repo, i) => {
    const angle = (i / repos.length) * 2 * Math.PI - Math.PI / 2;
    const radius = Math.sqrt(repo.value / maxValue) * maxRadius;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    // Create star shape
    const starPoints = [];
    for (let j = 0; j < 10; j++) {
      const angle = (j * Math.PI) / 5 - Math.PI / 2;
      const r = j % 2 === 0 ? radius : radius * 0.5;
      starPoints.push(`${x + r * Math.cos(angle)},${y + r * Math.sin(angle)}`);
    }

    return `
      <g>
        <polygon
          points="${starPoints.join(' ')}"
          fill="${repo.color}"
          opacity="0.8"
        />
        <text
          x="${x}"
          y="${y + radius + 15}"
          fill="#e5e7eb"
          font-size="8"
          font-family="monospace"
          text-anchor="middle"
        >
          ${repo.name.length > 12 ? repo.name.substring(0, 9) + "..." : repo.name}
        </text>
        <text
          x="${x}"
          y="${y + radius + 25}"
          fill="#9ca3af"
          font-size="7"
          font-family="monospace"
          text-anchor="middle"
        >
          ${repo.value} ⭐
        </text>
      </g>
    `;
  }).join("");

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" rx="14" fill="#020617"/>
      
      <text x="20" y="24" fill="#e5e7eb" font-size="14" font-family="monospace">
        Stars per Repo
      </text>

      ${stars}
    </svg>
  `;

  res.status(200).send(svg);
}
