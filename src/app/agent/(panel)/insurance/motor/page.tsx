"use client";

import { InsuranceApplyPanel } from "@/components/insurance/InsuranceApplyPanel";
import { agentChoiceConnectApi } from "@/sg-agent/lib/services/choiceConnectService";

export default function AgentInsuranceMotorPage() {
  return (
    <InsuranceApplyPanel
      api={agentChoiceConnectApi}
      queryScope="agent-insurance"
      title="Motor Insurance"
      description="Bike / car insurance for your customers. Separate from the Credit Card module."
    />
  );
}
