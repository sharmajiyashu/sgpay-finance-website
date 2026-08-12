"use client";

import { useEffect, useRef, useState } from "react";
import { ChoiceConnectWidget } from "@/components/choice-connect/ChoiceConnectWidget";
import type { ChoiceProductType } from "@/lib/choiceConnect/types";
import { createWebsiteChoiceLead } from "@/lib/choiceConnect/publicService";
import { getWebsiteWidgetConfig } from "@/lib/choiceConnect/widgetConfig";

interface ChoiceConnectWebsiteApplyProps {
  productType?: ChoiceProductType;
  allowLoanProductSelect?: boolean;
}

export function ChoiceConnectWebsiteApply({
  productType: initialProductType = "credit-card",
  allowLoanProductSelect = false,
}: ChoiceConnectWebsiteApplyProps) {
  const [productType, setProductType] = useState<ChoiceProductType>(initialProductType);
  const trackedProductsRef = useRef<Set<string>>(new Set());
  const widgetConfig = getWebsiteWidgetConfig();

  const containerId =
    productType === "credit-card" ? "creditCardWidgetContainer" : "loanWidgetContainer";

  useEffect(() => {
    const trackKey = `website:${productType}`;
    if (trackedProductsRef.current.has(trackKey)) return;

    const searchParams = new URLSearchParams(window.location.search);
    const refId =
      searchParams.get("refId") ||
      searchParams.get("agentId") ||
      searchParams.get("agentCode") ||
      undefined;

    trackedProductsRef.current.add(trackKey);
    createWebsiteChoiceLead({
      productType,
      refId,
    }).catch(() => {
      trackedProductsRef.current.delete(trackKey);
    });
  }, [productType]);

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
