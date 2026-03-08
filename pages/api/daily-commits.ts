import { NextApiRequest, NextApiResponse } from "next";
import { getUserRepositories } from "../../lib/github";

interface DailyCommits {
  date: string;
  commits: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  try {
    const repos = await getUserRepositories();

    const fetchCommits = async (days: number) => {
      const dailyCommits: DailyCommits[] = [];
      const today = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format

        let totalCommits = 0;

        for (const repo of repos.slice(0, 10)) { // Limit to 10 repos for performance
          try {
            const commitsUrl = `https://api.github.com/repos/${repo.full_name}/commits?since=${dateStr}T00:00:00Z&until=${dateStr}T23:59:59Z`;
            const response = await fetch(commitsUrl, {
              headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
              },
            });

            if (response.ok) {
              const commits = await response.json();
              totalCommits += commits.length;
            }
          } catch (error) {
            console.error(`Error fetching commits for ${repo.full_name}:`, error);
          }
        }

        dailyCommits.push({
          date: dateStr,
          commits: totalCommits
        });
      }
      return dailyCommits;
    };

    // First try 7 days
    let dailyCommits = await fetchCommits(7);
    const totalCommitsLast7Days = dailyCommits.reduce((sum, day) => sum + day.commits, 0);

    // If no commits in last 7 days, fetch 14 days
    if (totalCommitsLast7Days === 0) {
      dailyCommits = await fetchCommits(14);
    }

    const commitCounts = dailyCommits.map(day => day.commits);
    const maxCommits = Math.max(...commitCounts, 1);
    const width = 400;
    const height = 200;
    const barWidth = width / dailyCommits.length - 10;
    const barSpacing = 10;

    // Generate dates for labels
    const dateLabels = dailyCommits.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });

    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#0a0a0a"/>

  <!-- Title -->
  <text x="${width/2}" y="20" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
    DAILY COMMITS (LAST ${dailyCommits.length} DAYS)
  </text>

  <!-- Grid lines -->
  ${Array.from({length: 5}, (_, i) => {
    const y = 30 + (i * (height - 70) / 4);
    return `<line x1="10" y1="${y}" x2="${width - 10}" y2="${y}" stroke="#1a1a1a" stroke-width="0.5"/>`;
  }).join('')}

  <!-- Bars -->
  ${commitCounts.map((commits, index) => {
    const barHeight = commits > 0 ? (commits / maxCommits) * (height - 70) : 2;
    const x = index * (barWidth + barSpacing) + barSpacing;
    const y = height - 30 - barHeight;

    return `
    <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#2a2a2a"/>
    <text x="${x + barWidth/2}" y="${height - 10}" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="8">
      ${dateLabels[index]}
    </text>
    ${commits > 0 ? `
    <text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="10">
      ${commits}
    </text>` : ''}
    `;
  }).join('')}

  <!-- Border -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#1a1a1a" stroke-width="1"/>
</svg>`;

    res.status(200).send(svg);
  } catch (error) {
    console.error('Daily commits API Error:', error);

    // Return fallback SVG
    const fallbackSvg = `
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#0a0a0a"/>
  <text x="200" y="100" text-anchor="middle" fill="#1a1a1a" font-family="Arial, sans-serif" font-size="14">
    Error loading data
  </text>
  <rect x="0" y="0" width="400" height="200" fill="none" stroke="#1a1a1a" stroke-width="1"/>
</svg>`;

    res.status(200).send(fallbackSvg);
  }
}
