"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { MotorInsuranceWidget } from "@/modules/insurance/components/MotorInsuranceWidget";
import { validateMotorWidgetConfig } from "@/modules/insurance/widgetConfig";
import type {
  CreateInsuranceLeadInput,
  InsuranceVehicleType,
  InsuranceWidgetConfig,
} from "@/modules/insurance/types";
import { INSURANCE_VEHICLE_TYPES } from "@/modules/insurance/types";

export interface InsuranceApplyApiClient {
  getConfig: () => Promise<InsuranceWidgetConfig>;
  createLead?: (input: CreateInsuranceLeadInput) => Promise<{ _id: string; uuid?: string }>;
}

interface InsuranceApplyPanelProps {
  api: InsuranceApplyApiClient;
  title?: string;
  description?: string;
  queryScope?: string;
  applyBasePath: string;
}

export function InsuranceApplyPanel({
  api,
  title = "Motor Insurance",
  description = "Bike / car insurance via Choice Connect. Separate from Credit Card.",
  queryScope = "insurance",
  applyBasePath,
}: InsuranceApplyPanelProps) {
  const searchParams = useSearchParams();
  const resumeUuid = searchParams.get("uuid")?.trim() || "";
  const resumeVehicle = searchParams.get("vehicleType");
  const initialVehicle: InsuranceVehicleType =
    resumeVehicle === "car" || resumeVehicle === "bike" ? resumeVehicle : "bike";

  const [vehicleType, setVehicleType] = useState<InsuranceVehicleType>(initialVehicle);
  const trackedRef = useRef<Set<string>>(new Set());

  const { data: widgetConfig, isLoading, error } = useQuery({
    queryKey: ["insurance-widget-config", queryScope],
    queryFn: () => api.getConfig(),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (!api.createLead || !widgetConfig?.xApiKey) return;
    const trackKey = `${queryScope}:motor-insurance:${vehicleType}:${resumeUuid || "new"}`;
    if (trackedRef.current.has(trackKey)) return;

    trackedRef.current.add(trackKey);
    api
      .createLead({
        uuid: resumeUuid || undefined,
        metadata: { vehicleType, resumed: Boolean(resumeUuid) },
      })
      .catch(() => {
        trackedRef.current.delete(trackKey);
      });
  }, [api, vehicleType, queryScope, widgetConfig?.xApiKey, resumeUuid]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-[420px] animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (error || !widgetConfig) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to load Insurance widget config from backend.";
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        <p className="font-medium">Motor Insurance config failed</p>
        <p className="mt-1">{message}</p>
        <p className="mt-2 text-xs">
          Backend must return a live ptr/token as xApiKey from GET /insurance/config.
        </p>
      </div>
    );
  }

  const configError = validateMotorWidgetConfig(widgetConfig);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
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
          {resumeUuid && (
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-900">
              Resuming UUID: <span className="font-mono">{resumeUuid}</span>
            </span>
          )}
        </div>
      </div>

      <div className="max-w-xs">
        <label className="mb-1 block text-sm font-medium">Vehicle Type</label>
        <div className="flex gap-2">
          {INSURANCE_VEHICLE_TYPES.map((opt) => (
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

      {resumeUuid && (
        <p className="text-xs text-muted-foreground">
          Resume link:{" "}
          <code className="rounded bg-muted px-1">
            {applyBasePath}?uuid={resumeUuid}&vehicleType={vehicleType}
          </code>
        </p>
      )}

      {configError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {configError}
        </div>
      ) : (
        <MotorInsuranceWidget
          config={widgetConfig}
          vehicleType={vehicleType}
          uuid={resumeUuid || undefined}
        />
      )}
    </div>
  );
}
