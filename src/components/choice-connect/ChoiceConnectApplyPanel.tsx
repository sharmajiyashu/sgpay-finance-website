"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChoiceConnectWidget } from "@/components/choice-connect/ChoiceConnectWidget";
import { validateWidgetConfig } from "@/lib/choiceConnect/widgetConfig";
import type {
  ChoiceProductType,
  CreateChoiceLeadInput,
} from "@/lib/choiceConnect/types";
import { CHOICE_LOAN_PRODUCTS } from "@/lib/choiceConnect/types";
import type { ChoiceWidgetConfig } from "@/lib/choiceConnect/types";

export interface ChoiceConnectApiClient {
  getConfig: () => Promise<ChoiceWidgetConfig & { configured?: boolean }>;
  createLead: (input: CreateChoiceLeadInput) => Promise<{ _id: string; uuid?: string }>;
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
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const { data: widgetConfig, isLoading, error } = useQuery({
    queryKey: ["choice-connect-config", queryScope],
    queryFn: () => api.getConfig(),
    staleTime: 5 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: (input: CreateChoiceLeadInput) => api.createLead(input),
    onSuccess: () => {
      toast.success("Customer saved — check Summary for this application");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Customer name and phone are required");
      return;
    }
    saveMutation.mutate({
      productType,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || undefined,
      customerPhone: customerPhone.trim(),
    });
  };

  const containerId =
    productType === "credit-card"
      ? `${queryScope}-creditCardWidgetContainer`
      : `${queryScope}-loanWidgetContainer`;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
            Source:{" "}
            <span className="font-medium text-foreground">{widgetConfig.sourceLabel}</span>
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
            CBA: <span className="font-medium text-foreground">{widgetConfig.agentCode}</span>
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSaveCustomer}
        className="max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm"
      >
        <div>
          <h2 className="text-lg font-medium">Customer Details</h2>
          <p className="text-xs text-muted-foreground">
            Save customer info for your Summary report. The widget below works independently — same as the public website.
          </p>
        </div>

        {allowLoanProductSelect && (
          <div>
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

        <div>
          <label className="mb-1 block text-sm font-medium">Full Name *</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="Customer full name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="customer@email.com"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone *</label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="10-digit mobile number"
          />
        </div>

        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="rounded-lg border border-primary bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/15 disabled:opacity-50"
        >
          {saveMutation.isPending ? "Saving…" : "Save to Summary"}
        </button>
      </form>

      <div className="space-y-2">
        <h2 className="text-lg font-medium">Choice Connect Application</h2>
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
