import { motion } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";
import { ArrowRight, Users } from "lucide-react";

import averanceLogo from "@/assets/clients/averance.png";
import bizMilleniumLogo from "@/assets/clients/biz-millenium.jpg";
import identitySpaceLogo from "@/assets/clients/identity-space.png";
import jumpstartLogo from "@/assets/clients/jumpstart.png";
import crystaInternationalLogo from "@/assets/clients/crysta-international.png";
import prepaiLogo from "@/assets/clients/prepai.png";
import helloDigiSirLogo from "@/assets/clients/hello-digi-sir.jpeg";
import noshItLogo from "@/assets/clients/nosh-it.jpg";
import identityBrandLogo from "@/assets/clients/identity-brand.png";

const clients = [
  { name: "Averance", image: averanceLogo },
  { name: "Biz Millenium", image: bizMilleniumLogo },
  { name: "Identity Space", image: identitySpaceLogo },
  { name: "Jumpstart", image: jumpstartLogo },
  { name: "Crysta International", image: crystaInternationalLogo },
  { name: "PrepAI", image: prepaiLogo },
  { name: "Hello Digi Sir", image: helloDigiSirLogo },
  { name: "Nosh IT", image: noshItLogo },
  { name: "Identity Brand", image: identityBrandLogo },
];

const CtaBanner = () => {
  const handleScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <AnimatedSection>
          <div className="bg-secondary/40 border border-border/40 rounded-[2rem] px-6 md:px-12 py-12 md:py-14">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-snug mb-7">
                Get Complete Digital Solutions For Branding ~ Web/App Development And{" "}
                <span className="text-gradient">AI Automation.</span>
              </h2>

              <div className="flex flex-wrap justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleScroll("#services")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-accent text-accent text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  View Services
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleScroll("#contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
                >
                  <Users className="h-3.5 w-3.5" />
                  Request Meeting
                </motion.button>
              </div>
            </div>

            {/* Client logos strip */}
            <div className="border-t border-border/40 pt-8">
              <p className="text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.15em] mb-6">
                Trusted by Leading Brands
              </p>
              <div className="flex flex-wrap items-center justify-center gap-0">
                {clients.map((client, index) => (
                  <div key={client.name} className="flex items-center">
                    <div className="px-4 md:px-5 py-2">
                      <img
                        src={client.image}
                        alt={client.name}
                        className="h-8 md:h-9 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                      />
                    </div>
                    {index < clients.length - 1 && (
                      <div className="w-px h-8 bg-border/50 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CtaBanner;
