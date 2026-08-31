import type { CreatedByPerson } from "@/sg-admin/lib/created-by";

export interface CreateTreeStats {
  directCount: number;
  totalCount: number;
}

export interface CreateTreeNode {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  userRole?: string;
  designation?: string;
  agentType?: string;
  createdBy?: CreatedByPerson | null;
  parentId?: CreatedByPerson | string | null;
  createdAt?: string;
  directCount: number;
  totalCount: number;
  children: CreateTreeNode[];
}
