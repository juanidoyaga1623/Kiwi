import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/mdx";
import type { ArticleCategory } from "@/types";

export const metadata: Metadata = { title: "Hub Educacional" };

const CATEGORIES: ArticleCategory[] = ["BASICS", "STRATEGIES", "FAQ", "ADVANCED"];

export default function EducationPage() {
  const articles = getAllArticles();
  const totalRead = 0; // Would come from DB in real app
  const progressPercent = articles.length > 0
    ? Math.round((totalRead / articles.length) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hub Educacional</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aprendé todo sobre inversión en acciones fraccionadas
          </p>
        </div>

        {/* Progress */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Tu progreso</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {totalRead} / {articles.length} artículos
              </p>
            </div>
            <div className="w-24">
              <Progress value={progressPercent} className="h-2" />
              <p className="text-[10px] text-muted-foreground mt-1 text-right">
                {progressPercent}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      {CATEGORIES.map((category) => {
        const catArticles = articles.filter((a) => a.category === category);
        if (catArticles.length === 0) return null;

        return (
          <section key={category}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{CATEGORY_ICONS[category]}</span>
              <h2 className="text-base font-semibold text-foreground">
                {CATEGORY_LABELS[category]}
              </h2>
              <Badge variant="secondary" className="text-xs ml-1">
                {catArticles.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {catArticles.map((article) => (
                <Link key={article.slug} href={`/education/${article.slug}`}>
                  <Card className="bg-card border-border hover:border-primary/30 transition-all cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] bg-accent"
                            >
                              {tag}
                            </Badge>
                          ))}
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
                            <Clock className="h-2.5 w-2.5" />
                            {article.readTime} min
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {articles.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No hay artículos disponibles todavía</p>
        </div>
      )}
    </div>
  );
}
