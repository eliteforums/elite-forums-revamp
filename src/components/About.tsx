import { useState, useEffect } from "react";
import { Quote, Users, Target, Lightbulb, Award, Clock, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedCard, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  quote: string | null;
}

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
  const [teamQuotes, setTeamQuotes] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("is_active", true)
        .not("quote", "is", null)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setTeamQuotes(data);
      }
    };

    fetchTeam();
  }, []);

  return (
    <section id="about" className="relative overflow-hidden">
      {/* Light top section - About intro */}
      <div className="py-24 bg-background">
        <div className="container">
          <AnimatedSection className="max-w-3xl mx-auto text-center mb-16">
            <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8">
              We Are <span className="text-gradient">Elite Forums</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Elite Forums is a forward-thinking technology company dedicated to
              empowering businesses through innovative digital solutions. We
              combine expertise in AI, software development, and digital
              transformation to deliver measurable results for our clients.
            </p>
          </AnimatedSection>

          {/* CTA Banner */}
          <AnimatedSection delay={0.2} className="mb-16">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-accent rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4 text-accent-foreground">
                <Clock className="h-10 w-10 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold">We'll Reply in 24 Hours</h3>
                  <p className="text-accent-foreground/80">Get in touch and let's start building your future.</p>
                </div>
              </div>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-accent font-semibold rounded-full hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                Contact Us Now
              </button>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>

      {/* Dark section - Values & Team */}
      <div className="py-24 bg-foreground text-background">
        <div className="container">
          {/* Values - Horizontal cards */}
          <AnimatedSection className="mb-20">
            <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Our Core <span className="text-accent">Values</span>
            </h3>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 gap-4 mb-20">
            {values.map((value, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-5 p-6 rounded-2xl bg-background/5 border border-background/10 hover:border-accent/30 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/30 transition-colors">
                    <value.icon className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">{value.title}</h4>
                    <p className="text-background/60 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Team section */}
          {teamQuotes.length > 0 && (
            <>
              <AnimatedSection delay={0.2} className="mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                  ))}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-center mb-2">
                  What Our Team Says
                </h3>
              </AnimatedSection>

              <div className="grid md:grid-cols-2 gap-6">
                {teamQuotes.map((item, index) => (
                  <AnimatedCard key={item.id} index={index}>
                    <div className="bg-background/5 rounded-3xl p-8 relative group hover:bg-background/10 transition-all duration-300 h-full border border-background/10 hover:border-accent/20">
                      <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/20 group-hover:text-accent/40 transition-colors" />
                      <p className="text-background/80 mb-8 leading-relaxed text-lg italic">
                        "{item.quote}"
                      </p>
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg"
                        >
                          {item.name.charAt(0)}
                        </motion.div>
                        <div>
                          <div className="font-semibold text-lg">
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

              {/* Request Meeting CTA */}
              <AnimatedSection delay={0.3} className="mt-12 text-center">
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
                >
                  Request Meeting 👋
                  <ArrowRight className="h-4 w-4" />
                </button>
              </AnimatedSection>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
