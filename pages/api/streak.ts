import { NextApiRequest, NextApiResponse } from "next";
import { getStreak } from "../../lib/github";
import { streakSVG } from "../../lib/svg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  try {
    const streak = await getStreak();
    res.send(streakSVG(streak));
  } catch (error) {
    console.error('Streak API Error:', error);

    // Check if it's a rate limit error
    if (error instanceof Error && error.message.includes('rate limit exceeded')) {
      // Return fallback streak data when rate limited
      const fallbackStreak = 42; // Sample streak data
      const width = 400;
      const height = 180;

      const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#28370d"/>

  <!-- Title -->
  <text x="${width/2}" y="25" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="16" font-weight="bold">
    CODING STREAK (RATE LIMITED)
  </text>

  <!-- Streak display -->
  <text x="${width/2}" y="${height/2}" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="48" font-weight="bold">
    ${fallbackStreak}
  </text>

  <!-- Label -->
  <text x="${width/2}" y="${height/2 + 30}" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="12">
    days
  </text>

  <!-- Fire icons -->
  <text x="${width/2 - 60}" y="${height/2 + 5}" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="24">
    🔥
  </text>
  <text x="${width/2 + 60}" y="${height/2 + 5}" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="24">
    🔥
  </text>

  <!-- Outer border -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="none" stroke="#89c201" stroke-width="2"/>
</svg>`;

      return res.status(200).send(svg);
    }

    // For other errors, return error message
    const fallbackSvg = `
<svg width="400" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="180" fill="#28370d"/>
  <text x="200" y="90" text-anchor="middle" fill="#89c201" font-family="monospace" font-size="14">
    Error loading streak
  </text>
  <rect x="0" y="0" width="400" height="180" fill="none" stroke="#89c201" stroke-width="2"/>
</svg>`;

    res.status(200).send(fallbackSvg);
  }
}
