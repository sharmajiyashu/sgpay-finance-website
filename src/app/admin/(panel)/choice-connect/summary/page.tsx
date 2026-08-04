"use client";

import { ChoiceConnectSummaryPanel } from "@/components/choice-connect/ChoiceConnectSummaryPanel";
import { adminChoiceConnectApi } from "@/sg-admin/lib/services/choiceConnectService";

export default function AdminChoiceConnectSummaryPage() {
  return (
    <ChoiceConnectSummaryPanel
      api={adminChoiceConnectApi}
      queryScope="admin"
      title="Choice Connect Summary"
      showAllSources
    />
  );
}
