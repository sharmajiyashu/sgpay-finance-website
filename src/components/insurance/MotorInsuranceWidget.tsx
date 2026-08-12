"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ChoiceVehicleType, ChoiceWidgetConfig } from "@/lib/choiceConnect/types";
import { buildWidgetPartnerConfig, validateWidgetConfig } from "@/lib/choiceConnect/widgetConfig";

interface MotorInsuranceWidgetProps {
  config: ChoiceWidgetConfig;
  vehicleType: ChoiceVehicleType;
  uuid?: string;
  className?: string;
}

type WidgetHost = Window & {
  MotorInsuranceWidget?: (id: string, cfg: unknown) => void;
  InsuranceWidget?: (id: string, cfg: unknown) => void;
};

function resolveMotorInit(win: WidgetHost): ((id: string, cfg: unknown) => void) | null {
  if (typeof win.MotorInsuranceWidget === "function") return win.MotorInsuranceWidget.bind(win);
  if (typeof win.InsuranceWidget === "function") return win.InsuranceWidget.bind(win);
  return null;
}

/**
 * Dedicated Motor Insurance embed — never falls back to CreditCardWidget.
 */
export function MotorInsuranceWidget({
  config,
  vehicleType,
  uuid,
  className = "",
}: MotorInsuranceWidgetProps) {
  const reactId = useId().replace(/:/g, "");
  const containerId = `insuranceWidgetContainer-${reactId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const configError = validateWidgetConfig(config, "motor-insurance");

  useEffect(() => {
    if (configError) return;

    setLoadError(null);
    const scriptId = "choice-motor-insurance-widget-script";

    const initializeWidget = () => {
      const partner_config = buildWidgetPartnerConfig(config, {
        uuid,
        productType: "motor-insurance",
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
      const win = window as WidgetHost;
      const init = resolveMotorInit(win);

      if (!init) {
        const host = win as unknown as Record<string, unknown>;
        const available = Object.keys(host).filter(
          (k) => /widget|insurance|motor/i.test(k) && typeof host[k] === "function"
        );
        setLoadError(
          `Motor insurance widget is not available from Choice Connect script. Expected window.MotorInsuranceWidget.${
            available.length ? ` Found: ${available.join(", ")}` : ""
          }`
        );
        return;
      }

      setLoadError(null);
      init(containerId, widgetConfig);
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
      scriptElement.src = `${config.widgetBaseUrl.replace(/\/+$/, "")}/widget/widget.js`;
      scriptElement.async = true;
      scriptElement.onload = () => {
        scriptElement.setAttribute("data-loaded", "true");
        initializeWidget();
      };
      scriptElement.onerror = () => {
        setLoadError(
          `Failed to load motor insurance widget script: ${config.widgetBaseUrl}/widget/widget.js`
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
  }, [config, vehicleType, uuid, containerId, configError]);

  if (configError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {configError}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">Motor Insurance widget could not start</p>
        <p className="mt-1">{loadError}</p>
        <p className="mt-2 text-xs">
          Credit Card widget is intentionally not used here. Confirm Choice Connect enabled Motor
          Insurance for your partner and that LIVE embed URL is set.
        </p>
      </div>
    );
  }

  return (
    <div className={`motor-insurance-widget-wrapper rounded-xl border bg-white p-2 shadow-sm ${className}`}>
      <div
        id={containerId}
        ref={containerRef}
        style={{ minHeight: "480px" }}
        data-product="motor-insurance"
        data-vehicle-type={vehicleType}
      />
    </div>
  );
}
