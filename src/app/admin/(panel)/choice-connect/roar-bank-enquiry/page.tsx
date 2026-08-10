"use client";

import { EnquiriesPanel } from "@/sg-admin/components/EnquiriesPanel";
import { ROAR_CREDIT_CARD } from "@/lib/config/creditCards";

export default function RoarBankEnquiryPage() {
  return (
    <EnquiriesPanel
      categoryId="finance"
      serviceSlug={ROAR_CREDIT_CARD.id}
      title="Roar Bank Enquiry"
      subtitle="Only leads submitted from the website Roar Credit Card apply form"
    />
  );
}
