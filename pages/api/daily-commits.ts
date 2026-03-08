import { NextApiRequest, NextApiResponse } from "next";
import { getUserRepositories } from "../../lib/github";

interface DailyCommits {
  date: string;
  commits: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  let repos: any[] = [];

  try {
    repos = await getUserRepositories();
  } catch (error) {
    console.error('Daily commits API Error:', error);
    
    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('rate limit exceeded')) {
      // Return fallback data when rate limited
      const fallbackData = [2, 5, 3, 8, 4, 6, 7]; // Sample data
      const width = 400;
      const height = 200;
      const padding = 40;
      const graphWidth = width - 2 * padding;
      const graphHeight = height - 2 * padding;

      const today = new Date();
      const dateLabels = Array.from({length: 7}, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      const maxCommits = Math.max(...fallbackData, 1);
      const points = fallbackData.map((commits, index) => {
        const x = padding + (index / 6) * graphWidth;
        const y = height - padding - (commits / maxCommits) * graphHeight;
        return `${x},${y}`;
      });

      const squares = fallbackData.map((commits, index) => {
        const x = padding + (index / 6) * graphWidth;
        const y = height - padding - (commits / maxCommits) * graphHeight;
        return `
        <rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="#a5d234"/>
      `;
      }).join('');

      const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#28370d"/>
  
  <!-- Title -->
  <text x="${width/2}" y="25" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="16" font-weight="bold">
    DAILY CODING (RATE LIMITED)
  </text>
  
  <!-- Graph area border -->
  <rect x="${padding}" y="${padding}" width="${graphWidth}" height="${graphHeight}" fill="none" stroke="#89c201" stroke-width="2"/>
  
  <!-- Line graph -->
  <polyline points="${points.join(' ')}" fill="none" stroke="#89c201" stroke-width="2"/>
  
  <!-- Data points (squares) -->
  ${squares}
  
  <!-- X-axis labels -->
  ${dateLabels.map((label, index) => {
    const x = padding + (index / 6) * graphWidth;
    return `
    <text x="${x}" y="${height - 15}" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="10">
      ${label}
    </text>`;
  }).join('')}
  
  <!-- Y-axis labels -->
  ${Array.from({length: 5}, (_, i) => {
    const value = Math.round((maxCommits * (4 - i)) / 4);
    const y = padding + (i * graphHeight) / 4;
    return `
    <text x="${padding - 10}" y="${y + 3}" text-anchor="end" fill="#89c201" font-family="monospace" font-size="10">
      ${value}
    </text>`;
  }).join('')}
  
  <!-- Outer border -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#89c201" stroke-width="2"/>
</svg>`;

      return res.status(200).send(svg);
    }
    
    // For other errors, return error message
    const fallbackSvg = `
<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="200" fill="#28370d"/>
  <text x="200" y="100" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="14">
    Error loading data
  </text>
  <rect x="0" y="0" width="400" height="200" fill="none" stroke="#89c201" stroke-width="2"/>
</svg>`;
    
    return res.status(200).send(fallbackSvg);
  }

  // Original logic continues here...
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
  const padding = 40;
  const graphWidth = width - 2 * padding;
  const graphHeight = height - 2 * padding;

  // Generate dates for labels
  const dateLabels = dailyCommits.map(day => {
    const date = new Date(day.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Calculate points for line graph
  const points = commitCounts.map((commits, index) => {
    const x = padding + (index / (dailyCommits.length - 1)) * graphWidth;
    const y = height - padding - (commits / maxCommits) * graphHeight;
    return `${x},${y}`;
  });

  // Generate square points
  const squares = commitCounts.map((commits, index) => {
    const x = padding + (index / (dailyCommits.length - 1)) * graphWidth;
    const y = height - padding - (commits / maxCommits) * graphHeight;
    return `
    <rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="#a5d234"/>
    `;
  }).join('');

  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#28370d"/>
  
  <!-- Title -->
  <text x="${width/2}" y="25" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="16" font-weight="bold">
    DAILY CODING
  </text>
  
  <!-- Graph area border -->
  <rect x="${padding}" y="${padding}" width="${graphWidth}" height="${graphHeight}" fill="none" stroke="#89c201" stroke-width="2"/>
  
  <!-- Line graph -->
  <polyline points="${points.join(' ')}" fill="none" stroke="#89c201" stroke-width="2"/>
  
  <!-- Data points (squares) -->
  ${squares}
  
  <!-- X-axis labels -->
  ${dateLabels.map((label, index) => {
    const x = padding + (index / (dailyCommits.length - 1)) * graphWidth;
    return `
    <text x="${x}" y="${height - 15}" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="10">
      ${label}
    </text>`;
  }).join('')}
  
  <!-- Y-axis labels -->
  ${Array.from({length: 5}, (_, i) => {
    const value = Math.round((maxCommits * (4 - i)) / 4);
    const y = padding + (i * graphHeight) / 4;
    return `
    <text x="${padding - 10}" y="${y + 3}" text-anchor="end" fill="#89c201" font-family="monospace" font-size="10">
      ${value}
    </text>`;
  }).join('')}
  
  <!-- Outer border -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#89c201" stroke-width="2"/>
</svg>`;

  res.status(200).send(svg);
}
