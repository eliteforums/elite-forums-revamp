import {
  Sparkles,
  Globe,
  Layers,
  BarChart3,
  Brain,
  Smartphone,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const trainings = [
  {
    icon: Sparkles,
    title: "Generative AI",
    description:
      "Master the cutting-edge field of generative AI, including large language models, image generation, and creative applications of artificial intelligence.",
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Build responsive, dynamic websites with modern frameworks and tools. Learn front-end and back-end technologies to create professional web applications.",
  },
  {
    icon: Layers,
    title: "MERN Stack",
    description:
      "Become proficient in MongoDB, Express.js, React.js, and Node.js to develop full-stack JavaScript applications with industry-standard technologies.",
  },
  {
    icon: BarChart3,
    title: "Data Science",
    description:
      "Transform raw data into valuable insights through statistical analysis, data visualization, and predictive modeling techniques.",
  },
  {
    icon: Brain,
    title: "AI/ML",
    description:
      "Develop expertise in artificial intelligence and machine learning algorithms, neural networks, and practical implementation of AI solutions.",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "Create native and cross-platform mobile applications for iOS and Android using modern frameworks and user-centered design principles.",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description:
      "Gain hands-on experience with AWS, Azure, and cloud services. Learn cloud architecture, deployment, and management best practices.",
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
    <section id="trainings" className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Trainings
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upskill with industry-relevant training programs designed by experts
            to accelerate your career growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {trainings.map((training, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-xl p-6 border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-card"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <training.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {training.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {training.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={handleContact}
            className="bg-gradient-accent hover:opacity-90 transition-opacity"
          >
            Enquire About Training
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Trainings;
