const ALLOWED = [
  /^\/users\/[\w-]+$/,
  /^\/users\/[\w-]+\/repos$/,
  /^\/users\/[\w-]+\/events\/public$/,
  /^\/repos\/[\w-]+\/[\w.-]+\/languages$/,
];

export default async function handler(req, res) {
  const { path } = req.query;

  if (typeof path !== "string" || !path.startsWith("/")) {
    return res.status(400).json({ message: "Missing path" });
  }

  const url = new URL(path, "https://api.github.com");
  const allowed =
    url.origin === "https://api.github.com" &&
    ALLOWED.some((pattern) => pattern.test(url.pathname));

  if (!allowed) {
    return res.status(400).json({ message: "Path not allowed" });
  }

  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const upstream = await fetch(url, { headers });
    const body = await upstream.text();

    res.setHeader("Content-Type", "application/json");
    if (upstream.ok) {
      res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    }
    res.status(upstream.status).send(body);
  } catch {
    res.status(502).json({ message: "Could not reach GitHub" });
  }
}