import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import { codeToHtml } from "shiki";

const THEMES = { light: "github-light", dark: "github-dark" } as const;

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeShiki, { themes: THEMES, defaultColor: false })
  .use(rehypeStringify);

export async function renderMarkdown(md: string) {
  return String(await processor.process(md));
}

/** Reads content/learn/<...parts>.md. Returns null if the note doesn't exist yet. */
export async function loadNote(...parts: string[]) {
  try {
    const file = await readFile(path.join(process.cwd(), "content", "learn", ...parts) + ".md", "utf8");
    const { content, data } = matter(file);
    return { html: await renderMarkdown(content), data };
  } catch {
    return null;
  }
}

const LANG: Record<string, string> = { cpp: "cpp", c: "c", mysql: "sql", python3: "python", java: "java" };

export function highlight(code: string, lang: string) {
  return codeToHtml(code, { lang: LANG[lang] ?? "text", themes: THEMES, defaultColor: false });
}
