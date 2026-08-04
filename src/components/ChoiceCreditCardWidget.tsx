"use client";

import { ChoiceConnectWebsiteApply } from "@/components/choice-connect/ChoiceConnectWebsiteApply";

export function ChoiceCreditCardWidget() {
  return (
    <ChoiceConnectWebsiteApply
      productType="credit-card"
      title="Apply for Credit Card"
    />
  );
}
