"use client";

import { RoarBankEnquiryWorkspace } from "@/components/roar/RoarBankEnquiryWorkspace";
import { ROAR_CREDIT_CARD } from "@/lib/config/creditCards";
import { getCommissionRates } from "@/sg-admin/lib/services/commissionService";
import { createAdminRoarEnquiry } from "@/sg-admin/lib/services/enquiryService";
import { getRoarReferralLink } from "@/sg-admin/lib/services/roarReferralService";

export default function RoarBankEnquiryPage() {
  return (
    <RoarBankEnquiryWorkspace
      title="Roar Bank Enquiry"
      subtitle="Website Roar Credit Card enquiries — referrer shows team role (ASM, RM, etc.) when customers used a staff referral link"
      getLink={getRoarReferralLink}
      queryScope="admin"
      createEnquiry={createAdminRoarEnquiry}
      invalidateKeys={[["admin-enquiries"], ["enquiries"]]}
      listPanel={{
        queryKeyPrefix: "admin-enquiries",
        categoryId: "finance",
        serviceSlug: ROAR_CREDIT_CARD.id,
      }}
      getRates={() => getCommissionRates()}
    />
  );
}
