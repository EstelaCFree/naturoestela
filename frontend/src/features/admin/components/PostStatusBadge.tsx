import { cn } from "@/lib/cn";
import type { PostStatus } from "@/types/adminPost";

type PostStatusBadgeProps = { status: PostStatus; className?: string };

const statusConfig: Record<PostStatus, { label: string; classes: string }> = {
  draft: { label: "Draft", classes: "bg-taupe/15 text-taupe" },
  scheduled: { label: "Scheduled", classes: "bg-amber-100 text-amber-700" },
  published: {
    label: "Published",
    classes: "bg-forest-green/15 text-forest-green",
  },
};

export function PostStatusBadge({ status, className }: PostStatusBadgeProps) {
  const { label, classes } = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        classes,
        className,
      )}
    >
      {label}
    </span>
  );
}
