import { useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { ArrowRight, Clock, Globe, Users } from "lucide-react";
import BookingModal from "./BookingModal";

const ReplyBanner = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-secondary/20 relative overflow-hidden">
      {/* Decorative elements matching reference */}
      <div className="absolute top-8 left-8 w-14 h-14 rounded-full border-2 border-accent/15 pointer-events-none" />
      <div className="absolute bottom-8 right-14 w-8 h-8 rounded-full bg-accent/8 pointer-events-none" />
      <div className="absolute top-1/2 right-8 w-2.5 h-2.5 rounded-full bg-accent/25 pointer-events-none" />
      <div className="absolute top-14 right-1/4 w-5 h-16 rounded-full bg-accent/8 rotate-45 pointer-events-none" />
      <div className="absolute bottom-1/3 left-16 w-3 h-3 rounded-full bg-accent/20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-foreground/10 pointer-events-none" />

      <div className="container relative">
        <AnimatedSection className="text-center max-w-2xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold mb-6 tracking-wide"
          >
            <Clock className="h-3.5 w-3.5" />
            24 Hours Reply
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
            We'll Reply in{" "}
            <span className="text-gradient">24 Hours</span>
          </h2>

          <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Get in touch and let's start building your future. Our team responds
            to every inquiry within one business day.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleScroll("#services")}
              className="inline-flex items-center gap-2 pl-5 pr-4 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              View Services
              <span className="ml-1 w-6 h-6 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                <ArrowRight className="h-3 w-3" />
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleScroll("#contact")}
              className="inline-flex items-center gap-2.5 pl-3 pr-5 py-2.5 rounded-full border-2 border-foreground/15 text-foreground text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
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
