"use client";

import { useEffect, useRef } from "react";
import type { ChoiceProductType, ChoiceWidgetConfig } from "@/lib/choiceConnect/types";
import {
  buildWidgetPartnerConfig,
  validateWidgetConfig,
} from "@/lib/choiceConnect/widgetConfig";

interface ChoiceConnectWidgetProps {
  config: ChoiceWidgetConfig;
  productType: ChoiceProductType;
  /** Choice Connect enquiry UUID — only when resuming an existing application */
  uuid?: string;
  containerId?: string;
  className?: string;
}

export function ChoiceConnectWidget({
  config,
  productType,
  uuid,
  containerId,
  className = "",
}: ChoiceConnectWidgetProps) {
  const resolvedContainerId =
    containerId ||
    (productType === "credit-card" ? "creditCardWidgetContainer" : "loanWidgetContainer");

  const containerRef = useRef<HTMLDivElement>(null);
  const configError = validateWidgetConfig(config);

  useEffect(() => {
    if (configError) return;

    const scriptId =
      productType === "credit-card"
        ? "choice-credit-card-widget-script"
        : "choice-loan-widget-script";

    const initializeWidget = () => {
      const partner_config = buildWidgetPartnerConfig(config, {
        uuid,
        productType,
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
      };

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
  }, [config, productType, uuid, resolvedContainerId, configError]);

  if (configError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {configError}
      </div>
    );
  }

  return (
    <div className={`choice-widget-wrapper w-full max-w-full overflow-x-auto rounded-xl border bg-white p-2 shadow-sm ${className}`}>
      <div
        id={resolvedContainerId}
        ref={containerRef}
        className="min-w-0"
        style={{
          minHeight: productType === "credit-card" ? "400px" : "450px",
        }}
      />
    </div>
  );
}
