import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { ArrowRight, Clock, Globe, Users } from "lucide-react";

const ReplyBanner = () => {
  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-16 h-16 rounded-full border-2 border-accent/20 pointer-events-none" />
      <div className="absolute bottom-10 right-16 w-10 h-10 rounded-full bg-accent/10 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-3 h-3 rounded-full bg-accent/30 pointer-events-none" />
      <div className="absolute top-16 right-1/4 w-6 h-20 rounded-full bg-accent/10 rotate-45 pointer-events-none" />

      <div className="container relative">
        <AnimatedSection className="text-center max-w-3xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold mb-8"
          >
            <Clock className="h-4 w-4" />
            24 Hours Reply
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            We'll Reply in{" "}
            <span className="text-gradient">24 Hours</span>
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Get in touch and let's start building your future. Our team responds
            to every inquiry within one business day.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScroll("#services")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
            >
              <Globe className="h-4 w-4" />
              View Services
              <ArrowRight className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScroll("#contact")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-foreground/20 text-foreground font-semibold hover:bg-foreground hover:text-background transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                <Users className="h-3 w-3 text-accent" />
              </div>
              Request Meeting
            </motion.button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ReplyBanner;
