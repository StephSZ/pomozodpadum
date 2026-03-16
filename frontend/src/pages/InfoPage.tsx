import { Card, ErrorState, LoadingState } from "../components";
import { api } from "../lib/api";
import { useAsyncData } from "../utils";

export function InfoPage() {
  const containers = useAsyncData(() => api.getContainers(), {
    cacheKey: "containers-info",
  });

  if (containers.loading && !containers.data) {
    return <LoadingState label="Načítám průvodce třídění..." />;
  }

  if (containers.error && !containers.data) {
    return <ErrorState message={containers.error} onRetry={containers.reload} />;
  }

  if (!containers.data) {
    return <ErrorState message="Průvodce třídění není k dispozici." />;
  }

  return (
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
  );
}
