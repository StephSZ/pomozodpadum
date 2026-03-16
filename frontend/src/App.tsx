import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ScanPage } from "./pages/ScanPage";
import { WastePage } from "./pages/WastePage";
import { HistoryPage } from "./pages/HistoryPage";
import { StatsPage } from "./pages/StatsPage";
import { InfoPage } from "./pages/InfoPage";

function Layout() {
  const items = [
    { to: "/", label: "Domu" },
    { to: "/scan", label: "Skenovat" },
    { to: "/history", label: "Historie" },
    { to: "/stats", label: "Statistiky" },
    { to: "/info", label: "Info" },
  ];

  return (
    <div className="shell">
      <header className="hero">
        <p className="hero__eyebrow">Pomoz Odpadum</p>
        <h1>Prakticky AI pruvodce trideni odpadu</h1>
        <p className="hero__text">
          Vyfotte odpad, ziskejte doporuceni kontejneru, ulozte historii a
          sledujte svoje tridici navyky.
        </p>
      </header>

      <nav className="nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<ScanPage />} path="/scan" />
        <Route element={<WastePage />} path="/waste/:id" />
        <Route element={<HistoryPage />} path="/history" />
        <Route element={<StatsPage />} path="/stats" />
        <Route element={<InfoPage />} path="/info" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </div>
  );
}

export default function App() {
  return <Layout />;
}
