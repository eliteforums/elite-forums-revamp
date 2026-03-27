import { useState, useEffect } from "react";
import { Quote, Users, Target, Lightbulb, Award, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem } from "./AnimatedSection";
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
    gradient: "from-orange-100 to-amber-50",
    accent: "bg-orange-400",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "Constantly exploring new technologies to solve complex challenges.",
    gradient: "from-purple-100 to-indigo-50",
    accent: "bg-purple-400",
  },
  {
    icon: Users,
    title: "Client Centric",
    description: "Your success is our priority. We build partnerships, not just products.",
    gradient: "from-rose-100 to-pink-50",
    accent: "bg-rose-400",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to the highest standards in everything we deliver.",
    gradient: "from-emerald-100 to-teal-50",
    accent: "bg-emerald-400",
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
      {/* Testimonials Section */}
      {teamQuotes.length > 0 && (
        <div className="py-20 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {/* Left side */}
              <AnimatedSection>
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-5 tracking-wide">
                  Testimonials
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  What Our{" "}
                  <span className="text-gradient">Clients Say</span>
                </h2>
                <p className="text-base text-muted-foreground mb-8 max-w-sm leading-relaxed">
                  Hear from the businesses we've helped transform with our digital solutions.
                </p>

                {/* Client logos */}
                <div className="flex items-center gap-5 flex-wrap">
                  {clientLogos.map((client) => (
                    <img
                      key={client.name}
                      src={client.image}
                      alt={client.name}
                      className="h-7 w-auto object-contain opacity-40 hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              </AnimatedSection>

              {/* Right side - Quote card */}
              <AnimatedSection delay={0.2}>
                <div className="bg-card rounded-[1.25rem] p-7 md:p-8 border border-border/60 relative"
                  style={{ boxShadow: '0 4px 24px -6px rgba(0,0,0,0.06)' }}
                >
                  <Quote className="h-10 w-10 text-accent/15 mb-5" />
                  
                  <div className="flex items-center gap-0.5 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                    ))}
                  </div>

                  <p className="text-foreground text-base md:text-lg leading-relaxed mb-7 italic">
                    "{teamQuotes[0]?.quote}"
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-sm">
                      {teamQuotes[0]?.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {teamQuotes[0]?.name}
                      </div>
                      <div className="text-xs text-accent">
                        {teamQuotes[0]?.role}
                      </div>
                    </div>
                  </div>

                  {/* More testimonials */}
                  {teamQuotes.length > 1 && (
                    <div className="mt-6 pt-6 border-t border-border/60 space-y-5">
                      {teamQuotes.slice(1, 3).map((item) => (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-muted-foreground text-[13px] italic mb-1 leading-relaxed">
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
      <div className="py-20 bg-foreground text-background">
        <div className="container">
          {/* Header row */}
          <AnimatedSection className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14">
            <div className="max-w-lg">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                Why <span className="text-accent">Elite Forums</span>
              </h3>
              <p className="text-background/55 text-base leading-relaxed">
                Elite Forums is a forward-thinking technology company dedicated to
                empowering businesses through innovative digital solutions.
              </p>
            </div>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 self-start md:self-auto px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors whitespace-nowrap"
            >
              Request Meeting 👋
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </AnimatedSection>

          {/* Value cards */}
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="rounded-[1.25rem] overflow-hidden bg-background/5 border border-background/8 hover:border-accent/25 transition-all group h-full"
                >
                  {/* Top visual area */}
                  <div className={`h-36 bg-gradient-to-br ${value.gradient} relative overflow-hidden flex items-center justify-center`}>
                    {/* Layered abstract shapes */}
                    <div className="absolute inset-6 rounded-[2rem] bg-white/25" />
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/20" />
                    <div className="absolute bottom-4 left-4 w-5 h-5 rounded-lg bg-white/20 rotate-12" />
                    <div className={`w-10 h-10 rounded-xl ${value.accent} flex items-center justify-center relative z-10`}
                      style={{ boxShadow: '0 4px 12px -2px rgba(0,0,0,0.15)' }}
                    >
                      <value.icon className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h4 className="text-base font-semibold mb-1.5">{value.title}</h4>
                    <p className="text-background/50 text-[13px] leading-relaxed">{value.description}</p>
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
