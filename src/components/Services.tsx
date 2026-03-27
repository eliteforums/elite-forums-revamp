import {
  Globe,
  Smartphone,
  Bot,
  Code2,
  Workflow,
  MessageSquare,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Premium responsive websites with cutting-edge technologies, optimized for performance and user experience.",
    iconBg: "bg-accent",
    illustrationBg: "from-orange-100 via-amber-50 to-orange-100",
    shapes: [
      { cls: "absolute top-4 left-4 w-16 h-16 rounded-[18px] bg-orange-300/30 rotate-12" },
      { cls: "absolute bottom-5 right-4 w-12 h-12 rounded-full bg-amber-200/40" },
      { cls: "absolute top-1/2 left-1/3 w-20 h-8 rounded-full bg-orange-200/30 -rotate-12" },
    ],
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Sophisticated mobile applications with intuitive interfaces for iOS and Android platforms.",
    iconBg: "bg-purple-500",
    illustrationBg: "from-purple-100 via-indigo-50 to-purple-100",
    shapes: [
      { cls: "absolute top-5 right-5 w-14 h-14 rounded-2xl bg-purple-300/30 -rotate-6" },
      { cls: "absolute bottom-4 left-5 w-10 h-10 rounded-full bg-indigo-200/40" },
      { cls: "absolute top-1/3 left-1/4 w-16 h-6 rounded-full bg-purple-200/30 rotate-6" },
    ],
  },
  {
    icon: Bot,
    title: "AI Automation",
    description:
      "Advanced AI-driven solutions that streamline business processes and provide actionable insights.",
    iconBg: "bg-rose-500",
    illustrationBg: "from-rose-100 via-pink-50 to-rose-100",
    shapes: [
      { cls: "absolute top-4 left-6 w-14 h-14 rounded-2xl bg-rose-300/30 rotate-12" },
      { cls: "absolute bottom-6 right-6 w-8 h-8 rounded-full bg-pink-200/40" },
      { cls: "absolute top-1/2 right-1/4 w-12 h-12 rounded-[16px] bg-rose-200/30 -rotate-6" },
    ],
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Bespoke software solutions tailored to your unique business needs and requirements.",
    iconBg: "bg-emerald-500",
    illustrationBg: "from-emerald-100 via-teal-50 to-emerald-100",
    shapes: [
      { cls: "absolute top-5 left-5 w-12 h-12 rounded-full bg-emerald-300/30" },
      { cls: "absolute bottom-4 right-4 w-14 h-14 rounded-2xl bg-teal-200/40 rotate-6" },
      { cls: "absolute top-1/3 right-1/3 w-8 h-16 rounded-full bg-emerald-200/30 -rotate-12" },
    ],
  },
  {
    icon: Workflow,
    title: "Digital Transformation",
    description:
      "Modernize your business with comprehensive digital strategies and emerging technologies.",
    iconBg: "bg-indigo-500",
    illustrationBg: "from-indigo-100 via-blue-50 to-indigo-100",
    shapes: [
      { cls: "absolute top-4 right-4 w-16 h-10 rounded-2xl bg-indigo-300/30 rotate-3" },
      { cls: "absolute bottom-5 left-6 w-10 h-10 rounded-full bg-blue-200/40" },
      { cls: "absolute top-1/2 left-1/2 w-12 h-12 rounded-2xl bg-indigo-200/30 -rotate-6" },
    ],
  },
  {
    icon: MessageSquare,
    title: "Custom Chatbots",
    description:
      "Intelligent conversational interfaces that enhance customer engagement.",
    iconBg: "bg-pink-500",
    illustrationBg: "from-pink-100 via-rose-50 to-pink-100",
    shapes: [
      { cls: "absolute top-5 left-4 w-13 h-13 rounded-[16px] bg-pink-300/30 -rotate-6" },
      { cls: "absolute bottom-4 right-5 w-11 h-11 rounded-full bg-rose-200/40" },
      { cls: "absolute top-1/3 right-1/4 w-16 h-7 rounded-full bg-pink-200/30 rotate-12" },
    ],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-background relative overflow-hidden">
      <div className="container relative">
        {/* Header row */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14">
          <div className="max-w-lg">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
              Do You Need Help<br />With<span className="text-accent"> ?</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Comprehensive technology solutions designed to drive your business
              forward in the digital age.
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 self-start md:self-auto px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            View Works
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" staggerDelay={0.08}>
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group relative bg-card rounded-[1.25rem] overflow-hidden border border-border/60 hover:border-accent/20 transition-all duration-300 cursor-pointer h-full"
                style={{ boxShadow: '0 2px 12px -4px rgba(0,0,0,0.04)' }}
              >
                {/* Illustrated header */}
                <div className={`h-40 bg-gradient-to-br ${service.illustrationBg} relative overflow-hidden flex items-center justify-center`}>
                  {service.shapes.map((shape, i) => (
                    <div key={i} className={shape.cls} />
                  ))}
                  <div className={`w-13 h-13 rounded-xl ${service.iconBg} flex items-center justify-center relative z-10`} style={{ width: '52px', height: '52px', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.12)' }}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all transform translate-y-1 group-hover:translate-y-0 flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[13px]">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Services;
