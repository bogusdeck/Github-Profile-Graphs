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
    { name: "bogusdeck.github.io", value: 342, color: REPO_COLORS[0] },
    { name: "sh-plugin", value: 278, color: REPO_COLORS[1] },
    { name: "e-commerce-flask-app", value: 234, color: REPO_COLORS[2] },
    { name: "Tamely", value: 189, color: REPO_COLORS[3] },
    { name: "flask-portfolio", value: 156, color: REPO_COLORS[4] },
    { name: "Text-Review-authenticity-checker", value: 123, color: REPO_COLORS[5] },
    { name: "BRS", value: 98, color: REPO_COLORS[6] },
    { name: "whatsapp_chat_exporter", value: 87, color: REPO_COLORS[7] },
    { name: "ReviewReward", value: 65, color: REPO_COLORS[8] },
    { name: "POOPlicious", value: 43, color: REPO_COLORS[9] },
  ];

  const width = 600;
  const height = 350;
  const margin = { top: 20, right: 30, bottom: 80, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const barHeight = chartHeight / repos.length;
  const maxValue = Math.max(...repos.map(repo => repo.value));

  const bars = repos.map((repo, i) => {
    const barWidth = (repo.value / maxValue) * chartWidth;
    const y = margin.top + i * barHeight;

    return `
      <g>
        <rect
          x="${margin.left}"
          y="${y + barHeight * 0.1}"
          width="${barWidth}"
          height="${barHeight * 0.8}"
          fill="${repo.color}"
          opacity="0.8"
          rx="4"
        />
        <text
          x="${margin.left - 10}"
          y="${y + barHeight / 2 + 4}"
          fill="#e5e7eb"
          font-size="9"
          font-family="monospace"
          text-anchor="end"
        >
          ${repo.name.length > 15 ? repo.name.substring(0, 12) + "..." : repo.name}
        </text>
        <text
          x="${margin.left + barWidth + 10}"
          y="${y + barHeight / 2 + 4}"
          fill="#9ca3af"
          font-size="9"
          font-family="monospace"
        >
          ${repo.value}
        </text>
      </g>
    `;
  }).join("");

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" rx="14" fill="#020617"/>
      
      <text x="20" y="24" fill="#e5e7eb" font-size="14" font-family="monospace">
        Commits per Repo (top 10)
      </text>

      ${bars}
      
      <line
        x1="${margin.left}"
        y1="${margin.top}"
        x2="${margin.left}"
        y2="${height - margin.bottom}"
        stroke="#374151"
        stroke-width="1"
      />
    </svg>
  `;

  res.status(200).send(svg);
}
