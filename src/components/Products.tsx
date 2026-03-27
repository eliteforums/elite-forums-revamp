import { useState, useEffect } from "react";
import { ExternalLink, ArrowUpRight, ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  gradient: string;
  display_order: number;
}

const INITIAL_PRODUCTS_COUNT = 6;

const Products = () => {
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setProducts(data);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, []);
  
  const visibleProducts = showAll ? products : products.slice(0, INITIAL_PRODUCTS_COUNT);
  const hasMoreProducts = products.length > INITIAL_PRODUCTS_COUNT;

  if (isLoading) {
    return (
      <section id="products" className="py-20 bg-secondary/20 relative overflow-hidden">
        <div className="container flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-20 bg-secondary/20 relative overflow-hidden">
      <div className="container relative">
        {/* Header */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14">
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
              Latest <span className="text-gradient">Works</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Discover our range of products designed to help businesses grow and succeed in the digital age.
            </p>
          </div>
          <button
            onClick={() => window.open('/projects', '_self')}
            className="inline-flex items-center gap-2 self-start md:self-auto px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            View All Works
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </AnimatedSection>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-base">Coming soon! We're working on exciting new products.</p>
          </div>
        ) : (
          <>
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {visibleProducts.map((product, index) => (
                  <motion.a
                    key={product.id}
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    className="group block"
                  >
                    <div className="bg-card rounded-[1.25rem] overflow-hidden border border-border/60 hover:border-accent/20 transition-all duration-400 h-full"
                      style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.04)' }}
                    >
                      <div className="h-44 relative overflow-hidden bg-secondary/30">
                        <iframe
                          src={product.link}
                          title={product.title}
                          className="w-full h-[400px] scale-[0.5] origin-top-left pointer-events-none"
                          style={{ width: '200%', height: '800px' }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                            {product.title}
                          </h3>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-all transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-muted-foreground mb-3 leading-relaxed text-[13px]">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {product.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2.5 py-0.5 text-[11px] font-medium bg-accent/8 text-accent rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMoreProducts && (
              <motion.div 
                className="flex justify-center mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  size="lg"
                  className="group px-7 py-5 text-sm font-semibold rounded-full border-2 border-accent/25 hover:border-accent hover:bg-accent/5 transition-all duration-300"
                >
                  <span className="mr-2">
                    {showAll ? "Show Less" : `Show More (${products.length - INITIAL_PRODUCTS_COUNT} more)`}
                  </span>
                  <motion.div
                    animate={{ rotate: showAll ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Products;
