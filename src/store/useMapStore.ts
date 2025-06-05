import { create } from "zustand";
import type {
  RegionIndexEntry,
  UnidadVecinalFeature,
  UnidadVecinalGeoJSON,
} from "../components/region-selector.inteface";

// Función helper para calcular centroide real de una geometría
function calculateCentroid(geometry: any): [number, number] {
  let totalLat = 0;
  let totalLng = 0;
  let pointCount = 0;

  function processCoordinates(coords: number[] | number[][] | number[][][]) {
    if (typeof coords[0] === "number") {
      // Es un punto [lng, lat]
      totalLng += coords[0] as number;
      totalLat += coords[1] as number;
      pointCount++;
    } else {
      // Es un array de arrays, procesar recursivamente
      (coords as any[]).forEach(processCoordinates);
    }
  }

  if (geometry.type === "Polygon") {
    geometry.coordinates.forEach(processCoordinates);
  } else if (geometry.type === "MultiPolygon") {
    geometry.coordinates.forEach((polygon: any) => {
      polygon.forEach(processCoordinates);
    });
  }

  return pointCount > 0 ? [totalLat / pointCount, totalLng / pointCount] : [-33.048, -71.456];
}

interface MapStore {
  regionList: RegionIndexEntry[];
  regionGeoJSON: UnidadVecinalGeoJSON | null;
  selectedRegion: RegionIndexEntry | null;
  loading: boolean;
  position: [number, number];
  communeList: string[];
  selectedCommune: string | null;
  selectedUnidadVecinal: string | null;
  hoveredFeature: UnidadVecinalFeature | null;
  geoJsonVersion: number;

  setSelectedCommune: (commune: string | null) => void;
  setSelectedUnidadVecinal: (uv: string | null) => void;
  setHoveredFeature: (feature: UnidadVecinalFeature | null) => void;
  getFilteredUVFeatures: () => UnidadVecinalFeature[];

  // Actions
  setRegionGeoJSON: (geoJSON: UnidadVecinalGeoJSON | null) => void;
  setSelectedRegion: (region: RegionIndexEntry | null) => void;
  setLoading: (loading: boolean) => void;
  setRegionList: (regions: RegionIndexEntry[]) => void;
  setPosition: (position: [number, number]) => void;
  setCommuneList: (communes: string[]) => void;

  // Async Actions
  loadRegions: () => Promise<void>;
  loadRegionGeoJSON: () => Promise<void>;
}

export const useMapStore = create<MapStore>((set, get) => ({
  regionList: [],
  regionGeoJSON: null,
  selectedRegion: null,
  loading: false,
  position: [-33.048, -71.456],
  communeList: [],
  selectedCommune: null,
  selectedUnidadVecinal: null,
  hoveredFeature: null,
  geoJsonVersion: 0,

  // Setters
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

  getFilteredUVFeatures: () => {
    const { regionGeoJSON, selectedCommune, selectedUnidadVecinal } = get();
    if (!regionGeoJSON) return [];

    let features = regionGeoJSON.features;

    // Filtrar por comuna si está seleccionada
    if (selectedCommune) {
      features = features.filter((f) => f.properties.t_com === selectedCommune);
    }

    // : Filtrar por unidad vecinal si está seleccionada
    if (selectedUnidadVecinal) {
      features = features.filter((f) => f.properties.t_uv_nom === selectedUnidadVecinal);
    }

    return features;
  },

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

  loadRegionGeoJSON: async () => {
    const { selectedRegion, setLoading, setRegionGeoJSON } = get();
    setLoading(true);
    try {
      if (!selectedRegion) throw new Error("No region selected");
      console.log("Cargando UV región:", selectedRegion.name);
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
