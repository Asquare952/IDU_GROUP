export type PropertyRouteTarget = {
  id?: string | number | null;
  slug?: string | number | null;
};

export const getPropertyDetailsPath = (property: PropertyRouteTarget) => {
  const identifier = property.slug || property.id;

  if (!identifier) {
    return "/properties";
  }

  return `/properties/${encodeURIComponent(String(identifier))}`;
};
