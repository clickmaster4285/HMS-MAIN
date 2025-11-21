import React, { useState } from "react";
import {  Twitter, Facebook, Instagram, Link,  Heart, Star } from "lucide-react";
import Logo from "../../assets/landing-page/logo.png";


const Footer = () => {
  const [email, setEmail] = useState('');

  const socialLinks = [
    { icon: Twitter, href: "#", color: "hover:text-sky-400", bgColor: "hover:bg-sky-400/10" },
    { icon: Facebook, href: "#", color: "hover:text-primary-600", bgColor: "hover:bg-primary-600/10" },
    { icon: Instagram, href: "#", color: "hover:text-purple-500", bgColor: "hover:bg-purple-500/10" },
    { icon: Link, href: "#", color: "hover:text-gray-400", bgColor: "hover:bg-white/10" }
  ];


  return (
    <footer className="relative bg-gradient-to-br from-indigo-900 via-sky-900 to-primary-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative z-10">
      

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <div className="flex items-center mb-6 group">
                  <div className="h-20 w-20 bg-gray-400/30 rounded-xl flex items-center p-1 backdrop-blur-sm justify-center mr-3 group-hover:scale-110 transition-transform">
                   <img src={Logo} alt="CareSync Logo" />
                  </div>
                  <span className="font-bold text-2xl bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                    CareSync
                  </span>
                </div>
                
                <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
                  Empowering healthcare providers with data-driven insights to create better patient experiences and operational efficiency.
                </p>
                
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl ${social.color} ${social.bgColor} transition-all duration-300 hover:scale-110 hover:border-white/20`}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Product Links */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-white">Product</h3>
                <ul className="space-y-3">
                  {["Features", "Analytics", "Integrations", "Pricing", "Updates"].map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-slate-400 underline hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-white">Company</h3>
                <ul className="space-y-3">
                  {["About Us", "Our Team", "Careers", "Blog", "Contact Us"].map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-slate-400 hover:text-white underline transition-colors duration-300 hover:translate-x-1 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="font-bold text-lg mb-6 text-white">Resources</h3>
                <ul className="space-y-3">
                  {["Documentation", "Tutorials", "Support", "API", "Community"].map((item, i) => (
                    <li key={i}>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300 underline hover:translate-x-1 inline-block">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-slate-700/50 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>&copy; 2025 CURESYNC.  Healthcare Solutions</span>
                  <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                  
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex gap-6">
                    {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, i) => (
                      <a 
                        key={i}
                        href="#"
                        className="text-slate-400 hover:text-white underline transition-colors duration-300 text-sm"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;