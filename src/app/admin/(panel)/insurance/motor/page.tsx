"use client";

import { Suspense } from "react";
import { InsuranceApplyPanel } from "@/modules/insurance";
import { adminInsuranceApi } from "@/sg-admin/lib/services/insuranceService";

export default function AdminInsuranceMotorPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted" />}>
      <InsuranceApplyPanel
        api={adminInsuranceApi}
        queryScope="admin-insurance"
        applyBasePath="/admin/insurance/motor"
        title="Motor Insurance"
        description="Bike / car insurance via Choice Connect. Separate from the Credit Card module."
      />
    </Suspense>
  );
}
