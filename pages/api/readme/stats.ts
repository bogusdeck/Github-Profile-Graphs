import { NextApiRequest, NextApiResponse } from "next";
import { getUserRepositories } from "../../../lib/github";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  try {
    const repos = await getUserRepositories();
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalCommits = repos.reduce((sum, repo) => sum + (repo.commits || 0), 0);
    const totalRepos = repos.length;

    // Calculate current streak (simplified - just using recent activity)
    const today = new Date();
    const streak = repos.some(repo => {
      const lastUpdate = new Date(repo.updated_at);
      const daysDiff = Math.floor((today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 1;
    }) ? 1 : 0;

    const svg = `
      <svg width="500" height="200" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges;">
        <rect width="100%" height="100%" rx="4" fill="#28370d" stroke="#000000" stroke-width="2"/>

        <text x="20" y="30" fill="#89c201" font-size="16" font-family="'Determination', 'Retro Gaming', monospace" font-weight="bold">
          📈 GITHUB STATISTICS
        </text>

        <!-- Stats Grid -->
        <g transform="translate(20, 60)">
          <!-- Total Repos -->
          <rect x="0" y="0" width="140" height="60" rx="3" fill="#1a2508" stroke="#89c201" stroke-width="1"/>
          <text x="70" y="25" fill="#a5d234" font-size="20" font-family="'Determination', 'Retro Gaming', monospace" text-anchor="middle" font-weight="bold">
            ${totalRepos}
          </text>
          <text x="70" y="45" fill="#89c201" font-size="10" font-family="'Determination', 'Retro Gaming', monospace" text-anchor="middle">
            REPOSITORIES
          </text>

          <!-- Total Stars -->
          <rect x="150" y="0" width="140" height="60" rx="3" fill="#1a2508" stroke="#89c201" stroke-width="1"/>
          <text x="220" y="25" fill="#a5d234" font-size="20" font-family="'Determination', 'Retro Gaming', monospace" text-anchor="middle" font-weight="bold">
            ${totalStars}
          </text>
          <text x="220" y="45" fill="#89c201" font-size="10" font-family="'Determination', 'Retro Gaming', monospace" text-anchor="middle">
            TOTAL STARS
          </text>

          <!-- Total Commits -->
          <rect x="300" y="0" width="140" height="60" rx="3" fill="#1a2508" stroke="#89c201" stroke-width="1"/>
          <text x="370" y="25" fill="#a5d234" font-size="20" font-family="'Determination', 'Retro Gaming', monospace" text-anchor="middle" font-weight="bold">
            ${totalCommits}
          </text>
          <text x="370" y="45" fill="#89c201" font-size="10" font-family="'Determination', 'Retro Gaming', monospace" text-anchor="middle">
            COMMITS
          </text>
        </g>
      </svg>
    `;

    res.status(200).send(svg);
  } catch (error) {
    res.status(200).send("<!-- Error loading real data -->");
  }
}
