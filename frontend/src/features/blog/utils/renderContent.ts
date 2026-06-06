export type ContentBlock = { type: "h3" | "p"; text: string };

const HEADING_MAX_LENGTH = 80;
const TERMINAL_PUNCT = /[.,?]$/;

export function renderContent(text: string): ContentBlock[] {
  if (!text.trim()) return [];

  return text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): ContentBlock => {
      const isHeading =
        block.length <= HEADING_MAX_LENGTH && !TERMINAL_PUNCT.test(block);
      return { type: isHeading ? "h3" : "p", text: block };
    });
}
