import { MapPin } from "lucide-react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ScanPage } from "./pages/ScanPage";
import { WastePage } from "./pages/WastePage";
import { HistoryPage } from "./pages/HistoryPage";
import { StatsPage } from "./pages/StatsPage";
import { InfoPage } from "./pages/InfoPage";
import { MapPage } from "./pages/MapPage";
import { CatalogPage } from "./pages/CatalogPage";

function Layout() {
  const items = [
    { to: "/", label: "Domů" },
    { to: "/scan", label: "Skenovat" },
    { to: "/stats", label: "Statistiky" },
    { to: "/map", label: "Mapa", icon: <MapPin size={16} /> },
    { to: "/catalog", label: "Katalog" },
    { to: "/history", label: "Historie" },
    { to: "/info", label: "Info" },
  ];

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar__logo">
          <img src="/logo.png" alt="Pomoz Odpadům" className="topbar__logo-img" />
          <span className="topbar__logo-text">Pomoz Odpadům</span>
        </div>
        <nav className="topbar__nav">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}
            >
              {"icon" in item ? <span className="nav__icon">{item.icon}</span> : null}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<ScanPage />} path="/scan" />
        <Route element={<WastePage />} path="/waste/:id" />
        <Route element={<HistoryPage />} path="/history" />
        <Route element={<StatsPage />} path="/stats" />
        <Route element={<MapPage />} path="/map" />
        <Route element={<CatalogPage />} path="/catalog" />
        <Route element={<InfoPage />} path="/info" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </div>
  );
}

export default function App() {
  return <Layout />;
}
