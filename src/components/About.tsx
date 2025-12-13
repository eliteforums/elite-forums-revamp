import { Quote, Users, Target, Lightbulb, Award } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedCard, StaggerContainer, StaggerItem } from "./AnimatedSection";

const teamQuotes = [
  {
    quote: "Innovation isn't just about creating something new; it's about solving real problems in ways that were previously unimaginable.",
    name: "Harsh Tambade",
    role: "CEO",
  },
  {
    quote: "The most successful tech projects aren't just about code—they're about understanding human needs.",
    name: "Suchita Nigam",
    role: "Project Manager",
  },
  {
    quote: "Technology at its best doesn't replace human potential—it amplifies it.",
    name: "Siddhant Mandlik",
    role: "COO",
  },
  {
    quote: "Every line of code we write represents an opportunity to make someone's life better.",
    name: "Raj Dabholkar",
    role: "Tech Lead",
  },
];

const values = [
  {
    icon: Target,
    title: "Mission Driven",
    description: "Focused on delivering measurable impact for every client we serve.",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "Constantly exploring new technologies to solve complex challenges.",
  },
  {
    icon: Users,
    title: "Client Centric",
    description: "Your success is our priority. We build partnerships, not just products.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to the highest standards in everything we deliver.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container relative">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8">
            Who We Are
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Elite Forums is a forward-thinking technology company dedicated to
            empowering businesses through innovative digital solutions. We
            combine expertise in AI, software development, and digital
            transformation to deliver measurable results for our clients.
          </p>
        </AnimatedSection>

        {/* Values Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {values.map((value, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-card rounded-2xl p-8 border border-border hover:border-accent/30 transition-all h-full group"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Team Quotes */}
        <AnimatedSection delay={0.2}>
          <h3 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            What Our Team Says
          </h3>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 gap-6">
          {teamQuotes.map((item, index) => (
            <AnimatedCard key={index} index={index}>
              <div className="bg-secondary/50 backdrop-blur-sm rounded-2xl p-8 relative group hover:shadow-card transition-all duration-300 h-full border border-border/50 hover:border-accent/20">
                <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/10 group-hover:text-accent/30 transition-colors" />
                <p className="text-foreground/80 mb-8 leading-relaxed text-lg italic">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg"
                  >
                    {item.name.charAt(0)}
                  </motion.div>
                  <div>
                    <div className="font-semibold text-foreground text-lg">
                      {item.name}
                    </div>
                    <div className="text-sm text-accent">
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
