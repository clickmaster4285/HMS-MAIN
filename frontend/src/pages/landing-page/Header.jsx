import React, { useState } from "react";
import { Menu, X, PenTool, Building, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/landing-page/logo.png";

const Header = ({ scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-linear-to-r from-indigo-900 to-primary-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-auto w-14 rounded-md flex items-center justify-center mr-2">
            <img src={Logo} alt="ClickMasters HMS Logo" />
          </div>
          <span className="font-bold text-lg tracking-wide">ClickMasters HMS</span>
         
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("features");
            }}
            className="hover:text-primary-300 transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("testimonials");
            }}
            className="hover:text-primary-300 transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("pricing");
            }}
            className="hover:text-primary-300 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("contact");
            }}
            className="hover:text-primary-300 transition-colors"
          >
            Contact
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => navigate("/profiles")} className="hover:text-primary-300 border rounded-md border-primary-500 transition-colors py-1.5 px-2.5 font-medium">Login</button>
          <button onClick={() => navigate("/signup")} 
           className="rounded-md transition-colors py-1.5 px-2.5 bg-primary-500 hover:bg-primary-600 font-medium">Sign Up</button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-900 px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <a
              href="#features"
              className="hover:text-primary-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("features");
                toggleMenu();
              }}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="hover:text-primary-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("testimonials");
                toggleMenu();
              }}
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="hover:text-primary-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("pricing");
                toggleMenu();
              }}
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="hover:text-primary-300 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("contact");
                toggleMenu();
              }}
            >
              Contact
            </a>
            <div className="pt-4 flex flex-col space-y-2">
              <button
                onClick={() => navigate("/profiles")}
                className="hover:text-primary-300  border border-primary-500 rounded-md py-1 transition-colors">Login</button>
              <button  onClick={() => navigate("/signup")} className="rounded-md transition-colors py-1 bg-primary-500 hover:bg-primary-600 font-medium">Sign Up</button>

            </div>
          </nav>
        </div>
      )} 
    </header>
  );
};

export default Header;