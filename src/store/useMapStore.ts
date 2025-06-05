import { create } from "zustand";
import type { RegionIndexEntry, UnidadVecinalGeoJSON } from "../components/region-selector.inteface";

// Importación de la interface de la store
import type { MapStore } from "./map-store.interface";

import { calculateCentroid } from "./calculate.centroid.helper";

// Store de Zustand para manejar el estado del mapa y las regiones
// Incluye la lista de regiones, GeoJSON de la región, región seleccionada, posición del mapa, etc.

// Inicialización de la store con Zustand

export const useMapStore = create<MapStore>((set, get) => ({
  regionList: [], // Inicialización de la lista de regiones
  regionGeoJSON: null, // Inicialización del GeoJSON de la región
  selectedRegion: null, // Inicialización de la región seleccionada
  loading: false, // Inicialización de estado de carga para manejar peticiones asíncronas
  position: [-33.048, -71.456], // Posición inicial del mapa (centro de Chile)
  communeList: [], // Inicialización de la lista de comunas
  selectedCommune: null, // Inicialización de la comuna seleccionada
  selectedUnidadVecinal: null, // Inicialización de la unidad vecinal seleccionada
  hoveredFeature: null, // Inicialización de la feature que está siendo hoverada
  geoJsonVersion: 0, // Versión del GeoJSON para manejar cambios y re-renderizados

  // Funciones para actualizar el estado de la store desde cualquier componente que la consuma
  // Estas funciones permiten modificar el estado de manera controlada y predecible
  // Cada función actualiza una parte específica del estado de la store

  setSelectedCommune: (commune) => set({ selectedCommune: commune, selectedUnidadVecinal: null }),
  setSelectedUnidadVecinal: (uv) => set({ selectedUnidadVecinal: uv }),
  setHoveredFeature: (feature) => set({ hoveredFeature: feature }),
  setCommuneList: (communes) => set({ communeList: communes }),
  setRegionGeoJSON: (geoJSON) =>
    set((state) => ({
      regionGeoJSON: geoJSON,
      geoJsonVersion: state.geoJsonVersion + 1,
    })),
  setSelectedRegion: (region) => {
    set({
      selectedRegion: region,
      selectedCommune: null,
      selectedUnidadVecinal: null,
      position: region?.centroide || [-33.048, -71.456],
    });
  },
  setLoading: (loading) => set({ loading }),
  setRegionList: (regions) => set({ regionList: regions }),
  setPosition: (position) => set({ position }),

  // Función para obtener las features de UV filtradas según la comuna y unidad vecinal seleccionadas
  // Una feature es un objeto que representa una unidad vecinal en el GeoJSON según la estructura del GeoJSON

  getFilteredUVFeatures: () => {
    const { regionGeoJSON, selectedCommune, selectedUnidadVecinal } = get();
    if (!regionGeoJSON) return [];

    let features = regionGeoJSON.features;

    // Filtrar por comuna si está seleccionada
    if (selectedCommune) {
      features = features.filter((f) => f.properties.t_com === selectedCommune);
    }

    //  Filtrar por unidad vecinal si está seleccionada
    if (selectedUnidadVecinal) {
      features = features.filter((f) => f.properties.t_uv_nom === selectedUnidadVecinal);
    }

    return features;
  },

  // Funciones asíncronas para cargar datos desde el servidor
  // Estas funciones permiten cargar la lista de regiones y el GeoJSON de una región específica

  // Cargar la lista de regiones desde un archivo JSON (creación propia -> modificar más adelante para usar una API real)
  loadRegions: async () => {
    const { setRegionList, setLoading } = get();
    setLoading(true);
    try {
      const res = await fetch("/geojson/regiones.json");
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data: RegionIndexEntry[] = await res.json();
      setRegionList(data);
    } catch (error) {
      console.error("Error cargando regiones:", error);
    } finally {
      setLoading(false);
    }
  },

  // Cargar el GeoJSON de la región seleccionada desde un archivo JSON
  // Esta función se encarga de obtener el GeoJSON de la región seleccionada y actualizar el estado de la store
  // Idealmente a futuro debería ser una llamada a una API real que devuelva el GeoJSON de la región mediante query params

  loadRegionGeoJSON: async () => {
    const { selectedRegion, setLoading, setRegionGeoJSON } = get();
    setLoading(true);
    try {
      if (!selectedRegion) throw new Error("No region selected");
      console.log("Cargando UV región:", selectedRegion.name);
      // Realizar la petición al servidor para obtener el GeoJSON de la región seleccionada
      // Usar el slug de la región para construir la URL del archivo GeoJSON
      // El slug es un identificador único para cada región, por lo que se usa para cargar el archivo correspondiente
      const res = await fetch(`/geojson/${selectedRegion.slug}.json`);

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo cargar el archivo ${selectedRegion.slug}.json`);
      }

      const data: UnidadVecinalGeoJSON = await res.json();
      setRegionGeoJSON(data);
    } catch (error) {
      console.error("Error cargando región:", error);
      setRegionGeoJSON(null);
    } finally {
      setLoading(false);
    }
  },
}));

// Export de la función helper para usar en componentes
export { calculateCentroid };
