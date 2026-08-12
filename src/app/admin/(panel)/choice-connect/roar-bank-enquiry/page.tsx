"use client";

import { EnquiriesPanel } from "@/sg-admin/components/EnquiriesPanel";
import { RoarReferralCopyCard } from "@/components/roar/RoarReferralCopyCard";
import { ROAR_CREDIT_CARD } from "@/lib/config/creditCards";
import { getRoarReferralLink } from "@/sg-admin/lib/services/roarReferralService";

export default function RoarBankEnquiryPage() {
  return (
    <div className="space-y-6">
      <RoarReferralCopyCard getLink={getRoarReferralLink} queryScope="admin" />
      <EnquiriesPanel
        categoryId="finance"
        serviceSlug={ROAR_CREDIT_CARD.id}
        title="Roar Bank Enquiry"
        subtitle="Website Roar Credit Card enquiries — referrer shows team role (ASM, RM, etc.) when customers used a staff referral link"
      />
    </div>
  );
}
