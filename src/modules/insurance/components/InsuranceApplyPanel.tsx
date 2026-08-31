"use client";

import { useState } from "react";
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
import {
  navigateWithVehicleType,
  readVehicleTypeFromSearch,
} from "@/modules/insurance/lib/vehicleSwitch";
import { CommissionRatesCard } from "@/components/commissions/CommissionRatesCard";
import type { CommissionRatesResponse } from "@/sg-admin/lib/services/commissionService";

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
  getRates?: () => Promise<CommissionRatesResponse>;
}

export function InsuranceApplyPanel({
  api,
  title = "Motor Insurance",
  description = "Bike / car insurance via Choice Connect. Separate from Credit Card.",
  queryScope = "insurance",
  applyBasePath,
  getRates,
}: InsuranceApplyPanelProps) {
  const searchParams = useSearchParams();
  const resumeUuid =
    searchParams.get("uuid")?.trim() ||
    searchParams.get("lead_uuid")?.trim() ||
    searchParams.get("UUID")?.trim() ||
    "";
  const vehicleType = readVehicleTypeFromSearch(searchParams);
  const [switching, setSwitching] = useState(false);

  const {
    data: widgetConfig,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["insurance-widget-config", queryScope, vehicleType],
    queryFn: () => api.getConfig(),
    staleTime: 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const onSelectVehicle = (next: InsuranceVehicleType) => {
    if (next === vehicleType || switching) return;
    setSwitching(true);
    // Full page load — Choice singleton store cannot change VEHICLE_TYPE without reload.
    navigateWithVehicleType(next);
  };

  if (isLoading || switching) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-[420px] animate-pulse rounded-xl bg-muted" />
        {switching && (
          <p className="text-sm text-muted-foreground">Switching vehicle type…</p>
        )}
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
            Applying as:{" "}
            <span className="font-medium text-foreground">
              {widgetConfig.agentName || widgetConfig.sourceLabel}
            </span>
            {widgetConfig.staffRoleLabel ? ` · ${widgetConfig.staffRoleLabel}` : ""}
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
          {widgetConfig.choiceConnectProfile?.onboarded && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">
              Choice Connect onboarded
            </span>
          )}
          {resumeUuid && (
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-900">
              Resuming UUID: <span className="font-mono">{resumeUuid}</span>
            </span>
          )}
        </div>
      </div>

      {getRates ? (
        <CommissionRatesCard
          getRates={getRates}
          queryKey={["commission-rates", queryScope]}
          highlight="motor-insurance"
          title="Your motor insurance commission"
          description="This is what you earn when a customer’s bike or car policy is issued."
        />
      ) : null}

      <div className="max-w-xs">
        <label className="mb-1 block text-sm font-medium">Vehicle Type</label>
        <div className="flex gap-2">
          {INSURANCE_VEHICLE_TYPES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelectVehicle(opt.value)}
              disabled={switching}
              className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium disabled:opacity-60 ${
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
          Resuming enquiry with widget <code className="rounded bg-muted px-1">UUID</code> from
          summary-report. Link:{" "}
          <code className="break-all rounded bg-muted px-1">
            {applyBasePath}?uuid={resumeUuid}&lead_uuid={resumeUuid}&vehicleType={vehicleType}
          </code>
        </p>
      )}

      {configError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {configError}
        </div>
      ) : (
        <MotorInsuranceWidget
          key={`staff-motor-${queryScope}-${vehicleType}`}
          config={widgetConfig}
          vehicleType={vehicleType}
          uuid={resumeUuid || undefined}
        />
      )}
    </div>
  );
}
