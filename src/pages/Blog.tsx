import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, RefreshCw, Sparkles, ExternalLink, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

interface Article {
  id: number;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  imageKeyword: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  readTime: string;
}

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "AI", "Cybersecurity", "Cloud", "Software", "Startups", "Innovation"];

  const categoryColors: Record<string, string> = {
    AI: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    Cybersecurity: "bg-red-500/10 text-red-400 border-red-500/20",
    Cloud: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Software: "bg-green-500/10 text-green-400 border-green-500/20",
    Startups: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Innovation: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-tech-news', {
        body: { category: selectedCategory === "All" ? "technology" : selectedCategory }
      });

      if (error) throw error;
      
      if (data?.articles) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Failed to load news",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshNews = async () => {
    setIsRefreshing(true);
    await fetchNews();
    setIsRefreshing(false);
    toast({
      title: "News refreshed",
      description: "Latest tech news loaded successfully"
    });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredArticles = selectedCategory === "All" 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  const handleReadMore = (article: Article) => {
    if (article.sourceUrl) {
      window.open(article.sourceUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Search for the article on Google if no source URL
      const searchQuery = encodeURIComponent(article.title);
      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Helmet>
        <title>Tech Blog | Latest Technology News & Trends | Elite Forums</title>
        <meta name="description" content="Stay updated with the latest technology news, AI developments, cybersecurity updates, cloud computing trends, and startup news. AI-powered tech news aggregation by Elite Forums." />
        <meta name="keywords" content="tech news, AI news, technology blog, cybersecurity news, cloud computing, startup news, tech trends, Elite Forums blog" />
        <meta property="og:title" content="Tech Blog | Elite Forums" />
        <meta property="og:description" content="AI-powered technology news and trends from Elite Forums" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://eliteforums.in/blog" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3">
                <img src={logo} alt="Elite Forums" className="h-10 w-auto" />
                <span className="text-xl font-bold text-foreground hidden sm:block">Elite Forums</span>
              </Link>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshNews}
                  disabled={isRefreshing || isLoading}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Back to Home</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered News</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Pulse</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Stay ahead with AI-curated technology news. Fresh insights on AI, cybersecurity, cloud computing, and innovation—updated daily.
              </p>
              
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
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
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-16">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground mb-4">Try selecting a different category or refresh the news</p>
                <Button onClick={refreshNews} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh News
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article, index) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                      
                      <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {article.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.publishedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1 text-primary hover:text-primary"
                          onClick={() => handleReadMore(article)}
                        >
                          Read More
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-muted-foreground">
              News curated with AI by <span className="text-primary font-medium">Elite Forums</span>
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Powered by Perplexity AI • Updated daily
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Blog;
