import type { PropsWithChildren } from "react";
import type { ContainerType } from "./types";

export function Card({
  title,
  children,
  action,
}: PropsWithChildren<{ title?: string; action?: React.ReactNode }>) {
  return (
    <section className="card">
      {(title || action) && (
        <div className="card__header">
          {title ? <h2>{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function LoadingState({ label = "Načítám..." }: { label?: string }) {
  return (
    <div className="state state--loading">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="state state--error">
      <p>{message}</p>
      {onRetry ? (
        <button className="button button--secondary" onClick={onRetry}>
          Zkusit znovu
        </button>
      ) : null}
    </div>
  );
}

const labels: Record<ContainerType, string> = {
  plastic: "Plast",
  paper: "Papír",
  glass: "Sklo",
  mixed: "Směsný",
  bio: "Bio",
  metal: "Kov",
  hazardous: "Nebezpečný",
  electro: "Elektro",
  carton: "Karton",
};

export function ContainerBadge({ type }: { type: ContainerType }) {
  return <span className={`badge badge--${type}`}>{labels[type]}</span>;
}
