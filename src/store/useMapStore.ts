import { create } from "zustand";
import type { RegionIndexEntry, UnidadVecinalGeoJSON } from "../components/region-selector.inteface";
import type { JuntaVecinal } from "../components/juntas-vecinos.interface";
import type { MapStore } from "./map-store.interface";
import { calculateCentroid } from "./calculate.centroid.helper";

export const useMapStore = create<MapStore>((set, get) => ({
  juntasVecinos: [],
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
  selectedCommuneData: null,
  selectedUnidadVecinalData: null,
  filtroNombreJJVV: "",

  setSelectedCommune: (commune) => set({ selectedCommune: commune, selectedUnidadVecinal: null }),
  setSelectedUnidadVecinal: (uv) => set({ selectedUnidadVecinal: uv }),
  setHoveredFeature: (feature) => set({ hoveredFeature: feature }),
  setCommuneList: (communes) => set({ communeList: communes }),
  setSelectedCommuneData: (data) => set({ selectedCommuneData: data }),
  setSelectedUnidadVecinalData: (data) => set({ selectedUnidadVecinalData: data }),
  setSelectedJuntasVecinos: (data) => set({ juntasVecinos: data }),

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
  setFiltroNombreJJVV: (filtro) => set({ filtroNombreJJVV: filtro }),

  getFilteredUVFeatures: () => {
    const { regionGeoJSON, selectedCommune, selectedUnidadVecinal } = get();
    if (!regionGeoJSON) return [];
    let features = regionGeoJSON.features;
    if (selectedCommune) {
      features = features.filter((f) => f.properties.t_com === selectedCommune);
    }
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
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
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
      const res = await fetch(`/geojson/${selectedRegion.slug}.json`);
      if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar el archivo ${selectedRegion.slug}.json`);
      const data: UnidadVecinalGeoJSON = await res.json();
      setRegionGeoJSON(data);
    } catch (error) {
      console.error("Error cargando región:", error);
      setRegionGeoJSON(null);
    } finally {
      setLoading(false);
    }
  },

  loadCommuneData: async (communeCode: string): Promise<void> => {
    const { setSelectedCommuneData, setLoading } = get();
    setLoading(true);
    try {
      const res = await fetch(`datos/${communeCode}.json`);
      if (!res.ok) throw new Error(`Error ${res.status}: No se pudo cargar los datos de la comuna ${communeCode}`);
      const data = await res.json();
      setSelectedCommuneData(data);
    } catch (error) {
      console.error("Error cargando datos de la comuna:", error);
      setSelectedCommuneData(null);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  loadUnidadVecinalData: async (unidadVecinalName: string): Promise<void> => {
    const { setSelectedUnidadVecinalData, selectedCommuneData, setLoading } = get();
    setLoading(true);
    try {
      const data = selectedCommuneData?.datos?.find(
        (uv: any) =>
          uv["NOMBRE UNIDAD VECINAL"].toString().trim().toLowerCase() === unidadVecinalName.trim().toLowerCase()
      );
      setSelectedUnidadVecinalData(data || null);
    } catch (error) {
      console.error("Error cargando datos de la unidad vecinal:", error);
      setSelectedUnidadVecinalData(null);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  loadJuntasVecinos: async (communCode: string): Promise<void> => {
    const { setSelectedJuntasVecinos, setLoading } = get();
    setLoading(true);
    try {
      const res = await fetch(`/datos/${communCode}-JJVV.json`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data: JuntaVecinal[] = await res.json();
      setSelectedJuntasVecinos(data);
    } catch (error) {
      console.error("Error cargando juntas de vecinos:", error);
    } finally {
      setLoading(false);
    }
  },

  clearFilters: () => () =>
    set({
      selectedRegion: null,
      selectedCommune: null,
      selectedUnidadVecinal: null,
      regionGeoJSON: null,
      juntasVecinos: [],
      filtroNombreJJVV: "",
      selectedCommuneData: null,
      selectedUnidadVecinalData: null,
      // No limpiar position para que el mapa no se mueva
    }),
}));

export { calculateCentroid };
