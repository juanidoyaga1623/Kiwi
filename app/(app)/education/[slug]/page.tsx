import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getAllArticles, CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, BookOpen, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Artículo no encontrado" };
  return {
    title: article.meta.title,
    description: article.meta.excerpt,
  };
}

// Simple markdown to HTML renderer (no MDX dependency issues)
function renderMarkdown(content: string): string {
  return content
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold text-foreground mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-foreground mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-foreground mt-8 mb-4">$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre class="bg-accent border border-border rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-primary font-mono">$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-accent px-1.5 py-0.5 rounded text-sm text-primary font-mono">$1</code>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 py-1 my-4 text-muted-foreground italic">$1</blockquote>')
    // Tables (basic)
    .replace(/\|(.+)\|/g, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(c => c.trim());
      return `<div class="flex gap-4 border-b border-border py-2">${cells.map(c => `<span class="flex-1 text-sm">${c.trim()}</span>`).join('')}</div>`;
    })
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-muted-foreground list-disc">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-sm text-muted-foreground list-decimal">$1</li>')
    // Paragraphs
    .replace(/\n\n(.+)/g, '<p class="text-muted-foreground leading-relaxed my-3">$1</p>')
    // Line breaks
    .replace(/\n/g, '<br/>');
}

export default function ArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const { meta, content } = article;
  const renderedContent = renderMarkdown(content);

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground -ml-2">
        <Link href="/education">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Hub Educacional
        </Link>
      </Button>

      {/* Article header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span>{CATEGORY_ICONS[meta.category]}</span>
          <Badge variant="secondary" className="text-xs">
            {CATEGORY_LABELS[meta.category]}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {meta.readTime} min de lectura
          </span>
        </div>

        <h1 className="text-3xl font-black text-foreground leading-tight">
          {meta.title}
        </h1>

        {meta.excerpt && (
          <p className="text-muted-foreground text-lg leading-relaxed">
            {meta.excerpt}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap pt-1">
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-accent">
              {tag}
            </Badge>
          ))}
          <span className="text-xs text-muted-foreground ml-auto">
            {format(new Date(meta.publishedAt), "d 'de' MMMM, yyyy", { locale: es })}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Article content */}
      <article
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />

      {/* Mark as read CTA */}
      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              ¿Terminaste de leer este artículo?
            </p>
          </div>
          <Button size="sm" className="bg-primary text-primary-foreground shrink-0">
            Marcar como leído
          </Button>
        </CardContent>
      </Card>

      {/* Back link */}
      <div className="pt-4">
        <Link
          href="/education"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Ver más artículos
        </Link>
      </div>
    </div>
  );
}
