"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MotorInsuranceWidget } from "@/modules/insurance/components/MotorInsuranceWidget";
import type { InsuranceVehicleType } from "@/modules/insurance/types";
import { INSURANCE_VEHICLE_TYPES } from "@/modules/insurance/types";
import { getWebsiteInsuranceConfig } from "@/modules/insurance/publicService";
import {
  navigateWithVehicleType,
  readVehicleTypeFromSearch,
} from "@/modules/insurance/lib/vehicleSwitch";

function readResumeFromLocation(): {
  uuid: string;
  vehicleType: InsuranceVehicleType;
  refId: string;
} {
  if (typeof window === "undefined") {
    return { uuid: "", vehicleType: "bike", refId: "" };
  }
  const searchParams = new URLSearchParams(window.location.search);
  const uuid =
    searchParams.get("uuid")?.trim() ||
    searchParams.get("lead_uuid")?.trim() ||
    searchParams.get("UUID")?.trim() ||
    "";
  const refId =
    searchParams.get("refId")?.trim() ||
    searchParams.get("agentId")?.trim() ||
    searchParams.get("agentCode")?.trim() ||
    "";
  return {
    uuid,
    vehicleType: readVehicleTypeFromSearch(searchParams),
    refId,
  };
}

export function WebsiteMotorInsuranceApply() {
  const initial = useMemo(() => readResumeFromLocation(), []);
  const [vehicleType] = useState<InsuranceVehicleType>(initial.vehicleType);
  const [switching, setSwitching] = useState(false);
  const resumeUuid = initial.uuid;
  const refId = initial.refId;

  const {
    data: widgetConfig,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["website-insurance-widget-config", vehicleType, refId],
    queryFn: () => getWebsiteInsuranceConfig(refId || undefined),
    staleTime: 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const onSelectVehicle = (next: InsuranceVehicleType) => {
    if (next === vehicleType || switching) return;
    setSwitching(true);
    // Full page load — required because Choice widget singleton store cannot switch VEHICLE_TYPE in-place.
    navigateWithVehicleType(next);
  };

  return (
    <div className="w-full max-w-full">
      <div className="mx-auto mb-3 d-flex gap-2 justify-content-center flex-wrap">
        {INSURANCE_VEHICLE_TYPES.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`btn ${vehicleType === opt.value ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => onSelectVehicle(opt.value)}
            disabled={switching}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {switching && (
        <div className="text-center text-muted small py-2">Switching vehicle type…</div>
      )}

      {resumeUuid && (
        <p className="text-center text-muted small mb-3">
          Continuing enquiry UUID: <code className="break-all">{resumeUuid}</code>
        </p>
      )}

      {isLoading && !switching && (
        <div className="text-center text-muted small py-4">Loading insurance widget…</div>
      )}

      {error && (
        <div className="alert alert-danger small">
          {(error instanceof Error && error.message) ||
            "Could not load Motor Insurance config from backend (ptr/token)."}
        </div>
      )}

      {widgetConfig && !error && !switching && (
        <MotorInsuranceWidget
          key={`website-motor-${vehicleType}-${refId || "direct"}`}
          config={{
            ...widgetConfig,
            subAgentCode: widgetConfig.subAgentCode || refId,
          }}
          vehicleType={vehicleType}
          uuid={resumeUuid || undefined}
        />
      )}
    </div>
  );
}
