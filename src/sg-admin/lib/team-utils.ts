import {
  AGENT_TYPE_LABELS,
  TEAM_DESIGNATION_LABELS,
  teamFullName,
  type TeamDesignation,
  type TeamMember,
  type TeamTreeNode,
} from "@/sg-admin/lib/types/hierarchy";

const TEAM_ROLES = new Set<TeamDesignation>(["state_head", "asm", "rm"]);

const DESIGNATION_ALIASES: Record<string, TeamDesignation> = {
  r: "rm",
  rm: "rm",
  relationship_manager: "rm",
  "relationship manager": "rm",
  sh: "state_head",
  state_head: "state_head",
  "state head": "state_head",
  asm: "asm",
  "sales manager": "asm",
  super_admin: "super_admin",
  superadmin: "super_admin",
  sa: "super_admin",
};

export function normalizeDesignation(value?: string): TeamDesignation | undefined {
  if (!value) return undefined;
  const key = value.trim().toLowerCase().replace(/-/g, "_");
  return DESIGNATION_ALIASES[key] ?? DESIGNATION_ALIASES[key.replace(/\s+/g, " ")];
}

export function designationLabel(value?: string): string {
  const normalized = normalizeDesignation(value);
  if (normalized === "super_admin") return "Super Admin";
  if (normalized && normalized in TEAM_DESIGNATION_LABELS) {
    return TEAM_DESIGNATION_LABELS[normalized as keyof typeof TEAM_DESIGNATION_LABELS];
  }
  return value || "—";
}

export function resolveParentId(
  parentId?: TeamMember["parentId"] | TeamMember["managedById"] | TeamMember["createdBy"]
): string | null {
  if (!parentId) return null;
  if (typeof parentId === "string") return parentId || null;
  return parentId._id || null;
}

export function memberRoleLabel(member: Pick<TeamMember, "designation" | "agentType" | "userRole">): string {
  if (member.agentType && member.agentType in AGENT_TYPE_LABELS) {
    return AGENT_TYPE_LABELS[member.agentType];
  }
  return designationLabel(member.designation);
}

export function isDummyTeamMember(member: TeamMember): boolean {
  const email = (member.email || "").toLowerCase();
  const name = teamFullName(member).toLowerCase();
  return (
    email.includes("smoke") ||
    name.includes("smoke") ||
    /\.smoke\./.test(email) ||
    /smoke\.\d+@/.test(email)
  );
}

export function isSuperAdminMember(member: TeamMember): boolean {
  return normalizeDesignation(member.designation) === "super_admin";
}

export function agentDetailHref(id: string) {
  return `/admin/agents/view/${id}`;
}

export function teamDetailHref(id: string) {
  return `/admin/teams/view/${id}`;
}

export function memberDetailHref(member: TeamMember): string | null {
  if (member.userRole === "agent") return agentDetailHref(member._id);
  if (isSuperAdminMember(member)) return null;
  if (member.userRole === "admin" || member.designation) return teamDetailHref(member._id);
  return null;
}

export function isTeamStaffMember(member: TeamMember): boolean {
  const role = normalizeDesignation(member.designation);
  return Boolean(role && TEAM_ROLES.has(role));
}

export function normalizeTeamMember(
  member: TeamMember & { role?: string; roleLabel?: string }
): TeamMember {
  const designation =
    normalizeDesignation(member.designation || member.role || member.roleLabel) ??
    member.designation;
  return { ...member, designation };
}

export function flattenTeamTree(nodes: TeamTreeNode[] | undefined): TeamMember[] {
  if (!nodes?.length) return [];
  const out: TeamMember[] = [];
  const walk = (items: TeamTreeNode[]) => {
    for (const node of items) {
      out.push(node);
      if (node.children?.length) walk(node.children);
    }
  };
  walk(nodes);
  return out;
}

export function extractTeamList(data: unknown): TeamMember[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as TeamMember[];
  if (typeof data !== "object") return [];
  const record = data as Record<string, unknown>;
  for (const key of ["teams", "members", "items", "staff", "data"]) {
    if (Array.isArray(record[key])) return record[key] as TeamMember[];
  }
  return [];
}

export function buildTeamHierarchy(members: TeamMember[]): TeamTreeNode[] {
  const nodes = members.map((member) => ({
    ...normalizeTeamMember(member),
    children: [] as TeamTreeNode[],
  }));
  const byId = new Map<string, TeamTreeNode>();
  for (const node of nodes) {
    const id = node._id || (node as TeamTreeNode).id;
    if (id) byId.set(id, node);
  }

  const roots: TeamTreeNode[] = [];
  for (const node of nodes) {
    const attachId =
      resolveParentId(node.parentId) ||
      resolveParentId(node.managedById) ||
      resolveParentId(node.createdBy);
    const parent = attachId ? byId.get(attachId) : undefined;
    if (parent && parent !== node) {
      parent.children = parent.children || [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (items: TeamTreeNode[]) => {
    items.sort((a, b) => teamFullName(a).localeCompare(teamFullName(b)));
    for (const item of items) {
      if (item.children?.length) sortNodes(item.children);
    }
  };
  sortNodes(roots);

  const adminRoots = roots.filter(isSuperAdminMember);
  const otherRoots = roots.filter((node) => !isSuperAdminMember(node));
  const adminRoot = adminRoots[0];
  if (adminRoots.length === 1 && adminRoot && otherRoots.length > 0) {
    adminRoot.children = [...(adminRoot.children || []), ...otherRoots];
    sortNodes(adminRoot.children || []);
    return adminRoots;
  }
  return roots;
}

export function visibleTeamMembers(members: TeamMember[]): TeamMember[] {
  return members
    .map(normalizeTeamMember)
    .filter((member) => !isDummyTeamMember(member))
    .filter(isTeamStaffMember);
}

export function matchesTeamSearch(member: TeamMember, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    teamFullName(member),
    member.email,
    member.mobile,
    member.city,
    member.territory,
    member.stateCode,
    designationLabel(member.designation),
    member.designation,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function countTreeNodes(nodes: TeamTreeNode[]): number {
  return nodes.reduce(
    (sum, node) => sum + 1 + countTreeNodes(node.children || []),
    0
  );
}
