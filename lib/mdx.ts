import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ArticleMeta, ArticleCategory } from "@/types";

const CONTENT_DIR = path.join(process.cwd(), "content/articles");

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const filePath = path.join(CONTENT_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);

      return {
        slug,
        title: data.title || slug,
        excerpt: data.excerpt || "",
        category: (data.category as ArticleCategory) || "BASICS",
        tags: data.tags || [],
        readTime: data.readTime || 5,
        publishedAt: data.publishedAt || new Date().toISOString().split("T")[0],
      } as ArticleMeta;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getArticleBySlug(slug: string): {
  meta: ArticleMeta;
  content: string;
} | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title || slug,
      excerpt: data.excerpt || "",
      category: (data.category as ArticleCategory) || "BASICS",
      tags: data.tags || [],
      readTime: data.readTime || 5,
      publishedAt: data.publishedAt || new Date().toISOString().split("T")[0],
    },
    content,
  };
}

export function getArticlesByCategory(category: ArticleCategory): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  BASICS: "Conceptos básicos",
  STRATEGIES: "Estrategias",
  FAQ: "Preguntas frecuentes",
  ADVANCED: "Avanzado",
};

export const CATEGORY_ICONS: Record<ArticleCategory, string> = {
  BASICS: "📖",
  STRATEGIES: "🎯",
  FAQ: "❓",
  ADVANCED: "🚀",
};
