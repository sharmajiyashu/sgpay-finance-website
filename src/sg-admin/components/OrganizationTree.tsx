"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconChevronDown, IconSearch, IconUsers } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";
import {
  buildTeamHierarchy,
  countTreeNodes,
  flattenTeamTree,
  isDummyTeamMember,
  isSuperAdminMember,
  memberDetailHref,
  memberRoleLabel,
  normalizeTeamMember,
} from "@/sg-admin/lib/team-utils";
import { teamFullName, type TeamTreeNode } from "@/sg-admin/lib/types/hierarchy";
import { DetailLink } from "@/sg-admin/components/DetailLink";

function roleBadgeClass(node: TeamTreeNode): string {
  const label = memberRoleLabel(node);
  if (label === "Super Admin") return "bg-violet-100 text-violet-800";
  if (label.startsWith("State Head")) return "bg-sky-100 text-sky-800";
  if (label.startsWith("Sales Manager")) return "bg-amber-100 text-amber-800";
  if (label.startsWith("Relationship")) return "bg-emerald-100 text-emerald-800";
  if (label.includes("Distributor") || label === "Retailer") return "bg-orange-100 text-orange-800";
  return "bg-muted text-muted-foreground";
}

function TreeBranch({
  node,
  isLast,
  isRoot,
}: {
  node: TeamTreeNode;
  isLast: boolean;
  isRoot?: boolean;
}) {
  const children = node.children || [];
  const [open, setOpen] = useState(true);
  const reports = countTreeNodes(children);

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
                  {memberDetailHref(node) ? (
                    <Link
                      href={memberDetailHref(node)!}
                      className="font-medium text-foreground hover:underline"
                    >
                      {teamFullName(node)}
                    </Link>
                  ) : (
                    <p className="font-medium text-foreground">{teamFullName(node)}</p>
                  )}
                  <span
                    className={twMerge(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      roleBadgeClass(node)
                    )}
                  >
                    {memberRoleLabel(node)}
                  </span>
                  {node.isActive === false ? (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                      Inactive
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 break-all text-xs text-muted-foreground">
                  {[node.email, node.mobile, node.stateCode, node.territory || node.city]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {reports > 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {reports} {reports === 1 ? "person" : "people"} in this branch
                  </p>
                ) : null}
                {memberDetailHref(node) ? (
                  <DetailLink href={memberDetailHref(node)!} className="mt-2" />
                ) : null}
              </div>
            </div>
          </div>
          {open && children.length > 0 ? (
            <ul className="mt-1">
              {children.map((child, index) => (
                <TreeBranch
                  key={child._id || child.id || `${teamFullName(child)}-${index}`}
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

export function OrganizationTree({
  tree,
  isLoading,
  error,
}: {
  tree?: TeamTreeNode[];
  isLoading?: boolean;
  error?: Error | null;
}) {
  const [search, setSearch] = useState("");

  const hierarchy = useMemo(() => {
    const flat = flattenTeamTree(tree)
      .map(normalizeTeamMember)
      .filter((member) => !isDummyTeamMember(member));
    return buildTeamHierarchy(flat);
  }, [tree]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hierarchy;

    const matchNode = (node: TeamTreeNode): TeamTreeNode | null => {
      const children = (node.children || [])
        .map(matchNode)
        .filter((child): child is TeamTreeNode => Boolean(child));
      const selfMatch = [
        teamFullName(node),
        node.email,
        node.mobile,
        memberRoleLabel(node),
        node.stateCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
      if (!selfMatch && children.length === 0) return null;
      return { ...node, children };
    };

    return hierarchy.map(matchNode).filter((node): node is TeamTreeNode => Boolean(node));
  }, [hierarchy, search]);

  const total = countTreeNodes(filtered.filter((node) => !isSuperAdminMember(node))) ||
    countTreeNodes(filtered);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading organization tree…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-destructive">
        {error.message || "Failed to load organization tree"}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, role..."
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
          <IconUsers className="h-4 w-4" />
          {total} in tree
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          No team hierarchy found.
        </div>
      ) : (
        <ul className="min-w-0">
          {filtered.map((node, index) => (
            <TreeBranch
              key={node._id || node.id || `${teamFullName(node)}-${index}`}
              node={node}
              isLast={index === filtered.length - 1}
              isRoot
            />
          ))}
        </ul>
      )}
    </div>
  );
}
