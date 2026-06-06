import { apiClient } from "@/lib/api-client";
import type {
  AdminImageListResponse,
  AdminPost,
  AdminPostListResponse,
  AdminTag,
  BodyImage,
} from "@/types/adminPost";

type ListPostsParams = { status?: string; page?: number; page_size?: number };

// Collection endpoints use trailing slash; resource/action endpoints do not
export async function fetchAdminPosts(
  params?: ListPostsParams,
): Promise<AdminPostListResponse> {
  const { data } = await apiClient.get<AdminPostListResponse>(
    "/api/v1/admin/posts/",
    { params },
  );
  return data;
}

export async function fetchAdminPost(id: string): Promise<AdminPost> {
  const { data } = await apiClient.get<AdminPost>(`/api/v1/admin/posts/${id}`);
  return data;
}

type CreatePostPayload = {
  title: string;
  slug?: string;
  content: string;
  category_id: string;
  excerpt?: string | null;
  featured_image_id?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
};

export async function createPost(
  payload: CreatePostPayload,
): Promise<AdminPost> {
  const { data } = await apiClient.post<AdminPost>(
    "/api/v1/admin/posts/",
    payload,
  );
  return data;
}

export async function updatePost(
  id: string,
  payload: Partial<CreatePostPayload>,
): Promise<AdminPost> {
  const { data } = await apiClient.put<AdminPost>(
    `/api/v1/admin/posts/${id}`,
    payload,
  );
  return data;
}

export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/admin/posts/${id}`);
}

export async function publishPost(
  id: string,
  publishedAt?: string,
): Promise<AdminPost> {
  const body = publishedAt ? { published_at: publishedAt } : undefined;
  const { data } = await apiClient.patch<AdminPost>(
    `/api/v1/admin/posts/${id}/publish`,
    body,
  );
  return data;
}

export async function unpublishPost(id: string): Promise<AdminPost> {
  const { data } = await apiClient.patch<AdminPost>(
    `/api/v1/admin/posts/${id}/unpublish`,
  );
  return data;
}

export async function updatePostTags(
  id: string,
  tagIds: string[],
): Promise<void> {
  await apiClient.put(`/api/v1/admin/posts/${id}/tags`, { tag_ids: tagIds });
}

export async function updatePostBodyImages(
  id: string,
  bodyImages: BodyImage[],
): Promise<void> {
  await apiClient.put(`/api/v1/admin/posts/${id}/body-images`, {
    body_images: bodyImages,
  });
}

export async function fetchAdminImages(params?: {
  page?: number;
  page_size?: number;
}): Promise<AdminImageListResponse> {
  const { data } = await apiClient.get<AdminImageListResponse>(
    "/api/v1/admin/images/",
    { params },
  );
  return data;
}

export async function fetchAdminTags(): Promise<AdminTag[]> {
  const { data } = await apiClient.get<{ data: AdminTag[] }>(
    "/api/v1/admin/tags/",
  );
  return data.data;
}

export type AdminCategory = { id: string; name: string; slug: string };

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const { data } = await apiClient.get<{ data: AdminCategory[] }>(
    "/api/v1/admin/categories/",
  );
  return data.data;
}
