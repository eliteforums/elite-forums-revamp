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
    illustrationBg: "from-orange-100 to-orange-50",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Sophisticated mobile applications with intuitive interfaces for iOS and Android platforms.",
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    illustrationBg: "from-purple-100 to-purple-50",
  },
  {
    icon: Bot,
    title: "AI Automation",
    description:
      "Advanced AI-driven solutions that streamline business processes and provide actionable insights.",
    bg: "bg-rose-50",
    iconBg: "bg-rose-500",
    illustrationBg: "from-rose-100 to-rose-50",
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Bespoke software solutions tailored to your unique business needs and requirements.",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-500",
    illustrationBg: "from-emerald-100 to-emerald-50",
  },
  {
    icon: Workflow,
    title: "Digital Transformation",
    description:
      "Modernize your business with comprehensive digital strategies and emerging technologies.",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-500",
    illustrationBg: "from-indigo-100 to-indigo-50",
  },
  {
    icon: MessageSquare,
    title: "Custom Chatbots",
    description:
      "Intelligent conversational interfaces that enhance customer engagement.",
    bg: "bg-pink-50",
    iconBg: "bg-pink-500",
    illustrationBg: "from-pink-100 to-pink-50",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description:
      "Expert cloud infrastructure setup, migration, and management for optimal scalability.",
    bg: "bg-sky-50",
    iconBg: "bg-sky-500",
    illustrationBg: "from-sky-100 to-sky-50",
  },
  {
    icon: TrendingUp,
    title: "SEO & Marketing",
    description:
      "Data-driven SEO and digital marketing strategies to grow your online visibility.",
    bg: "bg-amber-50",
    iconBg: "bg-amber-500",
    illustrationBg: "from-amber-100 to-amber-50",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      <div className="container relative">
        {/* Header row: title left, button right */}
        <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Need Help With<span className="text-accent"> ?</span>
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
                {/* Illustration header */}
                <div className={`h-40 bg-gradient-to-br ${service.illustrationBg} flex items-center justify-center relative overflow-hidden`}>
                  {/* Decorative shapes */}
                  <div className="absolute inset-0">
                    <div className="absolute top-4 left-4 w-16 h-16 rounded-2xl bg-white/40 rotate-12" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white/30" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-3xl bg-white/20 -rotate-6" />
                  </div>
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
