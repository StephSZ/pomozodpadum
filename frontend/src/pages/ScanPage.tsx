import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, ErrorState } from "../components";
import { api } from "../lib/api";

export function ScanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const preview = useMemo(() => {
    if (!file) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  async function handleAnalyze() {
    if (!file) {
      setError("Vyberte prosim JPEG, PNG nebo WebP soubor.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await api.analyzeWaste(formData);
      navigate(`/waste/${result.waste.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Analyza se nezdarila.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Skenuj odpad">
      <div className="stack">
        <label className="upload">
          <span>Vyberte fotku odpadu</span>
          <input
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            type="file"
          />
        </label>
        {preview ? <img alt="Nahled odpadu" className="preview" src={preview} /> : null}
        {error ? <ErrorState message={error} /> : null}
        <button className="button" disabled={loading} onClick={() => void handleAnalyze()}>
          {loading ? "Analyzuji..." : "Analyzovat"}
        </button>
      </div>
    </Card>
  );
}
