import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ExternalLink, ArrowUpRight, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LatestWorks from "@/components/Products";

interface Product {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  gradient: string;
  display_order: number;
}

const INITIAL_PRODUCTS_COUNT = 4;

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

  return (
    <>
      <Helmet>
        <title>Our Products | Elite Forums</title>
        <meta
          name="description"
          content="Explore Elite Forums' innovative products and solutions designed to transform your business."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24">
          <section className="py-20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="container relative">
              <AnimatedSection className="text-center mb-16">
                <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  Our Products
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Innovative Solutions
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Discover our range of products designed to help businesses grow and succeed in the digital age.
                </p>
              </AnimatedSection>

              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No products available at the moment.</p>
                </div>
              ) : (
                <>
                  <motion.div layout className="grid md:grid-cols-2 gap-8">
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
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ y: -10 }}
                          className="group block"
                        >
                          <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-500 h-full hover:shadow-card-hover">
                            {/* Product Preview */}
                            <div className="h-56 relative overflow-hidden bg-muted">
                              <iframe
                                src={product.link}
                                title={product.title}
                                className="w-full h-[400px] scale-[0.5] origin-top-left pointer-events-none"
                                style={{ width: '200%', height: '800px' }}
                                loading="lazy"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-t ${product.gradient} opacity-20`} />

                              {/* Hover overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ExternalLink className="h-6 w-6 text-white" />
                                </div>
                              </div>
                            </div>

                            <div className="p-8">
                              <div className="flex items-start justify-between mb-4">
                                <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                                  {product.title}
                                </h3>
                                <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-all transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                              </div>
                              <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                                {product.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-4 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full border border-border hover:border-accent/30 transition-colors"
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

                  {/* Show More/Less Button */}
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
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Products;
