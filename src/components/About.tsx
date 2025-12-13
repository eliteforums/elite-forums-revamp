import { Quote } from "lucide-react";

const teamQuotes = [
  {
    quote: "Innovation isn't just about creating something new; it's about solving real problems in ways that were previously unimaginable. Technology gives us the tools, but human creativity drives true transformation.",
    name: "Harsh Tambade",
    role: "CEO",
  },
  {
    quote: "The most successful tech projects aren't just about code and algorithms—they're about understanding human needs and orchestrating solutions that seamlessly integrate into people's lives and workflows.",
    name: "Suchita Nigam",
    role: "Project Manager",
  },
  {
    quote: "Technology at its best doesn't replace human potential—it amplifies it. Our mission is to create systems that enhance human capabilities while making complex processes feel effortless and intuitive.",
    name: "Siddhant Mandlik",
    role: "COO",
  },
  {
    quote: "Every line of code we write represents an opportunity to make someone's life better. It's incredible to be part of an industry where continuous learning transforms not just our skills, but the world around us.",
    name: "Raj Dabholkar",
    role: "Tech Lead",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Who We Are
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Elite Forums is a forward-thinking technology company dedicated to
            empowering businesses through innovative digital solutions. We
            combine expertise in AI, software development, and digital
            transformation to deliver measurable results for our clients. Our
            team of passionate technologists believes in creating solutions that
            not only solve today's challenges but anticipate tomorrow's
            opportunities.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-12">
            What Our Team Says
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {teamQuotes.map((item, index) => (
              <div
                key={index}
                className="bg-secondary/50 rounded-xl p-8 relative group hover:shadow-card transition-all duration-300"
              >
                <Quote className="absolute top-6 right-6 h-8 w-8 text-accent/20 group-hover:text-accent/40 transition-colors" />
                <p className="text-foreground/80 mb-6 leading-relaxed italic">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {item.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
