"use client";

import { InsuranceSummaryPanel } from "@/modules/insurance";
import { agentInsuranceApi } from "@/sg-agent/lib/services/insuranceService";

export default function AgentInsuranceSummaryPage() {
  return (
    <InsuranceSummaryPanel
      api={agentInsuranceApi}
      queryScope="agent-insurance-summary"
      applyHref="/agent/insurance/motor"
      title="Motor Insurance Summary"
      showSourceFilter={false}
    />
  );
}
