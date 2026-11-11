import "./LanguageChart.css";

const COLORS = [
  "#e8ff6b", "#6be0ff", "#ff9d6b", "#b88bff",
  "#6bffb0", "#ff6b9d", "#ffd36b", "#8b9dff",
];

export default function LanguageChart({ data }) {
  if (data.length === 0) {
    return (
      <section className="langs">
        <h2 className="langs__title">Languages</h2>
        <p className="langs__empty">No language data found.</p>
      </section>
    );
  }

  return (
    <section className="langs">
      <div className="langs__header">
        <h2 className="langs__title">Languages</h2>
        <span className="langs__sub">by bytes of code</span>
      </div>

      <ul className="langs__list">
        {data.map((lang, i) => (
          <li key={lang.name} className="langs__row">
            <div className="langs__meta">
              <span
                className="langs__dot"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="langs__name">{lang.name}</span>
              <span className="langs__pct">{lang.pct}%</span>
            </div>
            <div className="langs__track">
              <div
                className="langs__fill"
                style={{
                  width: `${lang.pct}%`,
                  background: COLORS[i % COLORS.length],
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}