import { Link } from "react-router-dom";
import { Card, ErrorState, LoadingState } from "../components";
import { api } from "../lib/api";
import { useAsyncData } from "../utils";

export function HomePage() {
  const tip = useAsyncData(() => api.getTodayTip(), { cacheKey: "today-tip" });
  const stats = useAsyncData(() => api.getStats(), { cacheKey: "stats-home" });
  const latest = useAsyncData(() => api.getHistory({ limit: 1 }), {
    cacheKey: "history-home",
  });

  return (
    <div className="stack">
      <div className="grid grid--3">
        <Card title="Denní tip">
          {tip.loading && !tip.data ? <LoadingState /> : null}
          {tip.error && !tip.data ? <ErrorState message={tip.error} onRetry={tip.reload} /> : null}
          {tip.data ? (
            <div className="stack stack--tight">
              <strong>
                {tip.data.emoji} {tip.data.title}
              </strong>
              <p>{tip.data.content}</p>
              {tip.error ? <p className="muted">{tip.error}</p> : null}
            </div>
          ) : null}
        </Card>

        <Card title="Statistiky">
          {stats.loading && !stats.data ? <LoadingState /> : null}
          {stats.error && !stats.data ? (
            <ErrorState message={stats.error} onRetry={stats.reload} />
          ) : null}
          {stats.data ? (
            <div className="mini-stats">
              <div>
                <strong>{stats.data.totalScans}</strong>
                <span>celkem skenů</span>
              </div>
              <div>
                <strong>{stats.data.weeklyScans}</strong>
                <span>za 7 dní</span>
              </div>
              <div>
                <strong>
                  {stats.data.topContainer ? stats.data.topContainer.container : "žádný"}
                </strong>
                <span>top kontejner</span>
              </div>
            </div>
          ) : null}
        </Card>

        <Card title="Poslední sken">
          {latest.loading && !latest.data ? <LoadingState /> : null}
          {latest.error && !latest.data ? (
            <ErrorState message={latest.error} onRetry={latest.reload} />
          ) : null}
          {latest.data ? (
            latest.data.items.length ? (
              <div className="stack stack--tight">
                <strong>{latest.data.items[0].name}</strong>
                <p>{latest.data.items[0].description}</p>
                <Link className="button button--secondary" to={`/waste/${latest.data.items[0].id}`}>
                  Detail
                </Link>
              </div>
            ) : (
              <div className="stack stack--tight">
                <strong>Začněte svůj první sken!</strong>
                <p>Historie je prázdná a čeká na první analýzu.</p>
                <Link className="button" to="/scan">
                  Skenuj odpad
                </Link>
              </div>
            )
          ) : null}
        </Card>
      </div>
    </div>
  );
}
