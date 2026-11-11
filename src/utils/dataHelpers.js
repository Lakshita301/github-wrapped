// Turns a list of events into [{ date: "2026-03-15", count: 4 }, ...]
// with one entry per day, including days with zero activity.
export function buildHeatmapData(events, days = 90) {
  const counts = {};
  for (const event of events) {
    const day = event.created_at.slice(0, 10);
    counts[day] = (counts[day] || 0) + 1;
  }

  const result = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: counts[key] || 0 });
  }
  return result;
}

// { JavaScript: 80000, Python: 20000 } -> [{ name, bytes, pct }, ...] top 8
export function buildLanguageData(languageBytes) {
  const total = Object.values(languageBytes).reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  return Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      pct: Math.round((bytes / total) * 100),
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);
}

// Summary numbers for the insights panel
export function buildInsights(user, repos, events) {
  const ownRepos = repos.filter((r) => !r.fork);

  const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = ownRepos.reduce((sum, r) => sum + r.forks_count, 0);

  const pushes = events.filter((e) => e.type === "PushEvent").length;

  // Which hour of the day is this person most active?
  const hourCounts = Array(24).fill(0);
  for (const e of events) {
    hourCounts[new Date(e.created_at).getHours()]++;
  }
  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

  // Streak: consecutive days with activity, counting back from today
  const activeDays = new Set(events.map((e) => e.created_at.slice(0, 10)));
  let streak = 0;
  for (let i = 0; i < 90; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (activeDays.has(d.toISOString().slice(0, 10))) streak++;
    else break;
  }

  return {
    totalStars,
    totalForks,
    totalRepos: ownRepos.length,
    pushes,
    streak,
    peakHour,
    followers: user.followers,
    following: user.following,
  };
}