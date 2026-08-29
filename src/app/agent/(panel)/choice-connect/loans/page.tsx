"use client";

import { ChoiceConnectApplyPanel } from "@/components/choice-connect/ChoiceConnectApplyPanel";
import { agentChoiceConnectApi } from "@/sg-agent/lib/services/choiceConnectService";

export default function AgentLoansApplyPage() {
  return (
    <ChoiceConnectApplyPanel
      api={agentChoiceConnectApi}
      queryScope="agent-loan"
      productType="personal-loan"
      allowLoanProductSelect
      title="Apply Loan"
      description="Start a loan application for your customer. Your name is sent as the referrer on Choice Connect."
    />
  );
}
