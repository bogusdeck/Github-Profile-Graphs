const GITHUB_API = "https://api.github.com";

interface GitHubEvent {
  type: string;
  created_at: string;
  payload: {
    commits?: Array<{ length: number }>;
  };
}

export async function githubFetch(path: string): Promise<any> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error: ${text}`);
  }

  return res.json();
}

/**
 * Get last N days commit activity (rough)
 */
export async function getDailyCommits(days: number = 7): Promise<number[]> {
  const username = process.env.GITHUB_USERNAME;

  if (!username) {
    throw new Error("GITHUB_USERNAME environment variable is not set");
  }

  const events = await githubFetch(
    `/users/${username}/events/public`
  );

  const today = new Date();
  const counts = Array(days).fill(0);

  events.forEach((event: GitHubEvent) => {
    if (event.type !== "PushEvent") return;

    const date = new Date(event.created_at);
    const diff = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff >= 0 && diff < days) {
      const commitCount = event.payload.commits?.length || 0;
      counts[days - diff - 1] += commitCount;
    }
  });

  return counts;
}

/**
 * Simple streak calculation
 */
export async function getStreak(): Promise<number> {
  const commits = await getDailyCommits(30);

  let streak = 0;
  for (let i = commits.length - 1; i >= 0; i--) {
    if (commits[i] === 0) break;
    streak++;
  }

  return streak;
}
