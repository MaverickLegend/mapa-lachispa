import { useMapStore } from "../store/useMapStore";

export const UnidadVecinalSelector = () => {
  const { regionGeoJSON, selectedCommune, selectedUnidadVecinal, setSelectedUnidadVecinal, loading } = useMapStore();

  // Obtener unidades vecinales disponibles (filtradas por comuna si está seleccionada)
  const unidadesVecinales = regionGeoJSON
    ? regionGeoJSON.features
        .filter((f) => !selectedCommune || f.properties.t_com === selectedCommune)
        .map((f) => ({
          name: f.properties.t_uv_nom,
          commune: f.properties.t_com_nom,
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const handleUVChange = (uvName: string | null) => {
    setSelectedUnidadVecinal(uvName);
  };

  if (!regionGeoJSON) return null;

  return (
    <div style={{ padding: "1rem", background: "#f0f0f0", zIndex: 1000, color: "black" }}>
      <select
        onChange={(e) => handleUVChange(e.target.value || null)}
        value={selectedUnidadVecinal || ""}
        disabled={loading}
        style={{ width: "100%", background: "white", padding: "0.5rem" }}>
        <option value="">{selectedCommune ? "Todas las UV de la comuna" : "Todas las unidades vecinales"}</option>
        {unidadesVecinales.map((uv, index) => (
          <option key={`${uv.name}-${index}`} value={uv.name}>
            {uv.name} {!selectedCommune && `(${uv.commune})`}
          </option>
        ))}
      </select>

      {/* Info adicional */}
      {selectedUnidadVecinal && (
        <div style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "#666" }}>
          📍 UV seleccionada: <strong>{selectedUnidadVecinal}</strong>
          <br />
          <button
            onClick={() => setSelectedUnidadVecinal(null)}
            style={{
              fontSize: "0.7rem",
              padding: "2px 8px",
              marginTop: "4px",
              background: "#ff6b35",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}>
            Limpiar selección
          </button>
        </div>
      )}
    </div>
  );
};
