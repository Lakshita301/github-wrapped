import "./ContributionHeatmap.css";

function getLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

export default function ContributionHeatmap({ data }) {
  const total = data.reduce((sum, day) => sum + day.count, 0);

  // Pad the start so the first day lands on the right weekday row
  const firstWeekday = new Date(data[0].date).getUTCDay(); // 0 = Sunday
  const cells = [...Array(firstWeekday).fill(null), ...data];

  return (
    <section className="heatmap">
      <div className="heatmap__header">
        <h2 className="heatmap__title">Activity</h2>
        <span className="heatmap__sub">{total} events · last 90 days</span>
      </div>

      <div className="heatmap__grid">
        {cells.map((day, i) =>
          day ? (
            <div
              key={day.date}
              className={`heatmap__cell heatmap__cell--${getLevel(day.count)}`}
              title={`${day.date}: ${day.count} events`}
            />
          ) : (
            <div key={`pad-${i}`} className="heatmap__cell heatmap__cell--pad" />
          )
        )}
      </div>

      <div className="heatmap__legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className={`heatmap__cell heatmap__cell--${level}`} />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}