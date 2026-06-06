import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { AuthorshipBadge } from "@/features/admin/components/AuthorshipBadge";
import { BodyImagesManager } from "@/features/admin/components/BodyImagesManager";
import { EditorToolbar } from "@/features/admin/components/EditorToolbar";
import { ImagePickerModal } from "@/features/admin/components/ImagePickerModal";
import { PostStatusBadge } from "@/features/admin/components/PostStatusBadge";
import { useAdminPost } from "@/features/admin/hooks/useAdminPost";
import { useAdminCategories } from "@/features/admin/hooks/useAdminCategories";
import {
  useCreatePost,
  usePublishPost,
  useUnpublishPost,
  useUpdatePost,
  useUpdatePostBodyImages,
  useUpdatePostTags,
} from "@/features/admin/hooks/useAdminPostMutations";
import { useAdminTags } from "@/features/admin/hooks/useAdminTags";
import type {
  AdminImage,
  AdminPost,
  BodyImage,
  PostStatus,
} from "@/types/adminPost";

type FormState = {
  title: string;
  slug: string;
  slugManual: boolean;
  content: string;
  categoryId: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  featuredImageId: string | null;
  featuredImageUrl: string | null;
  bodyImages: BodyImage[];
  tagIds: string[];
  scheduledAt: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function initForm(post?: AdminPost): FormState {
  if (!post) {
    return {
      title: "",
      slug: "",
      slugManual: false,
      content: "",
      categoryId: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
      featuredImageId: null,
      featuredImageUrl: null,
      bodyImages: [],
      tagIds: [],
      scheduledAt: "",
    };
  }
  return {
    title: post.title,
    slug: post.slug,
    slugManual: true,
    content: post.content,
    categoryId: post.category?.id ?? "",
    seoTitle: post.seo?.title ?? "",
    seoDescription: post.seo?.description ?? "",
    seoKeywords: post.seo?.keywords ?? "",
    featuredImageId: post.featured_image?.id ?? null,
    featuredImageUrl: post.featured_image?.thumbnail_url ?? null,
    bodyImages: post.body_images,
    tagIds: post.tags.map((t) => t.id),
    scheduledAt: "",
  };
}

export function PostEditorPage() {
  const { id: rawId } = useParams<{ id?: string }>();
  // Guard: if the route mistakenly matched "new" as an id param, treat as create mode
  const id = rawId === "new" ? undefined : rawId;
  const navigate = useNavigate();
  const { show: showToast } = useToast();

  const { data: post, isLoading, error } = useAdminPost(id);
  const { data: allTags } = useAdminTags();
  const { data: allCategories } = useAdminCategories();

  const [form, setForm] = useState<FormState>(initForm());
  const [initialized, setInitialized] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>(id);
  const [slugEditing, setSlugEditing] = useState(false);
  const [featuredPickerOpen, setFeaturedPickerOpen] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();
  const updateTagsMutation = useUpdatePostTags();
  const updateBodyImagesMutation = useUpdatePostBodyImages();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setForm((f) => ({ ...f, content: editor.getHTML() }));
      setIsDirty(true);
    },
  });

  useEffect(() => {
    if (post && !initialized && editor) {
      const f = initForm(post);
      setForm(f);
      editor.commands.setContent(post.content);
      setInitialized(true);
    }
  }, [post, initialized, editor]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setIsDirty(true);
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: f.slugManual ? f.slug : slugify(title),
    }));
    setIsDirty(true);
  }

  function handleFeaturedSelect(img: AdminImage) {
    setField("featuredImageId", img.id);
    setField("featuredImageUrl", img.thumbnail_url);
    setFeaturedPickerOpen(false);
  }

  async function persistPost() {
    if (!form.categoryId) {
      setCategoryError("Please select a category.");
      throw new Error("category_required");
    }
    setCategoryError("");

    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      content: form.content,
      category_id: form.categoryId,
      excerpt: undefined,
      featured_image_id: form.featuredImageId,
      seo_title: form.seoTitle || null,
      seo_description: form.seoDescription || null,
      seo_keywords: form.seoKeywords || null,
    };

    let postId = savedId;
    if (!postId) {
      const created = await createMutation.mutateAsync(payload);
      postId = created.id;
      setSavedId(postId);
      navigate(`/admin/posts/${postId}/edit`, { replace: true });
    } else {
      await updateMutation.mutateAsync({ id: postId, payload });
    }

    await updateTagsMutation.mutateAsync({ id: postId, tagIds: form.tagIds });
    await updateBodyImagesMutation.mutateAsync({
      id: postId,
      bodyImages: form.bodyImages.map(
        ({ thumbnail_url, original_url, alt_text, ...bi }) => bi,
      ),
    });

    setIsDirty(false);
    return postId;
  }

  function apiErrorMessage(e: unknown, fallback: string): string {
    if (isAxiosError(e)) {
      const msg =
        e.response?.data?.detail ||
        e.response?.data?.error ||
        e.response?.data?.message;
      if (msg) return typeof msg === "string" ? msg : JSON.stringify(msg);
    }
    if (e instanceof Error && e.message !== "category_required")
      return fallback;
    return "";
  }

  async function handleSaveDraft() {
    try {
      await persistPost();
      showToast("Draft saved");
    } catch (e: unknown) {
      const msg = apiErrorMessage(e, "Failed to save draft");
      if (msg) showToast(msg, "error");
    }
  }

  async function handlePublishNow() {
    try {
      const postId = await persistPost();
      await publishMutation.mutateAsync({ id: postId });
      showToast("Post published");
    } catch (e: unknown) {
      const msg = apiErrorMessage(e, "Failed to publish");
      if (msg) showToast(msg, "error");
    }
  }

  async function handleSchedule() {
    setScheduleError("");
    if (!form.scheduledAt) {
      setScheduleError("Please select a date and time.");
      return;
    }
    if (new Date(form.scheduledAt) <= new Date()) {
      setScheduleError("Scheduled date must be in the future.");
      return;
    }
    try {
      const postId = await persistPost();
      await publishMutation.mutateAsync({
        id: postId,
        publishedAt: new Date(form.scheduledAt).toISOString(),
      });
      showToast("Post scheduled");
    } catch (e: unknown) {
      const msg = apiErrorMessage(e, "Failed to schedule");
      if (msg) showToast(msg, "error");
    }
  }

  async function handleUnpublish() {
    if (!savedId) return;
    try {
      await unpublishMutation.mutateAsync(savedId);
      showToast("Post unpublished");
    } catch (e: unknown) {
      const msg = apiErrorMessage(e, "Failed to unpublish");
      showToast(msg || "Failed to unpublish", "error");
    }
  }

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    publishMutation.isPending ||
    unpublishMutation.isPending;

  const postStatus: PostStatus = post?.status ?? "draft";
  const isEditMode = !!id;

  if (isEditMode && isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner className="h-8 w-8 text-forest-green" />
      </div>
    );
  }

  if (isEditMode && error) {
    const is404 = isAxiosError(error) && error.response?.status === 404;
    return (
      <div className="space-y-2 py-12 text-center">
        <p className="text-foreground font-medium">
          {is404 ? "Post not found" : "Failed to load post"}
        </p>
        <Link
          to="/admin/posts"
          className="text-sm text-forest-green hover:underline"
        >
          ← Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Main content area */}
      <div className="flex-1 space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Post title"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-lg border border-foreground/20 bg-warm-ivory px-4 py-3 text-lg font-semibold text-foreground placeholder-taupe focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />

        {/* Slug */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-taupe">Slug:</span>
          {slugEditing ? (
            <input
              type="text"
              value={form.slug}
              onChange={(e) => {
                setField("slug", e.target.value);
                setField("slugManual", true);
              }}
              onBlur={() => setSlugEditing(false)}
              autoFocus
              className="flex-1 rounded border border-foreground/20 bg-warm-ivory px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          ) : (
            <>
              <span className="font-mono text-foreground">
                {form.slug || "—"}
              </span>
              <button
                type="button"
                onClick={() => setSlugEditing(true)}
                className="text-xs text-taupe hover:text-foreground underline"
              >
                Edit slug
              </button>
            </>
          )}
        </div>

        {/* WYSIWYG editor */}
        <div className="overflow-hidden rounded-lg border border-foreground/20">
          {editor && <EditorToolbar editor={editor} />}
          <EditorContent
            editor={editor}
            className="min-h-64 px-4 py-3 prose prose-sm prose-headings:font-semibold prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground max-w-none [&_.ProseMirror]:outline-none"
          />
        </div>

        {/* Body images */}
        <div className="rounded-lg border border-foreground/20 p-4">
          <BodyImagesManager
            images={form.bodyImages}
            onChange={(imgs) => setField("bodyImages", imgs)}
          />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-full space-y-4 lg:w-80 lg:shrink-0">
        {/* Status + authorship */}
        {isEditMode && post && (
          <div className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-4 py-3">
            <PostStatusBadge status={postStatus} />
            <AuthorshipBadge authorship={post.created_by} />
          </div>
        )}

        {/* Category (required) */}
        <div className="rounded-lg border border-foreground/20 p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">
            Category <span className="text-red-500">*</span>
          </p>
          <select
            value={form.categoryId}
            onChange={(e) => {
              setField("categoryId", e.target.value);
              setCategoryError("");
            }}
            className="w-full rounded border border-foreground/20 bg-warm-ivory px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
          >
            <option value="">Select a category…</option>
            {allCategories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categoryError && (
            <p className="text-xs text-red-600">{categoryError}</p>
          )}
        </div>

        {/* Featured image */}
        <div className="rounded-lg border border-foreground/20 p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Featured Image</p>
          {form.featuredImageUrl ? (
            <div className="space-y-2">
              <img
                src={form.featuredImageUrl}
                alt=""
                className="w-full rounded-lg object-cover aspect-video"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFeaturedPickerOpen(true)}
                  className="text-xs text-taupe hover:text-foreground underline"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setField("featuredImageId", null);
                    setField("featuredImageUrl", null);
                  }}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setFeaturedPickerOpen(true)}
              className="flex w-full items-center justify-center rounded-lg border-2 border-dashed border-foreground/20 py-6 text-sm text-taupe hover:border-foreground/40 hover:text-foreground transition-colors"
            >
              Select image
            </button>
          )}
        </div>

        {/* SEO */}
        <div className="rounded-lg border border-foreground/20 p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">SEO</p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="SEO title"
              value={form.seoTitle}
              onChange={(e) => setField("seoTitle", e.target.value)}
              className="w-full rounded border border-foreground/20 bg-warm-ivory px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
            <textarea
              placeholder="SEO description"
              value={form.seoDescription}
              onChange={(e) => setField("seoDescription", e.target.value)}
              rows={3}
              className="w-full rounded border border-foreground/20 bg-warm-ivory px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
            <input
              type="text"
              placeholder="Keywords (comma-separated)"
              value={form.seoKeywords}
              onChange={(e) => setField("seoKeywords", e.target.value)}
              className="w-full rounded border border-foreground/20 bg-warm-ivory px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="rounded-lg border border-foreground/20 p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Tags</p>
          {!allTags ? (
            <Spinner className="h-4 w-4 text-taupe" />
          ) : allTags.length === 0 ? (
            <p className="text-xs text-taupe">No tags created yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {allTags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={form.tagIds.includes(tag.id)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...form.tagIds, tag.id]
                        : form.tagIds.filter((t) => t !== tag.id);
                      setField("tagIds", next);
                    }}
                    className="accent-forest-green"
                  />
                  <span className="text-foreground">{tag.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Publish controls */}
        <div className="rounded-lg border border-foreground/20 p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Publish</p>

          {postStatus === "published" ? (
            <>
              <Button
                className="w-full"
                size="sm"
                isLoading={isSaving}
                onClick={handleSaveDraft}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                size="sm"
                isLoading={unpublishMutation.isPending}
                onClick={handleUnpublish}
              >
                Unpublish
              </Button>
            </>
          ) : postStatus === "scheduled" ? (
            <>
              <Button
                className="w-full"
                size="sm"
                isLoading={isSaving}
                onClick={handleSaveDraft}
              >
                Save
              </Button>
              <Button
                className="w-full"
                size="sm"
                isLoading={isSaving}
                onClick={handlePublishNow}
              >
                Publish Now
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                size="sm"
                isLoading={unpublishMutation.isPending}
                onClick={handleUnpublish}
              >
                Cancel schedule
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                className="w-full"
                size="sm"
                isLoading={isSaving}
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
              <Button
                className="w-full"
                size="sm"
                isLoading={isSaving}
                onClick={handlePublishNow}
              >
                Publish Now
              </Button>
              <div className="space-y-1.5">
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => {
                    setField("scheduledAt", e.target.value);
                    setScheduleError("");
                  }}
                  className="w-full rounded border border-foreground/20 bg-warm-ivory px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
                {scheduleError && (
                  <p className="text-xs text-red-600">{scheduleError}</p>
                )}
                <Button
                  variant="secondary"
                  className="w-full"
                  size="sm"
                  isLoading={isSaving}
                  onClick={handleSchedule}
                >
                  Schedule
                </Button>
              </div>
            </>
          )}
        </div>
      </aside>

      {featuredPickerOpen && (
        <ImagePickerModal
          onSelect={handleFeaturedSelect}
          onClose={() => setFeaturedPickerOpen(false)}
        />
      )}
    </div>
  );
}
