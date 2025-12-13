import logo from "@/assets/logo.png";

const footerLinks = {
  services: [
    { name: "Web Development", href: "#services" },
    { name: "App Development", href: "#services" },
    { name: "AI Automation", href: "#services" },
    { name: "Cloud Computing", href: "#services" },
  ],
  trainings: [
    { name: "Generative AI", href: "#trainings" },
    { name: "MERN Stack", href: "#trainings" },
    { name: "Data Science", href: "#trainings" },
    { name: "Cloud Computing", href: "#trainings" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ],
};

const Footer = () => {
  const handleClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Elite Forums" className="h-10 w-10 invert" />
              <span className="text-xl font-bold">Elite Forums</span>
            </div>
            <p className="text-primary-foreground/70 mb-6 max-w-sm leading-relaxed">
              Empowering businesses with cutting-edge technology solutions. We
              transform ideas into digital reality through innovation and
              expertise.
            </p>
            <div className="text-sm text-primary-foreground/60">
              <p>Mumbai, MH 401209</p>
              <p>+91 95118 68948</p>
              <p>eliteforumsindia@zohomail.in</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Trainings */}
          <div>
            <h4 className="font-semibold mb-4">Trainings</h4>
            <ul className="space-y-3">
              {footerLinks.trainings.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleClick(link.href)}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} Elite Forums. All rights reserved.
            </p>
            <p className="text-sm text-primary-foreground/60">
              Crafted with passion in Mumbai, India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
