"use client";

import { useQuery } from "@tanstack/react-query";
import { getRoarReferralTree, type RoarReferralTreeNode } from "@/sg-admin/lib/services/roarReferralService";

function TreeNode({ node, depth = 0 }: { node: RoarReferralTreeNode; depth?: number }) {
  return (
    <li className="mt-2">
      <div
        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2"
        style={{ marginLeft: depth * 16 }}
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{node.name}</p>
          <p className="text-xs text-muted-foreground">
            {node.roleLabel}
            {typeof node.commissionPercent === "number" ? ` · ${node.commissionPercent}%` : ""}
            {node.commissionSource === "override" ? " (override)" : ""}
            {node.email ? ` · ${node.email}` : ""}
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          {typeof node.commissionPercent === "number" && (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-700 dark:text-emerald-400">
              {node.commissionPercent}%
            </span>
          )}
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
            Own: {node.referralCount}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-foreground">
            Team: {node.subtreeReferralCount}
          </span>
        </div>
      </div>
      {node.children.length > 0 && (
        <ul className="mt-1">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function AdminRoarReferralTreePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["roar-referral-tree"],
    queryFn: getRoarReferralTree,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Roar Referral Tree</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Team and agent hierarchy with Roar referral counts and each role&apos;s commission %.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading tree…</p>}
      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load tree"}
        </p>
      )}

      {data && (
        <>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-xl border border-border bg-card px-3 py-2">
              Total Roar enquiries: <strong>{data.totalReferrals}</strong>
            </span>
            <span className="rounded-xl border border-border bg-card px-3 py-2">
              Staff in tree: <strong>{data.totalStaff}</strong>
            </span>
          </div>

          {data.tree.length === 0 ? (
            <p className="text-sm text-muted-foreground">No staff nodes found.</p>
          ) : (
            <ul className="space-y-1">
              {data.tree.map((node) => (
                <TreeNode key={node.id} node={node} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
