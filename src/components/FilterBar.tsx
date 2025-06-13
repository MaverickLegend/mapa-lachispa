import { useMapStore } from "../store/useMapStore";
import { CommuneSelector } from "./CommuneSelector";
import { RegionSelector } from "./RegionSelector";
import { UnidadVecinalSelector } from "./UnidadVecinalSelector";
import { FiltroJJVV } from "./FiltroJJVV";

export const FilterBar = () => {
  const { clearFilters } = useMapStore();
  // Esta función se encarga de limpiar la selección de región}

  return (
    <div className="filterbar-container">
      <RegionSelector />
      <h1>Implementar filtro provincia</h1>
      <CommuneSelector />
      <UnidadVecinalSelector />
      <FiltroJJVV />
      <h1>Implementar ubicación</h1>
      <div>
        <button onClick={clearFilters()} className="btn">
          Limpiar selección
        </button>
      </div>
    </div>
  );
};
