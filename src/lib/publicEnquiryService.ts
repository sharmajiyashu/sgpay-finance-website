import { publicPost, APP_API_PATHS } from "@/lib/public-api";

export interface CreateEnquiryInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  type?: string;
  service?: string;
  pageUrl?: string;
  message: string;
  metadata?: Record<string, unknown>;
}

export async function submitPublicEnquiry(
  input: CreateEnquiryInput
): Promise<void> {
  await publicPost(APP_API_PATHS.enquiries, input);
}
