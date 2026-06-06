import { apiClient } from "@/lib/api-client";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function submitContact(payload: ContactPayload): Promise<void> {
  await apiClient.post("/api/v1/contact/", payload);
}
