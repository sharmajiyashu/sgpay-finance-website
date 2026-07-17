import {
  get,
  post,
  put,
  deleteRequest,
} from "@/lib/api";
import type {
  UpdateUserDTO,
  GetUsersFilterDTO,
} from "@/lib/validations/user-management";

export interface MobileProfileImage {
  id: number;
  mediaId?: number;
  /** Backward-compatible direct URL (older API shape). */
  url?: string;
  /** Backward-compatible direct mimetype (older API shape). */
  mimetype?: string;
  isPrimary?: boolean;
  order?: number;
  createdAt?: string;
  media?: {
    id: number;
    url: string;
    mimetype?: string | null;
    type?: string | null;
    size?: number | null;
    width?: number | null;
    height?: number | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface UserProfile {
  id: number;
  userId: number;
  bio?: string;
  dob?: string;
  gender?: 'female' | 'male' | 'other';
  userType?: string;
  relationshipStatus?: string;
  educationLevel?: string;
  languages?: string[];
  experienceHabits?: string;
  drinkingHabits?: string;
  smokingHabits?: string;
  religious?: string;
  political?: string;
  havePets?: string;
  haveChildren?: string;
  wantChildren?: string;
  height?: number;
  searchingFor?: string[];
  connectionType?: string[];
  location?: {
    lat?: number;
    long?: number;
    city?: string;
    state?: string;
    zipcode?: string;
    name?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AppUser {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  mobile: string | null;
  userRole: string;
  adminRoleId?: number;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt: string | null;
  profileImages?: MobileProfileImage[];
  profile?: UserProfile;
}

export interface UserPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedAppUsers {
  users: AppUser[];
  pagination: UserPagination;
}

export interface UserLike {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  liker?: AppUser;
  liked?: AppUser;
  sender?: AppUser;
  receiver?: AppUser;
}

export interface UserMatch {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  matchedAt?: string;
  user1?: AppUser;
  user2?: AppUser;
  otherUser?: AppUser;
}

/** GET /users - Returns list of app users. */
export async function getAppUsers(
  params: GetUsersFilterDTO
): Promise<PaginatedAppUsers> {
  const raw = await get<PaginatedAppUsers>("/users", { params });
  
  if (raw && typeof raw === "object" && "users" in raw) {
    return raw;
  }

  return {
    users: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
  };
}

/** GET /users/:id - Detailed view of a user. */
export async function getAppUserDetail(id: number): Promise<AppUser> {
  return get<AppUser>(`/users/${id}`);
}

/** PUT /users/:id - Updates an existing app user. */
export async function updateAppUser(
  id: number,
  body: UpdateUserDTO
): Promise<AppUser> {
  return put<AppUser>(`/users/${id}`, body);
}

/** DELETE /users/:id - Deletes an app user. */
export async function deleteAppUser(id: number): Promise<{ message: string }> {
  return deleteRequest<{ message: string }>(`/users/${id}`);
}

/** POST /users/bulk-delete - Deletes multiple app users. */
export async function deleteAppUsers(ids: number[]): Promise<{ message: string }> {
  return post<{ message: string }>("/users/bulk-delete", { ids });
}

/** GET /users/:id/likes-sent */
export async function getUserLikesSent(
  id: number,
  params: { page?: number; limit?: number }
): Promise<UserLike[]> {
  const data = await get<UserLike[]>(`/users/${id}/likes-sent`, { params });
  return Array.isArray(data) ? data : [];
}

/** GET /users/:id/likes-received */
export async function getUserLikesReceived(
  id: number,
  params: { page?: number; limit?: number }
): Promise<UserLike[]> {
  const data = await get<UserLike[]>(`/users/${id}/likes-received`, { params });
  return Array.isArray(data) ? data : [];
}

/** GET /users/:id/matches */
export async function getUserMatches(
  id: number,
  params: { page?: number; limit?: number }
): Promise<UserMatch[]> {
  const data = await get<UserMatch[]>(`/users/${id}/matches`, { params });
  return Array.isArray(data) ? data : [];
}

/** DELETE /users/likes/:id */
export async function deleteLike(id: number): Promise<{ message: string }> {
  return deleteRequest<{ message: string }>(`/users/likes/${id}`);
}

/** DELETE /users/matches/:id */
export async function deleteMatch(id: number): Promise<{ message: string }> {
  return deleteRequest<{ message: string }>(`/users/matches/${id}`);
}
