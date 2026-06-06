import { useState } from "react";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { AuthorshipBadge } from "@/features/admin/components/AuthorshipBadge";
import { PostStatusBadge } from "@/features/admin/components/PostStatusBadge";
import { useAdminPosts } from "@/features/admin/hooks/useAdminPosts";
import {
  useDeletePost,
  usePublishPost,
  useUnpublishPost,
} from "@/features/admin/hooks/useAdminPostMutations";
import type { AdminPostListItem, PostStatus } from "@/types/adminPost";
import { cn } from "@/lib/cn";

type StatusFilter = "" | PostStatus;

const TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "" },
  { label: "Draft", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
];

export function AdminPostsPage() {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminPostListItem | null>(
    null,
  );
  const { show: showToast } = useToast();

  const queryClient = useQueryClient();
  const { data, isLoading } = useAdminPosts({
    status: activeStatus || undefined,
    page,
  });
  const deleteMutation = useDeletePost();
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();

  const posts = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta ? Math.ceil(meta.total / meta.page_size) : 1;

  function handleTabChange(value: StatusFilter) {
    setActiveStatus(value);
    setPage(1);
  }

  function apiMsg(e: unknown, fallback: string) {
    if (isAxiosError(e)) {
      const d = e.response?.data;
      const msg = d?.detail || d?.error || d?.message;
      if (msg) return typeof msg === "string" ? msg : JSON.stringify(msg);
    }
    return fallback;
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      showToast("Post deleted");
      setDeleteTarget(null);
    } catch (e) {
      showToast(apiMsg(e, "Failed to delete"), "error");
    }
  }

  async function handleQuickPublish(post: AdminPostListItem) {
    try {
      await publishMutation.mutateAsync({ id: post.id });
      await queryClient.refetchQueries({
        queryKey: [
          "admin",
          "posts",
          { status: activeStatus || undefined, page },
        ],
      });
      showToast("Post published");
    } catch (e) {
      showToast(apiMsg(e, "Failed to publish"), "error");
    }
  }

  async function handleQuickUnpublish(post: AdminPostListItem) {
    try {
      await unpublishMutation.mutateAsync(post.id);
      await queryClient.refetchQueries({
        queryKey: [
          "admin",
          "posts",
          { status: activeStatus || undefined, page },
        ],
      });
      showToast("Post unpublished");
    } catch (e) {
      showToast(apiMsg(e, "Failed to unpublish"), "error");
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Posts</h2>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-warm-ivory transition-all hover:opacity-90"
        >
          + New Post
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 border-b border-foreground/10">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-colors",
              activeStatus === tab.value
                ? "border-b-2 border-foreground text-foreground"
                : "text-taupe hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5 text-xs uppercase tracking-wide text-taupe">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Author</th>
              <th className="px-4 py-3 text-left">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-4 w-48 rounded bg-foreground/10" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 rounded bg-foreground/10" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-16 rounded-full bg-foreground/10" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-14 rounded-full bg-foreground/10" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 rounded bg-foreground/10" />
                  </td>
                  <td className="px-4 py-3" />
                </tr>
              ))
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-taupe">
                  No posts yet.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-foreground/[0.02] transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-taupe">
                    {post.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <PostStatusBadge status={post.status} />
                  </td>
                  <td className="px-4 py-3">
                    <AuthorshipBadge authorship={post.created_by} />
                  </td>
                  <td className="px-4 py-3 text-taupe">
                    {formatDate(post.published_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="text-xs font-medium text-forest-green hover:underline"
                      >
                        Edit
                      </Link>
                      {post.status === "draft" ? (
                        <button
                          type="button"
                          onClick={() => handleQuickPublish(post)}
                          disabled={publishMutation.isPending}
                          className="text-xs font-medium text-forest-green hover:underline disabled:opacity-50"
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQuickUnpublish(post)}
                          disabled={unpublishMutation.isPending}
                          className="text-xs font-medium text-taupe hover:text-foreground disabled:opacity-50"
                        >
                          Unpublish
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(post)}
                        className="text-xs font-medium text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.total > meta.page_size && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-taupe">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-warm-ivory p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-foreground">
              Delete post?
            </h3>
            <p className="mt-2 text-sm text-taupe">
              "{deleteTarget.title}" will be permanently deleted.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700"
                isLoading={deleteMutation.isPending}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
