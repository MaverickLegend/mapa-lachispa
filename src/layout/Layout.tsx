import type { ReactNode } from "react";
import "./Layout.css";
import { FilterBar } from "../components/FilterBar";
import { MapView } from "../components/MapView";
import { ShowInfo } from "../components/ShowInfo";
import { useMapStore } from "../store/useMapStore";

export const Layout: React.FC<{ children: ReactNode }> = () => {
  const { selectedRegion } = useMapStore();

  return (
    <div className="my-container">
      <header className="bg-gray-800 text-white">
        <FilterBar />
      </header>
      <main className="main-content">
        <MapView />
        {selectedRegion && <ShowInfo />}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2023 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};
