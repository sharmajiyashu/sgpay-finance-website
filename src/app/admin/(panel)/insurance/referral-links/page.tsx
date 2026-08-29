"use client";

import { ChoiceConnectSsoLoginButton } from "@/components/choice-connect/ChoiceConnectSsoLoginButton";
import { InsuranceReferralLinksPanel } from "@/modules/insurance";
import { adminChoiceConnectApi } from "@/sg-admin/lib/services/choiceConnectService";
import { adminInsuranceApi } from "@/sg-admin/lib/services/insuranceService";

export default function AdminInsuranceReferralLinksPage() {
  return (
    <div className="space-y-8">
      <ChoiceConnectSsoLoginButton
        api={adminChoiceConnectApi}
        label="Open Choice Connect portal"
        description="Login as the current admin or team member. Insurance referrals on Choice Connect will show under their name."
      />
      <InsuranceReferralLinksPanel
        api={adminInsuranceApi}
        queryScope="admin-insurance-referrals"
        title="Insurance Referral Links"
        description="Share these links so vehicle insurance enquiries are attributed to the logged-in admin or team member."
        showAgentCodeFilter
      />
    </div>
  );
}
