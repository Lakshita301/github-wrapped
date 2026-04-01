const BASE = "https://api.github.com";

const HEADERS = {
  Accept: "application/vnd.github+json",
};

// ─── Cache ────────────────────────────────────────────────────────────────────
// A simple Map that stores results so we don't hit the API twice for the
// same data. Think of it like a notepad — check the notepad first, only
// call the API if the answer isn't written down yet.
const cache = new Map();

async function fetchGH(path) {
  if (cache.has(path)) return cache.get(path);

  const res = await fetch(`${BASE}${path}`, { headers: HEADERS });

  if (res.status === 404) throw new Error("User not found");
  if (res.status === 403) throw new Error("Rate limit hit — add a GitHub token in .env");
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data = await res.json();
  cache.set(path, data);
  return data;
}

// ─── Exported functions ───────────────────────────────────────────────────────

export async function fetchUser(username) {
  return fetchGH(`/users/${username}`);
}

export async function fetchRepos(username) {
  let all = [];
  for (let page = 1; page <= 3; page++) {
    const repos = await fetchGH(
      `/users/${username}/repos?per_page=100&page=${page}&sort=pushed`
    );
    all = all.concat(repos);
    if (repos.length < 100) break;
  }
  return all.sort((a, b) => b.stargazers_count - a.stargazers_count);
}

export async function fetchLanguages(username, repos) {
  const results = await Promise.all(
    repos
      .filter((r) => !r.fork)
      .map((r) => fetchGH(`/repos/${username}/${r.name}/languages`))
  );

  const totals = {};
  for (const langMap of results) {
    for (const [lang, bytes] of Object.entries(langMap)) {
      totals[lang] = (totals[lang] || 0) + bytes;
    }
  }
  return totals;
}

export async function fetchEvents(username) {
  let all = [];
  for (let page = 1; page <= 3; page++) {
    const events = await fetchGH(
      `/users/${username}/events/public?per_page=100&page=${page}`
    );
    all = all.concat(events);
    if (events.length < 100) break;
  }
  return all;
}

export async function fetchAllData(username) {
  const user = await fetchUser(username);
  const repos = await fetchRepos(username);
  const [languages, events] = await Promise.all([
    fetchLanguages(username, repos),
    fetchEvents(username),
  ]);
  return { user, repos, languages, events };
}


//What's actually happening here — line by line
//BASE and HEADERS are just constants. Every GitHub API call starts with the same URL and needs the same header. Putting them at the top means you only ever change them in one place.
//The cache is the most important thing to understand here. Without it, if someone searches for torvalds, every component that needs his data would fire its own API call. With it, the first call fetches and stores the result, and every call after that returns instantly from memory. GitHub also rate-limits you to 60 requests/hour without a token — the cache helps you stay under that.
//fetchGH is a private helper (not exported, so nothing outside this file can call it directly). It's the only function that actually calls fetch(). All the other functions just call fetchGH with different paths. This means error handling lives in exactly one place.
//async/await — any function that talks to the internet takes time. async means "this function will take a while", await means "pause here until the result comes back, then continue". Without this, you'd get an empty response before the data arrives.
//fetchRepos loops up to 3 pages because GitHub only returns 100 repos per request. A developer with 250 repos would be invisible if you only fetched page 1. The break stops early if a page has fewer than 100 results — meaning you've hit the last page.
//fetchLanguages uses Promise.all — this is a big one. If someone has 50 repos, you need 50 separate API calls to get language data. Promise.all fires all 50 simultaneously instead of one after another. The difference is 50x speed.
//fetchAllData is the convenience function your hook will call. It fetches everything in the right order — user first (you need it to exist before fetching repos), then languages and events in parallel.