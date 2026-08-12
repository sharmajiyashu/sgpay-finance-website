"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MotorInsuranceWidget } from "@/modules/insurance/components/MotorInsuranceWidget";
import type { InsuranceVehicleType } from "@/modules/insurance/types";
import { INSURANCE_VEHICLE_TYPES } from "@/modules/insurance/types";
import {
  createWebsiteInsuranceLead,
  getWebsiteInsuranceConfig,
} from "@/modules/insurance/publicService";

export function WebsiteMotorInsuranceApply() {
  const [vehicleType, setVehicleType] = useState<InsuranceVehicleType>("bike");
  const trackedRef = useRef<Set<string>>(new Set());

  const {
    data: widgetConfig,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["website-insurance-widget-config"],
    queryFn: getWebsiteInsuranceConfig,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!widgetConfig?.xApiKey) return;
    const trackKey = `website:motor-insurance:${vehicleType}`;
    if (trackedRef.current.has(trackKey)) return;

    const searchParams = new URLSearchParams(window.location.search);
    const refId =
      searchParams.get("refId") ||
      searchParams.get("agentId") ||
      searchParams.get("agentCode") ||
      undefined;

    trackedRef.current.add(trackKey);
    createWebsiteInsuranceLead({
      refId,
      metadata: { vehicleType },
    }).catch(() => {
      trackedRef.current.delete(trackKey);
    });
  }, [vehicleType, widgetConfig?.xApiKey]);

  return (
    <div>
      <div className="mx-auto mb-3 d-flex gap-2 justify-content-center flex-wrap">
        {INSURANCE_VEHICLE_TYPES.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className={`btn ${vehicleType === opt.value ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setVehicleType(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-center text-muted small py-4">Loading insurance widget…</div>
      )}

      {error && (
        <div className="alert alert-danger small">
          {(error instanceof Error && error.message) ||
            "Could not load Motor Insurance config from backend (ptr/token)."}
        </div>
      )}

      {widgetConfig && !error && (
        <MotorInsuranceWidget config={widgetConfig} vehicleType={vehicleType} />
      )}
    </div>
  );
}
