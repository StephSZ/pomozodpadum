import { Card, ErrorState, LoadingState } from "./components";
import { api } from "./lib/api";
import type { Season } from "./types";
import { useAsyncData } from "./utils";

const seasonLabels: Record<Season, string> = {
  spring: "Jaro",
  summer: "Léto",
  autumn: "Podzim",
  winter: "Zima",
};

export function SeasonalTipsCard() {
  const seasonalTips = useAsyncData(() => api.getSeasonalTips(), {
    cacheKey: "seasonal-tips",
  });

  return (
    <Card title="Sezónní tipy">
      {seasonalTips.loading && !seasonalTips.data ? <LoadingState /> : null}
      {seasonalTips.error && !seasonalTips.data ? (
        <ErrorState message={seasonalTips.error} onRetry={seasonalTips.reload} />
      ) : null}
      {seasonalTips.data ? (
        <div className="stack stack--tight">
          <p className="muted">
            {seasonLabels[seasonalTips.data.season]} •{" "}
            {seasonalTips.data.aiGenerated ? "vygenerováno AI" : "fallback data"}
          </p>
          {seasonalTips.data.tips.map((tip) => (
            <div key={tip.id} className="stack stack--tight">
              <strong>
                {tip.emoji} {tip.title}
              </strong>
              <p>{tip.content}</p>
            </div>
          ))}
          {seasonalTips.error ? <p className="muted">{seasonalTips.error}</p> : null}
        </div>
      ) : null}
    </Card>
  );
}
