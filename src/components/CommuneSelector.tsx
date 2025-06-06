import { useEffect } from "react";
import { useMapStore, calculateCentroid } from "../store/useMapStore";

export const CommuneSelector = () => {
  // Obtener el estado de la región, comuna seleccionada, GeoJSON de la región y funciones para actualizar el estado
  // desde la store de Zustand
  const { regionGeoJSON, selectedCommune, setSelectedCommune, loading, setPosition, selectedRegion } = useMapStore();

  // Variable para almacenar la lista de comunas de la región actual
  // Se obtiene del GeoJSON de la región cargado en la store
  // Se usa un Map para eliminar duplicados y luego se convierte a un array de objetos con código y nombre
  // Se ordena alfabéticamente por nombre de comuna
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

  // Función para manejar el cambio de comuna que se llama al seleccionar una comuna del dropdown con el evento onChange
  // Esta función actualiza el estado de la comuna seleccionada y centra el mapa en el centroide de la comuna
  // Actualiza la

  const handleCommuneChange = (communeCode: string | null) => {
    // Actualizar la comuna seleccionada en el estado global
    setSelectedCommune(communeCode);

    // Si se selecciona una comuna, centrar el mapa en su centroide
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
      // Si no se selecciona ninguna comuna, resetear la posición al centroide de la región
      // Volver al centroide de la región
      if (selectedRegion) {
        setPosition(selectedRegion.centroide);
      }
    }
  };

  return (
    <div className="selector-container">
      <select
        onChange={(e) => handleCommuneChange(e.target.value || null)}
        value={selectedCommune || ""}
        disabled={loading || !regionGeoJSON}
        className="selector">
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
