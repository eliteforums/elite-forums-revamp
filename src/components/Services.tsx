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
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Sophisticated mobile applications with intuitive interfaces for iOS and Android platforms.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Bot,
    title: "AI Automation",
    description:
      "Advanced AI-driven solutions that streamline business processes and provide actionable insights.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Bespoke software solutions tailored to your unique business needs and requirements.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Workflow,
    title: "Digital Transformation",
    description:
      "Modernize your business with comprehensive digital strategies and emerging technologies.",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: MessageSquare,
    title: "Custom Chatbots",
    description:
      "Intelligent conversational interfaces that enhance customer engagement.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description:
      "Expert cloud infrastructure setup, migration, and management for optimal scalability.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: TrendingUp,
    title: "SEO & Marketing",
    description:
      "Data-driven SEO and digital marketing strategies to grow your online visibility.",
    color: "from-amber-500 to-orange-500",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container relative">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our Services
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive technology solutions designed to drive your business
            forward in the digital age.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.08}>
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-card rounded-2xl p-8 h-full border border-border hover:border-accent/30 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all transform translate-y-2 group-hover:translate-y-0" />
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
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
