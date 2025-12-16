import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", href: "#home", isPage: false },
  { name: "About", href: "#about", isPage: false },
  { name: "Services", href: "#services", isPage: false },
  { name: "Trainings", href: "/trainings", isPage: true },
  { name: "Projects", href: "#projects", isPage: false },
  { name: "Contact", href: "#contact", isPage: false },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string, isPage: boolean) => {
    setIsMobileMenuOpen(false);
    
    if (isPage) {
      navigate(href);
      return;
    }

    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/" + href);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogoClick = () => {
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      const element = document.querySelector("#home");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <button onClick={handleLogoClick} className="flex items-center gap-3">
          <img src={logo} alt="Elite Forums" className="h-10 w-10" />
          <span className="text-xl font-bold text-foreground">Elite Forums</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href, link.isPage)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            onClick={() => handleNavClick("#contact", false)}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b shadow-lg animate-fade-in">
          <nav className="container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href, link.isPage)}
                className="text-lg font-medium text-foreground py-2 text-left hover:text-accent transition-colors"
              >
                {link.name}
              </button>
            ))}
            <Button
              onClick={() => handleNavClick("#contact", false)}
              className="mt-4 bg-gradient-primary hover:opacity-90 transition-opacity w-full"
            >
              Get Started
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;