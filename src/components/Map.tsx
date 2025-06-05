import { MapContainer, TileLayer, Marker, Popup, GeoJSON, LayersControl } from "react-leaflet";
import { type LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";
import type { RegionIndexEntry, UnidadVecinalGeoJSON } from "./region-selector.inteface";

export const Map = () => {
  // Estados para manejar la región seleccionada, lista de regiones, GeoJSON de la región y posición del mapa

  const [selectedRegion, setSelectedRegion] = useState<RegionIndexEntry | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
  const [regionesList, setRegionesList] = useState<RegionIndexEntry[]>([]);
  const [regionGeoJSON, setRegionGeoJSON] = useState<UnidadVecinalGeoJSON | null>(null);
  const [position, setPosition] = useState<[number, number]>([-33.04820461451196, -71.45584440972384]);
  const [loading, setLoading] = useState<boolean>(false);

  // Cargar el índice de regiones al montar el componente

  useEffect(() => {
    fetch("/geojson/regiones.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((data: RegionIndexEntry[]) => setRegionesList(data))
      .catch((error) => {
        console.error("Error cargando regiones:", error);
      });
  }, []);

  // Cargar GeoJSON de la región seleccionada - Corregir a futuro para evitar el re-render innecesario

  useEffect(() => {
    if (!selectedRegion) {
      setRegionGeoJSON(null);
      return;
    }

    const loadRegionData = async () => {
      setLoading(true);
      try {
        console.log("Cargando región:", selectedRegion.name);
        const res = await fetch(`/geojson/${selectedRegion.slug}.json`);

        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudo cargar el archivo ${selectedRegion.slug}.json`);
        }

        const data: UnidadVecinalGeoJSON = await res.json();
        setRegionGeoJSON(data);
        console.log(`GeoJSON cargado para ${selectedRegion.name}:`, data);
      } catch (error) {
        console.error("Error cargando región:", error);
        setRegionGeoJSON(null);
      } finally {
        setLoading(false);
      }
    };

    loadRegionData();
  }, [selectedRegion]);

  const handleRegionSelect = (slug: string) => {
    if (!slug) {
      setSelectedRegion(null);
      setPosition([-33.04820461451196, -71.45584440972384]); // Posición inicial de Chile
      return;
    }

    const region = regionesList.find((r) => r.slug === slug);
    if (!region) return;

    setSelectedRegion(region);
    setPosition(region.centroide);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      {/* Selector de Regiones */}
      <div style={{ padding: "1rem", background: "#f0f0f0", zIndex: 1000, color: "black" }}>
        <select
          onChange={(e) => handleRegionSelect(e.target.value)}
          value={selectedRegion?.slug || ""}
          style={{ width: "100%", background: "white", padding: "0.5rem" }}
          disabled={loading}>
          <option value="">Selecciona una región</option>
          {regionesList.map((region) => (
            <option key={region.slug} value={region.slug}>
              {region.name}
            </option>
          ))}
        </select>
        {selectedRegion && (
          <select>
            <option value="">Selecciona una comuna</option>
            {regionGeoJSON?.features.map((feature) => (
              <option key={feature.properties.t_com} value={feature.properties.t_com}>
                {feature.properties.t_com_nom}
              </option>
            ))}
          </select>
        )}

        {loading && <div className="mt-1">Cargando unidades vecinales...</div>}

        {selectedRegion && regionGeoJSON && (
          <div style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
            <strong>{selectedRegion.name}</strong>
            <br />
            Unidades vecinales: {regionGeoJSON.features.length}
          </div>
        )}
      </div>

      {/* Mapa */}
      <MapContainer
        center={position}
        zoom={selectedRegion ? 8 : 6}
        style={{ flex: 1 }}
        key={`${position[0]}-${position[1]}`}>
        {/* Capa base */}
        <LayersControl position="topright" key={`layers-${selectedRegion?.slug || "default"}`}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" />

          {/* Capa de unidades vecinales - solo se muestra cuando hay una región seleccionada */}
          {regionGeoJSON && selectedRegion && (
            <LayersControl.Overlay name={`Unidades Vecinales - ${selectedRegion.name}`} checked>
              <GeoJSON
                key={`geojson-${selectedRegion.slug}-${Date.now()}`} // Key única con timestamp, DOLOR DE CABEZA SOLUCIONADO
                data={regionGeoJSON}
                style={{
                  color: "#3388ff",
                  weight: 1,
                  opacity: 0.8,
                  fillOpacity: 0.2,
                }}
                onEachFeature={(feature, layer) => {
                  const props = feature.properties;
                  if (props?.t_uv_nom) {
                    const popupContent = `
                      <div>
                        <strong>${props.t_uv_nom}</strong><br/>
                        <small>
                          Comuna: ${props.t_com_nom || "N/A"}<br/>
                          Provincia: ${props.t_prov_nom || "N/A"}<br/>
                          Región: ${props.t_reg_nom || "N/A"}
                        </small>
                      </div>
                    `;
                    layer.bindPopup(popupContent);
                  }
                }}
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>

        {/* Marcador en el centroide de la región seleccionada */}
        {selectedRegion && (
          <Marker position={selectedRegion.centroide as LatLngExpression}>
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
