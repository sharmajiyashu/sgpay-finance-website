"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MotorInsuranceWidget } from "@/components/insurance/MotorInsuranceWidget";
import type { ChoiceVehicleType } from "@/lib/choiceConnect/types";
import { CHOICE_VEHICLE_TYPES } from "@/lib/choiceConnect/types";
import {
  createWebsiteChoiceLead,
  getWebsiteChoiceConnectConfig,
} from "@/lib/choiceConnect/publicService";
import { getWebsiteWidgetConfig } from "@/lib/choiceConnect/widgetConfig";

/** Public website Motor Insurance apply — never uses Credit Card widget. */
export function WebsiteMotorInsuranceApply() {
  const [vehicleType, setVehicleType] = useState<ChoiceVehicleType>("bike");
  const trackedRef = useRef<Set<string>>(new Set());

  const { data: remoteConfig, isLoading } = useQuery({
    queryKey: ["website-insurance-widget-config"],
    queryFn: getWebsiteChoiceConnectConfig,
    staleTime: 5 * 60 * 1000,
  });

  const widgetConfig = remoteConfig || getWebsiteWidgetConfig();

  useEffect(() => {
    const trackKey = `website:motor-insurance:${vehicleType}`;
    if (trackedRef.current.has(trackKey)) return;

    const searchParams = new URLSearchParams(window.location.search);
    const refId =
      searchParams.get("refId") ||
      searchParams.get("agentId") ||
      searchParams.get("agentCode") ||
      undefined;

    trackedRef.current.add(trackKey);
    createWebsiteChoiceLead({
      productType: "motor-insurance",
      refId,
      metadata: { vehicleType },
    }).catch(() => {
      trackedRef.current.delete(trackKey);
    });
  }, [vehicleType]);

  return (
    <div>
      <div className="mx-auto mb-3 d-flex gap-2 justify-content-center flex-wrap">
        {CHOICE_VEHICLE_TYPES.map((opt) => (
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

      {isLoading && !remoteConfig ? (
        <div className="text-center text-muted small py-4">Loading insurance widget…</div>
      ) : (
        <MotorInsuranceWidget config={widgetConfig} vehicleType={vehicleType} />
      )}
    </div>
  );
}
