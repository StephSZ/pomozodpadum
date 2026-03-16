import type {
  AnalyzeResponse,
  ContainerInfo,
  DailyTip,
  HistoryResponse,
  StatsResponse,
  UserCorrection,
  WasteCatalogItem,
  WasteCatalogResponse,
  WasteItem,
} from "../types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: "Chyba serveru" }));
    throw new Error(payload.error || `HTTP ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  return parseResponse<T>(response);
}

export const api = {
  analyzeWaste(formData: FormData) {
    return fetchApi<AnalyzeResponse>("/analyze", {
      method: "POST",
      body: formData,
    });
  },
  getWaste(id: string) {
    return fetchApi<WasteItem>(`/waste/${id}`);
  },
  getHistory(params?: {
    search?: string;
    container?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();

    if (params?.search) {
      searchParams.set("search", params.search);
    }

    if (params?.container) {
      searchParams.set("container", params.container);
    }

    if (params?.page) {
      searchParams.set("page", String(params.page));
    }

    if (params?.limit) {
      searchParams.set("limit", String(params.limit));
    }

    const suffix = searchParams.toString();
    return fetchApi<HistoryResponse>(`/history${suffix ? `?${suffix}` : ""}`);
  },
  deleteHistoryItem(id: string) {
    return fetchApi<{ success: boolean; message: string }>(`/history/${id}`, {
      method: "DELETE",
    });
  },
  submitCorrection(data: UserCorrection) {
    return fetchApi<{
      success: boolean;
      correction: UserCorrection;
      updatedWaste: WasteItem;
    }>("/corrections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getTodayTip() {
    return fetchApi<DailyTip>("/tips/today");
  },
  getStats() {
    return fetchApi<StatsResponse>("/stats");
  },
  getContainers() {
    return fetchApi<ContainerInfo[]>("/containers");
  },
  getContainer(type: string) {
    return fetchApi<ContainerInfo>(`/containers/${type}`);
  },
  getCatalog(params?: {
    search?: string;
    letter?: string;
    category?: string;
  }) {
    const searchParams = new URLSearchParams();

    if (params?.search) {
      searchParams.set("search", params.search);
    }

    if (params?.letter) {
      searchParams.set("letter", params.letter);
    }

    if (params?.category) {
      searchParams.set("category", params.category);
    }

    const suffix = searchParams.toString();
    return fetchApi<WasteCatalogResponse>(`/catalog${suffix ? `?${suffix}` : ""}`);
  },
  getCatalogItem(id: string) {
    return fetchApi<WasteCatalogItem>(`/catalog/${id}`);
  },
};
