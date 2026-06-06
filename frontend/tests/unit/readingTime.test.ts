import { describe, expect, it } from "vitest";
import { readingTime } from "@/features/blog/utils/readingTime";

function words(n: number) {
  return Array(n).fill("palabra").join(" ");
}

describe("readingTime", () => {
  it("returns 1 min de lectura for exactly 200 words", () => {
    expect(readingTime(words(200))).toBe("1 min de lectura");
  });

  it("returns 3 min de lectura for 401 words (ceil)", () => {
    expect(readingTime(words(401))).toBe("3 min de lectura");
  });

  it("returns 1 min de lectura for an empty string", () => {
    expect(readingTime("")).toBe("1 min de lectura");
  });

  it("returns 1 min de lectura for a single word", () => {
    expect(readingTime("hola")).toBe("1 min de lectura");
  });
});
