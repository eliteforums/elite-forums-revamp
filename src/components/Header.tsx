import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const navLinks = [
  { name: "Home", href: "#home", isPage: false },
  {
    name: "About",
    href: "#about",
    isPage: false,
    children: [
      { name: "About Us", href: "#about", isPage: false },
      { name: "Trainings", href: "/trainings", isPage: true },
      { name: "Projects", href: "/projects", isPage: true },
    ],
  },
  { name: "Services", href: "#services", isPage: false },
  { name: "Products", href: "#products", isPage: false },
  { name: "Contact", href: "#contact", isPage: false },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
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
    setOpenDropdown(null);

    if (isPage) {
      navigate(href);
      return;
    }

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

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
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
        <nav className="hidden lg:flex items-center">
          <div className="flex items-center gap-1 bg-secondary/60 rounded-full px-2 py-1.5 backdrop-blur-sm">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all px-4 py-2 rounded-full flex items-center gap-1"
                    >
                      {link.name}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <div
                      className={`absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-2xl shadow-lg overflow-hidden transition-all duration-200 ${
                        openDropdown === link.name
                          ? 'opacity-100 visible translate-y-0'
                          : 'opacity-0 invisible -translate-y-2'
                      }`}
                    >
                      {link.children.map((child) => (
                        <button
                          key={child.name}
                          onClick={() => handleNavClick(child.href, child.isPage)}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick(link.href, link.isPage)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all px-4 py-2 rounded-full"
                  >
                    {link.name}
                  </button>
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="hidden lg:block">
          <Button
            onClick={() => handleNavClick("#contact", false)}
            className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-6"
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
          <nav className="container py-6 flex flex-col gap-2">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.children ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className="w-full flex items-center justify-between text-lg font-medium text-foreground py-2 hover:text-accent transition-colors"
                    >
                      {link.name}
                      <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.name && (
                      <div className="pl-4 border-l-2 border-accent/30 ml-2 mt-1 space-y-1">
                        {link.children.map((child) => (
                          <button
                            key={child.name}
                            onClick={() => handleNavClick(child.href, child.isPage)}
                            className="block w-full text-left text-base font-medium text-muted-foreground py-2 hover:text-accent transition-colors"
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick(link.href, link.isPage)}
                    className="text-lg font-medium text-foreground py-2 text-left hover:text-accent transition-colors"
                  >
                    {link.name}
                  </button>
                )}
              </div>
            ))}
            <Button
              onClick={() => handleNavClick("#contact", false)}
              className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-full"
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
