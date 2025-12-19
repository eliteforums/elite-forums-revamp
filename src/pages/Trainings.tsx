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
  CheckCircle,
  Play,
  Clock,
  TrendingUp,
  Building2,
  Briefcase,
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
    modules: 24,
    color: "from-purple-600 to-pink-600",
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Build responsive, dynamic websites with modern frameworks and tools for professional applications.",
    duration: "10 Weeks",
    level: "Beginner",
    modules: 18,
    color: "from-blue-600 to-cyan-600",
  },
  {
    icon: Layers,
    title: "MERN Stack",
    description:
      "Become proficient in MongoDB, Express.js, React.js, and Node.js for full-stack development.",
    duration: "14 Weeks",
    level: "Intermediate",
    modules: 32,
    color: "from-green-600 to-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Data Science",
    description:
      "Transform raw data into valuable insights through statistical analysis and predictive modeling.",
    duration: "12 Weeks",
    level: "Intermediate",
    modules: 26,
    color: "from-orange-600 to-amber-600",
  },
  {
    icon: Brain,
    title: "AI/ML",
    description:
      "Develop expertise in artificial intelligence, machine learning algorithms, and neural networks.",
    duration: "16 Weeks",
    level: "Advanced",
    modules: 36,
    color: "from-indigo-600 to-violet-600",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Create native and cross-platform mobile applications using modern frameworks.",
    duration: "10 Weeks",
    level: "Intermediate",
    modules: 20,
    color: "from-rose-600 to-red-600",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description:
      "Gain hands-on experience with AWS, Azure, and cloud architecture best practices.",
    duration: "8 Weeks",
    level: "Intermediate",
    modules: 16,
    color: "from-sky-600 to-blue-600",
  },
];

const stats = [
  { icon: Users, value: 3500, suffix: "+", label: "Professionals Trained" },
  { icon: Building2, value: 50, suffix: "+", label: "Corporate Partners" },
  { icon: GraduationCap, value: 95, suffix: "%", label: "Placement Rate" },
  { icon: Award, value: 15, suffix: "+", label: "Industry Certifications" },
];

const features = [
  {
    icon: Briefcase,
    title: "Corporate Training Solutions",
    description: "Customized training programs tailored for enterprise teams with flexible scheduling and dedicated support.",
  },
  {
    icon: TrendingUp,
    title: "Career Advancement Track",
    description: "Structured learning paths designed to accelerate your professional growth and industry readiness.",
  },
  {
    icon: BookOpen,
    title: "Industry-Aligned Curriculum",
    description: "Courses developed in partnership with leading tech companies to meet current market demands.",
  },
  {
    icon: Users,
    title: "Expert-Led Sessions",
    description: "Learn from industry veterans with 10+ years of experience in top multinational corporations.",
  },
];

const benefits = [
  "Live interactive sessions with industry experts",
  "Real-world project-based learning",
  "1-on-1 mentorship and doubt resolution",
  "Lifetime access to course materials",
  "Industry-recognized certification",
  "100% placement assistance",
  "Flexible batch timings",
  "Corporate tie-ups for internships",
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

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Hero Section - Corporate Style */}
          <section className="pt-32 pb-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
            
            <div className="container relative">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <AnimatedSection>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8">
                    <GraduationCap className="h-4 w-4" />
                    Elite Forums Campus
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                    Upskill Your <br />
                    <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                      Workforce Today
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                    Enterprise-grade training programs designed to transform professionals 
                    into industry-ready experts with cutting-edge skills.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/#contact">
                      <Button
                        size="lg"
                        className="bg-gradient-primary hover:opacity-90 transition-all group px-8 py-7 text-lg"
                      >
                        Explore Programs
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-7 text-lg border-2 border-accent/30 hover:border-accent hover:bg-accent/5"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Demo
                    </Button>
                  </div>
                </AnimatedSection>

                {/* Stats Cards - Corporate Style */}
                <AnimatedSection delay={0.2} className="hidden lg:block">
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border hover:border-accent/30 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                          <stat.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-1">
                          <CountUp end={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-muted-foreground text-sm">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>

          {/* Features Section - EdTech Style */}
          <section className="py-20 bg-secondary/30 relative">
            <div className="container">
              <AnimatedSection className="text-center mb-16">
                <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  Why Choose Us
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Enterprise Learning Solutions
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Designed for ambitious professionals and forward-thinking organizations
                </p>
              </AnimatedSection>

              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
                {features.map((feature, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="bg-card rounded-2xl p-8 h-full border border-border hover:border-accent/30 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-gradient-primary transition-all">
                        <feature.icon className="h-7 w-7 text-accent group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* Courses Section - Professional Grid */}
          <section className="py-24 bg-background relative overflow-hidden">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
            
            <div className="container relative">
              <AnimatedSection className="text-center mb-16">
                <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                  Our Curriculum
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Industry-Ready Programs
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Comprehensive courses designed in collaboration with industry leaders
                </p>
              </AnimatedSection>

              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" staggerDelay={0.08}>
                {trainings.map((training, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="group relative bg-card rounded-2xl overflow-hidden h-full border border-border hover:border-accent/30 transition-all"
                    >
                      {/* Gradient Header */}
                      <div className={`h-2 bg-gradient-to-r ${training.color}`} />
                      
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                          <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            className={`w-14 h-14 rounded-xl bg-gradient-to-r ${training.color} flex items-center justify-center`}
                          >
                            <training.icon className="h-7 w-7 text-white" />
                          </motion.div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            training.level === 'Advanced' 
                              ? 'bg-purple-500/10 text-purple-400' 
                              : training.level === 'Intermediate'
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-green-500/10 text-green-400'
                          }`}>
                            {training.level}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                          {training.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          {training.description}
                        </p>
                        
                        <div className="flex items-center gap-4 pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {training.duration}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            {training.modules} Modules
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
                    className="bg-gradient-primary hover:opacity-90 transition-all group px-10 py-7 text-lg"
                  >
                    Enquire About Training
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </AnimatedSection>
            </div>
          </section>

          {/* Benefits Section - Checklist Style */}
          <section className="py-24 bg-primary relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border border-primary-foreground/20 rounded-full" />
              <div className="absolute bottom-10 right-10 w-48 h-48 border border-primary-foreground/20 rounded-full" />
              <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-primary-foreground/20 rounded-full" />
            </div>
            
            <div className="container relative">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <AnimatedSection>
                  <span className="inline-block px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
                    Program Benefits
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                    Everything You Need to Succeed
                  </h2>
                  <p className="text-lg text-primary-foreground/70 mb-8">
                    Our comprehensive training programs are designed to give you every advantage in your career journey.
                  </p>
                  <Link to="/#contact">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="group px-8 py-7 text-lg"
                    >
                      Get Started Today
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 bg-primary-foreground/5 rounded-xl p-4 backdrop-blur-sm"
                      >
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-accent" />
                        </div>
                        <span className="text-primary-foreground text-sm font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-background">
            <div className="container">
              <AnimatedSection className="text-center">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                    Ready to Transform Your Career?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10">
                    Join thousands of professionals who have accelerated their careers with Elite Forums Campus. 
                    Get in touch to learn more about our corporate training solutions.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/#contact">
                      <Button
                        size="lg"
                        className="bg-gradient-primary hover:opacity-90 transition-all group px-10 py-7 text-lg"
                      >
                        Contact Us Today
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-7 text-lg border-2"
                    >
                      Download Brochure
                    </Button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TrainingsPage;