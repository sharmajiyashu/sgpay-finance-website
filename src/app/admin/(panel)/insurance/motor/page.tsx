"use client";

import { InsuranceApplyPanel } from "@/components/insurance/InsuranceApplyPanel";
import { adminChoiceConnectApi } from "@/sg-admin/lib/services/choiceConnectService";

export default function AdminInsuranceMotorPage() {
  return (
    <InsuranceApplyPanel
      api={adminChoiceConnectApi}
      queryScope="admin-insurance"
      title="Motor Insurance"
      description="Bike / car insurance via Choice Connect. Separate from the Credit Card module."
    />
  );
}
