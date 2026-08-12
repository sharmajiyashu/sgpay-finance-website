"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MotorInsuranceWidget } from "@/components/insurance/MotorInsuranceWidget";
import { validateWidgetConfig } from "@/lib/choiceConnect/widgetConfig";
import type {
  ChoiceVehicleType,
  ChoiceWidgetConfig,
  CreateChoiceLeadInput,
} from "@/lib/choiceConnect/types";
import { CHOICE_VEHICLE_TYPES } from "@/lib/choiceConnect/types";

export interface InsuranceApplyApiClient {
  getConfig: () => Promise<ChoiceWidgetConfig & { configured?: boolean }>;
  createLead?: (input: CreateChoiceLeadInput) => Promise<{ _id: string; uuid?: string }>;
}

interface InsuranceApplyPanelProps {
  api: InsuranceApplyApiClient;
  title?: string;
  description?: string;
  queryScope?: string;
}

/**
 * Staff Motor Insurance apply UI — separate from Credit Card ChoiceConnectApplyPanel.
 */
export function InsuranceApplyPanel({
  api,
  title = "Motor Insurance",
  description = "Bike / car insurance via Choice Connect. This module is separate from Credit Card.",
  queryScope = "insurance",
}: InsuranceApplyPanelProps) {
  const [vehicleType, setVehicleType] = useState<ChoiceVehicleType>("bike");
  const trackedRef = useRef<Set<string>>(new Set());

  const { data: widgetConfig, isLoading, error } = useQuery({
    queryKey: ["insurance-widget-config", queryScope],
    queryFn: () => api.getConfig(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!api.createLead || !widgetConfig?.configured) return;
    const trackKey = `${queryScope}:motor-insurance:${vehicleType}`;
    if (trackedRef.current.has(trackKey)) return;

    trackedRef.current.add(trackKey);
    api
      .createLead({
        productType: "motor-insurance",
        metadata: { vehicleType },
      })
      .catch(() => {
        trackedRef.current.delete(trackKey);
      });
  }, [api, vehicleType, queryScope, widgetConfig?.configured]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-[420px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error || !widgetConfig) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        Failed to load Insurance widget config from backend.
        {error instanceof Error ? ` ${error.message}` : ""}
      </div>
    );
  }

  const configError = validateWidgetConfig(widgetConfig, "motor-insurance");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Insurance</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
            Source:{" "}
            <span className="font-medium text-foreground">{widgetConfig.sourceLabel}</span>
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
            CBA: <span className="font-medium text-foreground">{widgetConfig.agentCode}</span>
          </span>
          {widgetConfig.subAgentCode && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
              Sub-agent:{" "}
              <span className="font-medium text-foreground">{widgetConfig.subAgentCode}</span>
            </span>
          )}
        </div>
      </div>

      <div className="max-w-md">
        <label className="mb-1 block text-sm font-medium">Vehicle Type</label>
        <div className="flex gap-2">
          {CHOICE_VEHICLE_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setVehicleType(opt.value)}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                vehicleType === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {configError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {configError}
        </div>
      ) : (
        <MotorInsuranceWidget config={widgetConfig} vehicleType={vehicleType} />
      )}
    </div>
  );
}
