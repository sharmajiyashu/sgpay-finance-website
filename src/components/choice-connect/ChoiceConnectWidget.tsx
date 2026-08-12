"use client";

import { useEffect, useRef } from "react";
import type {
  ChoiceProductType,
  ChoiceVehicleType,
  ChoiceWidgetConfig,
} from "@/lib/choiceConnect/types";
import {
  buildWidgetPartnerConfig,
  validateWidgetConfig,
} from "@/lib/choiceConnect/widgetConfig";

interface ChoiceConnectWidgetProps {
  config: ChoiceWidgetConfig;
  productType: ChoiceProductType;
  /** Choice Connect enquiry UUID — only when resuming an existing application */
  uuid?: string;
  vehicleType?: ChoiceVehicleType;
  containerId?: string;
  className?: string;
}

export function ChoiceConnectWidget({
  config,
  productType,
  uuid,
  vehicleType,
  containerId,
  className = "",
}: ChoiceConnectWidgetProps) {
  const resolvedContainerId =
    containerId ||
    (productType === "motor-insurance"
      ? "insuranceWidgetContainer"
      : productType === "credit-card"
        ? "creditCardWidgetContainer"
        : "loanWidgetContainer");

  const containerRef = useRef<HTMLDivElement>(null);
  const configError = validateWidgetConfig(config, productType);

  useEffect(() => {
    if (configError) return;
    if (productType === "motor-insurance" && !vehicleType) return;

    const scriptId =
      productType === "credit-card"
        ? "choice-credit-card-widget-script"
        : productType === "motor-insurance"
          ? "choice-motor-insurance-widget-script"
          : "choice-loan-widget-script";

    const initializeWidget = () => {
      const partner_config = buildWidgetPartnerConfig(config, {
        uuid,
        productType,
        vehicleType,
      });

      const widgetConfig = {
        theme: {
          mode: "light",
          options: {
            palette: {
              primary: { main: "#0F2B40" },
              secondary: { main: "#265BFF" },
              background: { default: "#F5F5F5" },
            },
          },
        },
        partner_config,
      };

      if (typeof window === "undefined") return;

      const win = window as Window & {
        CreditCardWidget?: (id: string, cfg: unknown) => void;
        LoanWidget?: (id: string, cfg: unknown) => void;
        MotorInsuranceWidget?: (id: string, cfg: unknown) => void;
      };

      // Never fall back across product types (insurance must not open credit card).
      if (productType === "motor-insurance") {
        if (win.MotorInsuranceWidget) {
          win.MotorInsuranceWidget(resolvedContainerId, widgetConfig);
        } else {
          console.error(
            "MotorInsuranceWidget is not available. Credit Card widget will NOT be used as fallback."
          );
        }
        return;
      }

      if (productType === "credit-card") {
        if (win.CreditCardWidget) {
          win.CreditCardWidget(resolvedContainerId, widgetConfig);
        }
        return;
      }

      if (win.LoanWidget) {
        win.LoanWidget(resolvedContainerId, widgetConfig);
      }
    };

    const loadWidgetScript = () => {
      const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (existing) {
        if (existing.getAttribute("data-loaded") === "true") {
          initializeWidget();
        } else {
          existing.addEventListener("load", initializeWidget, { once: true });
        }
        return;
      }

      const scriptElement = document.createElement("script");
      scriptElement.id = scriptId;
      scriptElement.src = `${config.widgetBaseUrl}/widget/widget.js`;
      scriptElement.async = true;
      scriptElement.onload = () => {
        scriptElement.setAttribute("data-loaded", "true");
        initializeWidget();
      };
      scriptElement.onerror = () => {
        console.error(
          "Choice Connect widget script failed to load. Use embed URL:",
          `${config.widgetBaseUrl}/widget/widget.js`
        );
      };
      document.body.appendChild(scriptElement);
    };

    loadWidgetScript();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [
    config,
    productType,
    uuid,
    vehicleType,
    resolvedContainerId,
    configError,
  ]);

  if (configError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {configError}
      </div>
    );
  }

  if (productType === "motor-insurance" && !vehicleType) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Select bike or car to load the Motor Insurance widget.
      </div>
    );
  }

  return (
    <div className={`choice-widget-wrapper rounded-xl border bg-white p-2 shadow-sm ${className}`}>
      <div
        id={resolvedContainerId}
        ref={containerRef}
        style={{
          minHeight:
            productType === "credit-card"
              ? "400px"
              : productType === "motor-insurance"
                ? "480px"
                : "450px",
        }}
      />
    </div>
  );
}
