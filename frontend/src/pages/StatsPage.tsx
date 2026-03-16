import { Card, ErrorState, LoadingState } from "../components";
import { api } from "../lib/api";
import { useAsyncData } from "../utils";

export function StatsPage() {
  const stats = useAsyncData(() => api.getStats(), { cacheKey: "stats-page" });

  if (stats.loading && !stats.data) {
    return <LoadingState label="Nacitam statistiky..." />;
  }

  if (stats.error && !stats.data) {
    return <ErrorState message={stats.error} onRetry={stats.reload} />;
  }

  if (!stats.data) {
    return <ErrorState message="Statistiky nejsou k dispozici." />;
  }

  const maxDaily = Math.max(...stats.data.dailyActivity.map((item) => item.count), 1);

  return (
    <div className="stack">
      <div className="grid grid--3">
        <Card title="Celkem skenu">
          <strong className="big-number">{stats.data.totalScans}</strong>
        </Card>
        <Card title="Za 7 dni">
          <strong className="big-number">{stats.data.weeklyScans}</strong>
        </Card>
        <Card title="Top kontejner">
          <strong className="big-number">
            {stats.data.topContainer
              ? `${stats.data.topContainer.container} (${stats.data.topContainer.count})`
              : "zadny"}
          </strong>
        </Card>
      </div>

      <div className="grid grid--2">
        <Card title="Aktivita za 7 dni">
          <div className="bar-chart">
            {stats.data.dailyActivity.map((item) => (
              <div className="bar-chart__item" key={item.date}>
                <div
                  className="bar-chart__bar"
                  style={{ height: `${(item.count / maxDaily) * 100}%` }}
                />
                <span>{item.count}</span>
                <small>{item.date.slice(5)}</small>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Rozlozeni kontejneru">
          <div className="pie-list">
            {stats.data.containerDistribution.length ? (
              stats.data.containerDistribution.map((item) => (
                <div className="pie-list__item" key={item.container}>
                  <div className="pie-list__header">
                    <strong>{item.container}</strong>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="progress">
                    <div
                      className="progress__fill"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p>Zatim nejsou zadna data.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
