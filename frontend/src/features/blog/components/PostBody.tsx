import { renderContent } from "@/features/blog/utils/renderContent";

type PostBodyProps = { content: string };

export function PostBody({ content }: PostBodyProps) {
  const blocks = renderContent(content);

  return (
    <article className="max-w-prose space-y-6 py-10">
      {blocks.map((block, i) =>
        block.type === "h3" ? (
          <h3
            key={i}
            className="font-serif text-foreground text-2xl font-normal pt-4"
          >
            {block.text}
          </h3>
        ) : (
          <p key={i} className="text-taupe leading-relaxed">
            {block.text}
          </p>
        ),
      )}
    </article>
  );
}
