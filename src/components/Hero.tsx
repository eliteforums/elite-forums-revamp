import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ParticleBackground from "./ParticleBackground";
import CountUp from "./CountUp";

const Hero = () => {
  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center relative overflow-hidden pt-24 pb-12"
    >
      <ParticleBackground />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Text Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Digital Solutions</span>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] mb-8 tracking-tight"
            >
              Empowering Your{" "}
              <span className="text-gradient">Digital Strategy</span>{" "}
              for Growth
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Transform your business with cutting-edge artificial intelligence,
              machine learning, and digital transformation strategies designed
              for the future.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Button
                size="lg"
                onClick={() => handleScroll("#contact")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all text-base px-8 py-7 rounded-full group"
              >
                <span className="flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handleScroll("#services")}
                className="text-base px-8 py-7 rounded-full border-2 border-border hover:border-accent/40 hover:bg-accent/5"
              >
                Explore Services
              </Button>
            </motion.div>
          </div>

          {/* Right - Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-full aspect-square max-w-lg">
              {/* Decorative circles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-accent/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border-2 border-dashed border-accent/15"
              />
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-accent mb-2">
                    <CountUp end={50} suffix="+" />
                  </div>
                  <div className="text-muted-foreground text-lg font-medium">Projects<br/>Delivered</div>
                </div>
              </div>
              {/* Floating cards */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-0 bg-card rounded-2xl p-4 shadow-lg border border-border"
              >
                <div className="text-2xl font-bold text-foreground"><CountUp end={100} suffix="+" /></div>
                <div className="text-sm text-muted-foreground">Clients Trained</div>
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-12 left-0 bg-card rounded-2xl p-4 shadow-lg border border-border"
              >
                <div className="text-2xl font-bold text-foreground"><CountUp end={8} suffix="+" /></div>
                <div className="text-sm text-muted-foreground">Core Services</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Mobile stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 lg:hidden"
        >
          {[
            { value: 50, suffix: "+", label: "Projects Delivered" },
            { value: 100, suffix: "+", label: "Clients Trained" },
            { value: 8, suffix: "+", label: "Core Services" },
            { value: 7, suffix: "+", label: "Training Programs" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-5 rounded-2xl bg-card border border-border"
            >
              <div className="text-3xl font-bold text-foreground mb-1">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
