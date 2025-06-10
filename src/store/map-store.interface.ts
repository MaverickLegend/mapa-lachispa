import type {
  CommuneData,
  RegionIndexEntry,
  UnidadVecinalData,
  UnidadVecinalFeature,
  UnidadVecinalGeoJSON,
} from "../components/region-selector.inteface";
import type { JuntaVecinal } from "../components/juntas-vecinos.interface";

export interface MapStore {
  regionList: RegionIndexEntry[];
  regionGeoJSON: UnidadVecinalGeoJSON | null;
  selectedRegion: RegionIndexEntry | null;
  loading: boolean;
  position: [number, number];
  communeList: string[];
  selectedCommune: string | null;
  selectedCommuneData: CommuneData | null;
  selectedUnidadVecinal: string | null;
  selectedUnidadVecinalData: UnidadVecinalData | null;
  hoveredFeature: UnidadVecinalFeature | null;
  geoJsonVersion: number;
  juntasVecinos: JuntaVecinal[];

  setSelectedCommune: (commune: string | null) => void;
  setSelectedCommuneData: (data: CommuneData | null) => void;
  setSelectedUnidadVecinal: (uv: string | null) => void;
  setSelectedUnidadVecinalData: (data: UnidadVecinalData | null) => void;
  setHoveredFeature: (feature: UnidadVecinalFeature | null) => void;
  getFilteredUVFeatures: () => UnidadVecinalFeature[];
  setSelectedJuntasVecinos: (data: JuntaVecinal[]) => void;

  // Actions
  setRegionGeoJSON: (geoJSON: UnidadVecinalGeoJSON | null) => void;
  setSelectedRegion: (region: RegionIndexEntry | null) => void;
  setLoading: (loading: boolean) => void;
  setRegionList: (regions: RegionIndexEntry[]) => void;
  setPosition: (position: [number, number]) => void;
  setCommuneList: (communes: string[]) => void;
  clearFilters(): () => void;

  // Async Actions
  loadRegions: () => Promise<void>;
  loadRegionGeoJSON: () => Promise<void>;
  loadCommuneData: (communeCode: string) => Promise<void>;
  loadUnidadVecinalData: (uvName: string) => Promise<void>;
  loadJuntasVecinos: (communCode: string) => Promise<void>;
}
