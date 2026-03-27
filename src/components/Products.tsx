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
      <section id="products" className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="container flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container relative">
        {/* Header: title left, button right */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Latest <span className="text-gradient">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Discover our range of products designed to help businesses grow and succeed in the digital age.
            </p>
          </div>
          <button
            onClick={() => window.open('/projects', '_self')}
            className="inline-flex items-center gap-2 self-start md:self-auto px-7 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            View All Works
            <ArrowRight className="h-4 w-4" />
          </button>
        </AnimatedSection>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Coming soon! We're working on exciting new products.</p>
          </div>
        ) : (
          <>
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ y: -8 }}
                    className="group block"
                  >
                    <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-500 h-full hover:shadow-card-hover">
                      <div className="h-48 relative overflow-hidden bg-secondary/30">
                        <iframe
                          src={product.link}
                          title={product.title}
                          className="w-full h-[400px] scale-[0.5] origin-top-left pointer-events-none"
                          style={{ width: '200%', height: '800px' }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                            {product.title}
                          </h3>
                          <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-all transform group-hover:-translate-y-1 group-hover:translate-x-1 flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full"
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
                className="flex justify-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  size="lg"
                  className="group px-8 py-6 text-lg font-semibold rounded-full border-2 border-accent/30 hover:border-accent hover:bg-accent/10 transition-all duration-300"
                >
                  <span className="mr-2">
                    {showAll ? "Show Less" : `Show More (${products.length - INITIAL_PRODUCTS_COUNT} more)`}
                  </span>
                  <motion.div
                    animate={{ rotate: showAll ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5" />
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
