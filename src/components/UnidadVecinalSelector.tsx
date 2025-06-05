import { useMapStore } from "../store/useMapStore";

export const UnidadVecinalSelector = () => {
  // Obtener el estado de la región, comuna seleccionada, GeoJSON de la región y funciones para actualizar el estado
  // desde la store de Zustand
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

  // Función para manejar el cambio de unidad vecinal
  // Esta función actualiza el estado de la unidad vecinal seleccionada
  // y se llama al seleccionar una unidad vecinal del dropdown con el evento onChange
  const handleUVChange = (uvName: string | null) => {
    setSelectedUnidadVecinal(uvName);
  };

  if (!regionGeoJSON) return null;

  return (
    <div className="selector-container">
      <select
        className="selector"
        onChange={(e) => handleUVChange(e.target.value || null)}
        value={selectedUnidadVecinal || ""}
        disabled={loading}>
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
