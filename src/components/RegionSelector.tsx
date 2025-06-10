import { useEffect } from "react";
import { useMapStore } from "../store/useMapStore";

export const RegionSelector = () => {
  // Obtener el estado de la región, comuna seleccionada, GeoJSON de la región y funciones para actualizar el estado
  // desde la store de Zustand
  const { loadRegions, regionList, selectedRegion, setSelectedRegion, loadRegionGeoJSON, loading, regionGeoJSON } =
    useMapStore();

  // Cargar lista de regiones al montar el componente con useEffect
  // Esto se hace una sola vez para evitar múltiples llamadas innecesarias

  useEffect(() => {
    loadRegions();
  }, []);

  // Función para manejar el cambio de región que se llama al seleccionar una región del dropdown con el evento onChange
  // Esta función actualiza el estado de la región seleccionada y carga el GeoJSON de la región
  // Llamando a la función loadRegionGeoJSON desde la store

  const handleRegionSelect = (slug: string) => {
    if (!slug) {
      setSelectedRegion(null);
      return;
    }

    const region = regionList.find((r) => r.slug === slug);
    if (region) {
      setSelectedRegion(region);
      loadRegionGeoJSON();
    }
  };

  return (
    <div className="selector-container">
      <select
        className="selector"
        onChange={(e) => handleRegionSelect(e.target.value)}
        value={selectedRegion?.slug || ""}
        disabled={loading}>
        <option value="">Selecciona una región</option>
        {regionList.map((region) => (
          <option key={region.id} value={region.slug}>
            {region.name}
          </option>
        ))}
      </select>

      {/* TODO */}
      {/* Implementar componente Loader  */}

      {/* {loading && <div className="mt-1">Cargando unidades vecinales...</div>} */}

      {/* {selectedRegion && regionGeoJSON && (
        <div style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
          <strong>{selectedRegion.name}</strong>
          <br />
          Unidades vecinales: {regionGeoJSON.features.length}
        </div>
      )} */}
    </div>
  );
};
