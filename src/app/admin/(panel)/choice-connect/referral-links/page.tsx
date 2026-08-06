"use client";

import { ChoiceConnectReferralLinksPanel } from "@/components/choice-connect/ChoiceConnectReferralLinksPanel";
import { adminChoiceConnectApi } from "@/sg-admin/lib/services/choiceConnectService";

export default function AdminChoiceConnectReferralLinksPage() {
  return (
    <ChoiceConnectReferralLinksPanel
      api={adminChoiceConnectApi}
      queryScope="admin"
      title="Referral Links"
      description="Generate Choice Connect referral links for credit cards, loans, and other products."
      showAgentCodeFilter
    />
  );
}
