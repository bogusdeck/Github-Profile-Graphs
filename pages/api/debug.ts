import { NextApiRequest, NextApiResponse } from "next";

interface DebugInfo {
  envVars: {
    GITHUB_TOKEN: string;
    GITHUB_USERNAME: string;
  };
  timestamp: string;
  githubApi?: {
    status: string;
    user?: string;
    repos?: number;
    followers?: number;
    error?: string;
    reason?: string;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check environment variables
    const githubToken = process.env.GITHUB_TOKEN;
    const githubUsername = process.env.GITHUB_USERNAME;
    
    const debug: DebugInfo = {
      envVars: {
        GITHUB_TOKEN: githubToken ? `***${githubToken.slice(-4)}` : 'NOT_SET',
        GITHUB_USERNAME: githubUsername || 'NOT_SET'
      },
      timestamp: new Date().toISOString()
    };

    // Test GitHub API call if env vars are set
    if (githubToken && githubUsername) {
      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}`, {
          headers: {
            Authorization: `Bearer ${githubToken}`,
            Accept: "application/vnd.github+json",
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          debug.githubApi = {
            status: 'SUCCESS',
            user: userData.login,
            repos: userData.public_repos,
            followers: userData.followers
          };
        } else {
          debug.githubApi = {
            status: 'ERROR',
            error: await response.text()
          };
        }
      } catch (error) {
        debug.githubApi = {
          status: 'ERROR',
          error: (error as Error).message
        };
      }
    } else {
      debug.githubApi = {
        status: 'SKIPPED',
        reason: 'Missing environment variables'
      };
    }

    res.status(200).json(debug);
  } catch (error) {
    res.status(500).json({ 
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });
  }
}
