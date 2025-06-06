export interface RegionIndexEntry {
  id: number;
  name: string;
  slug: string;
  centroide: [number, number];
}

export interface UnidadVecinalFeature {
  type: "Feature";
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
  properties: {
    t_com: string;
    t_com_nom: string;
    t_prov_nom: string;
    t_reg_nom: string;
    t_uv_nom: string;
    [key: string]: any;
  };
}

export interface UnidadVecinalGeoJSON {
  type: "FeatureCollection";
  features: UnidadVecinalFeature[];
}
