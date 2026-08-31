"use client";

import { RoarEnquiryCreateForm } from "@/components/roar/RoarEnquiryCreateForm";
import { createAgentRoarEnquiry } from "@/sg-agent/lib/services/enquiryService";

export function AgentRoarEnquiryForm() {
  return (
    <RoarEnquiryCreateForm
      createEnquiry={createAgentRoarEnquiry}
      invalidateKeys={[["agent-roar-enquiries"]]}
    />
  );
}
