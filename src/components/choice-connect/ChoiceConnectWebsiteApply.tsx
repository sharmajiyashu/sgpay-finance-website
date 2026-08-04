"use client";

import { useState } from "react";
import { ChoiceConnectWidget } from "@/components/choice-connect/ChoiceConnectWidget";
import { createWebsiteChoiceLead } from "@/lib/choiceConnect/publicService";
import type { ChoiceProductType } from "@/lib/choiceConnect/types";
import { getWebsiteWidgetConfig } from "@/lib/choiceConnect/widgetConfig";

interface ChoiceConnectWebsiteApplyProps {
  productType?: ChoiceProductType;
  title?: string;
  allowLoanProductSelect?: boolean;
  /** When true, widget loads immediately (default — matches original website behaviour). */
  directWidget?: boolean;
}

export function ChoiceConnectWebsiteApply({
  productType: initialProductType = "credit-card",
  title = "Apply Now",
  allowLoanProductSelect = false,
  directWidget = true,
}: ChoiceConnectWebsiteApplyProps) {
  const [productType, setProductType] = useState<ChoiceProductType>(initialProductType);
  const [trackOpen, setTrackOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [trackStatus, setTrackStatus] = useState<string | null>(null);

  const widgetConfig = getWebsiteWidgetConfig();
  const containerId =
    productType === "credit-card" ? "creditCardWidgetContainer" : "loanWidgetContainer";

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setTrackStatus("Name and phone are required for tracking.");
      return;
    }
    setTrackStatus("Saving…");
    try {
      await createWebsiteChoiceLead({
        productType,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerPhone: customerPhone.trim(),
        agentCode: widgetConfig.agentCode,
      });
      setTrackStatus("Details saved. Continue your application below.");
    } catch {
      // Do not block the widget if backend tracking fails.
      setTrackStatus("Application widget is ready below. Tracking sync will retry later.");
    }
  };

  if (directWidget) {
    return (
      <div>
        {allowLoanProductSelect && (
          <div className="mx-auto mb-3 max-w-md">
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value as ChoiceProductType)}
              className="form-select"
            >
              <option value="personal-loan">Personal Loan</option>
              <option value="business-loan">Business Loan</option>
              <option value="home-loan">Home Loan</option>
              <option value="other-loan">Other Loan</option>
            </select>
          </div>
        )}

        <ChoiceConnectWidget
          config={widgetConfig}
          productType={productType}
          containerId={containerId}
        />

        <div className="mt-4 text-center">
          <button
            type="button"
            className="btn btn-link btn-sm text-muted"
            onClick={() => setTrackOpen((v) => !v)}
          >
            {trackOpen ? "Hide enquiry form" : "Save my contact details (optional)"}
          </button>
        </div>

        {trackOpen && (
          <form onSubmit={handleTrackSubmit} className="mx-auto mt-2 max-w-md space-y-2 border-top pt-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Full Name *"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="email"
              className="form-control form-control-sm"
              placeholder="Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <input
              type="tel"
              className="form-control form-control-sm"
              placeholder="Phone *"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
            <button type="submit" className="btn btn-outline-primary btn-sm w-100">
              Save details
            </button>
            {trackStatus && <p className="small text-muted mb-0">{trackStatus}</p>}
          </form>
        )}
      </div>
    );
  }

  // Admin-style gated flow (not used on public website by default).
  return (
    <div className="bg-light rounded border p-4">
      <h4 className="mb-3 text-center">{title}</h4>
      <ChoiceConnectWidget
        config={widgetConfig}
        productType={productType}
        containerId={containerId}
      />
    </div>
  );
}
