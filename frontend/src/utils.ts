import { useCallback, useEffect, useRef, useState } from "react";

export function readCache<T>(key: string) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore cache failure
  }
}

export function useAsyncData<T>(
  loader: () => Promise<T>,
  options: {
    cacheKey?: string;
    enabled?: boolean;
    initialData?: T;
  } = {},
) {
  const { cacheKey, enabled = true, initialData } = options;
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  const [data, setData] = useState<T | undefined>(() => {
    if (initialData !== undefined) return initialData;
    if (!cacheKey) return undefined;
    return readCache<T>(cacheKey) ?? undefined;
  });
  const [loading, setLoading] = useState(enabled && data === undefined);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await loaderRef.current();
      setData(result);
      if (cacheKey) writeCache(cacheKey, result);
    } catch (error) {
      const cached = cacheKey ? readCache<T>(cacheKey) : null;
      if (cached) {
        setData(cached);
        setError("Backend není dostupný. Zobrazuji poslední uložená data.");
      } else {
        setError(error instanceof Error ? error.message : "Nepodařilo se načíst data.");
      }
    } finally {
      setLoading(false);
    }
  }, [cacheKey, enabled]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, setData, loading, error, reload };
}
