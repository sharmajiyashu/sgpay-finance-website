"use client";

import { RoarReferralLinkPanel } from "@/components/roar/RoarReferralLinkPanel";
import { getRoarReferralLink } from "@/sg-agent/lib/services/roarReferralService";

export default function AgentRoarReferralLinkPage() {
  return (
    <RoarReferralLinkPanel
      getLink={getRoarReferralLink}
      queryScope="agent"
      description="Share this Roar Credit Card link with customers. Enquiries opened through it will appear on your Roar Bank Enquiry list with your name and agent role."
    />
  );
}
