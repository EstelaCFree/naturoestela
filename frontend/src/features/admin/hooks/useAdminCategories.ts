import { useQuery } from "@tanstack/react-query";
import { fetchAdminCategories } from "@/features/admin/api/adminPostApi";

export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: fetchAdminCategories,
  });
}
