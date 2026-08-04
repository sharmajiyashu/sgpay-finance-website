export type EnquiryStatus = "pending" | "in_progress" | "resolved";

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
  createdAt: string;
  updatedAt: string;
}
