import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

const MAP_URL = "https://www.kamtridit.cz/";
const IFRAME_TIMEOUT_MS = 8000;

export function MapPage() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);

  useEffect(() => {
    if (iframeLoaded) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setIframeFailed(true);
    }, IFRAME_TIMEOUT_MS);

    return () => window.clearTimeout(timeout);
  }, [iframeLoaded]);

  const externalUrl = MAP_URL;

  function handleGeolocation() {
    if (!navigator.geolocation) {
      setLocationError("Váš prohlížeč nepodporuje geolokaci.");
      return;
    }

    setLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? "Přístup k poloze byl zamítnut."
            : "Polohu se nepodařilo zjistit.";

        setLocationError(message);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }

  function handleOpenExternal() {
    window.open(externalUrl, "_blank", "noopener,noreferrer");
  }

  const showFallback = iframeFailed && !iframeLoaded;

  return (
    <div className="stack">
      <section className="card">
        <div className="stack stack--tight">
          <p className="map-page__eyebrow">Mapa kontejnerů 🗺</p>
          <h2 className="map-page__title">Najděte nejbližší kontejnery pro třídění odpadu</h2>
          <p className="muted">
            Otevřete mapu sběrných míst a případně si nejdřív vyžádejte přístup k poloze.
          </p>
          <div className="row row--wrap">
            <button
              className="button button--location"
              disabled={loadingLocation}
              onClick={handleGeolocation}
              type="button"
            >
              <MapPin size={18} />
              <span>{loadingLocation ? "Zjišťuji polohu..." : "Zjistit moji polohu 📍"}</span>
            </button>
            {coordinates ? (
              <span className="chip">
                GPS: {coordinates.latitude.toFixed(5)}, {coordinates.longitude.toFixed(5)}
              </span>
            ) : null}
          </div>
          {locationError ? <p className="map-page__error">{locationError}</p> : null}
        </div>
      </section>

      <section className="card card--map">
        {!showFallback ? (
          <div className="map-frame">
            {!iframeLoaded ? <div className="map-frame__loading" aria-hidden="true" /> : null}
            <iframe
              src={MAP_URL}
              title="Mapa kontejnerů - Kam třídit"
              className="map-frame__iframe"
              style={{ height: "70vh" }}
              sandbox="allow-scripts allow-same-origin allow-popups"
              loading="lazy"
              onError={() => setIframeFailed(true)}
              onLoad={() => {
                setIframeLoaded(true);
                setIframeFailed(false);
              }}
            />
          </div>
        ) : (
          <div className="map-fallback">
            <div className="stack stack--tight">
              <strong>Mapa se nepodařila načíst přímo v aplikaci.</strong>
              <p className="muted">
                Otevřete KamTridit.cz v novém okně a pokračujte přímo na jejich webu.
              </p>
              <button className="button button--external" onClick={handleOpenExternal} type="button">
                Otevřít mapu na KamTridit.cz 🗺
              </button>
            </div>
          </div>
        )}
      </section>

      <a className="map-page__link" href={externalUrl} rel="noreferrer" target="_blank">
        Otevřít v novém okně
      </a>
    </div>
  );
}
