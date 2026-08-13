import type { InsuranceVehicleType } from "@/modules/insurance/types";

/**
 * Choice MotorInsuranceWidget keeps a singleton Redux store for the page lifetime.
 * Soft remounts reuse that store and return 401 when VEHICLE_TYPE changes.
 * A full navigation (same as manual refresh) is required for a clean session.
 */
export function navigateWithVehicleType(next: InsuranceVehicleType): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set("type", next);
  url.searchParams.set("vehicleType", next);
  window.location.assign(url.toString());
}

export function readVehicleTypeFromSearch(
  search: string | URLSearchParams,
  fallback: InsuranceVehicleType = "bike"
): InsuranceVehicleType {
  const params =
    typeof search === "string" ? new URLSearchParams(search) : search;
  const type = params.get("vehicleType") || params.get("type");
  return type === "car" || type === "bike" ? type : fallback;
}
