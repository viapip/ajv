/* eslint-disable */
export type GeoJSONMultiLineString = {
  bbox?: number[];
  coordinates: Array<Array<number[]>>;
  type: PurpleType;
  [property: string]: any;
}

export type PurpleType = "MultiLineString";

export type GeoJSONGeometryCollection = {
  bbox?: number[];
  geometries: PurpleGeoJSON[];
  type: FluffyType;
  [property: string]: any;
}

export type PurpleGeoJSON = {
  bbox?: number[];
  coordinates: Array<Array<Array<number[] | number> | number> | number>;
  type: GeometryType;
  [property: string]: any;
}

export type GeometryType = "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";

export type FluffyType = "GeometryCollection";

export type GeoJSONFeature = {
  bbox?: number[];
  geometry: null | GeoJSONFeatureGeoJSONPoint;
  id?: number | string;
  properties: { [key: string]: any } | null;
  type: GeoJSONFeatureType;
  [property: string]: any;
}

export type GeoJSONFeatureGeoJSONPoint = {
  bbox?: number[];
  coordinates?: Array<Array<Array<number[] | number> | number> | number>;
  type: TentacledType;
  geometries?: FluffyGeoJSON[];
  [property: string]: any;
}

export type FluffyGeoJSON = {
  bbox?: number[];
  coordinates: Array<Array<Array<number[] | number> | number> | number>;
  type: GeometryType;
  [property: string]: any;
}

export type TentacledType = "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon" | "GeometryCollection";

export type GeoJSONFeatureType = "Feature";

export type GeoJSONGeometry = {
  bbox?: number[];
  coordinates: Array<Array<Array<number[] | number> | number> | number>;
  type: GeometryType;
  [property: string]: any;
}

export type GeoJSONFeatureCollection = {
  bbox?: number[];
  features: FeatureElement[];
  type: GeoJSONFeatureCollectionType;
  [property: string]: any;
}

export type FeatureElement = {
  bbox?: number[];
  geometry: null | FeatureGeoJSONPoint;
  id?: number | string;
  properties: { [key: string]: any } | null;
  type: GeoJSONFeatureType;
  [property: string]: any;
}

export type FeatureGeoJSONPoint = {
  bbox?: number[];
  coordinates?: Array<Array<Array<number[] | number> | number> | number>;
  type: TentacledType;
  geometries?: TentacledGeoJSON[];
  [property: string]: any;
}

export type TentacledGeoJSON = {
  bbox?: number[];
  coordinates: Array<Array<Array<number[] | number> | number> | number>;
  type: GeometryType;
  [property: string]: any;
}

export type GeoJSONFeatureCollectionType = "FeatureCollection";

export type GeoJSONLineString = {
  bbox?: number[];
  coordinates: Array<number[]>;
  type: StickyType;
  [property: string]: any;
}

export type StickyType = "LineString";

export type GeoJSONMultiPoint = {
  bbox?: number[];
  coordinates: Array<number[]>;
  type: IndigoType;
  [property: string]: any;
}

export type IndigoType = "MultiPoint";

export type GeoJSONPoint = {
  bbox?: number[];
  coordinates: number[];
  type: IndecentType;
  [property: string]: any;
}

export type IndecentType = "Point";

export type GeoJSONMultiPolygon = {
  bbox?: number[];
  coordinates: Array<Array<Array<number[]>>>;
  type: HilariousType;
  [property: string]: any;
}

export type HilariousType = "MultiPolygon";

export type TestUserInfo = {
  email: string;
  name: string;
  [property: string]: any;
}

export type TileJSON = {
  attribution?: string;
  bounds?: number[];
  center?: number[];
  data?: string[];
  description?: string;
  fillzoom?: number;
  grids?: string[];
  legend?: string;
  maxzoom?: number;
  minzoom?: number;
  name?: string;
  scheme?: string;
  template?: string;
  tilejson: string;
  tiles: string[];
  vector_layers: VectorLayer[];
  version?: string;
  [property: string]: any;
}

export type VectorLayer = {
  description?: string;
  fields: { [key: string]: string };
  id: string;
  maxzoom?: number;
  minzoom?: number;
  [property: string]: any;
}

export type GeoJSONPolygon = {
  bbox?: number[];
  coordinates: Array<Array<number[]>>;
  type: AmbitiousType;
  [property: string]: any;
}

export type AmbitiousType = "Polygon";
