"use client";

import { EnquiriesPanel } from "@/sg-admin/components/EnquiriesPanel";
import { RoarReferralCopyCard } from "@/components/roar/RoarReferralCopyCard";
import { ROAR_CREDIT_CARD } from "@/lib/config/creditCards";
import { AGENT_API_PATHS } from "@/lib/config/env";
import { getEnquiries } from "@/sg-agent/lib/services/enquiryService";
import { getRoarReferralLink } from "@/sg-agent/lib/services/roarReferralService";

export default function AgentRoarBankEnquiryPage() {
  return (
    <div className="space-y-6">
      <RoarReferralCopyCard getLink={getRoarReferralLink} queryScope="agent" />
      <EnquiriesPanel
        categoryId="finance"
        serviceSlug={ROAR_CREDIT_CARD.id}
        title="Roar Bank Enquiry"
        subtitle="Only Roar Credit Card enquiries from your referral link — your name and agent type appear on each row"
        readOnly
        queryKeyPrefix="agent-roar-enquiries"
        api={{
          listPath: AGENT_API_PATHS.enquiries,
          getEnquiries,
        }}
      />
    </div>
  );
}
