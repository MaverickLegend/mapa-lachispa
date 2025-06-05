import { useEffect } from "react";
import { useMapStore, calculateCentroid } from "../store/useMapStore";

export const CommuneSelector = () => {
  const { regionGeoJSON, selectedCommune, setSelectedCommune, loading, setPosition, selectedRegion } = useMapStore();

  const communes = regionGeoJSON
    ? Array.from(new Map(regionGeoJSON.features.map((f) => [f.properties.t_com, f.properties.t_com_nom])).entries())
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // Auto-resetear comuna inválida
  useEffect(() => {
    if (selectedCommune && communes.length > 0) {
      const communeExists = communes.some((c) => c.code === selectedCommune);
      if (!communeExists) {
        console.log(`Comuna ${selectedCommune} no existe en la nueva región, reseteando...`);
        setSelectedCommune(null);
      }
    }
  }, [communes, selectedCommune, setSelectedCommune]);

  const handleCommuneChange = (communeCode: string | null) => {
    setSelectedCommune(communeCode);

    if (communeCode && regionGeoJSON) {
      // Calcular centroide real de la comuna
      const communeFeatures = regionGeoJSON.features.filter((f) => f.properties.t_com === communeCode);

      if (communeFeatures.length > 0) {
        // Calcular el centroide promedio de todas las features de la comuna
        let totalLat = 0;
        let totalLng = 0;
        let count = 0;

        communeFeatures.forEach((feature) => {
          const [lat, lng] = calculateCentroid(feature.geometry);
          totalLat += lat;
          totalLng += lng;
          count++;
        });

        if (count > 0) {
          const avgLat = totalLat / count;
          const avgLng = totalLng / count;
          setPosition([avgLat, avgLng]);
          console.log(`Centrando en comuna: ${communeCode} -> [${avgLat.toFixed(4)}, ${avgLng.toFixed(4)}]`);
        }
      }
    } else {
      // Volver al centroide de la región
      if (selectedRegion) {
        setPosition(selectedRegion.centroide);
      }
    }
  };

  return (
    <div style={{ padding: "1rem", background: "#f0f0f0", zIndex: 1000, color: "black" }}>
      <select
        onChange={(e) => handleCommuneChange(e.target.value || null)}
        value={selectedCommune || ""}
        disabled={loading || !regionGeoJSON}
        style={{ width: "100%", background: "white", padding: "0.5rem" }}>
        <option value="">Todas las comunas</option>
        {communes.map((commune) => (
          <option key={commune.code} value={commune.code}>
            {commune.name}
          </option>
        ))}
      </select>
    </div>
  );
};
