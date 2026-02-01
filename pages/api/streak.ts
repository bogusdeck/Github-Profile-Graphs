import { NextApiRequest, NextApiResponse } from "next";
import { getStreak } from "../../lib/github";
import { streakSVG } from "../../lib/svg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");

  const streak = await getStreak();
  res.send(streakSVG(streak));
}
