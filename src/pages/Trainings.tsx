import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Sparkles,
  Globe,
  Layers,
  BarChart3,
  Brain,
  Smartphone,
  Cloud,
  ArrowRight,
  Users,
  Award,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import { Link } from "react-router-dom";

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

const stats = [
  { icon: Users, value: 3500, suffix: "+", label: "Clients Trained" },
  { icon: BookOpen, value: 50, suffix: "+", label: "Courses Offered" },
  { icon: GraduationCap, value: 95, suffix: "%", label: "Success Rate" },
  { icon: Award, value: 15, suffix: "+", label: "Industry Partners" },
];

const TrainingsPage = () => {
  return (
    <>
      <Helmet>
        <title>Professional Training Programs | Elite Forums Campus</title>
        <meta
          name="description"
          content="Join 3500+ professionals trained at Elite Forums. Expert-led courses in AI, Web Development, MERN Stack, Data Science, and Cloud Computing."
        />
        <meta
          name="keywords"
          content="Elite Forums training, AI courses Mumbai, web development course, MERN stack training, data science course, cloud computing certification"
        />
        <link rel="canonical" href="https://eliteforums.in/trainings" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="pt-32 pb-20 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="container relative">
              <AnimatedSection className="text-center max-w-4xl mx-auto">
                <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  Elite Forums Campus
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Transform Your Career with <span className="text-accent">Expert Training</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                  Join thousands of professionals who have accelerated their careers through our
                  industry-relevant training programs designed by experts.
                </p>
                <Link to="/#contact">
                  <Button
                    size="lg"
                    className="bg-gradient-primary hover:opacity-90 transition-all group px-8 py-7"
                  >
                    Start Learning Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </AnimatedSection>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-primary text-primary-foreground">
            <div className="container">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-primary-foreground/70">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Courses Section */}
          <section className="py-32 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="container relative">
              <AnimatedSection className="text-center mb-16">
                <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  Our Courses
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Industry-Ready Programs
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Choose from our comprehensive range of courses designed to meet
                  industry demands and accelerate your career growth.
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
                <Link to="/#contact">
                  <Button
                    size="lg"
                    className="bg-gradient-accent hover:opacity-90 transition-all group px-8 py-7"
                  >
                    Enquire About Training
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </AnimatedSection>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="py-24 bg-secondary/30">
            <div className="container">
              <AnimatedSection className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Train with Elite Forums?
                </h2>
              </AnimatedSection>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Expert Instructors",
                    description: "Learn from industry professionals with years of real-world experience.",
                  },
                  {
                    title: "Hands-on Projects",
                    description: "Build a portfolio with practical projects that showcase your skills.",
                  },
                  {
                    title: "Career Support",
                    description: "Get placement assistance and career guidance throughout your journey.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-2xl p-8 border border-border text-center"
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TrainingsPage;
