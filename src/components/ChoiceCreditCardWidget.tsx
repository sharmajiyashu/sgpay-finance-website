"use client";

import React, { useEffect, useRef } from "react";

interface ChoiceCreditCardWidgetProps {
  uuid?: string; // Lead id, optional for new customer journey
}

export function ChoiceCreditCardWidget({ uuid = "" }: ChoiceCreditCardWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;

    // We use the environment variable if present, otherwise fallback to default
    const widgetBaseUrl = process.env.NEXT_PUBLIC_CHOICE_CONNECT_WIDGET_BASE_URL || "https://embed-uat.choiceconnect.in";
    const clientCode = process.env.NEXT_PUBLIC_CHOICE_CONNECT_CLIENT_CODE || "t girshapay";
    const agentCode = process.env.NEXT_PUBLIC_CHOICE_CONNECT_AGENT_CODE || "";
    const subAgentCode = process.env.NEXT_PUBLIC_CHOICE_CONNECT_SUB_AGENT_CODE || "";

    const initializeWidget = () => {
      const partner_config: any = {
        CLIENT_CODE: clientCode,
        SOURCE: "PARTNER_WEB",
        AGENT_CODE: agentCode,
      };
      if (uuid) partner_config.UUID = uuid;
      if (subAgentCode) partner_config.SUB_AGENT_CODE = subAgentCode;

      const config = {
        theme: {
          mode: "light",
          options: {
            palette: {
              primary: { main: "#0F2B40" },
              secondary: { main: "#265BFF" },
              background: { default: "#F5F5F5" },
            }
          },
        },
        partner_config,
      };

      // Ensure widget is loaded
      if (typeof window !== "undefined" && (window as any).CreditCardWidget) {
        (window as any).CreditCardWidget("creditCardWidgetContainer", config);
      }
    };

    const loadWidgetScript = () => {
      // Prevent multiple injections
      if (document.getElementById("choice-credit-card-widget-script")) {
        initializeWidget();
        return;
      }

      scriptElement = document.createElement("script");
      scriptElement.id = "choice-credit-card-widget-script";
      scriptElement.src = "https://embed-uat.choiceconnect.in/widget/widget.js";
      scriptElement.async = true;
      scriptElement.onload = () => {
        initializeWidget();
      };

      document.body.appendChild(scriptElement);
    };

    loadWidgetScript();

    return () => {
      // Cleanup script when component unmounts
      const scriptToRemove = document.getElementById("choice-credit-card-widget-script");
      if (scriptToRemove && document.body.contains(scriptToRemove)) {
        document.body.removeChild(scriptToRemove);
      }

      // Cleanup container if widget leaves artifacts
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [uuid]);

  return (
    <div className="choice-widget-wrapper border rounded shadow-sm bg-white p-2 w-100">
      <div id="creditCardWidgetContainer" ref={containerRef} style={{ minHeight: "400px" }}>
        {/* The Choice Connect widget will render here */}
      </div>
    </div>
  );
}
