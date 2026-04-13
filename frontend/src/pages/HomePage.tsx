import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorState, LoadingState } from "../components";
import { WasteGallery } from "../components/WasteGallery";
import { api } from "../lib/api";
import type { WasteCatalogItem } from "../types";
import { useAsyncData } from "../utils";

export function HomePage() {
  const tip = useAsyncData(() => api.getTodayTip(), { cacheKey: "today-tip" });
  const [catalogPreview, setCatalogPreview] = useState<Record<string, WasteCatalogItem[]>>({});

  useEffect(() => {
    async function loadPreview() {
      try {
        const res = await api.getCatalog({});
        const grouped: Record<string, WasteCatalogItem[]> = {};
        for (const item of res.items) {
          const letter = item.letter;
          if (!grouped[letter]) grouped[letter] = [];
          if (grouped[letter].length < 2) grouped[letter].push(item);
        }
        setCatalogPreview(grouped);
      } catch (e) {
        console.error("Catalog preview failed", e);
      }
    }
    void loadPreview();
  }, []);

  return (
    <div className="stack">
      <WasteGallery />

      <div className="daily-tip-bar">
        {tip.loading && !tip.data ? <LoadingState /> : null}
        {tip.error && !tip.data ? <ErrorState message={tip.error} onRetry={tip.reload} /> : null}
        {tip.data ? (
          <>
            <strong className="daily-tip-bar__title">Denní tip</strong>
            <div className="daily-tip-bar__inner">
              <span className="daily-tip-bar__icon">{tip.data.emoji}</span>
              <div>
                <strong className="daily-tip-bar__headline">{tip.data.title}</strong>
                <p className="daily-tip-bar__text">{tip.data.content}</p>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="home-section">
        <strong className="home-section__title">Katalog odpadů</strong>
        <p className="home-section__sub">Rychlý přehled — klikněte pro více informací</p>
        <div className="alpha-preview">
          {Object.keys(catalogPreview).sort().map((letter) => (
            <div key={letter} className="alpha-preview__row">
              <span className="alpha-preview__letter">{letter}</span>
              <div className="alpha-preview__items">
                {catalogPreview[letter].map((item) => (
                  <Link
                    key={item.id}
                    to="/catalog"
                    className="alpha-preview__chip"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Link className="alpha-preview__more" to="/catalog">Zobrazit celý katalog →</Link>
      </div>

      <div className="home-section">
        <strong className="home-section__title">Najdi kontejner</strong>
        <p className="home-section__sub">Kontejnery ve vašem okolí</p>
        <div className="home-map">
          <iframe
            src="https://www.kamtridit.cz/mapa"
            title="Mapa kontejnerů"
            className="home-map__iframe"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
