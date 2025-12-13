import {
  Sparkles,
  Globe,
  Layers,
  BarChart3,
  Brain,
  Smartphone,
  Cloud,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";

const trainings = [
  {
    icon: Sparkles,
    title: "Generative AI",
    description:
      "Master the cutting-edge field of generative AI, including large language models and creative applications.",
    duration: "12 Weeks",
    level: "Advanced",
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Build responsive, dynamic websites with modern frameworks and tools for professional applications.",
    duration: "10 Weeks",
    level: "Beginner",
  },
  {
    icon: Layers,
    title: "MERN Stack",
    description:
      "Become proficient in MongoDB, Express.js, React.js, and Node.js for full-stack development.",
    duration: "14 Weeks",
    level: "Intermediate",
  },
  {
    icon: BarChart3,
    title: "Data Science",
    description:
      "Transform raw data into valuable insights through statistical analysis and predictive modeling.",
    duration: "12 Weeks",
    level: "Intermediate",
  },
  {
    icon: Brain,
    title: "AI/ML",
    description:
      "Develop expertise in artificial intelligence, machine learning algorithms, and neural networks.",
    duration: "16 Weeks",
    level: "Advanced",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Create native and cross-platform mobile applications using modern frameworks.",
    duration: "10 Weeks",
    level: "Intermediate",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description:
      "Gain hands-on experience with AWS, Azure, and cloud architecture best practices.",
    duration: "8 Weeks",
    level: "Intermediate",
  },
];

const Trainings = () => {
  const handleContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="trainings" className="py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container relative">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            Learn & Grow
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Professional Trainings
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upskill with industry-relevant training programs designed by experts
            to accelerate your career growth.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" staggerDelay={0.08}>
          {trainings.map((training, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-card rounded-2xl p-8 h-full border border-border hover:border-accent/30 transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0"
                  >
                    <training.icon className="h-7 w-7 text-primary-foreground" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                      {training.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {training.description}
                    </p>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
                        {training.duration}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                        {training.level}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.3} className="text-center">
          <Button
            size="lg"
            onClick={handleContact}
            className="bg-gradient-accent hover:opacity-90 transition-all group px-8 py-7"
          >
            Enquire About Training
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Trainings;
