import { AnimatedSection } from "./AnimatedSection";

// Import client logos
import averanceLogo from "@/assets/clients/averance.png";
import bizMilleniumLogo from "@/assets/clients/biz-millenium.jpg";
import identitySpaceLogo from "@/assets/clients/identity-space.png";
import jumpstartLogo from "@/assets/clients/jumpstart.png";
import crystaLogo from "@/assets/clients/crysta-international.png";
import prepaiLogo from "@/assets/clients/prepai.png";
import helloDigiSirLogo from "@/assets/clients/hello-digi-sir.jpeg";
import noshItLogo from "@/assets/clients/nosh-it.jpg";
import identityBrandLogo from "@/assets/clients/identity-brand.png";
import skpFilmsLogo from "@/assets/clients/skp-films.jpg";

const clients = [
  { name: "Averance Media", logo: averanceLogo },
  { name: "Biz Millenium", logo: bizMilleniumLogo },
  { name: "Identity Space", logo: identitySpaceLogo },
  { name: "Jumpstart", logo: jumpstartLogo },
  { name: "Crysta International", logo: crystaLogo },
  { name: "PrepAI", logo: prepaiLogo },
  { name: "Hello Digi Sir", logo: helloDigiSirLogo },
  { name: "NOSH IT", logo: noshItLogo },
  { name: "Identity Brand", logo: identityBrandLogo },
  { name: "SKP Films", logo: skpFilmsLogo },
];

const ClientLogos = () => {
  // Triple the clients for seamless infinite scroll
  const tripleClients = [...clients, ...clients, ...clients];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />
      
      <div className="container relative">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            Trusted Partners
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our Clients
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We've had the privilege of working with amazing brands and businesses
          </p>
        </AnimatedSection>

        {/* Infinite scroll container */}
        <div className="relative">
          {/* Gradient masks for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling logos with CSS animation */}
          <div className="overflow-hidden">
            <div className="flex gap-8 md:gap-16 items-center animate-scroll">
              {tripleClients.map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="flex-shrink-0 group"
                >
                  <div className="w-32 h-20 md:w-40 md:h-24 flex items-center justify-center p-3 md:p-4 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-lg">
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        
        .animate-scroll {
          animation: scroll 25s linear infinite;
          will-change: transform;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default ClientLogos;
