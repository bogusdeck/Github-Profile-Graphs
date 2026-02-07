import { NextApiRequest, NextApiResponse } from "next";
import { getUserRepositories } from "../../lib/github";
import { VIBRANT_COLOR_ARRAY, RETRO_COLORS } from "../../lib/constants";

interface RepoData {
  name: string;
  value: number;
  color: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  try {
    const repos = await getUserRepositories();

    // Convert to chart data with star counts
    const repoData: RepoData[] = repos
      .filter(repo => repo.stargazers_count > 0)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 7)
      .map((repo, index) => ({
        name: repo.name,
        value: repo.stargazers_count,
        color: VIBRANT_COLOR_ARRAY[index % VIBRANT_COLOR_ARRAY.length],
      }));

    const width = 500;
    const height = 280;
    const margin = { top: 40, right: 30, bottom: 30, left: 120 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const barHeight = chartHeight / repoData.length * 0.7;
    const barSpacing = chartHeight / repoData.length * 0.3;
    const maxValue = Math.max(...repoData.map(repo => repo.value));

    const bars = repoData.map((repo, i) => {
      const barWidth = (repo.value / maxValue) * chartWidth;
      const y = margin.top + i * (barHeight + barSpacing) + barSpacing / 2;
      const displayName = repo.name.length > 18 ? repo.name.substring(0, 15) + "..." : repo.name;

      return `
        <g>
          <rect
            x="${margin.left}"
            y="${y}"
            width="${barWidth}"
            height="${barHeight}"
            fill="${repo.color}"
            opacity="0.9"
            style="shape-rendering: crispEdges;"
          />
          <text
            x="${margin.left - 10}"
            y="${y + barHeight / 2 + 4}"
            fill="${RETRO_COLORS.MATRIX_GREEN}"
            font-size="10"
            font-family="'Minecrafter', 'Retro Gaming', monospace"
            text-anchor="end"
            font-weight="bold"
          >
            ${displayName}
          </text>
          <text
            x="${margin.left + barWidth + 10}"
            y="${y + barHeight / 2 + 4}"
            fill="${RETRO_COLORS.WHITE}"
            font-size="11"
            font-family="'Minecrafter', 'Retro Gaming', monospace"
            font-weight="bold"
          >
            ${repo.value} ⭐
          </text>
        </g>
      `;
    }).join("");

    // Add grid lines
    const gridLines = Array.from({ length: 4 }, (_, i) => {
      const x = margin.left + (chartWidth / 3) * i;
      const value = Math.round(maxValue * (i / 3));
      return `
        <line
          x1="${x}"
          y1="${margin.top}"
          x2="${x}"
          y2="${height - margin.bottom}"
          stroke="${RETRO_COLORS.BORDER_COLOR}"
          stroke-width="1"
          opacity="0.3"
        />
        <text
          x="${x}"
          y="${height - margin.bottom + 15}"
          fill="${RETRO_COLORS.MATRIX_GREEN}"
          font-size="9"
          font-family="'Minecrafter', 'Retro Gaming', monospace"
          text-anchor="middle"
        >
          ${value}
        </text>
      `;
    }).join("");

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
        <rect width="100%" height="100%" rx="4" fill="${RETRO_COLORS.DARK_BG}" stroke="${RETRO_COLORS.BORDER_COLOR}" stroke-width="2"/>

        <text x="20" y="24" fill="${RETRO_COLORS.MATRIX_GREEN}" font-size="14" font-family="'Minecrafter', 'Retro Gaming', monospace" font-weight="bold">
          STARS PER REPO
        </text>

        ${gridLines}
        ${bars}

        <line
          x1="${margin.left}"
          y1="${margin.top}"
          x2="${margin.left}"
          y2="${height - margin.bottom}"
          stroke="${RETRO_COLORS.MATRIX_GREEN}"
          stroke-width="2"
        />
        <line
          x1="${margin.left}"
          y1="${height - margin.bottom}"
          x2="${width - margin.right}"
          y2="${height - margin.bottom}"
          stroke="${RETRO_COLORS.MATRIX_GREEN}"
          stroke-width="2"
        />
      </svg>
    `;

    res.status(200).send(svg);
  } catch (error) {
    res.status(200).send("<!-- Error loading real data -->");
  }
}
