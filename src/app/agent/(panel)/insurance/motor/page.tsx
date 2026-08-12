"use client";

import { Suspense } from "react";
import { InsuranceApplyPanel } from "@/modules/insurance";
import { agentInsuranceApi } from "@/sg-agent/lib/services/insuranceService";

export default function AgentInsuranceMotorPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted" />}>
      <InsuranceApplyPanel
        api={agentInsuranceApi}
        queryScope="agent-insurance"
        applyBasePath="/agent/insurance/motor"
        title="Motor Insurance"
        description="Bike / car insurance via Choice Connect. Separate from the Credit Card module."
      />
    </Suspense>
  );
}
