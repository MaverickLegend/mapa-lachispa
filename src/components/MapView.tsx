import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../store/useMapStore";
import { MapGeoJson } from "./MapGeoJson";
import { UnidadVecinalSelector } from "./UnidadVecinalSelector"; // 🔥 NUEVO
import "leaflet/dist/leaflet.css";
import { RegionSelector } from "./RegionSelector";
import { CommuneSelector } from "./CommuneSelector";

export const MapView = () => {
  const { selectedRegion, regionGeoJSON, position, selectedUnidadVecinal, selectedCommune } = useMapStore();

  return (
    <div className="map-container">
      {/* Sidebar*/}
      <div className="sidebar">
        <RegionSelector />
        {selectedRegion && <CommuneSelector />}
        {selectedRegion && selectedCommune && <UnidadVecinalSelector />}

        {/* Panel de información */}
        {selectedUnidadVecinal && (
          <div className="uv-info-panel">
            <h4>🎯 UV Seleccionada</h4>
            <div>
              <strong>{selectedUnidadVecinal}</strong>
            </div>
            <div className="uv-subtext">Click en el mapa o cambia la selección para ver otras UV</div>
          </div>
        )}
      </div>

      {/* Mapa principal */}
      <MapContainer center={position} zoom={12} className="map" key={`${position[0]}-${position[1]}`}>
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
  );
};
