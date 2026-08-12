export type EnquiryStatus = "pending" | "in_progress" | "resolved";

/** Partner / extra fields stored with the enquiry (e.g. Roar Credit Card) */
export interface EnquiryMetadata {
  partnerId?: string;
  partnerName?: string;
  bank?: string;
  applyUrl?: string;
  roarRef?: string;
  referredByUserId?: string;
  referredByName?: string;
  /** Display label e.g. "Sales Manager (ASM)", "Retailer" */
  referredByRole?: string;
  /** Raw key e.g. asm, rm, retailer */
  referredByRoleKey?: string;
  [key: string]: unknown;
}

export interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  type: string;
  service?: string;
  pageUrl?: string;
  message: string;
  status: EnquiryStatus;
  metadata?: EnquiryMetadata;
  createdAt: string;
  updatedAt: string;
}
