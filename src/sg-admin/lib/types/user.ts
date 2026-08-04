export interface AppUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  mobile?: string;
  extension?: string;
  businessName?: string;
  isActive?: boolean;
  isVerified?: boolean;
  userRole?: string;
  createdAt?: string;
  lastLoginAt?: string;
}
