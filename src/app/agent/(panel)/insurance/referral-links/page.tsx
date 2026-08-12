"use client";

import { InsuranceReferralLinksPanel } from "@/modules/insurance";
import { agentInsuranceApi } from "@/sg-agent/lib/services/insuranceService";

export default function AgentInsuranceReferralLinksPage() {
  return (
    <InsuranceReferralLinksPanel
      api={agentInsuranceApi}
      queryScope="agent-insurance-referrals"
      title="Insurance Referral Links"
    />
  );
}
