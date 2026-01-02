import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Clock, ExternalLink, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  readTime: string;
}

const BlogPreview = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categoryColors: Record<string, string> = {
    AI: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Cybersecurity: "bg-red-500/10 text-red-400 border-red-500/20",
    Cloud: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Software: "bg-green-500/10 text-green-400 border-green-500/20",
    Startups: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Innovation: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-tech-news', {
          body: { category: 'technology' }
        });

        if (error) throw error;
        
        if (data?.articles) {
          // Only show first 3 articles for preview
          setArticles(data.articles.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching news preview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleReadMore = (article: Article) => {
    if (article.sourceUrl) {
      window.open(article.sourceUrl, '_blank', 'noopener,noreferrer');
    } else {
      const searchQuery = encodeURIComponent(article.title);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered News</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Latest from <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Tech Pulse</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with AI-curated technology news, updated daily
          </p>
        </motion.div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
                <Skeleton className="w-full h-48" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <Badge 
                    variant="outline" 
                    className={`absolute top-4 left-4 ${categoryColors[article.category] || 'bg-primary/10 text-primary'}`}
                  >
                    {article.category}
                  </Badge>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-primary">{article.source}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {article.summary}
                  </p>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-primary hover:text-primary p-0"
                    onClick={() => handleReadMore(article)}
                  >
                    Read More
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link to="/blog">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;
