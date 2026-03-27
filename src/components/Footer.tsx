import logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import averanceLogo from "@/assets/clients/averance.png";
import bizMilleniumLogo from "@/assets/clients/biz-millenium.jpg";
import identitySpaceLogo from "@/assets/clients/identity-space.png";
import jumpstartLogo from "@/assets/clients/jumpstart.png";
import crystaInternationalLogo from "@/assets/clients/crysta-international.png";
import prepaiLogo from "@/assets/clients/prepai.png";
import helloDigiSirLogo from "@/assets/clients/hello-digi-sir.jpeg";
import noshItLogo from "@/assets/clients/nosh-it.jpg";
import identityBrandLogo from "@/assets/clients/identity-brand.png";

const footerLinks = {
  services: [
    { name: "Web Development", href: "/#services" },
    { name: "App Development", href: "/#services" },
    { name: "AI Automation", href: "/#services" },
    { name: "Cloud Computing", href: "/#services" },
  ],
  trainings: [
    { name: "Generative AI", href: "/trainings" },
    { name: "MERN Stack", href: "/trainings" },
    { name: "Data Science", href: "/trainings" },
    { name: "Cloud Computing", href: "/trainings" },
  ],
  company: [
    { name: "About Us", href: "/#about" },
    { name: "Projects", href: "/projects" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/#contact" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://in.linkedin.com/company/eliteforums", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/eliteforums/", label: "Instagram" },
];

const clientLogos = [
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

const Footer = () => {
  const navigate = useNavigate();
  
  const handleClick = (href: string) => {
    if (href.startsWith("/#")) {
      const hash = href.substring(1);
      if (window.location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const element = document.querySelector(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else if (href.startsWith("/")) {
      navigate(href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Large CTA Section */}
      <div className="container pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Have 🥳 Great Idea?<br />
            <span className="text-accent">Tell Us About It.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleClick("/#about")}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-full font-semibold hover:bg-accent/90 transition-colors"
            >
              About Us
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleClick("/#contact")}
              className="inline-flex items-center gap-2 border-2 border-background/20 text-background px-7 py-3.5 rounded-full font-semibold hover:bg-background hover:text-foreground transition-colors"
            >
              Company Details
            </button>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-background/10" />

      <div className="container py-16 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <img src={logo} alt="Elite Forums" className="h-12 w-12 invert" />
              <span className="text-2xl font-bold">Elite Forums</span>
            </motion.div>
            <p className="text-background/60 mb-8 max-w-sm leading-relaxed text-lg">
              Empowering businesses with cutting-edge technology solutions. We
              transform ideas into digital reality through innovation and
              expertise.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <a href="tel:+919322510601" className="flex items-center gap-3 text-background/60 hover:text-background transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span>+91 9322510601</span>
              </a>
              <a href="mailto:admin@eliteforums.in" className="flex items-center gap-3 text-background/60 hover:text-background transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span>admin@eliteforums.in</span>
              </a>
              <div className="flex items-center gap-3 text-background/60">
                <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>Mumbai, MH 401209</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-accent/30 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-background/60 hover:text-background transition-colors flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Trainings */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Trainings</h4>
            <ul className="space-y-4">
              {footerLinks.trainings.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-background/60 hover:text-background transition-colors flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-background/60 hover:text-background transition-colors flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Client logos strip */}
        <div className="border-t border-background/10 mt-16 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-0 mb-8">
            {clientLogos.map((client, index) => (
              <div key={client.name} className="flex items-center">
                <div className="px-4 py-2">
                  <img
                    src={client.image}
                    alt={client.name}
                    className="h-8 w-auto object-contain opacity-40 hover:opacity-70 transition-opacity invert"
                  />
                </div>
                {index < clientLogos.length - 1 && (
                  <div className="w-px h-6 bg-background/10 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-background/10 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} Elite Forums. All rights reserved.
            </p>
            <p className="text-sm text-background/50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Crafted with passion in Mumbai, India
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
