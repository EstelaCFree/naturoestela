import { useQuery } from "@tanstack/react-query";
import { fetchAdminTags } from "@/features/admin/api/adminPostApi";

export function useAdminTags() {
  return useQuery({
    queryKey: ["admin", "tags"],
    queryFn: fetchAdminTags,
  });
}
