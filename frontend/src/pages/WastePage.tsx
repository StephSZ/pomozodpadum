import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, ContainerBadge, ErrorState, LoadingState } from "../components";
import { api } from "../lib/api";
import type { ContainerType } from "../types";
import { useAsyncData } from "../utils";

export function WastePage() {
  const { id } = useParams<{ id: string }>();
  const [toast, setToast] = useState<string | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctionName, setCorrectionName] = useState("");
  const [correctionContainer, setCorrectionContainer] = useState("");
  const [correctionError, setCorrectionError] = useState<string | null>(null);
  const [correctionLoading, setCorrectionLoading] = useState(false);

  const waste = useAsyncData(() => api.getWaste(id ?? ""), {
    enabled: Boolean(id),
    cacheKey: id ? `waste-${id}` : undefined,
  });

  const similar = useAsyncData(
    async () => {
      const ids = waste.data?.similarWasteIds ?? [];
      return Promise.all(ids.map((similarId) => api.getWaste(similarId)));
    },
    {
      enabled: Boolean(waste.data?.similarWasteIds.length),
      initialData: [],
      cacheKey: id ? `similar-${id}` : undefined,
    },
  );

  async function submitCorrection() {
    if (!waste.data) {
      return;
    }

    setCorrectionLoading(true);
    setCorrectionError(null);

    try {
      const result = await api.submitCorrection({
        wasteId: waste.data.id,
        correctedName: correctionName || undefined,
        correctedContainer: (correctionContainer || undefined) as
          | ContainerType
          | undefined,
      });
      waste.setData(result.updatedWaste);
      setToast("Diky za opravu!");
      setShowCorrection(false);
      setCorrectionName("");
      setCorrectionContainer("");
    } catch (error) {
      setCorrectionError(
        error instanceof Error ? error.message : "Korekci se nepodarilo odeslat.",
      );
    } finally {
      setCorrectionLoading(false);
    }
  }

  if (!id) {
    return <ErrorState message="Chybi ID odpadu." />;
  }

  if (waste.loading && !waste.data) {
    return <LoadingState label="Nacitam detail odpadu..." />;
  }

  if (waste.error && !waste.data) {
    return <ErrorState message={waste.error} onRetry={waste.reload} />;
  }

  if (!waste.data) {
    return <ErrorState message="Odpad nebyl nalezen." />;
  }

  return (
    <div className="stack">
      {toast ? <div className="toast">{toast}</div> : null}
      <Card
        title={waste.data.name}
        action={
          <div className="row">
            <button className="button button--secondary" onClick={() => setToast("Zaznam uz je ulozen na serveru.")}>
              Ulozit
            </button>
            <button className="button" onClick={() => setShowCorrection((value) => !value)}>
              Opravit
            </button>
          </div>
        }
      >
        <div className="stack stack--tight">
          <p>{waste.data.description}</p>
          <div className="row">
            {waste.data.containers.map((container) => (
              <ContainerBadge key={container} type={container} />
            ))}
          </div>
          <details open>
            <summary>Jak vyhodit</summary>
            <p>{waste.data.disposalInstructions}</p>
          </details>
          <details>
            <summary>Z ceho se sklada</summary>
            <p>{waste.data.composition}</p>
          </details>
          <details>
            <summary>Doba rozkladu a zajimavost</summary>
            <p>{waste.data.decompositionTime}</p>
            <p>{waste.data.funFact}</p>
          </details>
        </div>
      </Card>

      {showCorrection ? (
        <Card title="Opravit rozpoznani">
          <div className="stack">
            <input
              onChange={(event) => setCorrectionName(event.target.value)}
              placeholder="Novy nazev"
              value={correctionName}
            />
            <select
              onChange={(event) => setCorrectionContainer(event.target.value)}
              value={correctionContainer}
            >
              <option value="">Bez zmeny kontejneru</option>
              <option value="plastic">Plast</option>
              <option value="paper">Papir</option>
              <option value="glass">Sklo</option>
              <option value="mixed">Smesny</option>
              <option value="bio">Bio</option>
              <option value="metal">Kov</option>
              <option value="hazardous">Nebezpecny</option>
              <option value="electro">Elektro</option>
              <option value="carton">Karton</option>
            </select>
            {correctionError ? <ErrorState message={correctionError} /> : null}
            <div className="row">
              <button
                className="button button--secondary"
                onClick={() => setShowCorrection(false)}
              >
                Zrusit
              </button>
              <button
                className="button"
                disabled={correctionLoading}
                onClick={() => void submitCorrection()}
              >
                {correctionLoading ? "Odesilam..." : "Odeslat"}
              </button>
            </div>
          </div>
        </Card>
      ) : null}

      <Card title="Podobne odpady">
        {similar.loading && !similar.data?.length ? <LoadingState /> : null}
        {similar.error && !similar.data?.length ? (
          <ErrorState message={similar.error} onRetry={similar.reload} />
        ) : null}
        {similar.data?.length ? (
          <div className="grid grid--2">
            {similar.data.map((item) => (
              <article className="mini-card" key={item.id}>
                <strong>{item.name}</strong>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        ) : (
          !similar.loading && <p>Zatim nejsou k dispozici podobne odpady.</p>
        )}
      </Card>
    </div>
  );
}
