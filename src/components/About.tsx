import { useState, useEffect } from "react";
import { Quote, Users, Target, Lightbulb, Award, Clock } from "lucide-react";
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
    bg: "bg-orange-50",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "Constantly exploring new technologies to solve complex challenges.",
    bg: "bg-amber-50",
  },
  {
    icon: Users,
    title: "Client Centric",
    description: "Your success is our priority. We build partnerships, not just products.",
    bg: "bg-emerald-50",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to the highest standards in everything we deliver.",
    bg: "bg-purple-50",
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
    <section id="about" className="py-24 bg-secondary/40 relative overflow-hidden">
      <div className="container relative">
        <AnimatedSection className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8">
            Who <span className="text-gradient">We Are</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Elite Forums is a forward-thinking technology company dedicated to
            empowering businesses through innovative digital solutions. We
            combine expertise in AI, software development, and digital
            transformation to deliver measurable results for our clients.
          </p>
        </AnimatedSection>

        {/* Values Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -5 }}
                className={`${value.bg} rounded-3xl p-8 border border-transparent hover:border-accent/20 transition-all h-full group`}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

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

        {/* Team Quotes */}
        {teamQuotes.length > 0 && (
          <>
            <AnimatedSection delay={0.2}>
              <h3 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
                What Our Team Says
              </h3>
            </AnimatedSection>
            
            <div className="grid md:grid-cols-2 gap-6">
              {teamQuotes.map((item, index) => (
                <AnimatedCard key={item.id} index={index}>
                  <div className="bg-card rounded-3xl p-8 relative group hover:shadow-card-hover transition-all duration-300 h-full border border-border hover:border-accent/20">
                    <Quote className="absolute top-6 right-6 h-10 w-10 text-accent/10 group-hover:text-accent/25 transition-colors" />
                    <p className="text-foreground/80 mb-8 leading-relaxed text-lg italic">
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
                        <div className="font-semibold text-foreground text-lg">
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
          </>
        )}
      </div>
    </section>
  );
};

export default About;
