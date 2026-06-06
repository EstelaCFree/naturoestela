import { useQuery } from "@tanstack/react-query";
import { fetchAdminImages } from "@/features/admin/api/adminPostApi";

export function useAdminImages(page = 1) {
  return useQuery({
    queryKey: ["admin", "images", page],
    queryFn: () => fetchAdminImages({ page, page_size: 20 }),
  });
}
