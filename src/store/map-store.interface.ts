import type {
  RegionIndexEntry,
  UnidadVecinalFeature,
  UnidadVecinalGeoJSON,
} from "../components/region-selector.inteface";

export interface MapStore {
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
