import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const GALLERY_ITEMS = [
  { cat: "Plasty", containerColor: "žlutý", color: "#f9a825", bg: "#fffde7", svgId: "plasty" },
  { cat: "Papír", containerColor: "modrý", color: "#1e88e5", bg: "#e3f2fd", svgId: "papir" },
  { cat: "Sklo", containerColor: "zelený/bílý", color: "#2e7d32", bg: "#e8f5e9", svgId: "sklo" },
  { cat: "Nápojové kartony", containerColor: "oranžový", color: "#e65100", bg: "#fff3e0", svgId: "kartony" },
  { cat: "Kovy", containerColor: "červený/šedý", color: "#c62828", bg: "#ffebee", svgId: "kovy" },
  { cat: "Bioodpad", containerColor: "hnědý", color: "#6d4c41", bg: "#efebe9", svgId: "bio" },
  { cat: "Elektroodpad", containerColor: "sběrné dvory / obchody", color: "#1565c0", bg: "#e3f2fd", svgId: "elektro" },
  { cat: "Směsný odpad", containerColor: "černý/šedý", color: "#616161", bg: "#f5f5f5", svgId: "smes" },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

function seededShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  let seed = getDayOfYear();
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(seed) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function WasteIcon({ id }: { id: string }) {
  switch (id) {
    case "plasty":
      return (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <rect x="40" y="35" width="20" height="44" rx="7" fill="#f9a825"/>
          <rect x="43" y="24" width="14" height="14" rx="4" fill="#f57f17"/>
          <rect x="41" y="20" width="18" height="8" rx="3" fill="#e65100"/>
          <rect x="45" y="40" width="4" height="20" rx="2" fill="white" opacity=".3"/>
          <ellipse cx="50" cy="79" rx="10" ry="3" fill="#f57f17" opacity=".4"/>
        </svg>
      );
    case "papir":
      return (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <rect x="20" y="30" width="36" height="46" rx="3" fill="#1565c0" opacity=".3"/>
          <rect x="28" y="24" width="36" height="46" rx="3" fill="#1976d2" opacity=".5"/>
          <rect x="36" y="18" width="36" height="46" rx="3" fill="#1e88e5"/>
          <rect x="42" y="28" width="22" height="2.5" rx="1.2" fill="white" opacity=".5"/>
          <rect x="42" y="35" width="18" height="2.5" rx="1.2" fill="white" opacity=".4"/>
          <rect x="42" y="42" width="20" height="2.5" rx="1.2" fill="white" opacity=".4"/>
          <rect x="42" y="49" width="14" height="2.5" rx="1.2" fill="white" opacity=".3"/>
        </svg>
      );
    case "sklo":
      return (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path d="M42 52 C38 58 36 65 36 74 C36 86 44 92 50 92 C56 92 64 86 64 74 C64 65 62 58 58 52 Z" fill="#2e7d32"/>
          <path d="M44 42 C42 46 42 50 42 52 L58 52 C58 50 58 46 56 42 Z" fill="#388e3c"/>
          <rect x="44" y="24" width="12" height="20" rx="3" fill="#1b5e20"/>
          <rect x="42" y="20" width="16" height="8" rx="3" fill="#2e7d32"/>
          <path d="M42 58 Q40 68 40 76" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity=".2"/>
          <rect x="47" y="27" width="3" height="13" rx="1.5" fill="white" opacity=".2"/>
          <path d="M36 74 C36 86 44 92 50 92 C56 92 64 86 64 74" fill="#1b5e20" opacity=".3"/>
        </svg>
      );
    case "kartony":
      return (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <rect x="30" y="32" width="40" height="50" rx="3" fill="#e65100" opacity=".15"/>
          <rect x="30" y="32" width="40" height="50" rx="3" stroke="#e65100" strokeWidth="2.5" fill="none"/>
          <path d="M30 32 L50 20 L70 32" fill="#e65100" opacity=".3"/>
          <path d="M30 32 L50 20 L70 32" stroke="#e65100" strokeWidth="2" fill="none"/>
          <line x1="50" y1="20" x2="50" y2="32" stroke="#e65100" strokeWidth="1.5" opacity=".5"/>
          <rect x="36" y="42" width="28" height="18" rx="2" fill="#e65100" opacity=".1"/>
          <rect x="38" y="46" width="20" height="2.5" rx="1" fill="#e65100" opacity=".5"/>
          <rect x="38" y="52" width="14" height="2.5" rx="1" fill="#e65100" opacity=".4"/>
          <rect x="44" y="23" width="12" height="6" rx="2" fill="#bf360c" opacity=".6"/>
        </svg>
      );
    case "kovy":
      return (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <rect x="30" y="36" width="40" height="50" rx="4" fill="#c62828"/>
          <rect x="30" y="36" width="40" height="50" rx="4" fill="white" opacity=".06"/>
          <ellipse cx="50" cy="36" rx="20" ry="6.5" fill="#b71c1c"/>
          <ellipse cx="50" cy="86" rx="20" ry="6.5" fill="#7f0000"/>
          <path d="M45 29 Q50 20 55 29" stroke="#7f0000" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <circle cx="50" cy="29" r="2.5" fill="#7f0000"/>
          <rect x="36" y="42" width="5" height="34" rx="2.5" fill="white" opacity=".18"/>
          <rect x="30" y="54" width="40" height="1.5" fill="white" opacity=".15"/>
          <rect x="30" y="65" width="40" height="1.5" fill="white" opacity=".15"/>
        </svg>
      );
    case "bio":
      return (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="64" rx="22" ry="22" fill="#6d4c41"/>
          <ellipse cx="50" cy="64" rx="22" ry="22" fill="#4e342e" opacity=".2"/>
          <path d="M50 40 Q62 30 64 42 Q56 46 50 40Z" fill="#558b2f"/>
          <path d="M50 40 Q38 30 36 42 Q44 46 50 40Z" fill="#7cb342"/>
          <rect x="48" y="34" width="4" height="10" rx="2" fill="#33691e"/>
          <ellipse cx="43" cy="56" rx="5" ry="8" fill="white" opacity=".12" transform="rotate(-20 43 56)"/>
        </svg>
      );
    case "elektro":
      return (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <rect x="30" y="18" width="40" height="68" rx="8" fill="#1565c0" opacity=".15"/>
          <rect x="30" y="18" width="40" height="68" rx="8" stroke="#1565c0" strokeWidth="2.5" fill="none"/>
          <rect x="34" y="26" width="32" height="44" rx="4" fill="#1976d2" opacity=".12"/>
          <rect x="34" y="26" width="32" height="44" rx="4" stroke="#1565c0" strokeWidth="1" fill="none"/>
          <circle cx="50" cy="78" r="4" stroke="#1565c0" strokeWidth="1.5" fill="none"/>
          <circle cx="50" cy="22" r="2.5" fill="#1565c0" opacity=".5"/>
          <circle cx="50" cy="48" r="10" fill="#1976d2" opacity=".15"/>
          <path d="M46 48 L54 44 L54 52 Z" fill="#1976d2" opacity=".7"/>
        </svg>
      );
    case "smes":
      return (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path d="M28 42 L32 82 Q32 86 36 86 L64 86 Q68 86 68 82 L72 42 Z" fill="#616161" opacity=".2"/>
          <path d="M28 42 L32 82 Q32 86 36 86 L64 86 Q68 86 68 82 L72 42 Z" stroke="#616161" strokeWidth="2.5" fill="none"/>
          <rect x="22" y="34" width="56" height="10" rx="4" fill="#757575" opacity=".5"/>
          <path d="M42 34 Q42 26 50 26 Q58 26 58 34" stroke="#424242" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <line x1="40" y1="48" x2="38" y2="80" stroke="#616161" strokeWidth="1.5" opacity=".3"/>
          <line x1="50" y1="48" x2="50" y2="80" stroke="#616161" strokeWidth="1.5" opacity=".3"/>
          <line x1="60" y1="48" x2="62" y2="80" stroke="#616161" strokeWidth="1.5" opacity=".3"/>
        </svg>
      );
    default:
      return null;
  }
}

const ITEMS = seededShuffle(GALLERY_ITEMS);
const VISIBLE = 4;
const GAP = 12;

export function WasteGallery() {
  const navigate = useNavigate();
  const [pos, setPos] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pages = ITEMS.length - VISIBLE + 1;

  useEffect(() => {
    function recalc() {
      const shell = document.querySelector(".shell") as HTMLElement;
      const w = shell ? shell.getBoundingClientRect().width : window.innerWidth;
      if (w > 0) {
        setItemWidth(Math.floor((w - GAP * (VISIBLE - 1)) / VISIBLE));
      }
    }
    recalc();
    const timer = setTimeout(recalc, 100);
    window.addEventListener("resize", recalc);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", recalc);
    };
  }, []);

  return (
    <div className="waste-gallery" style={{ maxWidth: "100%", overflow: "hidden" }}>
      <div className="waste-gallery__top">
        <a className="waste-gallery__title" href="/catalog">Třídění a recyklace</a>
        <p className="waste-gallery__sub">Kam s tím a další zajímavosti</p>
      </div>

      <div className="waste-gallery__controls">
        <div className="waste-gallery__arrows">
          <button className="waste-gallery__arrow" disabled={pos === 0} onClick={() => setPos(p => p - 1)}>&#8592;</button>
          <button className="waste-gallery__arrow" disabled={pos >= pages - 1} onClick={() => setPos(p => p + 1)}>&#8594;</button>
        </div>
        <a className="waste-gallery__hint" href="/catalog">Více informací</a>
      </div>

      <div className="waste-gallery__track-wrap" ref={wrapRef} style={{ overflow: "hidden", width: "100%" }}>
        <div
          className="waste-gallery__track"
          style={{ transform: `translateX(-${pos * (itemWidth + GAP)}px)` }}
        >
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="waste-gallery__item"
              style={{ width: `${itemWidth}px`, flexShrink: 0 }}
              onClick={() => navigate("/catalog")}
            >
              <div className="waste-gallery__illu" style={{ background: item.bg }}>
                <WasteIcon id={item.svgId} />
              </div>
              <div className="waste-gallery__foot">
                <p className="waste-gallery__cat">kontejner: {item.containerColor}</p>
                <p className="waste-gallery__label">{item.cat}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="waste-gallery__dots">
        {Array.from({ length: pages }).map((_, i) => (
          <span
            key={i}
            className={`waste-gallery__dot${i === pos ? " waste-gallery__dot--active" : ""}`}
            onClick={() => setPos(i)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>
    </div>
  );
}
