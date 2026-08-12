"use client";

import { RoarReferralLinkPanel } from "@/components/roar/RoarReferralLinkPanel";
import { getRoarReferralLink } from "@/sg-admin/lib/services/roarReferralService";

export default function AdminRoarReferralLinkPage() {
  return (
    <RoarReferralLinkPanel
      getLink={getRoarReferralLink}
      queryScope="admin"
      description="Share this Roar Credit Card link with customers. Enquiries opened through it will show your name and admin role on the Roar Bank Enquiry list."
    />
  );
}
