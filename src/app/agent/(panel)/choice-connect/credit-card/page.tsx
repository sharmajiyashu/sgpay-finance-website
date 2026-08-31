"use client";

import { ChoiceConnectApplyPanel } from "@/components/choice-connect/ChoiceConnectApplyPanel";
import { agentChoiceConnectApi } from "@/sg-agent/lib/services/choiceConnectService";
import { getAgentCommissionRates } from "@/sg-agent/lib/services/commissionService";

export default function AgentCreditCardApplyPage() {
  return (
    <ChoiceConnectApplyPanel
      api={agentChoiceConnectApi}
      queryScope="agent"
      productType="credit-card"
      title="Apply Credit Card"
      description="Start a credit card application for your customer."
      getRates={getAgentCommissionRates}
    />
  );
}
