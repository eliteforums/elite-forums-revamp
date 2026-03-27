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
  Star,
  ArrowUpRight,
  Zap,
  Target,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import CountUp from "@/components/CountUp";
import { Link as RouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HardcodedTraining {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
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

const hardcodedTrainings: HardcodedTraining[] = [
  { title: "Generative AI", description: "Master generative AI tools, prompt engineering, and large language models for real-world applications.", icon: Brain, gradient: "from-purple-500 to-pink-500", duration: "10-14 weeks", level: "Intermediate to Advanced", category: "AI" },
  { title: "Web Development", description: "Build modern, responsive websites using HTML, CSS, JavaScript, and popular frameworks.", icon: Globe, gradient: "from-blue-500 to-cyan-500", duration: "10-14 weeks", level: "Beginner to Intermediate", category: "Development" },
  { title: "MERN Stack", description: "Full-stack development with MongoDB, Express.js, React, and Node.js for scalable web apps.", icon: Layers, gradient: "from-green-500 to-teal-500", duration: "12-16 weeks", level: "Intermediate", category: "Development" },
  { title: "Data Science", description: "Learn data analysis, visualization, and statistical modeling with Python and R.", icon: Database, gradient: "from-orange-500 to-amber-500", duration: "10-14 weeks", level: "Beginner to Intermediate", category: "Data" },
  { title: "AI & Machine Learning", description: "Explore machine learning algorithms, neural networks, and deep learning frameworks.", icon: Cpu, gradient: "from-violet-500 to-purple-500", duration: "12-16 weeks", level: "Intermediate to Advanced", category: "AI & ML" },
  { title: "App Development", description: "Create cross-platform mobile applications for iOS and Android using modern frameworks.", icon: Smartphone, gradient: "from-pink-500 to-rose-500", duration: "10-14 weeks", level: "Beginner to Intermediate", category: "Development" },
  { title: "Cloud Computing", description: "Master cloud platforms like AWS, Azure, and Google Cloud for scalable applications.", icon: Cloud, gradient: "from-cyan-500 to-blue-500", duration: "8-12 weeks", level: "Intermediate", category: "Infrastructure" },
  { title: "Digital Marketing", description: "Learn SEO, social media marketing, content marketing, and paid advertising strategies.", icon: TrendingUp, gradient: "from-amber-500 to-orange-500", duration: "6-8 weeks", level: "Beginner to Intermediate", category: "Marketing" },
  { title: "DevOps", description: "Master CI/CD, containerization, and infrastructure automation for efficient software delivery.", icon: GitBranch, gradient: "from-indigo-500 to-blue-500", duration: "10-12 weeks", level: "Intermediate to Advanced", category: "Infrastructure" },
  { title: "Python Programming", description: "Learn Python from basics to advanced concepts including OOP and data structures.", icon: Code, gradient: "from-yellow-500 to-green-500", duration: "8-10 weeks", level: "Beginner to Intermediate", category: "Development" },
  { title: "Cybersecurity", description: "Learn to protect systems and networks from cyber threats and vulnerabilities.", icon: Shield, gradient: "from-red-500 to-orange-500", duration: "10-14 weeks", level: "Intermediate to Advanced", category: "Security" },
  { title: "UI/UX Design", description: "Master user interface and user experience design principles and tools.", icon: Palette, gradient: "from-pink-500 to-purple-500", duration: "8-10 weeks", level: "Beginner to Intermediate", category: "Design" },
  { title: "Blockchain", description: "Understand blockchain technology, smart contracts, and decentralized applications.", icon: LinkIcon, gradient: "from-emerald-500 to-teal-500", duration: "10-12 weeks", level: "Intermediate to Advanced", category: "Technology" },
  { title: "IoT Development", description: "Build Internet of Things solutions connecting hardware and software systems.", icon: Wifi, gradient: "from-sky-500 to-indigo-500", duration: "10-12 weeks", level: "Intermediate", category: "Technology" },
  { title: "Data Analytics", description: "Learn to analyze and visualize data using tools like Excel, Tableau, and Power BI.", icon: BarChart, gradient: "from-orange-400 to-yellow-500", duration: "6-8 weeks", level: "Beginner to Intermediate", category: "Data" },
  { title: "Software Testing", description: "Master manual and automated testing methodologies for quality assurance.", icon: CheckCircle, gradient: "from-green-500 to-emerald-500", duration: "8-10 weeks", level: "Beginner to Intermediate", category: "Quality" },
  { title: "Business Analytics", description: "Apply analytical methods to business problems for data-driven decision making.", icon: Briefcase, gradient: "from-slate-500 to-gray-600", duration: "8-10 weeks", level: "Intermediate", category: "Business" },
];

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
    accent: "bg-blue-500/10 text-blue-600",
    iconBg: "bg-blue-500",
  },
  {
    icon: TrendingUp,
    title: "Career Advancement Track",
    description: "Structured learning paths designed to accelerate your professional growth and industry readiness.",
    accent: "bg-emerald-500/10 text-emerald-600",
    iconBg: "bg-emerald-500",
  },
  {
    icon: BookOpen,
    title: "Industry-Aligned Curriculum",
    description: "Courses developed in partnership with leading tech companies to meet current market demands.",
    accent: "bg-purple-500/10 text-purple-600",
    iconBg: "bg-purple-500",
  },
  {
    icon: Users,
    title: "Expert-Led Sessions",
    description: "Learn from industry veterans with 10+ years of experience in top multinational corporations.",
    accent: "bg-accent/10 text-accent",
    iconBg: "bg-accent",
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
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
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

  const categories = ["All", ...Array.from(new Set(hardcodedTrainings.map(t => t.category).filter(Boolean) as string[]))];
  const filteredTrainings = activeCategory === "All" 
    ? hardcodedTrainings 
    : hardcodedTrainings.filter(t => t.category === activeCategory);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("student_reviews")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (!error && data) setReviews(data);
      setIsLoading(false);
    };

    fetchReviews();
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
          {/* ===== HERO SECTION ===== */}
          <section className="pt-28 pb-20 relative overflow-hidden">
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-hero" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/6 rounded-full blur-[200px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/4 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
            
            <div className="container relative">
              <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
                {/* Left content */}
                <AnimatedSection>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/15 text-accent text-xs font-semibold mb-6 tracking-wide"
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    <span>Elite Forums Campus</span>
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] font-bold text-foreground mb-5 leading-[1.08] tracking-tight"
                  >
                    Upskill Your <br />
                    <span className="text-gradient">Workforce Today</span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-base md:text-lg text-muted-foreground max-w-[480px] mb-8 leading-relaxed"
                  >
                    Enterprise-grade training programs designed to transform professionals 
                    into industry-ready experts with cutting-edge skills.
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap gap-3"
                  >
                    <button
                      onClick={scrollToPrograms}
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground pl-5 pr-4 py-3 rounded-full text-sm font-semibold transition-colors"
                    >
                      Explore Programs
                      <span className="ml-1 w-7 h-7 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="inline-flex items-center gap-2.5 border-2 border-foreground/15 text-foreground pl-3 pr-5 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                        <Play className="h-3.5 w-3.5 text-accent" />
                      </div>
                      Enquire Now
                    </button>
                  </motion.div>
                </AnimatedSection>

                {/* Right — Stats grid */}
                <AnimatedSection delay={0.2} className="hidden lg:block">
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -5, transition: { duration: 0.25 } }}
                        className="bg-card rounded-[1.25rem] p-5 border border-border/60 hover:border-accent/20 transition-all group"
                        style={{ boxShadow: 'var(--shadow-card)' }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-accent/10 group-hover:bg-accent flex items-center justify-center mb-3 transition-colors">
                          <stat.icon className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors" />
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-0.5">
                          <CountUp end={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-muted-foreground text-xs">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>

              {/* Mobile stats row */}
              <div className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.08 }}
                    className="bg-card rounded-xl p-4 border border-border/60 text-center"
                    style={{ boxShadow: 'var(--shadow-sm)' }}
                  >
                    <div className="text-xl font-bold text-foreground">
                      <CountUp end={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-muted-foreground text-[11px] mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== STUDENT REVIEWS ===== */}
          {reviews.length > 0 && (
            <section className="py-16 bg-secondary/30 relative overflow-hidden">
              <div className="container relative">
                <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
                  <div className="max-w-lg">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4 tracking-wide">
                      Student Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 leading-tight">
                      What Our <span className="text-gradient">Students</span> Say
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Hear from professionals who transformed their careers with our training programs
                    </p>
                  </div>
                  <RouterLink
                    to="/review"
                    className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-full border-2 border-foreground/15 text-foreground text-sm font-semibold hover:bg-foreground hover:text-background transition-colors whitespace-nowrap"
                  >
                    Write a Review
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </RouterLink>
                </AnimatedSection>

                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-secondary/30 via-secondary/30 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-secondary/30 via-secondary/30 to-transparent z-10 pointer-events-none" />
                  
                  <div className="review-scroll-wrapper">
                    <div className="review-scroll-container">
                      {[...reviews, ...reviews].map((review, idx) => (
                        <div
                          key={`review-${idx}`}
                          className="review-card-item flex-shrink-0 cursor-pointer"
                          onClick={() => setSelectedReview(review)}
                        >
                          <div
                            className="w-[300px] md:w-[340px] bg-card rounded-[1.25rem] p-5 border border-border/60 hover:border-accent/20 transition-all h-full group"
                            style={{ boxShadow: 'var(--shadow-card)' }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-3.5 w-3.5 text-accent fill-accent" />
                                ))}
                              </div>
                              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-foreground/75 italic leading-relaxed mb-4 text-[13px] line-clamp-4">
                              "{review.review}"
                            </p>
                            <div className="flex items-center gap-2.5 pt-3.5 border-t border-border/40">
                              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs">
                                {review.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-foreground text-xs">{review.name}</div>
                                <div className="text-[11px] text-muted-foreground">{review.college}</div>
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
                  overflow-x: hidden;
                }
                .review-scroll-container {
                  display: flex;
                  gap: 1.25rem;
                  animation: scroll-reviews 50s linear infinite;
                  width: max-content;
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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
                onClick={() => setSelectedReview(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-card rounded-[1.25rem] p-7 border border-border/60 max-w-lg w-full relative"
                  style={{ boxShadow: '0 20px 60px -15px rgba(0,0,0,0.2)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="absolute right-4 top-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <X className="h-4 w-4 text-foreground" />
                  </button>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                      {selectedReview.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{selectedReview.name}</div>
                      <div className="text-xs text-muted-foreground">{selectedReview.college}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic leading-relaxed text-sm">
                    "{selectedReview.review}"
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== WHY CHOOSE US — FEATURES ===== */}
          <section className="py-20 bg-background relative">
            <div className="container">
              <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14">
                <div className="max-w-lg">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4 tracking-wide">
                    Why Choose Us
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-3 leading-tight">
                    Enterprise <span className="text-gradient">Learning</span> Solutions
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Designed for ambitious professionals and forward-thinking organizations
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </AnimatedSection>

              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.08}>
                {features.map((feature, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      whileHover={{ y: -6, transition: { duration: 0.25 } }}
                      className="bg-card rounded-[1.25rem] overflow-hidden h-full border border-border/60 hover:border-accent/20 transition-all group"
                      style={{ boxShadow: 'var(--shadow-card)' }}
                    >
                      {/* Card top illustration area */}
                      <div className="h-32 relative overflow-hidden bg-secondary/30">
                        <div className={`absolute inset-0 opacity-[0.06]`} style={{
                          backgroundImage: `radial-gradient(circle at 30% 40%, hsl(var(--accent)) 0%, transparent 60%)`
                        }} />
                        <div className="absolute bottom-4 left-5">
                          <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center`}
                            style={{ boxShadow: '0 4px 12px -2px rgba(0,0,0,0.15)' }}
                          >
                            <feature.icon className="h-5.5 w-5.5 text-white" />
                          </div>
                        </div>
                        {/* Decorative shapes */}
                        <div className="absolute top-3 right-3 w-16 h-16 rounded-full border border-foreground/5" />
                        <div className="absolute top-8 right-8 w-8 h-8 rounded-full border border-foreground/5" />
                      </div>
                      <div className="p-5">
                        <h3 className="text-[15px] font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-[13px]">{feature.description}</p>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>

          {/* ===== INDUSTRY-READY PROGRAMS ===== */}
          <section id="industry-programs" className="py-20 bg-secondary/20 relative overflow-hidden scroll-mt-20">
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="container relative">
              <AnimatedSection className="text-center mb-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4 tracking-wide">
                  Our Curriculum
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-3 leading-tight">
                  Industry-Ready <span className="text-gradient">Programs</span>
                </h2>
                <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  Comprehensive courses designed in collaboration with industry leaders
                </p>
              </AnimatedSection>

              {/* Category filter pills */}
              <AnimatedSection delay={0.15} className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeCategory === cat
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:border-accent/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </AnimatedSection>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
                </div>
              ) : (
                <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                  <AnimatePresence mode="popLayout">
                    {filteredTrainings.map((training, index) => {
                      const IconComponent = training.icon;
                      return (
                        <motion.div
                          key={training.title}
                          layout
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.35, delay: index * 0.04 }}
                          whileHover={{ y: -6, transition: { duration: 0.25 } }}
                          className="group relative bg-card rounded-[1.25rem] overflow-hidden h-full border border-border/60 hover:border-accent/20 transition-all cursor-pointer"
                          style={{ boxShadow: 'var(--shadow-card)' }}
                          onClick={() => setIsFormOpen(true)}
                        >
                          {/* Gradient accent line */}
                          <div className={`h-1 bg-gradient-to-r ${training.gradient}`} />
                          
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <motion.div
                                whileHover={{ rotate: 8, scale: 1.08 }}
                                className={`w-11 h-11 rounded-xl bg-gradient-to-r ${training.gradient} flex items-center justify-center`}
                                style={{ boxShadow: '0 4px 12px -2px rgba(0,0,0,0.12)' }}
                              >
                                <IconComponent className="h-5 w-5 text-white" />
                              </motion.div>
                              <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full tracking-wide ${
                                training.level.includes('Advanced') 
                                  ? 'bg-purple-500/10 text-purple-600' 
                                  : training.level.includes('Intermediate')
                                  ? 'bg-blue-500/10 text-blue-600'
                                  : 'bg-emerald-500/10 text-emerald-600'
                              }`}>
                                {training.level}
                              </span>
                            </div>
                            
                            <h3 className="text-[15px] font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                              {training.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-[13px] mb-4">
                              {training.description}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-border/40">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  {training.duration}
                                </div>
                                {training.category && (
                                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    {training.category}
                                  </div>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              )}

              <AnimatedSection delay={0.3} className="text-center">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground pl-6 pr-5 py-3 rounded-full text-sm font-semibold transition-colors"
                >
                  Enquire About Training
                  <span className="ml-1 w-7 h-7 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              </AnimatedSection>
            </div>
          </section>

          {/* ===== BENEFITS SECTION ===== */}
          <section className="py-20 bg-foreground relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute inset-0 opacity-[0.04]">
              <div className="absolute top-10 left-10 w-28 h-28 border border-background/20 rounded-full" />
              <div className="absolute bottom-10 right-10 w-40 h-40 border border-background/20 rounded-full" />
              <div className="absolute top-1/2 left-1/3 w-20 h-20 border border-background/20 rounded-full" />
              <div className="absolute top-1/4 right-1/4 w-12 h-12 border border-background/20 rounded-full" />
            </div>
            
            <div className="container relative">
              <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
                <AnimatedSection>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-background/8 text-background text-xs font-semibold mb-5 tracking-wide">
                    Program Benefits
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-background mb-5 leading-tight">
                    Everything You Need <br className="hidden md:block" />to Succeed
                  </h2>
                  <p className="text-base text-background/50 mb-8 leading-relaxed max-w-[420px]">
                    Our comprehensive training programs are designed to give you every advantage in your career journey.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-full text-sm font-semibold transition-colors"
                    >
                      Get Started Today
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <RouterLink
                      to="/#contact"
                      className="inline-flex items-center gap-2 border-2 border-background/15 text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-background hover:text-foreground transition-colors"
                    >
                      Contact Us
                    </RouterLink>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.06 }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                        className="flex items-center gap-3 bg-background/6 rounded-xl p-4 backdrop-blur-sm border border-background/5 group"
                      >
                        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/30 transition-colors">
                          <CheckCircle className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-background text-[13px] font-medium leading-snug">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>

          {/* ===== FINAL CTA ===== */}
          <section className="py-20 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
            <div className="container relative">
              <AnimatedSection className="text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-5 tracking-wide">
                    <Zap className="h-3.5 w-3.5" />
                    Start Your Journey
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-5 leading-tight">
                    Ready to Transform <br className="hidden md:block" />
                    <span className="text-gradient">Your Career?</span>
                  </h2>
                  <p className="text-base text-muted-foreground mb-8 leading-relaxed max-w-lg mx-auto">
                    Join thousands of professionals who have accelerated their careers with Elite Forums Campus. 
                    Get in touch to learn more about our corporate training solutions.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <RouterLink to="/#contact">
                      <button className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground pl-6 pr-5 py-3 rounded-full text-sm font-semibold transition-colors">
                        Contact Us Today
                        <span className="ml-1 w-7 h-7 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    </RouterLink>
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="inline-flex items-center gap-2 border-2 border-foreground/15 text-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
                    >
                      <Target className="h-3.5 w-3.5" />
                      Enquire Now
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </section>
        </main>
        <Footer />

        {/* ===== TRAINING ENQUIRY FORM MODAL ===== */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsFormOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border/60 rounded-[1.25rem] w-full max-w-lg max-h-[90vh] overflow-y-auto"
                style={{ boxShadow: '0 20px 60px -15px rgba(0,0,0,0.2)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-card border-b border-border/40 px-6 py-5 flex items-center justify-between rounded-t-[1.25rem] z-10">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Training Enquiry</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Fill out the form and we'll get back to you</p>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  >
                    <X className="h-4 w-4 text-foreground" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your email"
                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Your phone"
                        className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-muted-foreground" />
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Enter your company name (optional)"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                      Training Interest *
                    </label>
                    <select
                      name="trainingInterest"
                      value={formData.trainingInterest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground text-sm"
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

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your training requirements..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/60 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-foreground placeholder:text-muted-foreground resize-none text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                        />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Submit Enquiry
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </button>
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
