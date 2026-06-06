import { useQuery } from "@tanstack/react-query";
import { fetchAdminPost } from "@/features/admin/api/adminPostApi";

export function useAdminPost(id: string | undefined) {
  return useQuery({
    queryKey: ["admin", "posts", id],
    queryFn: () => fetchAdminPost(id!),
    enabled: !!id,
  });
}
