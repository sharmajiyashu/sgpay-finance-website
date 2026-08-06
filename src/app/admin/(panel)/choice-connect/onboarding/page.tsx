"use client";

import { ChoiceConnectOnboardPanel } from "@/components/choice-connect/ChoiceConnectOnboardPanel";
import { adminChoiceConnectApi } from "@/sg-admin/lib/services/choiceConnectService";

export default function AdminChoiceConnectOnboardingPage() {
  return <ChoiceConnectOnboardPanel api={adminChoiceConnectApi} />;
}
