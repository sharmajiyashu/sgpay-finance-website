"use client";

import { ChoiceConnectApplyPanel } from "@/components/choice-connect/ChoiceConnectApplyPanel";
import { agentChoiceConnectApi } from "@/sg-agent/lib/services/choiceConnectService";

export default function AgentLoansApplyPage() {
  return (
    <ChoiceConnectApplyPanel
      api={agentChoiceConnectApi}
      queryScope="agent"
      productType="personal-loan"
      title="Apply Loan"
      description="Start a loan application for your customer."
      allowLoanProductSelect
    />
  );
}
