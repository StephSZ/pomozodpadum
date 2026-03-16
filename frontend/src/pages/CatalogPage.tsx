import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { WasteCatalogCategory, WasteCatalogResponse } from "../types";

const CATEGORY_OPTIONS: Array<{
  value: WasteCatalogCategory;
  label: string;
  className: string;
}> = [
  { value: "plasty", label: "Plasty", className: "catalog-chip--plasty" },
  { value: "papír", label: "Papír", className: "catalog-chip--papir" },
  { value: "sklo", label: "Sklo", className: "catalog-chip--sklo" },
  { value: "kovy", label: "Kovy", className: "catalog-chip--kovy" },
  {
    value: "nápojové kartony",
    label: "Nápojové kartony",
    className: "catalog-chip--kartony",
  },
  {
    value: "další odpady",
    label: "Další odpady",
    className: "catalog-chip--dalsi",
  },
];

const EMPTY_CATALOG: WasteCatalogResponse = {
  items: [],
  total: 0,
  letters: [],
  categories: [],
};

function getCategoryClassName(category: WasteCatalogCategory) {
  return (
    CATEGORY_OPTIONS.find((option) => option.value === category)?.className ?? "catalog-chip--dalsi"
  );
}

export function CatalogPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [catalog, setCatalog] = useState<WasteCatalogResponse>(EMPTY_CATALOG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    async function loadCatalog() {
      setLoading(true);
      setError(null);

      try {
        const response = await api.getCatalog({
          search: search || undefined,
          letter: activeLetter || undefined,
          category: activeCategory || undefined,
        });

        if (!cancelled) {
          setCatalog(response);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Katalog se nepodařilo načíst.");
          setCatalog(EMPTY_CATALOG);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      cancelled = true;
    };
  }, [activeCategory, activeLetter, search]);

  const availableLetters = useMemo(
    () => new Set(catalog.items.map((item) => item.letter)),
    [catalog.items],
  );

  const groupedItems = useMemo(() => {
    return catalog.letters
      .filter((letter) => catalog.items.some((item) => item.letter === letter))
      .map((letter) => ({
        letter,
        items: catalog.items.filter((item) => item.letter === letter),
      }));
  }, [catalog.items, catalog.letters]);

  function resetFilters() {
    setSearchInput("");
    setSearch("");
    setActiveLetter("");
    setActiveCategory("");
  }

  return (
    <div className="catalog-page stack">
      <section className="card">
        <div className="stack stack--tight">
          <p className="catalog-page__eyebrow">Kam patří? 📖</p>
          <h2 className="catalog-page__title">Odpadový slovníček vám pomůže stát se zdatným třídilem.</h2>
        </div>
      </section>

      <section className="catalog-toolbar">
        <div className="catalog-search">
          <Search size={18} />
          <input
            aria-label="Hledat odpad"
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Hledat odpad..."
            type="search"
            value={searchInput}
          />
        </div>

        <div className="catalog-letters" role="tablist" aria-label="Abecední filtr katalogu">
          <button
            className={activeLetter === "" ? "catalog-letter catalog-letter--active" : "catalog-letter"}
            onClick={() => setActiveLetter("")}
            type="button"
          >
            Vše
          </button>
          {catalog.letters.map((letter) => {
            const isActive = activeLetter === letter;
            const isAvailable = availableLetters.has(letter) || isActive || activeLetter !== "";

            return (
              <button
                key={letter}
                className={
                  isActive
                    ? "catalog-letter catalog-letter--active"
                    : isAvailable
                      ? "catalog-letter"
                      : "catalog-letter catalog-letter--disabled"
                }
                disabled={!isAvailable}
                onClick={() => setActiveLetter(letter)}
                type="button"
              >
                {letter}
              </button>
            );
          })}
        </div>

        <div className="catalog-categories" role="tablist" aria-label="Kategorie katalogu">
          <button
            className={activeCategory === "" ? "catalog-chip catalog-chip--active" : "catalog-chip"}
            onClick={() => setActiveCategory("")}
            type="button"
          >
            Vše
          </button>
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={
                activeCategory === option.value
                  ? `catalog-chip catalog-chip--active ${option.className}`
                  : "catalog-chip"
              }
              onClick={() => setActiveCategory(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <p className="catalog-page__count">Nalezeno: {catalog.total} položek</p>
      </section>

      {loading ? (
        <section className="grid grid--2">
          {Array.from({ length: 6 }, (_, index) => (
            <div className="catalog-card catalog-card--loading" key={index} />
          ))}
        </section>
      ) : null}

      {error ? (
        <section className="card">
          <p className="map-page__error">{error}</p>
        </section>
      ) : null}

      {!loading && !error && catalog.total === 0 ? (
        <section className="card catalog-empty">
          <div className="stack stack--tight">
            <strong>🔍 Nic jsme nenašli. Zkuste jiný výraz.</strong>
            <button className="button" onClick={resetFilters} type="button">
              Zrušit filtr
            </button>
          </div>
        </section>
      ) : null}

      {!loading && !error && catalog.total > 0 ? (
        groupedItems.map((group) => (
          <section className="stack stack--tight" key={group.letter}>
            <h3 className="catalog-group__title">{group.letter.toUpperCase()}</h3>
            <div className="grid grid--2">
              {group.items.map((item) => (
                <article className="catalog-card" key={item.id}>
                  <div className="stack stack--tight">
                    <div className="row row--wrap catalog-card__header">
                      <strong>{item.name}</strong>
                      <div className="row row--wrap">
                        {item.categories.map((category) => (
                          <span className={`catalog-badge ${getCategoryClassName(category)}`} key={category}>
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="catalog-card__description">{item.description}</p>
                    {item.tip ? <p className="catalog-card__tip">{item.tip}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      ) : null}
    </div>
  );
}
