import { post } from "@/lib/api";

export interface SendNotificationDto {
  title: string;
  body: string;
  type: "marketing" | "security";
}

export async function sendNotification(body: SendNotificationDto): Promise<{ message: string; count: number }> {
  return post<{ message: string; count: number }>("/notifications/send", body);
}
