import { useState, useEffect } from "react";
import { Quote, Users, Target, Lightbulb, Award, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection, AnimatedCard, StaggerContainer, StaggerItem } from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";

import averanceLogo from "@/assets/clients/averance.png";
import jumpstartLogo from "@/assets/clients/jumpstart.png";
import prepaiLogo from "@/assets/clients/prepai.png";
import noshItLogo from "@/assets/clients/nosh-it.jpg";

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
    gradient: "from-orange-200 to-amber-100",
    shape: "rounded-tl-[60px] rounded-br-[60px]",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "Constantly exploring new technologies to solve complex challenges.",
    gradient: "from-purple-200 to-indigo-100",
    shape: "rounded-tr-[60px] rounded-bl-[60px]",
  },
  {
    icon: Users,
    title: "Client Centric",
    description: "Your success is our priority. We build partnerships, not just products.",
    gradient: "from-rose-200 to-pink-100",
    shape: "rounded-tl-[60px] rounded-br-[60px]",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to the highest standards in everything we deliver.",
    gradient: "from-emerald-200 to-teal-100",
    shape: "rounded-tr-[60px] rounded-bl-[60px]",
  },
];

const clientLogos = [
  { name: "Averance", image: averanceLogo },
  { name: "Jumpstart", image: jumpstartLogo },
  { name: "PrepAI", image: prepaiLogo },
  { name: "Nosh IT", image: noshItLogo },
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
      {/* Testimonials Section - "What Our Clients Say" */}
      {teamQuotes.length > 0 && (
        <div className="py-24 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left side - Heading + client logos */}
              <AnimatedSection>
                <span className="inline-block px-5 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
                  Testimonials
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
                  What Our{" "}
                  <span className="text-gradient">Clients Say</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-md">
                  Hear from the businesses we've helped transform with our digital solutions.
                </p>

                {/* Client logos */}
                <div className="flex items-center gap-6 flex-wrap">
                  {clientLogos.map((client) => (
                    <img
                      key={client.name}
                      src={client.image}
                      alt={client.name}
                      className="h-8 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity"
                    />
                  ))}
                </div>
              </AnimatedSection>

              {/* Right side - Quote card */}
              <AnimatedSection delay={0.2}>
                <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-lg relative">
                  <Quote className="h-12 w-12 text-accent/20 mb-6" />
                  
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                    ))}
                  </div>

                  <p className="text-foreground text-lg md:text-xl leading-relaxed mb-8 italic">
                    "{teamQuotes[0]?.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-lg">
                      {teamQuotes[0]?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-foreground">
                        {teamQuotes[0]?.name}
                      </div>
                      <div className="text-sm text-accent">
                        {teamQuotes[0]?.role}
                      </div>
                    </div>
                  </div>

                  {/* More testimonials below */}
                  {teamQuotes.length > 1 && (
                    <div className="mt-8 pt-8 border-t border-border space-y-6">
                      {teamQuotes.slice(1, 3).map((item) => (
                        <div key={item.id} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm flex-shrink-0">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm italic mb-1">
                              "{item.quote}"
                            </p>
                            <div className="text-xs font-semibold text-foreground">
                              {item.name} · <span className="text-accent">{item.role}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      )}

      {/* Values Section - "Why Elite Forums" */}
      <div className="py-24 bg-foreground text-background">
        <div className="container">
          {/* Header row */}
          <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div className="max-w-xl">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Why <span className="text-accent">Elite Forums</span>
              </h3>
              <p className="text-background/60 text-lg leading-relaxed">
                Elite Forums is a forward-thinking technology company dedicated to
                empowering businesses through innovative digital solutions.
              </p>
            </div>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 self-start md:self-auto px-8 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
            >
              Request Meeting 👋
              <ArrowRight className="h-4 w-4" />
            </button>
          </AnimatedSection>

          {/* Value cards with illustrated tops */}
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="rounded-3xl overflow-hidden bg-background/5 border border-background/10 hover:border-accent/30 transition-all group h-full"
                >
                  {/* Illustrated top area */}
                  <div className={`h-44 bg-gradient-to-br ${value.gradient} relative overflow-hidden flex items-center justify-center`}>
                    {/* Abstract shapes */}
                    <div className={`absolute inset-4 bg-white/30 ${value.shape}`} />
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 rounded-lg bg-white/25 rotate-12" />
                    <value.icon className="h-10 w-10 text-foreground/70 relative z-10" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-lg font-semibold mb-2">{value.title}</h4>
                    <p className="text-background/60 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
};

export default About;
