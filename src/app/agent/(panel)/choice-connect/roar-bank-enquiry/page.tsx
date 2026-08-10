"use client";

import { EnquiriesPanel } from "@/sg-admin/components/EnquiriesPanel";
import { ROAR_CREDIT_CARD } from "@/lib/config/creditCards";
import { AGENT_API_PATHS } from "@/lib/config/env";
import { getEnquiries } from "@/sg-agent/lib/services/enquiryService";

export default function AgentRoarBankEnquiryPage() {
  return (
    <EnquiriesPanel
      categoryId="finance"
      serviceSlug={ROAR_CREDIT_CARD.id}
      title="Roar Bank Enquiry"
      subtitle="Only leads submitted from the website Roar Credit Card apply form"
      readOnly
      queryKeyPrefix="agent-roar-enquiries"
      api={{
        listPath: AGENT_API_PATHS.enquiries,
        getEnquiries,
      }}
    />
  );
}
