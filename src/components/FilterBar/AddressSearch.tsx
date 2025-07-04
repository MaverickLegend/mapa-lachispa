import { useState } from "react";
import { useMapStore } from "../../store/useMapStore";
import { mapPropsToUnidadVecinalAdapter } from "../../adapters/mapPropsUnidadVecinal.adapter";
import type { Feature, Polygon, MultiPolygon } from "geojson";
import * as turf from "@turf/turf";

export const AddressSearch = () => {
  const [query, setQuery] = useState("");
  const { setPosition, setSearchPosition, setSearchAddress, setSelectedUnidadVecinal, regionGeoJSON } = useMapStore();

  const handleSearch = async () => {
    if (!query.trim()) return;

    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
      const displayName = data[0].display_name; // texto completo de la dirección
      setSearchAddress(displayName);
      setPosition(newPos); // centra el mapa
      setSearchPosition(newPos); // guarda el pin
      handleUVDetection(newPos[0], newPos[1]); //resalta la UV donde cae el punto
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  //selector de unidad vecinal - funciona cuando una región ya fue seleccionada

  const handleUVDetection = (lat: number, lon: number) => {
    const point = turf.point([lon, lat]);
    const foundUV = regionGeoJSON?.features.find((feature) =>
      turf.booleanPointInPolygon(point, feature as Feature<Polygon | MultiPolygon>)
    );

    if (foundUV) {
      const adaptedUV = mapPropsToUnidadVecinalAdapter(foundUV.properties);
      setSelectedUnidadVecinal(adaptedUV);
    }
  };

  return (
    <div className="join w-full">
      <input
        type="input"
        placeholder="Busca tu dirección..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 bg-slate-700 text-gray-200 border border-slate-600 shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-slate-400 join-item input"
      />
      <button className="btn btn-accent join-item" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
};
