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
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Sophisticated mobile applications with intuitive interfaces for iOS and Android platforms.",
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
  },
  {
    icon: Bot,
    title: "AI Automation",
    description:
      "Advanced AI-driven solutions that streamline business processes and provide actionable insights.",
    bg: "bg-rose-50",
    iconBg: "bg-rose-500",
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Bespoke software solutions tailored to your unique business needs and requirements.",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-500",
  },
  {
    icon: Workflow,
    title: "Digital Transformation",
    description:
      "Modernize your business with comprehensive digital strategies and emerging technologies.",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-500",
  },
  {
    icon: MessageSquare,
    title: "Custom Chatbots",
    description:
      "Intelligent conversational interfaces that enhance customer engagement.",
    bg: "bg-pink-50",
    iconBg: "bg-pink-500",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description:
      "Expert cloud infrastructure setup, migration, and management for optimal scalability.",
    bg: "bg-sky-50",
    iconBg: "bg-sky-500",
  },
  {
    icon: TrendingUp,
    title: "SEO & Marketing",
    description:
      "Data-driven SEO and digital marketing strategies to grow your online visibility.",
    bg: "bg-amber-50",
    iconBg: "bg-amber-500",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      <div className="container relative">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive technology solutions designed to drive your business
            forward in the digital age.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" staggerDelay={0.08}>
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
                className={`group relative ${service.bg} rounded-3xl p-8 h-full border border-transparent hover:border-accent/20 transition-all duration-300 cursor-pointer hover:shadow-card-hover`}
              >
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all transform translate-y-2 group-hover:translate-y-0" />
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
