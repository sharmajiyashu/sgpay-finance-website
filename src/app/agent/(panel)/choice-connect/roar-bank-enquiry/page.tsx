"use client";

import { RoarBankEnquiryWorkspace } from "@/components/roar/RoarBankEnquiryWorkspace";
import { ROAR_CREDIT_CARD } from "@/lib/config/creditCards";
import { AGENT_API_PATHS } from "@/lib/config/env";
import { getAgentCommissionRates } from "@/sg-agent/lib/services/commissionService";
import { createAgentRoarEnquiry, getEnquiries } from "@/sg-agent/lib/services/enquiryService";
import { getRoarReferralLink } from "@/sg-agent/lib/services/roarReferralService";

export default function AgentRoarBankEnquiryPage() {
  return (
    <RoarBankEnquiryWorkspace
      title="Roar Bank Enquiry"
      subtitle="Only Roar Credit Card enquiries from your referral link — your name and agent type appear on each row"
      getLink={getRoarReferralLink}
      queryScope="agent"
      createEnquiry={createAgentRoarEnquiry}
      invalidateKeys={[["agent-roar-enquiries"]]}
      listPanel={{
        queryKeyPrefix: "agent-roar-enquiries",
        readOnly: true,
        categoryId: "finance",
        serviceSlug: ROAR_CREDIT_CARD.id,
        api: {
          listPath: AGENT_API_PATHS.enquiries,
          getEnquiries,
        },
      }}
      getRates={getAgentCommissionRates}
    />
  );
}
