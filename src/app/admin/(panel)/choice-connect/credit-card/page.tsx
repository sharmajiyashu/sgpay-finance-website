"use client";

import { ChoiceConnectApplyPanel } from "@/components/choice-connect/ChoiceConnectApplyPanel";
import { adminChoiceConnectApi } from "@/sg-admin/lib/services/choiceConnectService";

export default function AdminChoiceCardApplyPage() {
  return (
    <ChoiceConnectApplyPanel
      api={adminChoiceConnectApi}
      queryScope="admin"
      productType="credit-card"
      title="Apply Credit Card"
      description="Start a credit card application on behalf of a customer via Choice Connect."
    />
  );
}
