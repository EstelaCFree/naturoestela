import { cn } from "@/lib/cn";
import type { PostAuthorship } from "@/types/adminPost";

type AuthorshipBadgeProps = { authorship: PostAuthorship; className?: string };

export function AuthorshipBadge({
  authorship,
  className,
}: AuthorshipBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        authorship === "ai"
          ? "bg-purple-100 text-purple-700"
          : "bg-sky-100 text-sky-700",
        className,
      )}
    >
      {authorship === "ai" ? "AI" : "Human"}
    </span>
  );
}
