import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

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
      className="min-h-screen flex items-center relative overflow-hidden pt-28 pb-16 bg-background"
    >
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left - Text Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium mb-8"
            >
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span>100% TRUSTED PLATFORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] mb-8 tracking-tight"
            >
              Your Business 🌿 Our{" "}
              <span className="text-gradient">Digital Strategy</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
            >
              Transform your business with cutting-edge artificial intelligence,
              machine learning, and digital transformation strategies designed
              for the future.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={() => handleScroll("#products")}
                className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full text-base font-semibold hover:bg-foreground/90 transition-colors group"
              >
                Works
                <span className="w-10 h-10 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="h-5 w-5 text-accent-foreground" />
                </span>
              </button>
            </motion.div>
          </div>

          {/* Right - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="w-[300px] h-[600px] bg-foreground rounded-[3rem] p-3 shadow-2xl relative">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-foreground rounded-b-2xl z-20" />
                {/* Screen */}
                <div className="w-full h-full bg-background rounded-[2.4rem] overflow-hidden relative">
                  {/* Screen content */}
                  <div className="p-6 pt-12 h-full flex flex-col">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-8 h-8 rounded-full bg-accent/20" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-foreground/30" />
                        <div className="w-2 h-2 rounded-full bg-foreground/30" />
                        <div className="w-2 h-2 rounded-full bg-foreground/30" />
                      </div>
                    </div>
                    
                    {/* Card */}
                    <div className="bg-accent/10 rounded-3xl p-6 mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-accent mb-4 flex items-center justify-center">
                        <span className="text-accent-foreground font-bold text-xl">EF</span>
                      </div>
                      <h3 className="text-foreground font-bold text-xl mb-1">UI UX Design</h3>
                      <p className="text-muted-foreground text-sm">Premium digital experiences</p>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-secondary/60 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">50+</div>
                        <div className="text-xs text-muted-foreground">Projects</div>
                      </div>
                      <div className="bg-secondary/60 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-bold text-foreground">100+</div>
                        <div className="text-xs text-muted-foreground">Clients</div>
                      </div>
                    </div>

                    {/* Bottom button */}
                    <div className="mt-auto">
                      <div className="bg-accent rounded-2xl p-4 text-center">
                        <span className="text-accent-foreground font-semibold">Get Started</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements around phone */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-12 bg-card rounded-2xl p-4 shadow-lg border border-border"
              >
                <div className="text-2xl font-bold text-foreground">8+</div>
                <div className="text-sm text-muted-foreground">Services</div>
              </motion.div>

              <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-16 bg-card rounded-2xl p-4 shadow-lg border border-border"
              >
                <div className="text-2xl font-bold text-accent">7+</div>
                <div className="text-sm text-muted-foreground">Training Programs</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
