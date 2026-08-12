"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChoiceConnectWidget } from "@/components/choice-connect/ChoiceConnectWidget";
import { MotorInsuranceWidget } from "@/components/insurance/MotorInsuranceWidget";
import type { ChoiceProductType, ChoiceVehicleType } from "@/lib/choiceConnect/types";
import { CHOICE_VEHICLE_TYPES } from "@/lib/choiceConnect/types";
import {
  createWebsiteChoiceLead,
  getWebsiteChoiceConnectConfig,
} from "@/lib/choiceConnect/publicService";
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
  const [vehicleType, setVehicleType] = useState<ChoiceVehicleType>("bike");
  const trackedProductsRef = useRef<Set<string>>(new Set());
  const isMotor = productType === "motor-insurance";

  const { data: remoteConfig } = useQuery({
    queryKey: ["website-choice-connect-config"],
    queryFn: getWebsiteChoiceConnectConfig,
    staleTime: 5 * 60 * 1000,
    enabled: isMotor,
  });

  const widgetConfig = isMotor
    ? remoteConfig || getWebsiteWidgetConfig()
    : getWebsiteWidgetConfig();

  const containerId = isMotor
    ? "insuranceWidgetContainer"
    : productType === "credit-card"
      ? "creditCardWidgetContainer"
      : "loanWidgetContainer";

  useEffect(() => {
    const trackKey = isMotor
      ? `website:${productType}:${vehicleType}`
      : `website:${productType}`;
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
      metadata: isMotor ? { vehicleType } : undefined,
    }).catch(() => {
      trackedProductsRef.current.delete(trackKey);
    });
  }, [productType, vehicleType, isMotor]);

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

      {isMotor && (
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
      )}

      {isMotor ? (
        <MotorInsuranceWidget config={widgetConfig} vehicleType={vehicleType} />
      ) : (
        <ChoiceConnectWidget
          config={widgetConfig}
          productType={productType}
          containerId={containerId}
        />
      )}
    </div>
  );
}
