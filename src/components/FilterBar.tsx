import { useMapStore } from "../store/useMapStore";
import { CommuneSelector } from "./CommuneSelector";
import { RegionSelector } from "./RegionSelector";
import { UnidadVecinalSelector } from "./UnidadVecinalSelector";

export const FilterBar = () => {
  const { setSelectedRegion } = useMapStore();
  // Esta función se encarga de limpiar la selección de región}

  return (
    <div className="filterbar-container">
      <RegionSelector />
      <h1>Implementar filtro provincia</h1>
      <CommuneSelector />
      <UnidadVecinalSelector />
      <h1>Implementar filtro JJVV</h1>
      <h1>Implementar ubicación</h1>
      <div>
        <button onClick={() => setSelectedRegion(null)} className="btn">
          Limpiar selección
        </button>
      </div>
    </div>
  );
};
