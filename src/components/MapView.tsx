import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../store/useMapStore";
import { MapGeoJson } from "./MapGeoJson";
import { UnidadVecinalSelector } from "./UnidadVecinalSelector"; // 🔥 NUEVO
import "leaflet/dist/leaflet.css";
import { RegionSelector } from "./RegionSelector";
import { CommuneSelector } from "./CommuneSelector";

// Estilos CSS para el tooltip personalizado 
// TODO : Mover a un archivo CSS separado
const tooltipStyles = `
  .custom-tooltip {
    background: rgba(255, 255, 255, 0.95) !important;
    border: 1px solid #ddd !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  }
  .custom-tooltip::before {
    border-top-color: #ddd !important;
  }
`;

const mapStyles = {
  container: {
    display: "flex",
    flexDirection: "row" as const,
    height: "100vh",
    width: "100vw",
    position: "relative" as const,
  },
  sidebar: {
    width: "300px",
    background: "#f8f9fa",
    borderRight: "1px solid #dee2e6",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "auto",
  },
  map: {
    flex: 1,
    minHeight: "400px",
    zIndex: 1,
  },
};

export const MapView = () => {
  const { selectedRegion, regionGeoJSON, position, selectedUnidadVecinal } = useMapStore();

  return (
    <>
      {/* Inyectar estilos CSS para tooltips */}
      <style>{tooltipStyles}</style>

      <div style={mapStyles.container}>
        {/* Sidebar*/}
        <div style={mapStyles.sidebar}>
          <RegionSelector />
          {selectedRegion && <CommuneSelector />}
          {selectedRegion && <UnidadVecinalSelector />}
          {/* Panel de información */}
          {selectedUnidadVecinal && (
            <div
              style={{
                padding: "1rem",
                background: "#e8f4fd",
                borderTop: "1px solid #bee5eb",
                margin: "0 1rem",
                borderRadius: "4px",
                fontSize: "0.9rem",
              }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#0c5460" }}>🎯 UV Seleccionada</h4>
              <div style={{ color: "#0c5460" }}>
                <strong>{selectedUnidadVecinal}</strong>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6c757d", marginTop: "4px" }}>
                Click en el mapa o cambia la selección para ver otras UV
              </div>
            </div>
          )}
        </div>

        {/* Mapa principal */}
        <MapContainer center={position} zoom={12} style={mapStyles.map} key={`${position[0]}-${position[1]}`}>
          <LayersControl position="topright" key={`layers-${selectedRegion?.slug || "default"}`}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />

            {/* Capa de unidades vecinales */}
            {regionGeoJSON && selectedRegion && (
              <LayersControl.Overlay name={`Unidades Vecinales - ${selectedRegion.name}`} checked>
                <MapGeoJson />
              </LayersControl.Overlay>
            )}
          </LayersControl>

          {/* Marcador en el centroide de la región seleccionada - solo si no hay UV seleccionada */}
          {selectedRegion && !selectedUnidadVecinal && (
            <Marker position={position as LatLngExpression}>
              <Popup>
                <strong>{selectedRegion.name}</strong>
                <br />
                Lat: {selectedRegion.centroide[0].toFixed(4)}
                <br />
                Lon: {selectedRegion.centroide[1].toFixed(4)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </>
  );
};
