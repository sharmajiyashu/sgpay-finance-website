"use client";

import { ChoiceConnectSsoLoginButton } from "@/components/choice-connect/ChoiceConnectSsoLoginButton";
import { InsuranceReferralLinksPanel } from "@/modules/insurance";
import { agentChoiceConnectApi } from "@/sg-agent/lib/services/choiceConnectService";
import { agentInsuranceApi } from "@/sg-agent/lib/services/insuranceService";

export default function AgentInsuranceReferralLinksPage() {
  return (
    <div className="space-y-8">
      <ChoiceConnectSsoLoginButton
        api={agentChoiceConnectApi}
        label="Open Choice Connect portal"
        description="Login as this agent. Vehicle insurance referrals on Choice Connect will show under their name."
      />
      <InsuranceReferralLinksPanel
        api={agentInsuranceApi}
        queryScope="agent-insurance-referrals"
        title="Insurance Referral Links"
        description="Share these links so vehicle insurance enquiries are attributed to this agent."
      />
    </div>
  );
}
