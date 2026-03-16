import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, ContainerBadge, ErrorState, LoadingState } from "../components";
import { api } from "../lib/api";
import { useAsyncData } from "../utils";

export function HistoryPage() {
  const [search, setSearch] = useState("");
  const [container, setContainer] = useState("");

  const history = useAsyncData(
    () =>
      api.getHistory({
        search: search || undefined,
        container: container || undefined,
        limit: 50,
      }),
    {
      cacheKey: `history-${search}-${container}`,
    },
  );

  async function removeItem(id: string) {
    await api.deleteHistoryItem(id);
    await history.reload();
  }

  return (
    <div className="stack">
      <Card title="Historie">
        <div className="stack stack--tight">
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Vyhledat podle názvu"
            value={search}
          />
          <div className="row row--wrap">
            <button className={container === "" ? "chip chip--active" : "chip"} onClick={() => setContainer("")}>
              Vše
            </button>
            {["plastic", "paper", "glass", "mixed", "bio", "metal", "hazardous", "electro", "carton"].map((value) => (
              <button
                key={value}
                className={container === value ? "chip chip--active" : "chip"}
                onClick={() => setContainer(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {history.loading && !history.data ? <LoadingState label="Načítám historii..." /> : null}
      {history.error && !history.data ? (
        <ErrorState message={history.error} onRetry={history.reload} />
      ) : null}
      {history.data ? (
        history.data.items.length ? (
          history.data.items.map((item) => (
            <Card
              key={item.id}
              title={item.name}
              action={
                <div className="row">
                  <Link className="button button--secondary" to={`/waste/${item.id}`}>
                    Detail
                  </Link>
                  <button className="button" onClick={() => void removeItem(item.id)}>
                    Smazat
                  </button>
                </div>
              }
            >
              <p>{item.description}</p>
              <ContainerBadge type={item.primaryContainer} />
            </Card>
          ))
        ) : (
          <Card title="Historie">
            <p>Historie je prázdná.</p>
          </Card>
        )
      ) : null}
    </div>
  );
}
