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
    <section className="py-20 bg-secondary/30">
      <div className="container">
        <AnimatedSection className="text-center max-w-4xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-8">
            Get Complete Digital Solutions For Branding ~ Web/App Development And{" "}
            <span className="text-gradient">AI Automation.</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScroll("#services")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              View Services
              <ArrowRight className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleScroll("#contact")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-colors"
            >
              <Users className="h-4 w-4" />
              Request Meeting
            </motion.button>
          </div>
        </AnimatedSection>

        {/* Static Client Logos with dividers */}
        <AnimatedSection delay={0.2}>
          <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
            Trusted by Leading Brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-0">
            {clients.map((client, index) => (
              <div key={client.name} className="flex items-center">
                <div className="px-6 py-3">
                  <img
                    src={client.image}
                    alt={client.name}
                    className="h-10 md:h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
                {index < clients.length - 1 && (
                  <div className="w-px h-10 bg-border hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default CtaBanner;
