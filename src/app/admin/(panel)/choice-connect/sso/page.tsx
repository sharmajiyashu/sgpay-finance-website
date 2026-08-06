"use client";

import { ChoiceConnectSsoLoginButton } from "@/components/choice-connect/ChoiceConnectSsoLoginButton";
import { adminChoiceConnectApi } from "@/sg-admin/lib/services/choiceConnectService";

export default function AdminChoiceConnectSsoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Choice Connect Portal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Secure single sign-on to the Choice Connect partner dashboard.
        </p>
      </div>
      <ChoiceConnectSsoLoginButton api={adminChoiceConnectApi} />
    </div>
  );
}
