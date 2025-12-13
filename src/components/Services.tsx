import {
  Globe,
  Smartphone,
  Bot,
  Code2,
  Workflow,
  MessageSquare,
  Cloud,
  TrendingUp,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Premium responsive websites with cutting-edge technologies, optimized for performance and user experience across all devices.",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Sophisticated mobile applications with intuitive interfaces and smooth performance for iOS and Android platforms.",
  },
  {
    icon: Bot,
    title: "AI Automation",
    description:
      "Advanced AI-driven solutions that streamline business processes, analyze data, and provide actionable insights.",
  },
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Build bespoke software solutions tailored to your unique business needs, from enterprise applications to customer-facing platforms.",
  },
  {
    icon: Workflow,
    title: "Digital Transformation",
    description:
      "Modernize your business with comprehensive digital strategies that integrate emerging technologies to stay competitive.",
  },
  {
    icon: MessageSquare,
    title: "Custom Chatbots",
    description:
      "Intelligent conversational interfaces that enhance customer engagement and streamline communication processes.",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description:
      "Expert cloud infrastructure setup, migration, and management services for optimal performance and scalability.",
  },
  {
    icon: TrendingUp,
    title: "SEO & Marketing",
    description:
      "Data-driven SEO and digital marketing strategies to grow your online visibility and reach your target audience.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-24 bg-gradient-subtle">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive technology solutions designed to drive your business
            forward in the digital age.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-card-hover transition-all duration-300 group cursor-pointer border border-transparent hover:border-accent/20"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                <service.icon className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
