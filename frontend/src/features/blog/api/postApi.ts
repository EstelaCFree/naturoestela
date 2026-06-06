import { apiClient } from "@/lib/api-client";
import type { Post, PostListResponse } from "@/types/blog";

type PostsParams = {
  page?: number;
  page_size?: number;
  category?: string;
  preview?: boolean;
};

export async function fetchPosts(
  params?: PostsParams,
): Promise<PostListResponse> {
  const { data } = await apiClient.get<PostListResponse>("/api/v1/posts/", {
    params,
  });
  return data;
}

export async function fetchPostBySlug(slug: string): Promise<Post> {
  const { data } = await apiClient.get<Post>(`/api/v1/posts/${slug}`);
  return data;
}
