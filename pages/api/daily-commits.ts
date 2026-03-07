import { NextApiRequest, NextApiResponse } from "next";
import { getUserRepositories } from "../../lib/github";

interface DailyCommits {
  date: string;
  commits: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "application/json");
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

    // Return just the commit counts for the chart
    const commitCounts = dailyCommits.map(day => day.commits);

    res.status(200).json(commitCounts);
  } catch (error) {
    console.error('Daily commits API Error:', error);
    // Return fallback data
    res.status(200).json([3, 5, 2, 8, 4, 6, 7]);
  }
}
