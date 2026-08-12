"use client";

import { InsuranceReferralLinksPanel } from "@/modules/insurance";
import { adminInsuranceApi } from "@/sg-admin/lib/services/insuranceService";

export default function AdminInsuranceReferralLinksPage() {
  return (
    <InsuranceReferralLinksPanel
      api={adminInsuranceApi}
      queryScope="admin-insurance-referrals"
      title="Insurance Referral Links"
      showAgentCodeFilter
    />
  );
}
