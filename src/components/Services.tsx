import {
  Globe,
  Smartphone,
  Bot,
  Code2,
  Workflow,
  MessageSquare,
  Cloud,
  TrendingUp,
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
    bg: "bg-orange-50",
    iconBg: "bg-accent",
    illustrationBg: "from-orange-200 to-amber-100",
    shapes: [
      "absolute top-3 left-3 w-20 h-20 rounded-[20px] bg-orange-300/40 rotate-12",
      "absolute bottom-4 right-3 w-14 h-14 rounded-full bg-amber-300/30",
      "absolute top-1/2 left-1/3 w-24 h-12 rounded-full bg-orange-200/40 -rotate-12",
    ],
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Sophisticated mobile applications with intuitive interfaces for iOS and Android platforms.",
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    illustrationBg: "from-purple-200 to-indigo-100",
    shapes: [
      "absolute top-4 right-4 w-16 h-16 rounded-2xl bg-purple-300/40 -rotate-6",
      "absolute bottom-3 left-4 w-12 h-12 rounded-full bg-indigo-300/30",
      "absolute top-1/3 left-1/4 w-20 h-8 rounded-full bg-purple-200/40 rotate-6",
    ],
  },
  {
    icon: Bot,
    title: "AI Automation",
    description:
      "Advanced AI-driven solutions that streamline business processes and provide actionable insights.",
    bg: "bg-rose-50",
    iconBg: "bg-rose-500",
    illustrationBg: "from-rose-200 to-pink-100",
    shapes: [
      "absolute top-3 left-6 w-18 h-18 rounded-3xl bg-rose-300/40 rotate-12",
      "absolute bottom-5 right-5 w-10 h-10 rounded-full bg-pink-300/30",
      "absolute top-1/2 right-1/4 w-16 h-16 rounded-[20px] bg-rose-200/40 -rotate-6",
    ],
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Bespoke software solutions tailored to your unique business needs and requirements.",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    illustrationBg: "from-emerald-200 to-teal-100",
    shapes: [
      "absolute top-4 left-4 w-14 h-14 rounded-full bg-emerald-300/40",
      "absolute bottom-3 right-3 w-18 h-18 rounded-2xl bg-teal-300/30 rotate-6",
      "absolute top-1/3 right-1/3 w-10 h-20 rounded-full bg-emerald-200/40 -rotate-12",
    ],
  },
  {
    icon: Workflow,
    title: "Digital Transformation",
    description:
      "Modernize your business with comprehensive digital strategies and emerging technologies.",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-500",
    illustrationBg: "from-indigo-200 to-blue-100",
    shapes: [
      "absolute top-3 right-3 w-20 h-12 rounded-2xl bg-indigo-300/40 rotate-3",
      "absolute bottom-4 left-5 w-12 h-12 rounded-full bg-blue-300/30",
      "absolute top-1/2 left-1/2 w-16 h-16 rounded-3xl bg-indigo-200/40 -rotate-6",
    ],
  },
  {
    icon: MessageSquare,
    title: "Custom Chatbots",
    description:
      "Intelligent conversational interfaces that enhance customer engagement.",
    bg: "bg-pink-50",
    iconBg: "bg-pink-500",
    illustrationBg: "from-pink-200 to-rose-100",
    shapes: [
      "absolute top-4 left-3 w-16 h-16 rounded-[20px] bg-pink-300/40 -rotate-6",
      "absolute bottom-3 right-4 w-14 h-14 rounded-full bg-rose-300/30",
      "absolute top-1/3 right-1/4 w-20 h-10 rounded-full bg-pink-200/40 rotate-12",
    ],
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      <div className="container relative">
        {/* Header row */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Do You Need Help<br />With<span className="text-accent"> ?</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Comprehensive technology solutions designed to drive your business
              forward in the digital age.
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('products');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 self-start md:self-auto px-7 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
          >
            View Works
            <ArrowRight className="h-4 w-4" />
          </button>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="group relative bg-card rounded-3xl overflow-hidden border border-border hover:border-accent/20 transition-all duration-300 cursor-pointer hover:shadow-card-hover h-full"
              >
                {/* Illustrated header with abstract art shapes */}
                <div className={`h-44 bg-gradient-to-br ${service.illustrationBg} relative overflow-hidden flex items-center justify-center`}>
                  {service.shapes.map((shape, i) => (
                    <div key={i} className={shape} />
                  ))}
                  <div className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center relative z-10 shadow-lg`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all transform translate-y-1 group-hover:translate-y-0 flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-sm">
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
