import { AnimatedSection } from "./AnimatedSection";

import averanceLogo from "@/assets/clients/averance.png";
import bizMilleniumLogo from "@/assets/clients/biz-millenium.jpg";
import identitySpaceLogo from "@/assets/clients/identity-space.png";
import jumpstartLogo from "@/assets/clients/jumpstart.png";
import crystaInternationalLogo from "@/assets/clients/crysta-international.png";
import prepaiLogo from "@/assets/clients/prepai.png";
import helloDigiSirLogo from "@/assets/clients/hello-digi-sir.jpeg";
import noshItLogo from "@/assets/clients/nosh-it.jpg";
import identityBrandLogo from "@/assets/clients/identity-brand.png";
import skpFilmsLogo from "@/assets/clients/skp-films.jpg";

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
  { name: "SKP Films", image: skpFilmsLogo },
];

const ClientLogos = () => {
  return (
    <section className="py-12 bg-secondary/30 relative overflow-hidden">
      <div className="container relative">
        <AnimatedSection className="text-center mb-8">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Trusted by Leading Brands
          </p>
        </AnimatedSection>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-secondary/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-secondary/30 to-transparent z-10 pointer-events-none" />
          
          <div className="overflow-hidden">
            <div className="logo-scroll-container">
              {clients.map((client, index) => (
                <div key={`first-${index}`} className="logo-item flex-shrink-0 group">
                  <div className="w-32 h-16 md:w-44 md:h-20 flex items-center justify-center p-3 md:p-4 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-md">
                    <img src={client.image} alt={client.name} className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </div>
              ))}
              {clients.map((client, index) => (
                <div key={`second-${index}`} className="logo-item flex-shrink-0 group">
                  <div className="w-32 h-16 md:w-44 md:h-20 flex items-center justify-center p-3 md:p-4 rounded-2xl bg-card border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-md">
                    <img src={client.image} alt={client.name} className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .logo-scroll-container {
          display: flex;
          gap: 1rem;
          animation: scroll-logos 25s linear infinite;
          width: max-content;
        }
        @media (min-width: 768px) {
          .logo-scroll-container {
            gap: 1.5rem;
            animation-duration: 35s;
          }
        }
        @keyframes scroll-logos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .logo-scroll-container:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientLogos;
