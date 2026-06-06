import { apiClient } from "@/lib/api-client";

type SubscribeResponse = { data: { message: string } };

export async function subscribeToNewsletter(
  email: string,
): Promise<{ message: string; created: boolean }> {
  const response = await apiClient.post<SubscribeResponse>(
    "/api/v1/newsletter/subscribe",
    { email },
  );
  return {
    message: response.data.data.message,
    created: response.status === 201,
  };
}
