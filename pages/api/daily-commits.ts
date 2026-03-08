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

    // Get commits from last 7 days
    const dailyCommits: DailyCommits[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Count commits for this date across all repos
      let totalCommits = 0;

      for (const repo of repos.slice(0, 10)) { // Limit to 10 repos for performance
        try {
          // Get commits for this repo on this date
          const commitsUrl = `https://api.github.com/repos/${repo.full_name}/commits`;
          const response = await fetch(commitsUrl, {
            headers: {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          });

          if (response.ok) {
            const commits = await response.json();
            // Count commits that match this date
            const dateCommits = commits.filter((commit: any) => {
              const commitDate = new Date(commit.commit.committer.date).toISOString().split('T')[0];
              return commitDate === dateStr;
            });
            totalCommits += dateCommits.length;
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

    // Generate SVG chart
    const commitCounts = dailyCommits.map(day => day.commits);
    const maxCommits = Math.max(...commitCounts, 1);
    const width = 400;
    const height = 200;
    const barWidth = width / 7 - 10;
    const barSpacing = 10;

    // Generate dates for labels
    const dateLabels = dailyCommits.map(day => {
      const date = new Date(day.date);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });

    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#000000"/>
  
  <!-- Title -->
  <text x="${width/2}" y="20" text-anchor="middle" fill="#00FF00" font-family="monospace" font-size="14" font-weight="bold">
    DAILY COMMITS (LAST 7 DAYS)
  </text>
  
  <!-- Bars -->
  ${commitCounts.map((commits, index) => {
    const barHeight = (commits / maxCommits) * (height - 60);
    const x = index * (barWidth + barSpacing) + barSpacing;
    const y = height - 30 - barHeight;
    
    return `
    <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="#00FF00"/>
    <text x="${x + barWidth/2}" y="${height - 10}" text-anchor="middle" fill="#00FF00" font-family="monospace" font-size="10">
      ${dateLabels[index]}
    </text>
    <text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" fill="#00FF00" font-family="monospace" font-size="12">
      ${commits}
    </text>
    `;
  }).join('')}
  
  <!-- Border -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#00FF00" stroke-width="2"/>
</svg>`;

    res.status(200).send(svg);
  } catch (error) {
    console.error('Daily commits API Error:', error);
    
    // Return fallback SVG
    const fallbackSvg = `
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#000000"/>
  <text x="200" y="100" text-anchor="middle" fill="#00FF00" font-family="monospace" font-size="14">
    Error loading data
  </text>
  <rect x="0" y="0" width="400" height="200" fill="none" stroke="#00FF00" stroke-width="2"/>
</svg>`;
    
    res.status(200).send(fallbackSvg);
  }
}
