"use client";

import { AdminAgentsPanel } from "@/sg-admin/components/AdminAgentsPanel";

/** Default: all channel agents (Super Distributor → Distributor → Retailer), all statuses. */
export default function AdminAgentsPage() {
  return <AdminAgentsPanel statusFilter="" />;
}
