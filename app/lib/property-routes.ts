export type PropertyRouteTarget = {
  id?: string | number | null;
  slug?: string | number | null;
  rentalModel?: string;
};

export const getPropertyDetailsPath = (property: PropertyRouteTarget) => {
  const identifier = property.slug || property.id;

  if (!identifier) {
    return "/properties";
  }

  const propertyPath = `/properties/${encodeURIComponent(String(identifier))}`;
  return property.rentalModel
    ? `${propertyPath}?model=shortlet`
    : propertyPath;
};
