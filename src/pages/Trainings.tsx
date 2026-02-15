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
  X,
  Phone,
  Mail,
  Building,
  User,
  MessageSquare,
  Database,
  Code,
  Shield,
  Palette,
  Link as LinkIcon,
  Wifi,
  BarChart,
  Cpu,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  duration: string;
  level: string;
  category: string | null;
}

interface StudentReview {
  id: string;
  name: string;
  college: string;
  review: string;
  created_at: string;
}

const iconByTitle: Record<string, React.ComponentType<{ className?: string }>> = {
  "Generative AI": Brain,
  "Web Development": Globe,
  "MERN Stack": Layers,
  "Data Science": Database,
  "AI & Machine Learning": Cpu,
  "App Development": Smartphone,
  "Cloud Computing": Cloud,
  "Digital Marketing": TrendingUp,
  "DevOps": GitBranch,
  "Python Programming": Code,
  "Cybersecurity": Shield,
  "UI/UX Design": Palette,
  "Blockchain": LinkIcon,
  "IoT Development": Wifi,
  "Data Analytics": BarChart,
  "Software Testing": CheckCircle,
  "Business Analytics": Briefcase,
};

const stats = [
  { icon: Users, value: 3500, suffix: "+", label: "Professionals Trained" },
  { icon: Building2, value: 25, suffix: "+", label: "Corporate Partners" },
  { icon: GraduationCap, value: 25, suffix: "+", label: "Job Leads Daily" },
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

const trainingOptions = [
  "Generative AI",
  "Web Development",
  "MERN Stack",
  "Data Science",
  "AI/ML",
  "App Development",
  "Cloud Computing",
  "Corporate Training",
  "Custom Program",
];


const TrainingsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [reviews, setReviews] = useState<StudentReview[]>([]);
  const [selectedReview, setSelectedReview] = useState<StudentReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    trainingInterest: "",
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [trainingsRes, reviewsRes] = await Promise.all([
        supabase
          .from("training_programs")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true }),
        supabase
          .from("student_reviews")
          .select("*")
          .eq("is_approved", true)
          .order("created_at", { ascending: false }),
      ]);

      if (!trainingsRes.error && trainingsRes.data) setTrainings(trainingsRes.data);
      if (!reviewsRes.error && reviewsRes.data) setReviews(reviewsRes.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const scrollToPrograms = () => {
    const element = document.getElementById("industry-programs");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.trainingInterest) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-training-enquiry", {
        body: formData,
      });

      if (error) throw error;

      toast.success("Thank you! Your enquiry has been submitted. We'll contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        trainingInterest: "",
        message: "",
      });
      setIsFormOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Best IT Training Institute in Vasai, Nallasopara, Virar & Mumbai | Elite Forums Campus</title>
        <meta
          name="description"
          content="Join 3500+ professionals trained at Elite Forums - Best IT training institute in Vasai, Nallasopara, Virar, Mumbai & Maharashtra. Expert-led courses in AI, Web Development, MERN Stack, Data Science, Python, Cybersecurity, and Cloud Computing. 25+ job leads daily!"
        />
        <meta
          name="keywords"
          content="IT training Vasai, IT training Nallasopara, IT training Virar, IT training Mumbai, IT courses Maharashtra, best IT training institute near me, AI courses Vasai, web development course Mumbai, MERN stack training Vasai, data science course Nallasopara, Python training Virar, cybersecurity course Mumbai, cloud computing certification Maharashtra, Elite Forums training, software training Vasai, programming courses Mumbai, coding bootcamp Maharashtra, tech training institute Palghar"
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
                    <Button
                      size="lg"
                      onClick={scrollToPrograms}
                      className="bg-gradient-primary hover:opacity-90 transition-all group px-8 py-7 text-lg"
                    >
                      Explore Programs
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={() => setIsFormOpen(true)}
                      className="px-8 py-7 text-lg border-2 border-accent/30 hover:border-accent hover:bg-accent/5"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Enquire Now
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

          {/* Student Reviews Carousel */}
          {reviews.length > 0 && (
            <section className="py-20 bg-background relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />
              
              <div className="container relative">
                <AnimatedSection className="text-center mb-16">
                  <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                    Student Testimonials
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                    What Our Students Say
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Hear from professionals who transformed their careers with our training programs
                  </p>
                </AnimatedSection>

                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                  
                  <div className="review-scroll-wrapper">
                    <div className="review-scroll-container">
                      {reviews.map((review) => (
                        <div key={`first-${review.id}`} className="review-card-item flex-shrink-0 cursor-pointer" onClick={() => setSelectedReview(review)}>
                          <div className="w-[320px] md:w-[380px] bg-card rounded-2xl p-6 border border-border hover:border-accent/30 transition-all h-full">
                            <p className="text-foreground/80 italic leading-relaxed mb-5 text-sm line-clamp-4">
                              "{review.review}"
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-border">
                              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-foreground text-sm">{review.name}</div>
                                <div className="text-xs text-muted-foreground">{review.college}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {reviews.map((review) => (
                        <div key={`second-${review.id}`} className="review-card-item flex-shrink-0 cursor-pointer" onClick={() => setSelectedReview(review)}>
                          <div className="w-[320px] md:w-[380px] bg-card rounded-2xl p-6 border border-border hover:border-accent/30 transition-all h-full">
                            <p className="text-foreground/80 italic leading-relaxed mb-5 text-sm line-clamp-4">
                              "{review.review}"
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-border">
                              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-foreground text-sm">{review.name}</div>
                                <div className="text-xs text-muted-foreground">{review.college}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <style>{`
                .review-scroll-wrapper {
                  overflow-x: auto;
                  -webkit-overflow-scrolling: touch;
                  scrollbar-width: thin;
                  scrollbar-color: hsl(var(--muted-foreground) / 0.3) transparent;
                }
                .review-scroll-wrapper::-webkit-scrollbar {
                  height: 6px;
                }
                .review-scroll-wrapper::-webkit-scrollbar-track {
                  background: transparent;
                }
                .review-scroll-wrapper::-webkit-scrollbar-thumb {
                  background: hsl(var(--muted-foreground) / 0.3);
                  border-radius: 3px;
                }
                .review-scroll-container {
                  display: flex;
                  gap: 1.5rem;
                  animation: scroll-reviews 45s linear infinite;
                  width: max-content;
                }
                
                @media (min-width: 768px) {
                  .review-scroll-container {
                    animation-duration: 60s;
                  }
                }
                
                @keyframes scroll-reviews {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                
                .review-scroll-container:hover {
                  animation-play-state: paused;
                }
              `}</style>
            </section>
          )}

          {/* Review Popup */}
          <AnimatePresence>
            {selectedReview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={() => setSelectedReview(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-card rounded-2xl p-8 border border-border max-w-lg w-full relative shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <X className="h-5 w-5 text-foreground" />
                  </button>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                      {selectedReview.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-lg">{selectedReview.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedReview.college}</div>
                    </div>
                  </div>
                  <p className="text-foreground/80 italic leading-relaxed text-base">
                    "{selectedReview.review}"
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
          <section id="industry-programs" className="py-24 bg-background relative overflow-hidden scroll-mt-24">
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

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16" staggerDelay={0.08}>
                  {trainings.map((training, index) => {
                    const IconComponent = iconByTitle[training.title] || Code;
                    return (
                      <StaggerItem key={training.id}>
                        <motion.div
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.3 }}
                          className="group relative bg-card rounded-2xl overflow-hidden h-full border border-border hover:border-accent/30 transition-all"
                        >
                          {/* Gradient Header */}
                          <div className={`h-2 bg-gradient-to-r ${training.gradient}`} />
                          
                          <div className="p-8">
                            <div className="flex items-start justify-between mb-6">
                              <motion.div
                                whileHover={{ rotate: 10, scale: 1.1 }}
                                className={`w-14 h-14 rounded-xl bg-gradient-to-r ${training.gradient} flex items-center justify-center`}
                              >
                                <IconComponent className="h-7 w-7 text-white" />
                              </motion.div>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                training.level.includes('Advanced') 
                                  ? 'bg-purple-500/10 text-purple-400' 
                                  : training.level.includes('Intermediate')
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
                              {training.category && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <BookOpen className="h-4 w-4" />
                                  {training.category}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              )}

              <AnimatedSection delay={0.3} className="text-center">
                <Button
                  size="lg"
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-primary hover:opacity-90 transition-all group px-10 py-7 text-lg"
                >
                  Enquire About Training
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
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
                  <Button
                    size="lg"
                    variant="secondary"
                    onClick={() => setIsFormOpen(true)}
                    className="group px-8 py-7 text-lg"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
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
                    <RouterLink to="/#contact">
                      <Button
                        size="lg"
                        className="bg-gradient-primary hover:opacity-90 transition-all group px-10 py-7 text-lg"
                      >
                        Contact Us Today
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </RouterLink>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </main>
        <Footer />

        {/* Training Enquiry Form Modal */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsFormOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Training Enquiry</h3>
                    <p className="text-sm text-muted-foreground mt-1">Fill out the form and we'll get back to you</p>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <X className="h-5 w-5 text-foreground" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter your company name (optional)"
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      Training Interest *
                    </label>
                    <select
                      name="trainingInterest"
                      value={formData.trainingInterest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground"
                      required
                    >
                      <option value="">Select a program</option>
                      {trainingOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your training requirements..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-primary hover:opacity-90 transition-all py-6 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Submit Enquiry
                        <ArrowRight className="h-5 w-5" />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default TrainingsPage;
