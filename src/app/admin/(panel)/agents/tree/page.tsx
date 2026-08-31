"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { OrganizationTree } from "@/sg-admin/components/OrganizationTree";
import { getTeamTree } from "@/sg-admin/lib/services/teamService";

export default function AdminAgentsTreePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-org-tree"],
    queryFn: getTeamTree,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tree</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Super Admin → team → agents they created → that agent&apos;s downline
          </p>
        </div>
        <Link href="/admin/agents" className="text-sm font-medium text-primary hover:underline">
          View agents
        </Link>
      </div>

      <OrganizationTree
        tree={data?.tree}
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
      />
    </div>
  );
}
