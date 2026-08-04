"use client";

import { ChoiceConnectApplyPanel } from "@/components/choice-connect/ChoiceConnectApplyPanel";
import { adminChoiceConnectApi } from "@/sg-admin/lib/services/choiceConnectService";

export default function AdminChoiceLoansApplyPage() {
  return (
    <ChoiceConnectApplyPanel
      api={adminChoiceConnectApi}
      queryScope="admin"
      productType="personal-loan"
      title="Apply Loan"
      description="Start a loan application on behalf of a customer via Choice Connect."
      allowLoanProductSelect
    />
  );
}
