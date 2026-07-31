"use client";

import React, { useEffect, useRef } from "react";

interface ChoiceLoanWidgetProps {
  uuid?: string; // Lead id, optional for new customer journey
  productType?: string; // loan product slug/type
}

export function ChoiceLoanWidget({ uuid = "", productType = "personal-loan" }: ChoiceLoanWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;

    const widgetBaseUrl = process.env.NEXT_PUBLIC_CHOICE_CONNECT_WIDGET_BASE_URL || "https://embed-uat.choiceconnect.in";
    const clientCode = process.env.NEXT_PUBLIC_CHOICE_CONNECT_CLIENT_CODE || "t girshapay";
    const agentCode = process.env.NEXT_PUBLIC_CHOICE_CONNECT_AGENT_CODE || "";
    const subAgentCode = process.env.NEXT_PUBLIC_CHOICE_CONNECT_SUB_AGENT_CODE || "";

    const initializeWidget = () => {
      const partner_config: any = {
        CLIENT_CODE: clientCode,
        SOURCE: "PARTNER_WEB",
        AGENT_CODE: agentCode,
        PRODUCT_TYPE: productType,
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

      // Ensure loan widget or general widget is loaded
      if (typeof window !== "undefined") {
        if ((window as any).LoanWidget) {
          (window as any).LoanWidget("loanWidgetContainer", config);
        } else if ((window as any).CreditCardWidget) {
          (window as any).CreditCardWidget("loanWidgetContainer", config);
        }
      }
    };

    const loadWidgetScript = () => {
      if (document.getElementById("choice-loan-widget-script")) {
        initializeWidget();
        return;
      }

      scriptElement = document.createElement("script");
      scriptElement.id = "choice-loan-widget-script";
      scriptElement.src = `${widgetBaseUrl}/widget/widget.js`;
      scriptElement.async = true;
      scriptElement.onload = () => {
        initializeWidget();
      };

      document.body.appendChild(scriptElement);
    };

    loadWidgetScript();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [uuid, productType]);

  return (
    <div className="choice-widget-wrapper border rounded shadow-sm bg-white p-2 w-100">
      <div id="loanWidgetContainer" ref={containerRef} style={{ minHeight: "450px" }}>
        {/* The Choice Connect Loan widget will render here */}
      </div>
    </div>
  );
}
