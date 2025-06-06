import React, { useState } from "react";
import { useMapStore } from "../store/useMapStore";
import * as turf from "@turf/turf";

export const AddressSearch = () => {
  const [address, setAddress] = useState("");
  const { regionGeoJSON, setSelectedUnidadVecinal } = useMapStore();

  const handleSearch = async () => {
    if (!address || !regionGeoJSON) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const results = await response.json();

      if (!results || results.length === 0) {
        alert("Dirección no encontrada.");
        return;
      }

      const [lon, lat] = [parseFloat(results[0].lon), parseFloat(results[0].lat)];
      const point = turf.point([lon, lat]);

      let closestUV = null;
      let minDistance = Infinity;

      for (const feature of regionGeoJSON.features) {
        const polygon = turf.feature(feature.geometry);
        const distance = turf.pointToPolygonDistance(point, polygon, { units: "kilometers" });

        if (distance < minDistance) {
          minDistance = distance;
          closestUV = feature;
        }
      }

      if (closestUV) {
        setSelectedUnidadVecinal(closestUV.properties.name); // o el campo que uses
      } else {
        alert("No se encontró una unidad vecinal cercana.");
      }
    } catch (err) {
      console.error("Error al buscar dirección:", err);
    }
  };

  return (
    <div className="address-search">
      <input
        type="text"
        placeholder="Buscar dirección..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleSearch}>Buscar UV más cercana</button>
    </div>
  );
};