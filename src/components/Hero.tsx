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
      className="min-h-[92vh] flex items-center relative overflow-hidden pt-24 pb-12 bg-background"
    >
      {/* Subtle background grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
        backgroundSize: '32px 32px'
      }} />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-6 items-center">
          {/* Left - Text Content */}
          <div className="max-w-[580px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-6 tracking-wide"
            >
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span>100% TRUSTED PLATFORM</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem] xl:text-[4.25rem] font-bold text-foreground leading-[1.08] mb-6 tracking-tight"
            >
              Your Business 🌿 Our{" "}
              <span className="text-gradient">Digital Strategy</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-muted-foreground max-w-[480px] mb-8 leading-relaxed"
            >
              Transform your business with cutting-edge artificial intelligence,
              machine learning, and digital transformation strategies designed
              for the future.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => handleScroll("#services")}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground pl-5 pr-4 py-3 rounded-full text-sm font-semibold transition-colors"
              >
                <Globe className="h-4 w-4" />
                View Services
                <span className="ml-1 w-7 h-7 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
              <button
                onClick={() => handleScroll("#contact")}
                className="inline-flex items-center gap-2.5 border-2 border-foreground/15 text-foreground pl-3 pr-5 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 text-accent" />
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
            className="hidden lg:flex items-end justify-center relative h-[440px]"
          >
            <div className="flex items-end gap-3">
              {capsules.map((capsule, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: capsule.delay }}
                  className={`relative ${capsule.rotate} hover:rotate-0 transition-transform duration-500 cursor-pointer`}
                  style={{ height: index % 2 === 0 ? "300px" : "260px" }}
                >
                  <div
                    className={`${capsule.color} rounded-full w-[72px] h-full flex items-center justify-center relative overflow-hidden`}
                    style={{ boxShadow: '0 8px 30px -8px rgba(0,0,0,0.15)' }}
                  >
                    {/* Decorative circles */}
                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white/20" />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white/15" />
                    
                    {/* Vertical text */}
                    <span
                      className="text-white font-semibold text-xs tracking-widest whitespace-nowrap uppercase"
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
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-6 right-2 bg-card rounded-2xl px-4 py-2.5 border border-border"
              style={{ boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)' }}
            >
              <div className="text-lg font-bold text-foreground">50+</div>
              <div className="text-[11px] text-muted-foreground">Projects</div>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 left-0 bg-card rounded-2xl px-4 py-2.5 border border-border"
              style={{ boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)' }}
            >
              <div className="text-lg font-bold text-accent">100+</div>
              <div className="text-[11px] text-muted-foreground">Clients</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
