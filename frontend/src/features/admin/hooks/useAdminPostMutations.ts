import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  deletePost,
  publishPost,
  unpublishPost,
  updatePost,
  updatePostBodyImages,
  updatePostTags,
} from "@/features/admin/api/adminPostApi";

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "posts"] }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof updatePost>[1];
    }) => updatePost(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "posts", id] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "posts"] }),
  });
}

export function usePublishPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publishedAt }: { id: string; publishedAt?: string }) =>
      publishPost(id, publishedAt),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "posts", id] });
    },
  });
}

export function useUnpublishPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => unpublishPost(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "posts", id] });
    },
  });
}

export function useUpdatePostTags() {
  return useMutation({
    mutationFn: ({ id, tagIds }: { id: string; tagIds: string[] }) =>
      updatePostTags(id, tagIds),
  });
}

export function useUpdatePostBodyImages() {
  return useMutation({
    mutationFn: ({
      id,
      bodyImages,
    }: {
      id: string;
      bodyImages: Parameters<typeof updatePostBodyImages>[1];
    }) => updatePostBodyImages(id, bodyImages),
  });
}
