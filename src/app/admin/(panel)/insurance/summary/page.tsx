"use client";

import { InsuranceSummaryPanel } from "@/modules/insurance";
import { adminInsuranceApi } from "@/sg-admin/lib/services/insuranceService";

export default function AdminInsuranceSummaryPage() {
  return (
    <InsuranceSummaryPanel
      api={adminInsuranceApi}
      queryScope="admin-insurance-summary"
      applyHref="/admin/insurance/motor"
      title="Motor Insurance Summary"
      showSourceFilter
    />
  );
}
