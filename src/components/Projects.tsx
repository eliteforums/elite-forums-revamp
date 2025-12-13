import { ExternalLink, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";

const projects = [
  {
    title: "NOSH IT",
    description:
      "Digital QR-based restaurant menu & ordering solution that streamlines dining experiences with contactless technology.",
    link: "https://nosh-it-qr.vercel.app/",
    tags: ["Restaurant Tech", "QR Ordering", "Digital Menu"],
    gradient: "from-orange-500 via-red-500 to-pink-500",
  },
  {
    title: "HelloDigiSir",
    description:
      "Comprehensive digital marketing and branding platform helping businesses establish strong online presence.",
    link: "https://hellodigisir.in",
    tags: ["Digital Marketing", "Branding", "Growth"],
    gradient: "from-blue-500 via-purple-500 to-pink-500",
  },
  {
    title: "PrepAI",
    description:
      "AI-powered interview preparation and learning platform that helps candidates practice and improve their skills.",
    link: "https://theprepai.com",
    tags: ["AI/ML", "EdTech", "Interview Prep"],
    gradient: "from-green-500 via-teal-500 to-cyan-500",
  },
  {
    title: "Crystal International",
    description:
      "Professional corporate business website showcasing enterprise solutions and global business services.",
    link: "https://www.crystalinternational.in/",
    tags: ["Corporate", "Business", "Enterprise"],
    gradient: "from-indigo-500 via-purple-500 to-violet-500",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container relative">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our Projects
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Showcasing our portfolio of successful digital solutions delivered
            for clients across industries.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-2 gap-8" staggerDelay={0.15}>
          {projects.map((project, index) => (
            <StaggerItem key={index}>
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="group block"
              >
                <div className="bg-card rounded-3xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-500 h-full hover:shadow-card-hover">
                  {/* Header gradient */}
                  <div className={`h-56 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="text-7xl font-bold text-white/20"
                    >
                      {project.title.charAt(0)}
                    </motion.div>
                    
                    {/* Animated overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-6 w-6 text-white" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-all transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={tagIndex}
                          whileHover={{ scale: 1.05 }}
                          className="px-4 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground rounded-full border border-border hover:border-accent/30 transition-colors"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default Projects;
