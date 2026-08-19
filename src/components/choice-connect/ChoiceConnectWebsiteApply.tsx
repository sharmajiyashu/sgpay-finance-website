"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChoiceConnectWidget } from "@/components/choice-connect/ChoiceConnectWidget";
import type { ChoiceProductType, ChoiceWidgetConfig } from "@/lib/choiceConnect/types";
import {
  createWebsiteChoiceLead,
  getWebsiteChoiceConnectConfig,
} from "@/lib/choiceConnect/publicService";
import { getWebsiteWidgetConfig } from "@/lib/choiceConnect/widgetConfig";

interface ChoiceConnectWebsiteApplyProps {
  productType?: ChoiceProductType;
  allowLoanProductSelect?: boolean;
}

function readRefId(): string {
  if (typeof window === "undefined") return "";
  const searchParams = new URLSearchParams(window.location.search);
  return (
    searchParams.get("refId") ||
    searchParams.get("agentId") ||
    searchParams.get("agentCode") ||
    ""
  ).trim();
}

export function ChoiceConnectWebsiteApply({
  productType: initialProductType = "credit-card",
  allowLoanProductSelect = false,
}: ChoiceConnectWebsiteApplyProps) {
  const [productType, setProductType] = useState<ChoiceProductType>(initialProductType);
  const [remoteConfig, setRemoteConfig] = useState<ChoiceWidgetConfig | null>(null);
  const trackedProductsRef = useRef<Set<string>>(new Set());
  const refId = useMemo(() => readRefId(), []);

  useEffect(() => {
    getWebsiteChoiceConnectConfig()
      .then(setRemoteConfig)
      .catch(() => setRemoteConfig(getWebsiteWidgetConfig()));
  }, []);

  const widgetConfig: ChoiceWidgetConfig = {
    ...(remoteConfig || getWebsiteWidgetConfig()),
    subAgentCode: refId || remoteConfig?.subAgentCode || "",
  };

  const containerId =
    productType === "credit-card" ? "creditCardWidgetContainer" : "loanWidgetContainer";

  useEffect(() => {
    const trackKey = `website:${productType}`;
    if (trackedProductsRef.current.has(trackKey)) return;

    trackedProductsRef.current.add(trackKey);
    createWebsiteChoiceLead({
      productType,
      refId: refId || undefined,
    }).catch(() => {
      trackedProductsRef.current.delete(trackKey);
    });
  }, [productType, refId]);

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
    </div>
  );
}
