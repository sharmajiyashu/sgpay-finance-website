"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChoiceConnectWidget } from "@/components/choice-connect/ChoiceConnectWidget";
import { validateWidgetConfig } from "@/lib/choiceConnect/widgetConfig";
import type {
  ChoiceProductType,
  ChoiceWidgetConfig,
  CreateChoiceLeadInput,
} from "@/lib/choiceConnect/types";
import { CHOICE_LOAN_PRODUCTS } from "@/lib/choiceConnect/types";

export interface ChoiceConnectApiClient {
  getConfig: () => Promise<ChoiceWidgetConfig & { configured?: boolean }>;
  createLead?: (input: CreateChoiceLeadInput) => Promise<{ _id: string; uuid?: string }>;
}

interface ChoiceConnectApplyPanelProps {
  api: ChoiceConnectApiClient;
  productType: ChoiceProductType;
  title: string;
  description?: string;
  allowLoanProductSelect?: boolean;
  queryScope?: string;
}

export function ChoiceConnectApplyPanel({
  api,
  productType: initialProductType,
  title,
  description,
  allowLoanProductSelect = false,
  queryScope = "staff",
}: ChoiceConnectApplyPanelProps) {
  const [productType, setProductType] = useState<ChoiceProductType>(initialProductType);
  const trackedProductsRef = useRef<Set<string>>(new Set());

  const { data: widgetConfig, isLoading, error } = useQuery({
    queryKey: ["choice-connect-config", queryScope],
    queryFn: () => api.getConfig(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!api.createLead || !widgetConfig?.configured) return;
    const resumeUuid =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("uuid")?.trim() ||
          new URLSearchParams(window.location.search).get("lead_uuid")?.trim() ||
          ""
        : "";
    if (!resumeUuid) return;
    const trackKey = `${queryScope}:${productType}:${resumeUuid}`;
    if (trackedProductsRef.current.has(trackKey)) return;

    trackedProductsRef.current.add(trackKey);
    api
      .createLead({
        productType,
        uuid: resumeUuid,
      })
      .catch(() => {
        trackedProductsRef.current.delete(trackKey);
      });
  }, [api, productType, queryScope, widgetConfig?.configured]);

  const containerId =
    productType === "credit-card"
      ? `${queryScope}-creditCardWidgetContainer`
      : `${queryScope}-loanWidgetContainer`;

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
        Failed to load Choice Connect config from backend.
        {error instanceof Error ? ` ${error.message}` : ""}
        <p className="mt-2 text-xs">
          Ensure SG-Backend is running and you are logged in.
        </p>
      </div>
    );
  }

  const configError = validateWidgetConfig(widgetConfig);
  const profile = widgetConfig.choiceConnectProfile;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
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
          {widgetConfig.staffMobile && (
            <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
              Mobile: <span className="font-medium text-foreground">{widgetConfig.staffMobile}</span>
            </span>
          )}
          {profile?.onboarded && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">
              Choice Connect onboarded
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {allowLoanProductSelect && (
          <div className="max-w-xs">
            <label className="mb-1 block text-sm font-medium">Loan Type</label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value as ChoiceProductType)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {CHOICE_LOAN_PRODUCTS.map((loan) => (
                <option key={loan.value} value={loan.value}>
                  {loan.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {configError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {configError}
          </div>
        ) : (
          <ChoiceConnectWidget
            config={widgetConfig}
            productType={productType}
            containerId={containerId}
          />
        )}
      </div>
    </div>
  );
}
