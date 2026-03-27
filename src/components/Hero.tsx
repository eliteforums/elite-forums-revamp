import { ArrowRight, CheckCircle, Globe, Users } from "lucide-react";
import { motion } from "framer-motion";

const capsules = [
  { label: "Web Development", color: "bg-purple-400", rotate: "-rotate-6", delay: 0.5 },
  { label: "AI Automation", color: "bg-rose-400", rotate: "rotate-3", delay: 0.6 },
  { label: "App Development", color: "bg-orange-400", rotate: "-rotate-3", delay: 0.7 },
  { label: "Digital Strategy", color: "bg-yellow-400", rotate: "rotate-6", delay: 0.8 },
];

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
              className="flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => handleScroll("#services")}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-7 py-3.5 rounded-full text-sm font-semibold transition-colors"
              >
                <Globe className="h-4 w-4" />
                View Services
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleScroll("#contact")}
                className="inline-flex items-center gap-2 border-2 border-foreground/20 text-foreground px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                  <Users className="h-3 w-3 text-accent" />
                </div>
                Request Meeting
              </button>
            </motion.div>
          </div>

          {/* Right - Capsule Shapes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden lg:flex items-end justify-center relative h-[480px]"
          >
            <div className="flex items-end gap-4">
              {capsules.map((capsule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: capsule.delay }}
                  className={`relative ${capsule.rotate} hover:rotate-0 transition-transform duration-500`}
                  style={{ height: index % 2 === 0 ? "320px" : "280px" }}
                >
                  <div
                    className={`${capsule.color} rounded-full w-[80px] h-full flex items-center justify-center relative overflow-hidden shadow-lg`}
                  >
                    {/* Decorative circles */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/20" />
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white/15" />
                    
                    {/* Vertical text */}
                    <span
                      className="text-white font-semibold text-sm tracking-wider whitespace-nowrap"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      {capsule.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 right-4 bg-card rounded-2xl px-5 py-3 shadow-lg border border-border"
            >
              <div className="text-xl font-bold text-foreground">50+</div>
              <div className="text-xs text-muted-foreground">Projects</div>
            </motion.div>

            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-16 left-0 bg-card rounded-2xl px-5 py-3 shadow-lg border border-border"
            >
              <div className="text-xl font-bold text-accent">100+</div>
              <div className="text-xs text-muted-foreground">Clients</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
