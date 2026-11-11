# GitHub Wrapped

> Beautiful analytics for any public GitHub profile. Type a username, get a dashboard.

**[Live demo →](https://github-wrapped-delta-pearl.vercel.app/)**

![Dashboard](docs/dashboard.png)

## Features

- **Profile overview**: avatar, name, bio, location, and company
- **Insights panel**: total stars, forks, repos, recent pushes, current streak, peak coding hour, followers, and following
- **Activity heatmap**: a day-by-day grid of public activity over the last 90 days
- **Language breakdown**: the share of each language, measured in bytes of code across original (non-fork) repos
- **Top repos**: the five most-starred original repositories, each linking to GitHub
- **Loading and error states**: a spinner while data loads, and a friendly message for unknown users or rate limits
- **Responsive layout** and semantic, accessible markup

## Tech stack

| Area    | Tools                                                    |
| ------- | -------------------------------------------------------- |
| UI      | React 19, Vite                                           |
| Routing | React Router                                             |
| Data    | GitHub REST API                                          |
| Styling | Plain CSS (custom properties, grid, keyframe animations) |
| Hosting | Vercel (auto-deploys on every push to `main`)            |

## How it works

```
Home (search) → /dashboard/:username → useGitHubData(username)
                                            │
                                            ▼
                                   api/github.js (fetch + cache)
                                            │
                                            ▼
                               utils/dataHelpers.js (reshape data)
                                            │
                                            ▼
              ProfileHeader · InsightsPanel · ContributionHeatmap · LanguageChart · TopRepos
```

- **`api/github.js`** is the only file that calls `fetch`. It handles errors (404, rate limit) and keeps an in-memory cache so repeated lookups don't spend extra API requests.
- **`hooks/useGitHubData.js`** is a custom hook that tracks `loading`, `error`, and `success` state. It ignores stale responses, so a slow earlier search can't overwrite a newer one.
- **`utils/dataHelpers.js`** holds pure functions that turn raw API data into chart-ready shapes (heatmap days, language percentages, summary stats).
- Language data is fetched with `Promise.all`, so per-repo requests run in parallel rather than one after another.

## Project structure

```
src/
├── api/            GitHub API calls and caching
├── components/     ProfileHeader, InsightsPanel, ContributionHeatmap,
│                   LanguageChart, TopRepos, StatusScreen
├── hooks/          useGitHubData
├── pages/          Home, Dashboard
└── utils/          dataHelpers
```

## Run locally

```bash
git clone https://github.com/Lakshita301/github-wrapped.git
cd github-wrapped
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Optional: add a GitHub token

Without a token, GitHub allows 60 API requests per hour. With one, the limit is 5,000.

1. Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) (classic, with **no scopes selected**, since only public data is read).
2. Create a `.env` file in the project root:

```
VITE_GITHUB_TOKEN=your_token_here
```

3. Restart the dev server.

## Deployment

Deployed on Vercel. Two things are needed for it to work:

- A `vercel.json` rewrite so client-side routes like `/dashboard/torvalds` don't 404 on refresh
- A `VITE_GITHUB_TOKEN` environment variable set in the Vercel project settings

## Known limitations

- **90-day window.** GitHub's public events API only returns roughly the last 90 days of activity, so the heatmap and streak cover that period rather than a full year.
- **Pushes, not commits.** Insights count push events, because the events API doesn't reliably include individual commits.
- **Peak hour uses the viewer's timezone**, not the profile owner's.
- **Token visibility.** `VITE_` variables are bundled into the client code. The token has no scopes and can only read public data, but a server-side proxy would be the proper fix.
- Languages are measured per repository by bytes, so very small shares can round to 0%.

## Roadmap

- [ ] Serverless proxy to keep the token server-side
- [ ] Full-year contribution graph using the GitHub GraphQL API
- [ ] Shareable PNG card
- [ ] Compare two profiles side by side
- [ ] Limit language lookups to the most active repos for large profiles

## Author

Built by [Lakshita](https://github.com/Lakshita301) while learning React, hooks, REST APIs, and CI/CD.
