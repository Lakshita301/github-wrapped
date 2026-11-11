import "./InsightsPanel.css";

function formatHour(hour) {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

export default function InsightsPanel({ insights }) {
  const stats = [
    { label: "Total stars", value: insights.totalStars.toLocaleString() },
    { label: "Total forks", value: insights.totalForks.toLocaleString() },
    { label: "Repos", value: insights.totalRepos },
    { label: "Recent pushes", value: insights.pushes },
    { label: "Current streak", value: `${insights.streak}d` },
    { label: "Peak hour", value: formatHour(insights.peakHour) },
    { label: "Followers", value: insights.followers.toLocaleString() },
    { label: "Following", value: insights.following.toLocaleString() },
  ];

  return (
    <section className="insights">
      <div className="insights__header">
        <h2 className="insights__title">Insights</h2>
        <span className="insights__sub">from the last 90 days</span>
      </div>

      <div className="insights__grid">
        {stats.map((stat) => (
          <div key={stat.label} className="insights__card">
            <span className="insights__value">{stat.value}</span>
            <span className="insights__label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}