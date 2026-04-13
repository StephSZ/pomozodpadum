import { Link } from "react-router-dom";
import { Card, ErrorState, LoadingState } from "../components";
import { WasteGallery } from "../components/WasteGallery";
import { api } from "../lib/api";
import { useAsyncData } from "../utils";

export function HomePage() {
  const tip = useAsyncData(() => api.getTodayTip(), { cacheKey: "today-tip" });

  return (
    <div className="stack">
      <WasteGallery />

      <div className="daily-tip-bar">
        {tip.loading && !tip.data ? <LoadingState /> : null}
        {tip.error && !tip.data ? <ErrorState message={tip.error} onRetry={tip.reload} /> : null}
        {tip.data ? (
          <div className="daily-tip-bar__inner">
            <span className="daily-tip-bar__icon">{tip.data.emoji}</span>
            <div>
              <strong className="daily-tip-bar__headline">{tip.data.title}</strong>
              <p className="daily-tip-bar__text">{tip.data.content}</p>
            </div>
          </div>
        ) : null}
      </div>

      <Card title="Kam s odpadem dál">
        <div className="stack stack--tight">
          <p>Potřebujete najít nejbližší kontejnery nebo rychle zjistit, kam co patří?</p>
          <div className="row row--wrap">
            <Link className="button" to="/scan">
              Skenuj odpad
            </Link>
            <Link className="button button--secondary" to="/map">
              Najdi kontejner 🗺️
            </Link>
            <Link className="button button--secondary" to="/catalog">
              📖 Katalog odpadů
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
