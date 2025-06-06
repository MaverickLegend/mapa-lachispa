import { GeoJSON } from "react-leaflet";
import { useMapStore } from "../store/useMapStore";
import type { FeatureCollection, Feature, Geometry, GeoJsonProperties } from "geojson";
import type { LeafletMouseEvent } from "leaflet";

export const MapGeoJson = () => {
  // Obtener el estado de la región, comuna seleccionada, GeoJSON de la región y funciones para actualizar el estado global
  // desde la store de Zustand
  const {
    selectedRegion,
    selectedCommune,
    selectedUnidadVecinal,
    getFilteredUVFeatures,
    regionGeoJSON,
    setSelectedUnidadVecinal,
    setHoveredFeature,
    geoJsonVersion,
  } = useMapStore();

  if (!regionGeoJSON || !selectedRegion) return null;

  // Feature collection es una funcionaliad propia de la librería GeoJSON
  // Crear FeatureCollection filtrada
  const filteredFeatures: FeatureCollection = {
    type: "FeatureCollection",
    features: getFilteredUVFeatures() as Feature<Geometry, GeoJsonProperties>[],
  };

  // Key con versión que se incrementa al cambiar región
  // Esto fuerza a Leaflet a recargar el GeoJSON cuando cambia la región o UV
  const geoJsonKey = `geojson-${selectedRegion.slug}-${selectedCommune || "all"}-${
    selectedUnidadVecinal || "all"
  }-v${geoJsonVersion}`;

  return (
    <GeoJSON
      key={geoJsonKey}
      data={filteredFeatures}
      style={(feature) => {
        const isSelected = feature?.properties?.t_uv_nom === selectedUnidadVecinal;

        return {
          color: isSelected ? "#ff6b35" : "#3388ff",
          weight: isSelected ? 3 : 1,
          opacity: isSelected ? 1 : 0.8,
          fillOpacity: isSelected ? 0.4 : 0.2,
          fillColor: isSelected ? "#ff6b35" : "#3388ff",
        };
      }}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;

        if (props?.t_uv_nom) {
          // Click para aislar unidad vecinal
          layer.on("click", (e: LeafletMouseEvent) => {
            e.originalEvent.stopPropagation();

            const uvName = props.t_uv_nom;
            const isCurrentlySelected = selectedUnidadVecinal === uvName;

            if (isCurrentlySelected) {
              // Si ya está seleccionada, deseleccionar
              setSelectedUnidadVecinal(null);
            } else {
              // Seleccionar nueva UV y centrar en ella
              setSelectedUnidadVecinal(uvName);
            }

            console.log(`UV ${isCurrentlySelected ? "deseleccionada" : "seleccionada"}: ${uvName}`);
          });

          // Hover para mostrar información
          layer.on("mouseover", (e: LeafletMouseEvent) => {
            const layer = e.target as L.Path;

            // Cambiar estilo en hover si no está seleccionada
            if (props.t_uv_nom !== selectedUnidadVecinal) {
              layer.setStyle({
                color: "#ff9f43",
                weight: 2,
                fillOpacity: 0.3,
              });
            }

            // Mostrar tooltip
            setHoveredFeature(feature as any);

            // Crear popup temporal con información
            const tooltipContent = `
              <div style="font-family: Arial, sans-serif; min-width: 200px;">
                <strong style="color: #2c3e50; font-size: 14px;">${props.t_uv_nom}</strong>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid #ecf0f1;">
                <div style="font-size: 12px; color: #7f8c8d;">
                  <div style="margin: 4px 0;"><strong>Comuna:</strong> ${props.t_com_nom || "N/A"}</div>
                  <div style="margin: 4px 0;"><strong>Provincia:</strong> ${props.t_prov_nom || "N/A"}</div>
                  <div style="margin: 4px 0;"><strong>Región:</strong> ${props.t_reg_nom || "N/A"}</div>
                </div>
                <div style="font-size: 11px; color: #95a5a6; margin-top: 8px; font-style: italic;">
                  Click para aislar esta unidad vecinal
                </div>
              </div>
            `;

            layer
              .bindTooltip(tooltipContent, {
                permanent: false,
                direction: "top",
                offset: [0, -10],
                className: "custom-tooltip",
              })
              .openTooltip();
          });

          // Mouseleave para restaurar estilo
          layer.on("mouseout", (e: LeafletMouseEvent) => {
            const layer = e.target as L.Path;

            // Restaurar estilo original si no está seleccionada
            if (props.t_uv_nom !== selectedUnidadVecinal) {
              layer.setStyle({
                color: "#3388ff",
                weight: 1,
                fillOpacity: 0.2,
              });
            }

            // Cerrar tooltip
            setHoveredFeature(null);
            layer.closeTooltip();
          });
        }
      }}
    />
  );
};
