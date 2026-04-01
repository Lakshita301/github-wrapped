import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const cleaned = username.trim();
    if (!cleaned) {
      setError("Please enter a GitHub username.");
      return;
    }
    navigate(`/dashboard/${cleaned}`);
  }

  return (
    <div className="home">
      <div className="home__grid" aria-hidden="true" />
      <div className="home__blob home__blob--1" aria-hidden="true" />
      <div className="home__blob home__blob--2" aria-hidden="true" />

      <main className="home__card">
        <div className="home__logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </div>

        <h1 className="home__title">
          GitHub <span className="home__title-accent">Wrapped</span>
        </h1>

        <p className="home__subtitle">
          Your year in code — contribution maps, language breakdowns,
          top repos, and developer insights.
        </p>

        <form className="home__form" onSubmit={handleSubmit} noValidate>
          <div className="home__input-wrap">
            <span className="home__input-prefix" aria-hidden="true">@</span>
            <input
              className="home__input"
              type="text"
              placeholder="github-username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError("");
              }}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              aria-label="GitHub username"
            />
          </div>

          {error && (
            <p className="home__error" role="alert">{error}</p>
          )}

          <button className="home__btn" type="submit">
            <span>Unwrap my stats</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <div className="home__examples">
          <span className="home__examples-label">Try:</span>
          {["torvalds", "gaearon", "sindresorhus"].map((name) => (
            <button
              key={name}
              className="home__chip"
              type="button"
              onClick={() => {
                setUsername(name);
                navigate(`/dashboard/${name}`);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </main>

      <footer className="home__footer">
        Uses the public GitHub REST API · no login required
      </footer>
    </div>
  );
}