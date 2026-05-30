export {
  bookProperty,
  fetchAllProperties,
  fetchProperties,
  fetchPropertyById,
  fetchPropertyBySlug,
  fetchRecentProperties,
  normalizeProperty,
  propertyApi,
  searchProperties,
} from "./property.api";
export type { FetchPropertiesOptions } from "./property.api";
export {
  useBookProperty,
  useFetchProperties,
  useFetchPropertyById,
  useFetchPropertyBySlug,
  useSearchProperties,
} from "./property.queries";
export type { Properties, Property } from "./types";
