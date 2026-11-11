import "./TopRepos.css";

export default function TopRepos({ repos }) {
  const top = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5);

  if (top.length === 0) return null;

  return (
    <section className="top-repos">
      <div className="top-repos__header">
        <h2 className="top-repos__title">Top repos</h2>
        <span className="top-repos__sub">by stars</span>
      </div>

      <ol className="top-repos__list">
        {top.map((repo, i) => (
          <li key={repo.id}>
            <a
              className="top-repos__row"
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="top-repos__rank">{i + 1}</span>
              <div className="top-repos__info">
                <span className="top-repos__name">{repo.name}</span>
                {repo.description && (
                  <span className="top-repos__desc">{repo.description}</span>
                )}
                <div className="top-repos__meta">
                  {repo.language && <span>{repo.language}</span>}
                  <span>★ {repo.stargazers_count.toLocaleString()}</span>
                  <span>⑂ {repo.forks_count.toLocaleString()}</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}