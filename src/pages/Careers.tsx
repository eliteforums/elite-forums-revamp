import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Career {
  id: string;
  title: string;
  department: string | null;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  is_active: boolean;
  display_order: number;
}

const CareersPage = () => {
  const { data: careers, isLoading } = useQuery({
    queryKey: ["careers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("careers")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Career[];
    },
  });

  return (
    <>
      <Helmet>
        <title>Careers | Elite Forums</title>
        <meta
          name="description"
          content="Join Elite Forums and build the future of technology. Explore career opportunities in web development, AI, cloud computing, and more."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Join Our{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Growing Team
                </span>
              </h1>
              <p className="text-lg text-muted-foreground">
                We're looking for passionate individuals who want to make an impact.
                Explore our open positions and find your next opportunity.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Careers List */}
        <section className="py-16">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : careers?.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h2 className="text-2xl font-semibold mb-2">No Open Positions</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We don't have any open positions at the moment. Check back later or
                  send your resume to{" "}
                  <a
                    href="mailto:careers@eliteforums.in"
                    className="text-primary hover:underline"
                  >
                    careers@eliteforums.in
                  </a>
                </p>
              </motion.div>
            ) : (
              <div className="grid gap-6 max-w-4xl mx-auto">
                {careers?.map((career, index) => (
                  <motion.div
                    key={career.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                            {career.title}
                          </h3>
                          {career.department && (
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {career.department}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {career.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {career.type}
                          </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2">
                          {career.description}
                        </p>
                        {career.requirements?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {career.requirements.slice(0, 3).map((req, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                              >
                                {req}
                              </span>
                            ))}
                            {career.requirements.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{career.requirements.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        asChild
                        className="group/btn"
                      >
                        <a href={`mailto:careers@eliteforums.in?subject=Application for ${career.title}`}>
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Don't See the Right Role?
              </h2>
              <p className="text-muted-foreground mb-6">
                We're always looking for talented individuals. Send us your resume and
                we'll keep you in mind for future opportunities.
              </p>
              <Button asChild size="lg">
                <a href="mailto:careers@eliteforums.in">
                  Send Your Resume
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CareersPage;
