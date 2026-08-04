"use client";

import { ChoiceConnectSummaryPanel } from "@/components/choice-connect/ChoiceConnectSummaryPanel";
import { agentChoiceConnectApi } from "@/sg-agent/lib/services/choiceConnectService";

export default function AgentChoiceConnectSummaryPage() {
  return (
    <ChoiceConnectSummaryPanel
      api={agentChoiceConnectApi}
      queryScope="agent"
      title="My Applications Summary"
      showAllSources={false}
    />
  );
}
