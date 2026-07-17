import {
  post,
  put,
  putFormData,
  deleteRequest,
  setToken,
  setAuthUser,
  setSelectedLocationId,
} from "@/lib/api";
import type { AuthUser, AuthUserClinic } from "@/lib/api";
import type {
  LoginVendorUserDto,
  CreateVendorUserDto,
  UpdateVendorUserDto,
  GetVendorUserDto,
} from "@/lib/validations/vendor-user";

// ----- Response types (match backend) -----

export interface VendorUserProfileImage {
  url?: string;
  mimetype?: string;
}

export interface ClinicLocation {
  id?: number;
  locationCode?: string;
  locationName?: string;
  isMainLocation?: boolean;
  isEmergencyBranch?: boolean;
  address?: string;
  province?: string;
  district?: string;
  phoneNumber?: string;
  email?: string;
  status?: string;
}

export interface VendorUserClinic {
  id?: number;
  clinicCode?: string;
  clinicName?: string;
  locations?: ClinicLocation[];
}

export interface VendorUser {
  id: number;
  email?: string;
  name?: string;
  phoneExt?: string;
  phone?: string;
  dob?: string | null;
  country?: { en?: string; kh?: string } | null;
  city?: { en?: string; kh?: string } | null;
  state?: { en?: string; kh?: string } | null;
  zipCode?: string | null;
  language?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isActive?: boolean;
  userType?: string;
  vendorRoleId?: number | null;
  clinicId?: number | null;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
  deviceType?: string | null;
  profileImage?: VendorUserProfileImage | null;
  clinic?: VendorUserClinic | null;
  [key: string]: unknown;
}

/** POST /user/login response */
export interface LoginData {
  user: VendorUser;
  token: string;
}

/** Login: POST /user/login. On success, stores token and user in localStorage. */
export async function loginVendorUser(
  body: LoginVendorUserDto
): Promise<LoginData> {
  const data = await post<LoginData>("/user/login", body);
  if (data.token) {
    setToken(data.token);
  }
  if (data.user) {
    const user = data.user as AuthUser;
    setAuthUser(user);
    const locations = (user.clinic as AuthUserClinic | undefined)?.locations;
    if (Array.isArray(locations) && locations.length > 0 && locations[0]) {
      setSelectedLocationId(locations[0].id);
    }
  }
  return data;
}

/** POST /user/create – requires auth and permission vendor:user:create. Backend returns array from .returning(). */
export async function createVendorUser(
  body: CreateVendorUserDto
): Promise<VendorUser> {
  const raw = await post<VendorUser | VendorUser[]>("/user/create", body);
  if (Array.isArray(raw) && raw.length > 0) {
    return raw[0] as VendorUser;
  }
  if (raw && typeof raw === "object" && "id" in raw) {
    return raw as VendorUser;
  }
  throw new Error("Unexpected create user response");
}

/** PUT /user/update – requires auth and permission vendor:user:update. */
export async function updateVendorUser(
  body: UpdateVendorUserDto,
  profileImage?: File
): Promise<VendorUser> {
  if (profileImage) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(body));
    formData.append("profileImage", profileImage);
    return putFormData<VendorUser>("/user/update", formData);
  }
  return put<VendorUser>("/user/update", body);
}

/** DELETE /user/delete/:id – requires auth and permission vendor:user:delete. */
export async function deleteVendorUser(id: number): Promise<void> {
  await deleteRequest<{ message?: string }>(`/user/delete/${id}`);
}

/** POST /user/get – requires auth and permission vendor:user:get. Returns list of vendor users. */
export async function getVendorUsers(
  body: GetVendorUserDto
): Promise<VendorUser[]> {
  const raw = await post<VendorUser[] | { data?: VendorUser[] }>(
    "/user/get",
    body
  );
  if (Array.isArray(raw)) {
    return raw;
  }
  if (raw && typeof raw === "object" && "data" in raw && Array.isArray(raw.data)) {
    return raw.data;
  }
  return [];
}
