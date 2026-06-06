# Data Model

## Overview

All tables use PostgreSQL with UUID primary keys and timezone-aware timestamps.
Introduced across two changes: `home-blog-newsletter-contact` and `blog-admin`.

---

## Category

**Table:** `categories`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Display name (title-case) |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | URL-safe identifier |
| created_at | TIMESTAMPTZ | NOT NULL | Server default: `now()` |

**Business rules:**
- Names are compared case-insensitively for duplicate detection.
- Deleting a category is blocked if any post references it.

---

## Tag

**Table:** `tags`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Display name |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | URL-safe identifier |
| created_at | TIMESTAMPTZ | NOT NULL | Server default: `now()` |

**Business rules:**
- Deleting a tag silently removes all `post_tags` rows (cascade).

---

## PostTag

**Table:** `post_tags` (join)

| Column | Type | Constraints | Notes |
|---|---|---|---|
| post_id | UUID | PK, FK → posts.id, ON DELETE CASCADE | |
| tag_id | UUID | PK, FK → tags.id, ON DELETE CASCADE | |

---

## Image

**Table:** `images`

Stores uploaded images after WebP optimisation.

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| original_url | VARCHAR(500) | NOT NULL | Path to full-size WebP (≤1920px) |
| thumbnail_url | VARCHAR(500) | NOT NULL | Path to thumbnail WebP (≤600px) |
| filename | UUID-based filename | NOT NULL | Base filename without extension |
| alt_text | VARCHAR(255) | NULLABLE | Accessibility text |
| subtitle | VARCHAR(255) | NULLABLE | Optional caption |
| width | INTEGER | NULLABLE | Pixel width of original variant |
| height | INTEGER | NULLABLE | Pixel height of original variant |
| created_at | TIMESTAMPTZ | NOT NULL | Server default: `now()` |

**Business rules:**
- Deleting an image is blocked if referenced as `featured_image_id` on any post or present in `post_body_images`.
- Both physical files are deleted from `MEDIA_ROOT` on successful delete.

---

## PostBodyImage

**Table:** `post_body_images` (join with layout metadata)

| Column | Type | Constraints | Notes |
|---|---|---|---|
| post_id | UUID | PK, FK → posts.id, ON DELETE CASCADE | |
| image_id | UUID | PK, FK → images.id, ON DELETE RESTRICT | |
| sort_order | INTEGER | NOT NULL, default 0 | Display order in body |
| alignment | VARCHAR(10) | NOT NULL, CHECK IN ('left','center','right') | |
| size | VARCHAR(10) | NOT NULL, CHECK IN ('small','medium','full') | |

---

## Post

**Table:** `posts`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| title | VARCHAR(255) | NOT NULL | Display title |
| slug | VARCHAR(255) | NOT NULL, UNIQUE, INDEXED | URL-safe identifier |
| excerpt | TEXT | NOT NULL | Short summary for card display |
| content | TEXT | NOT NULL | Full article body (Markdown) |
| category_id | UUID | NOT NULL, FK → categories.id, INDEXED | |
| featured_image_id | UUID | NULLABLE, FK → images.id, ON DELETE SET NULL | |
| seo_title | VARCHAR(255) | NULLABLE | Override for `<title>` tag |
| seo_description | VARCHAR(500) | NULLABLE | Meta description |
| seo_keywords | VARCHAR(500) | NULLABLE | Comma-separated keywords |
| created_by | VARCHAR(10) | NOT NULL, CHECK IN ('human','ai'), default 'human' | Never exposed publicly |
| published_at | TIMESTAMPTZ | NULLABLE, INDEXED | NULL = draft; past = published; future = scheduled |
| created_at | TIMESTAMPTZ | NOT NULL | Server default: `now()` |
| updated_at | TIMESTAMPTZ | NOT NULL | Server default: `now()`, updated on write |

**Business rules:**
- **Status is derived** (not stored): `published_at IS NULL` → draft; `published_at > now()` → scheduled; `published_at <= now()` → published.
- Public API only returns posts where `published_at IS NOT NULL AND published_at <= now()`.
- `created_by` is set from the caller's API key identity at creation time and is immutable.
- `created_by` is **never** returned by public endpoints.

---

## NewsletterSubscriber

**Table:** `newsletter_subscribers`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| email | VARCHAR(255) | NOT NULL, UNIQUE, INDEXED | Subscriber email address |
| subscribed_at | TIMESTAMPTZ | NOT NULL | Server default: `now()` |
| is_active | BOOLEAN | NOT NULL | Default: `true` |

**Business rules:**
- Duplicate subscriptions are a no-op — returns the existing record, no error.
- `is_active = false` reserved for a future unsubscribe endpoint.

---

## ContactSubmission

**Table:** `contact_submissions`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | UUID | PK | Auto-generated |
| name | VARCHAR(255) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL | |
| subject | VARCHAR(255) | NOT NULL | |
| message | TEXT | NOT NULL, max 5000 chars (app-level) | |
| submitted_at | TIMESTAMPTZ | NOT NULL | Server default: `now()` |
| is_read | BOOLEAN | NOT NULL | Default: `false` |

**Business rules:**
- `message` capped at 5000 characters by Pydantic (not a DB constraint).
