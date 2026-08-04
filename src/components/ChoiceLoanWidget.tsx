"use client";

import { ChoiceConnectWebsiteApply } from "@/components/choice-connect/ChoiceConnectWebsiteApply";
import type { ChoiceProductType } from "@/lib/choiceConnect/types";

interface ChoiceLoanWidgetProps {
  uuid?: string;
  productType?: string;
}

export function ChoiceLoanWidget({
  productType = "personal-loan",
}: ChoiceLoanWidgetProps) {
  return (
    <ChoiceConnectWebsiteApply
      productType={productType as ChoiceProductType}
      title="Apply for Loan"
      allowLoanProductSelect
    />
  );
}
