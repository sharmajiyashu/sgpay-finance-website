export type EnquiryStatus = "pending" | "in_progress" | "resolved";

/** Partner / extra fields stored with the enquiry (e.g. Roar Credit Card) */
export interface EnquiryMetadata {
  partnerId?: string;
  partnerName?: string;
  bank?: string;
  applyUrl?: string;
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
