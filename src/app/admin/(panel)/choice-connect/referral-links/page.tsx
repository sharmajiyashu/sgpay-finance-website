"use client";

import { ChoiceConnectReferralLinksPanel } from "@/components/choice-connect/ChoiceConnectReferralLinksPanel";
import { ChoiceConnectSsoLoginButton } from "@/components/choice-connect/ChoiceConnectSsoLoginButton";
import { adminChoiceConnectApi } from "@/sg-admin/lib/services/choiceConnectService";

export default function AdminChoiceConnectReferralLinksPage() {
  return (
    <div className="space-y-8">
      <ChoiceConnectSsoLoginButton
        api={adminChoiceConnectApi}
        label="Open Choice Connect portal"
        description="Login as the current admin or team member. Credit-card, loan, and insurance referrals show under their name."
      />
      <ChoiceConnectReferralLinksPanel
        api={adminChoiceConnectApi}
        queryScope="admin"
        title="Referral Links"
        description="Generate Choice Connect referral links for credit cards, loans, and other products."
        showAgentCodeFilter
      />
    </div>
  );
}
