import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "NOSH IT",
    description:
      "Digital QR-based restaurant menu & ordering solution that streamlines dining experiences with contactless technology.",
    link: "https://nosh-it-qr.vercel.app/",
    tags: ["Restaurant Tech", "QR Ordering", "Digital Menu"],
  },
  {
    title: "HelloDigiSir",
    description:
      "Comprehensive digital marketing and branding platform helping businesses establish strong online presence.",
    link: "https://hellodigisir.in",
    tags: ["Digital Marketing", "Branding", "Growth"],
  },
  {
    title: "PrepAI",
    description:
      "AI-powered interview preparation and learning platform that helps candidates practice and improve their skills.",
    link: "https://theprepai.com",
    tags: ["AI/ML", "EdTech", "Interview Prep"],
  },
  {
    title: "Crystal International",
    description:
      "Professional corporate business website showcasing enterprise solutions and global business services.",
    link: "https://www.crystalinternational.in/",
    tags: ["Corporate", "Business", "Enterprise"],
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24 bg-gradient-subtle">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Showcasing our portfolio of successful digital solutions delivered
            for clients across industries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-card-hover h-full">
                <div className="h-48 bg-gradient-primary flex items-center justify-center relative overflow-hidden">
                  <div className="text-4xl font-bold text-primary-foreground/20">
                    {project.title.charAt(0)}
                  </div>
                  <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
