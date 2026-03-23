import { Link } from "react-router-dom";
import { Card, ErrorState, LoadingState } from "../components";
import { SeasonalTipsCard } from "../SeasonalTipsCard";
import { api } from "../lib/api";
import { useAsyncData } from "../utils";

export function InfoPage() {
  const containers = useAsyncData(() => api.getContainers(), {
    cacheKey: "containers-info",
  });

  if (containers.loading && !containers.data) {
    return <LoadingState label="Načítám průvodce tříděním..." />;
  }

  if (containers.error && !containers.data) {
    return <ErrorState message={containers.error} onRetry={containers.reload} />;
  }

  if (!containers.data) {
    return <ErrorState message="Průvodce tříděním není k dispozici." />;
  }

  return (
    <div className="stack">
      <Card title="Mapa kontejnerů">
        <div className="stack stack--tight">
          <p>Chcete rovnou najít nejbližší kontejnery nebo projít odpadový slovníček?</p>
          <div className="row row--wrap">
            <Link className="button" to="/map">
              Najdi kontejner 🗺️
            </Link>
            <Link className="button button--secondary" to="/catalog">
              📖 Katalog odpadů · Kam co patří?
            </Link>
          </div>
        </div>
      </Card>

      <SeasonalTipsCard />

      <div className="grid grid--2">
        {containers.data.map((container) => (
          <Card key={container.type} title={`${container.emoji} ${container.name}`}>
            <details open>
              <summary>Co patří</summary>
              <ul>
                {container.belongs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
            <details>
              <summary>Co nepatří</summary>
              <ul>
                {container.doesNotBelong.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </details>
            <p className="muted">{container.tip}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
