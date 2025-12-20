import React, { useState } from "react";
import {  Twitter, Facebook, Instagram, Send, Mail, Phone, MapPin, Sparkles } from "lucide-react";
import { motion } from 'framer-motion';


const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setIsSubmitting(false);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-sky-900 to-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>


      <div className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex justify-center items-center gap-2 bg-linear-to-r from-sky-600/20 to-primary-600/20 backdrop-blur-sm border border-sky-500/20 rounded-full px-6 py-3 mb-8 group hover:border-sky-500/40 transition-all duration-500"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <Sparkles className="w-8 h-8 md:w-9 md:h-9 text-sky-400 group-hover:text-sky-300 transition-colors duration-300" />
              </motion.div>

              <h1 className="text-3xl md:text-5xl font-bold bg-linear-to-r from-white via-sky-200 to-primary-200 bg-clip-text text-transparent mb-0 group-hover:bg-linear-to-r group-hover:from-sky-100 group-hover:via-sky-300 group-hover:to-primary-300 transition-all duration-500">
                Contact Us
              </h1>
            </motion.div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Ready to transform your design workflow? Let's start a conversation about your project.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
                <h2 className="text-2xl font-bold text-white mb-6 group-hover:text-sky-300 transition-colors">
                  Let's Connect
                </h2>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-sky-600/20 to-transparent hover:from-sky-600/30 transition-all duration-300 group/item cursor-pointer">
                    <div className="bg-linear-to-r from-sky-500 to-primary-500 p-3 rounded-xl group-hover/item:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Email Us</h3>
                      <p className="text-sky-300">marketing@clickmasters.pk</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-primary-600/20 to-transparent hover:from-primary-600/30 transition-all duration-300 group/item cursor-pointer">
                    <div className="bg-linear-to-r from-primary-500 to-cyan-500 p-3 rounded-xl group-hover/item:scale-110 transition-transform">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Call Us</h3>
                      <p className="text-primary-300">+X (XXX) XXX-XXXX</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-green-600/20 to-transparent hover:from-green-600/30 transition-all duration-300 group/item cursor-pointer">
                    <div className="bg-linear-to-r from-green-500 to-emerald-500 p-3 rounded-xl group-hover/item:scale-110 transition-transform">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Visit Us</h3>
                      <p className="text-green-300">PWD, Islamabad | pk</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="font-semibold text-white mb-4">Follow Our Journey</h3>
                  <div className="flex gap-3">
                    {[
                      { icon: Twitter, color: 'from-cyan-400 to-cyan-600', hoverColor: 'hover:from-cyan-300 hover:to-cyan-500' },
                      { icon: Facebook, color: 'from-primary-600 to-primary-800', hoverColor: 'hover:from-primary-500 hover:to-primary-700' },
                      { icon: Instagram, color: 'from-purple-500 via-pink-600 via-red-600 via-orange-600 to-yellow-600', hoverColor: 'hover:from-pink-400 hover:to-sky-500' }
                    ].map((social, index) => (
                      <button
                        key={index}
                        className={`bg-linear-to-br ${social.color} ${social.hoverColor} p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                      >
                        <social.icon className="w-5 h-5 text-white" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-500">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-medium text-sky-200 mb-2 group-focus-within:text-sky-300 transition-colors">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:bg-white/10 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition-all duration-300 outline-none"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-sky-200 mb-2 group-focus-within:text-sky-300 transition-colors">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:bg-white/10 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition-all duration-300 outline-none"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-sky-200 mb-2 group-focus-within:text-sky-300 transition-colors">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:bg-white/10 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20 transition-all duration-300 outline-none resize-none"
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || submitted}
                  className="w-full bg-linear-to-r from-sky-600 to-primary-600 hover:from-sky-500 hover:to-primary-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-sky-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : submitted ? (
                    <>
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>

              {submitted && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
                  <p className="text-green-300 text-center">
                    Thanks for reaching out! We'll get back to you soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;