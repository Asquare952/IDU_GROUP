export type InspectionRouteTarget = {
  id?: string | number | null;
};

export const getInspectionDetailsPath = (inspection: InspectionRouteTarget) => {
  const identifier = inspection.id;

  if (!identifier) {
    return "tenant/inspections";
  }

  return `tenant/inspections/${encodeURIComponent(String(identifier))}`;
};
