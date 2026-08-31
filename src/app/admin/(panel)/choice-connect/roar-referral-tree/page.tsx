"use client";

import { useQuery } from "@tanstack/react-query";
import { getRoarReferralTree, type RoarReferralTreeNode } from "@/sg-admin/lib/services/roarReferralService";
import { formatCommissionRate } from "@/lib/choiceConnect/types";

function payoutLabel(node: RoarReferralTreeNode) {
  return formatCommissionRate({
    payoutType: node.payoutType,
    percent: node.commissionPercent,
    flatAmount: node.flatAmount,
  });
}

function TreeNode({ node, depth = 0 }: { node: RoarReferralTreeNode; depth?: number }) {
  return (
    <li className="mt-2">
      <div
        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2"
        style={{ marginLeft: Math.min(depth * 12, 48) }}
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{node.name}</p>
          <p className="break-all text-xs text-muted-foreground">
            {node.roleLabel}
            {typeof node.commissionPercent === "number" || node.payoutType === "flat"
              ? ` · ${payoutLabel(node)}`
              : ""}
            {node.commissionSource === "override" ? " (override)" : ""}
            {node.email ? ` · ${node.email}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {(typeof node.commissionPercent === "number" || node.payoutType === "flat") && (
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-700 dark:text-emerald-400">
              {payoutLabel(node)}
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
          Team and agent hierarchy with Roar referral counts and each role&apos;s commission
          (percent or flat ₹).
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
            <div className="overflow-x-auto">
              <ul className="min-w-0 space-y-1">
                {data.tree.map((node) => (
                  <TreeNode key={node.id} node={node} />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
