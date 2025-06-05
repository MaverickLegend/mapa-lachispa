import { useEffect } from "react";
import { useMapStore } from "../store/useMapStore";

export const RegionSelector = () => {
  const { loadRegions, regionList, selectedRegion, setSelectedRegion, loadRegionGeoJSON, loading, regionGeoJSON } =
    useMapStore();

  // Cargar lista de regiones al montar el componente

  useEffect(() => {
    loadRegions();
  }, []);

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
    <div style={{ padding: "1rem", background: "#f0f0f0", zIndex: 1000, color: "black" }}>
      <select
        onChange={(e) => handleRegionSelect(e.target.value)}
        value={selectedRegion?.slug || ""}
        style={{ width: "100%", background: "white", padding: "0.5rem" }}
        disabled={loading}>
        <option value="">Selecciona una región</option>
        {regionList.map((region) => (
          <option key={region.id} value={region.slug}>
            {region.name}
          </option>
        ))}
      </select>

      {loading && <div className="mt-1">Cargando unidades vecinales...</div>}

      {selectedRegion && regionGeoJSON && (
        <div style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
          <strong>{selectedRegion.name}</strong>
          <br />
          Unidades vecinales: {regionGeoJSON.features.length}
        </div>
      )}
    </div>
  );
};
