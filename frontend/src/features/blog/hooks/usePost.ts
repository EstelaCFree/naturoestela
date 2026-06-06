import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug } from "../api/postApi";
import type { Post } from "@/types/blog";

export function usePost(slug: string) {
  return useQuery<Post>({
    queryKey: ["post", slug],
    queryFn: () => fetchPostBySlug(slug),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
