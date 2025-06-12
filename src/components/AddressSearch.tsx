import { useState } from "react";
import { useMapStore } from "../store/useMapStore";

export const AddressSearch = () => {
  const [query, setQuery] = useState("");
  const { setPosition } = useMapStore();

  const handleSearch = async () => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      const newPos = [parseFloat(lat), parseFloat(lon)];
      setPosition(newPos); // actualiza el centro del mapa
      // También podrías disparar una función para encontrar la UV más cercana
    }
  };

  return (
    <div className="selector-container">
      <input
        type="text"
        placeholder="Busca tu dirección..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        color="red"
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
};