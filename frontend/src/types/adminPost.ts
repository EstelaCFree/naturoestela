export type PostStatus = "draft" | "scheduled" | "published";
export type PostAuthorship = "human" | "ai";

export type AdminImage = {
  id: string;
  original_url: string;
  thumbnail_url: string;
  alt_text: string | null;
  subtitle: string | null;
};

export type AdminTag = {
  id: string;
  name: string;
  slug: string;
};

export type BodyImage = {
  image_id: string;
  alignment: "left" | "center" | "right";
  size: "small" | "medium" | "full";
  sort_order: number;
  thumbnail_url?: string;
  original_url?: string;
  alt_text?: string | null;
};

export type AdminPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: PostStatus;
  published_at: string | null;
  created_by: PostAuthorship;
  category: { id: string; name: string; slug: string } | null;
  tags: AdminTag[];
  featured_image: AdminImage | null;
  body_images: BodyImage[];
  seo: {
    title: string | null;
    description: string | null;
    keywords: string | null;
  } | null;
  created_at: string;
  updated_at: string;
};

export type AdminPostListItem = Pick<
  AdminPost,
  | "id"
  | "title"
  | "slug"
  | "status"
  | "published_at"
  | "created_by"
  | "category"
  | "tags"
  | "featured_image"
>;

export type AdminPostListMeta = {
  total: number;
  page: number;
  page_size: number;
};
export type AdminPostListResponse = {
  data: AdminPostListItem[];
  meta: AdminPostListMeta;
};

export type AdminImageListResponse = {
  data: AdminImage[];
  meta: AdminPostListMeta;
};
