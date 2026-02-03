import logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ArrowUpRight, Linkedin, Instagram } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

const Footer = () => {
  const navigate = useNavigate();
  
  const handleClick = (href: string) => {
    if (href.startsWith("/#")) {
      // Hash link with path - navigate to home and scroll to section
      const hash = href.substring(1); // Remove leading /
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
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container py-20 relative">
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
            <p className="text-primary-foreground/70 mb-8 max-w-sm leading-relaxed text-lg">
              Empowering businesses with cutting-edge technology solutions. We
              transform ideas into digital reality through innovation and
              expertise.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <a href="tel:+919322510601" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span>+91 9322510601</span>
              </a>
              <a href="mailto:admin@eliteforums.in" className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span>admin@eliteforums.in</span>
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
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
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent/30 transition-colors"
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
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-2 group"
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
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-2 group"
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
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-primary-foreground/10 mt-16 pt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Elite Forums. All rights reserved.
            </p>
            <p className="text-sm text-primary-foreground/60 flex items-center gap-2">
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
