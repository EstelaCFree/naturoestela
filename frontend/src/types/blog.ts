export type PostCategory = { id: string; name: string; slug: string };
export type PostTag = { id: string; name: string; slug: string };
export type PostFeaturedImage = {
  original_url: string;
  thumbnail_url: string;
  alt_text: string | null;
  subtitle: string | null;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  tags: PostTag[];
  featured_image: PostFeaturedImage | null;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type PostListMeta = { total: number; page: number; page_size: number };
export type PostListResponse = { data: Post[]; meta: PostListMeta };
