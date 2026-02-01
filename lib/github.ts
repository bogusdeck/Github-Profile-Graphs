const GITHUB_API = "https://api.github.com";

interface GitHubEvent {
  type: string;
  created_at: string;
  payload: {
    commits?: Array<{ length: number }>;
  };
}

interface LanguageStats {
  [key: string]: {
    totalBytes: number;
    repos: number;
    stars: number;
    commits: number;
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
export async function getDailyCommits(days = 7) {
  const username = process.env.GITHUB_USERNAME;

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
      counts[days - diff - 1] += event.payload.commits?.length || 0;
    }
  });

  return counts;
}

export async function getStreak() {
  const username = process.env.GITHUB_USERNAME;

  const events = await githubFetch(
    `/users/${username}/events/public`
  );

  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  // Check each day backwards
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const hasActivity = events.some((event: GitHubEvent) => {
      if (event.type !== "PushEvent") return false;
      const eventDate = new Date(event.created_at).toISOString().split('T')[0];
      return eventDate === dateStr;
    });

    if (hasActivity) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export async function getUserRepositories(): Promise<any[]> {
  const username = process.env.GITHUB_USERNAME;
  
  const repos = await githubFetch(
    `/users/${username}/repos?per_page=100&sort=updated`
  );

  return repos.map((repo: any) => ({
    name: repo.name,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    size: repo.size,
    pushed_at: repo.pushed_at,
  }));
}

export async function getLanguageStats(): Promise<LanguageStats> {
  const username = process.env.GITHUB_USERNAME;
  const repos = await getUserRepositories();
  
  const stats: LanguageStats = {};
  
  // Get language details for each repository
  for (const repo of repos) {
    if (!repo.language) continue;
    
    try {
      const languages = await githubFetch(
        `/repos/${username}/${repo.name}/languages`
      );
      
      Object.entries(languages).forEach(([lang, bytes]) => {
        if (!stats[lang]) {
          stats[lang] = {
            totalBytes: 0,
            repos: 0,
            stars: 0,
            commits: 0,
          };
        }
        
        stats[lang].totalBytes += bytes as number;
        stats[lang].repos += 1;
        stats[lang].stars += repo.stargazers_count;
      });
    } catch (error) {
      // Skip repos where we can't get language data
      continue;
    }
  }
  
  return stats;
}

export async function getCommitsPerLanguage(): Promise<{[key: string]: number}> {
  const username = process.env.GITHUB_USERNAME;
  const repos = await getUserRepositories();
  const commits: {[key: string]: number} = {};
  
  // Get recent commits for each repository
  for (const repo of repos.slice(0, 20)) { // Limit to avoid rate limiting
    try {
      const commitsData = await githubFetch(
        `/repos/${username}/${repo.name}/commits?per_page=50`
      );
      
      commitsData.forEach((commit: any) => {
        if (commit.author && commit.author.login === username) {
          const lang = repo.language || 'Other';
          commits[lang] = (commits[lang] || 0) + 1;
        }
      });
    } catch (error) {
      continue;
    }
  }
  
  return commits;
}

export async function getCommitsPerRepo(): Promise<{name: string; commits: number}[]> {
  const username = process.env.GITHUB_USERNAME;
  const repos = await getUserRepositories();
  const repoCommits: {name: string; commits: number}[] = [];
  
  // Get commit counts for top repositories
  for (const repo of repos.slice(0, 10)) {
    try {
      const commitsData = await githubFetch(
        `/repos/${username}/${repo.name}/commits?per_page=100`
      );
      
      const userCommits = commitsData.filter((commit: any) => 
        commit.author && commit.author.login === username
      ).length;
      
      repoCommits.push({
        name: repo.name,
        commits: userCommits,
      });
    } catch (error) {
      repoCommits.push({
        name: repo.name,
        commits: 0,
      });
    }
  }
  
  return repoCommits.sort((a, b) => b.commits - a.commits);
}
