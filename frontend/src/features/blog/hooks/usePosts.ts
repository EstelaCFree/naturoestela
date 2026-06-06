import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../api/postApi";
import type { Post, PostListResponse } from "@/types/blog";

type PostsQueryParams = {
  preview?: boolean;
  page?: number;
  pageSize?: number;
  category?: string;
};

export function usePosts(params?: PostsQueryParams) {
  const { preview, page, pageSize, category } = params ?? {};
  return useQuery<PostListResponse>({
    queryKey: ["posts", { preview, page, pageSize, category }],
    queryFn: () =>
      fetchPosts({
        preview,
        page,
        page_size: pageSize,
        category,
      }),
    staleTime: 1000 * 60 * 5,
  });
}

export function usePostsPreview() {
  const result = usePosts({ preview: true });
  return {
    ...result,
    data: result.data?.data as Post[] | undefined,
  };
}
