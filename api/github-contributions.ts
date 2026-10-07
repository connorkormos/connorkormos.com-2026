import type { IncomingMessage, ServerResponse } from "node:http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  const fail = (status: number, error: string) => {
    res.statusCode = status;
    res.end(JSON.stringify({ error }));
  };

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return fail(405, "Method not allowed");
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) return fail(503, "GitHub contributions are not configured");

  try {
    const now = new Date();
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      signal: AbortSignal.timeout(10000),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        "User-Agent": "connorkormos-portfolio",
      },
      body: JSON.stringify({
        query: `query($from: DateTime!, $to: DateTime!) {
          user(login: "connorkormos") {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks { contributionDays { date contributionCount } }
              }
            }
          }
        }`,
        variables: {
          from: new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).toISOString(),
          to: now.toISOString(),
        },
      }),
    });
    if (!response.ok) return fail(502, "Unable to load GitHub contributions");

    const payload = await response.json() as {
      errors?: unknown[];
      data?: { user?: { contributionsCollection?: { contributionCalendar?: {
        totalContributions: number;
        weeks: { contributionDays: { date: string; contributionCount: number }[] }[];
      } } } };
    };
    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
    if (payload.errors?.length || !calendar || !Array.isArray(calendar.weeks)
      || typeof calendar.totalContributions !== "number") {
      return fail(502, "Unable to load GitHub contributions");
    }

    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, stale-while-revalidate=600");
    res.statusCode = 200;
    res.end(JSON.stringify(calendar));
  } catch {
    return fail(502, "Unable to load GitHub contributions");
  }
}
