import React, { useState } from "react";
import { Check, Zap, Shield, Users, HeartPulse, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const PricingSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const plans = [
    {
      name: "Clinic Plan",
      price: "$0",
      period: "/mo",
      description: "Perfect for small clinics and private practices",
      features: [
        "Up to 10 staff accounts",
        "100 patient records",
        "Basic appointment scheduling",
        "Prescription management",
        "Medical billing",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false,
      icon: <Stethoscope className="w-6 h-6" />,
      color: "from-sky-500 to-sky-600"
    },
    {
      name: "Hospital Plan",
      price: "$99",
      period: "/mo",
      description: "Ideal for medium-sized hospitals and healthcare centers",
      features: [
        "Unlimited staff accounts",
        "Unlimited patient records",
        "Advanced scheduling",
        "Electronic Health Records",
        "Lab integration",
        "Billing & insurance",
        "24/7 phone support",
        "Training sessions"
      ],
      cta: "Get Started",
      popular: true,
      icon: <HeartPulse className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/mo",
      description: "For large hospital networks and healthcare systems",
      features: [
        "Multi-location management",
        "Custom EHR solutions",
        "API integrations",
        "Dedicated account manager",
        "On-premise deployment",
        "HIPAA compliance audit",
        "Priority 24/7 support",
        "Custom development"
      ],
      cta: "Contact Sales",
      popular: false,
      icon: <Users className="w-6 h-6" />,
      color: "from-emerald-500 to-emerald-600"
    }
  ];

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -10 }
  };

  return (
    <section id="pricing" className="py-20 bg-linear-to-br from-sky-50 to-primary-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-sky-400 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-purple-400 mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-8 py-2 text-sm font-semibold bg-sky-100 text-sky-800 rounded-full mb-4">
            FLEXIBLE PLANS
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gray-800">
            Healthcare Solutions for Every Scale
          </h2>
          <p className="text-lg text-gray-600">
            Transparent pricing with enterprise-grade features for organizations of all sizes
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              variants={cardVariants}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              viewport={{ once: true, margin: "-100px" }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`relative rounded-xl overflow-hidden shadow-xl ${hoveredCard === index ? "shadow-2xl" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-bold uppercase py-1 px-4 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className={`absolute inset-0 bg-linear-to-br ${plan.color} opacity-10`}></div>
              
              <div className="relative bg-white bg-opacity-70 backdrop-blur-sm p-8 h-full">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-linear-to-br ${plan.color} text-white mr-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="font-bold text-2xl text-gray-800">{plan.name}</h3>
                </div>
                
                <div className="flex items-end mb-6">
                  <span className="text-5xl font-bold bg-clip-text text-transparent bg-linear-to-br from-gray-800 to-gray-600">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-lg text-gray-500 ml-2 mb-1">{plan.period}</span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-8">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full py-3 px-6 text-center rounded-lg font-medium transition-all ${
                    plan.popular 
                      ? "bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-linear-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {plan.cta}
                </motion.a>
                
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto border border-gray-100"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-sky-50 p-4 rounded-lg mb-4 md:mb-0 md:mr-6">
              <Zap className="w-8 h-8 text-sky-600" />
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold text-gray-800 mb-2">Need custom solutions?</h4>
              <p className="text-gray-600 mb-4">
                We offer tailored implementations for specialized healthcare requirements including 
                telemedicine, clinical research, and multi-site management.
              </p>
              <a 
                href="#" 
                className="inline-flex items-center text-sky-600 underline bg-sky-50 rounded-tr-xl p-2 font-semibold hover:text-sky-800"
              >
                Contract our expert
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;