import { publicPost, APP_API_PATHS } from "@/lib/public-api";
import type { CreateChoiceLeadInput } from "@/lib/choiceConnect/types";

export async function createWebsiteChoiceLead(
  input: CreateChoiceLeadInput
): Promise<{ _id: string; uuid?: string }> {
  return publicPost<{ _id: string; uuid?: string }>(APP_API_PATHS.choiceConnectLeads, input);
}
