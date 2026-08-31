"use client";

import { useState } from "react";
import Link from "next/link";
import { IconChevronDown } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";
import { createdByLabel, personLabel } from "@/sg-admin/lib/created-by";
import {
  AGENT_TYPE_LABELS,
  COMMISSION_LEVEL_LABELS,
} from "@/sg-admin/lib/types/hierarchy";
import type { CreateTreeNode } from "@/sg-admin/lib/types/create-tree";
import { agentDetailHref, teamDetailHref } from "@/sg-admin/lib/team-utils";
import { DetailLink } from "@/sg-admin/components/DetailLink";

function roleLabel(node: CreateTreeNode): string {
  if (node.designation) {
    const label = COMMISSION_LEVEL_LABELS[node.designation];
    if (label) return label;
  }
  if (node.agentType) {
    const label = AGENT_TYPE_LABELS[node.agentType as keyof typeof AGENT_TYPE_LABELS];
    if (label) return label;
  }
  return node.userRole === "agent" ? "Agent" : node.userRole || "Staff";
}

function detailHref(node: CreateTreeNode): string | null {
  if (node.userRole === "agent") return agentDetailHref(node._id);
  if (node.userRole === "admin") return teamDetailHref(node._id);
  return null;
}

function TreeBranch({
  node,
  isLast,
  isRoot,
}: {
  node: CreateTreeNode;
  isLast: boolean;
  isRoot?: boolean;
}) {
  const children = node.children || [];
  const [open, setOpen] = useState(true);
  const href = detailHref(node);
  const name = personLabel(node);

  return (
    <li className="relative">
      <div className="flex items-stretch">
        <div className={twMerge("flex w-6 shrink-0 flex-col items-center", isRoot && "w-0")}>
          {!isRoot ? <span className="h-5 w-px bg-border" /> : null}
          {!isRoot ? <span className={twMerge("h-px w-4 bg-border", isLast && "mb-auto")} /> : null}
          {!isRoot && !isLast ? <span className="w-px flex-1 bg-border" /> : null}
        </div>
        <div className="min-w-0 flex-1 pb-3">
          <div className="rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm">
            <div className="flex items-start gap-2">
              {children.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  className="mt-0.5 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label={open ? "Collapse" : "Expand"}
                >
                  <IconChevronDown
                    className={twMerge("h-4 w-4 transition-transform", !open && "-rotate-90")}
                  />
                </button>
              ) : (
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {href ? (
                    <Link href={href} className="font-medium text-foreground hover:underline">
                      {name}
                    </Link>
                  ) : (
                    <p className="font-medium text-foreground">{name}</p>
                  )}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {roleLabel(node)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Created by {createdByLabel(node)}
                  {node.email ? ` · ${node.email}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Created {node.directCount} · Their team created {node.totalCount}
                </p>
                {href ? <DetailLink href={href} className="mt-2" /> : null}
              </div>
            </div>
          </div>
          {open && children.length > 0 ? (
            <ul className="mt-1">
              {children.map((child, index) => (
                <TreeBranch
                  key={child._id}
                  node={child}
                  isLast={index === children.length - 1}
                />
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function CreateTree({ tree }: { tree: CreateTreeNode[] }) {
  if (tree.length === 0) {
    return <p className="text-sm text-muted-foreground">No one created under this person yet.</p>;
  }

  return (
    <ul className="space-y-1">
      {tree.map((node, index) => (
        <TreeBranch
          key={node._id}
          node={node}
          isLast={index === tree.length - 1}
          isRoot
        />
      ))}
    </ul>
  );
}
