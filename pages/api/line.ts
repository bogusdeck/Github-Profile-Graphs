import { NextApiRequest, NextApiResponse } from "next";
import { getDailyCommits } from "../../lib/github";
import { lineChartSVG } from "../../lib/svg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "image/svg+xml");

  const days = Number(req.query.days || 7);
  const data = await getDailyCommits(days);

  res.send(lineChartSVG(data, `Last ${days} Days`));
}
