import { useQuery } from "@tanstack/react-query";
import { fetchAdminPosts } from "@/features/admin/api/adminPostApi";

type UseAdminPostsParams = { status?: string; page?: number };

export function useAdminPosts({ status, page = 1 }: UseAdminPostsParams = {}) {
  return useQuery({
    queryKey: ["admin", "posts", { status, page }],
    queryFn: () =>
      fetchAdminPosts({ status: status || undefined, page, page_size: 20 }),
  });
}
