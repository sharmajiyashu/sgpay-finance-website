"use client";

import { ChoiceConnectReferralLinksPanel } from "@/components/choice-connect/ChoiceConnectReferralLinksPanel";
import { ChoiceConnectSsoLoginButton } from "@/components/choice-connect/ChoiceConnectSsoLoginButton";
import { agentChoiceConnectApi } from "@/sg-agent/lib/services/choiceConnectService";

export default function AgentChoiceConnectReferralLinksPage() {
  return (
    <div className="space-y-8">
      <ChoiceConnectSsoLoginButton
        api={agentChoiceConnectApi}
        label="Open Choice Connect"
        description="Login to your Choice Connect agent dashboard."
      />
      <ChoiceConnectReferralLinksPanel
        api={agentChoiceConnectApi}
        queryScope="agent"
        title="My Referral Links"
        description="Share these links with customers for credit cards and loans."
      />
    </div>
  );
}
