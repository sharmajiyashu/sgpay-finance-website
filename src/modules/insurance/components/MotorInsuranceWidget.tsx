"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { InsuranceVehicleType, InsuranceWidgetConfig } from "@/modules/insurance/types";
import {
  buildMotorPartnerConfig,
  resolveMotorWidgetBaseUrl,
  validateMotorWidgetConfig,
} from "@/modules/insurance/widgetConfig";

interface MotorInsuranceWidgetProps {
  config: InsuranceWidgetConfig;
  vehicleType: InsuranceVehicleType;
  uuid?: string;
  className?: string;
}

type WidgetHost = Window & {
  MotorInsuranceWidget?: (id: string, cfg: unknown) => void;
  InsuranceWidget?: (id: string, cfg: unknown) => void;
};

const SCRIPT_ID = "choice-motor-insurance-widget-script";

function resolveMotorInit(win: WidgetHost): ((id: string, cfg: unknown) => void) | null {
  if (typeof win.MotorInsuranceWidget === "function") return win.MotorInsuranceWidget.bind(win);
  if (typeof win.InsuranceWidget === "function") return win.InsuranceWidget.bind(win);
  return null;
}

function waitForMotorInit(
  win: WidgetHost,
  attempts = 25,
  delayMs = 80
): Promise<((id: string, cfg: unknown) => void) | null> {
  return new Promise((resolve) => {
    let left = attempts;
    const tick = () => {
      const init = resolveMotorInit(win);
      if (init) {
        resolve(init);
        return;
      }
      left -= 1;
      if (left <= 0) {
        resolve(null);
        return;
      }
      window.setTimeout(tick, delayMs);
    };
    tick();
  });
}

/**
 * Motor Insurance embed — loads https://motor.choiceinsurance.in/widget/widget.js
 *
 * Parent should pass `key={vehicleType}` so bike/car switches fully remount with a
 * fresh container (Choice widget 401s if the same root is reused after wipe).
 */
export function MotorInsuranceWidget({
  config,
  vehicleType,
  uuid,
  className = "",
}: MotorInsuranceWidgetProps) {
  const reactId = useId().replace(/:/g, "");
  // Include vehicleType so each bike/car mount gets a unique DOM id.
  const containerId = `insuranceWidgetContainer-${reactId}-${vehicleType}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const configError = validateMotorWidgetConfig(config);
  const widgetBaseUrl = resolveMotorWidgetBaseUrl(config);
  const scriptSrc = `${widgetBaseUrl}/widget/widget.js`;

  useEffect(() => {
    if (configError) {
      setIsBooting(false);
      return;
    }

    let cancelled = false;
    let bootTimer: number | undefined;
    setLoadError(null);
    setIsBooting(true);

    const initializeWidget = async () => {
      if (cancelled || typeof window === "undefined") return;

      const partner_config = buildMotorPartnerConfig(config, { uuid, vehicleType });
      const widgetConfig = {
        theme: {
          mode: "light",
          options: {
            palette: {
              primary: { main: "#0F2B40" },
              secondary: { main: "#265BFF" },
              background: { default: "#F5F5F5" },
            },
            offsetTop: 0,
          },
        },
        partner_config,
      };

      const win = window as WidgetHost;
      const init = (await waitForMotorInit(win)) || resolveMotorInit(win);
      if (cancelled) return;

      if (!init) {
        setIsBooting(false);
        setLoadError(
          `Motor insurance widget is not available from ${scriptSrc}. Expected window.MotorInsuranceWidget.`
        );
        return;
      }

      const el = document.getElementById(containerId);
      if (!el) {
        setIsBooting(false);
        setLoadError("Insurance widget container was not found in the page.");
        return;
      }

      // Fresh empty node — never reuse a wiped Choice React root.
      el.innerHTML = "";

      setLoadError(null);
      setIsBooting(false);
      init(containerId, widgetConfig);
    };

    const ensureScript = () => {
      const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

      if (
        existing &&
        existing.src &&
        !existing.src.includes("motor.choiceinsurance.in") &&
        !existing.src.includes(widgetBaseUrl)
      ) {
        existing.remove();
      }

      const current = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (current) {
        if (current.getAttribute("data-loaded") === "true") {
          // Small delay so the new container is committed after vehicle-type remount.
          bootTimer = window.setTimeout(() => {
            void initializeWidget();
          }, 50);
        } else {
          current.addEventListener(
            "load",
            () => {
              current.setAttribute("data-loaded", "true");
              void initializeWidget();
            },
            { once: true }
          );
        }
        return;
      }

      const scriptElement = document.createElement("script");
      scriptElement.id = SCRIPT_ID;
      scriptElement.src = scriptSrc;
      scriptElement.async = true;
      scriptElement.dataset.motorWidget = "true";
      scriptElement.onload = () => {
        scriptElement.setAttribute("data-loaded", "true");
        void initializeWidget();
      };
      scriptElement.onerror = () => {
        if (cancelled) return;
        setIsBooting(false);
        setLoadError(`Failed to load motor insurance widget script: ${scriptSrc}`);
      };
      document.body.appendChild(scriptElement);
    };

    ensureScript();

    return () => {
      cancelled = true;
      if (bootTimer) window.clearTimeout(bootTimer);
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = "";
    };
  }, [config, vehicleType, uuid, containerId, configError, scriptSrc, widgetBaseUrl]);

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
      </div>
    );
  }

  return (
    <div className={`motor-insurance-widget-wrapper rounded-xl border bg-white p-2 shadow-sm ${className}`}>
      {isBooting && (
        <div className="px-3 py-2 text-xs text-muted-foreground">Loading motor insurance widget…</div>
      )}
      <div
        id={containerId}
        ref={containerRef}
        style={{ minHeight: "480px" }}
        data-product="motor-insurance"
        data-vehicle-type={vehicleType}
        data-widget-src={scriptSrc}
      />
    </div>
  );
}
