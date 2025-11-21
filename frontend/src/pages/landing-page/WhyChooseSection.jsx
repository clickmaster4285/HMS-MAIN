import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Stethoscope, ClipboardList, Bed, Pill, Users, Shield,
  Calendar, FileSearch, Activity, ChevronRight,
  Smartphone, Cloud, BrainCircuit, MessageSquare,
  FileBarChart2, Lock, ClipboardCheck, Zap
} from "lucide-react";

const FeatureCard = ({ icon, title, description, color, hoverColor, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.1, duration: 0.5 }
      });
    }
  }, [controls, inView, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      whileHover={{ y: -5 }}
      className={`group relative flex flex-col p-6 rounded-2xl transition-all duration-300 ${hoverColor} hover:shadow-xl bg-white border border-gray-200/80 overflow-hidden`}
    >
      {/* Animated background element */}
      <motion.div
        className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${color.replace('bg-', 'bg-').replace('text-', 'text-')} opacity-10 group-hover:opacity-20 transition-all duration-500`}
        initial={{ scale: 0.5 }}
        whileHover={{ scale: 1.2 }}
      />
      
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${color} group-hover:scale-110 transition-transform relative z-10`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3 relative z-10">{title}</h3>
      <p className="text-gray-600 mb-6 relative z-10">{description}</p>
      
      {/* Animated "learn more" indicator */}
      <motion.div 
        className="absolute bottom-4 left-6 text-primary-500 font-medium flex items-center"
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        Learn more <ChevronRight size={16} className="ml-1" />
      </motion.div>
    </motion.div>
  );
};

const CombinedFeaturesSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const features = [
    {
      icon: <Stethoscope size={24} />,
      title: "Comprehensive OPD Management",
      description: "Simplify patient onboarding and maintain complete digital health records for every visit.",
      color: "bg-primary-50 text-primary-600",
      hoverColor: "hover:bg-primary-50/50"
    },
    {
      icon: <Bed size={24} />,
      title: "Efficient IPD Management",
      description: "Manage inpatient admissions, bed allocation, nursing care, and discharge processes seamlessly.",
      color: "bg-green-50 text-green-600",
      hoverColor: "hover:bg-green-50/50"
    },
    {
      icon: <ClipboardList size={24} />,
      title: "Operation Theater Scheduling",
      description: "Coordinate surgical procedures, staff assignments, equipment availability, and post-op care plans.",
      color: "bg-purple-50 text-purple-600",
      hoverColor: "hover:bg-purple-50/50"
    },
    {
      icon: <Pill size={24} />,
      title: "Automated Billing & Pharmacy",
      description: "Integrated billing, pharmacy, and lab modules for seamless hospital operations.",
      color: "bg-red-50 text-red-600",
      hoverColor: "hover:bg-red-50/50"
    },
    {
      icon: <Users size={24} />,
      title: "HR & Staff Management",
      description: "Manage staff schedules, payroll, training, and performance tracking for all hospital personnel.",
      color: "bg-amber-50 text-amber-600",
      hoverColor: "hover:bg-amber-50/50"
    },
    {
      icon: <Shield size={24} />,
      title: "Secure Data & Compliance",
      description: "Protect sensitive health information with advanced security and compliance standards.",
      color: "bg-teal-50 text-teal-600",
      hoverColor: "hover:bg-teal-50/50"
    },
    {
      icon: <Calendar size={24} />,
      title: "Appointment System",
      description: "Online booking, automated reminders, and resource allocation for optimized patient flow.",
      color: "bg-pink-50 text-pink-600",
      hoverColor: "hover:bg-pink-50/50"
    },
    {
      icon: <FileSearch size={24} />,
      title: "Medical Billing",
      description: "Integrated billing system supporting insurance claims, payment processing, and reporting.",
      color: "bg-orange-50 text-orange-600",
      hoverColor: "hover:bg-orange-50/50"
    },
    {
      icon: <Smartphone size={24} />,
      title: "Mobile Accessibility",
      description: "Access patient records and manage operations from anywhere with our responsive mobile interface.",
      color: "bg-indigo-50 text-indigo-600",
      hoverColor: "hover:bg-indigo-50/50"
    },
    {
      icon: <BrainCircuit size={24} />,
      title: "AI-Enhanced Technology",
      description: "Smart diagnostics, predictive analytics, and automated workflows powered by artificial intelligence.",
      color: "bg-fuchsia-50 text-fuchsia-600",
      hoverColor: "hover:bg-fuchsia-50/50"
    },
    {
      icon: <Cloud size={24} />,
      title: "Cloud-Based Solution",
      description: "Secure, scalable infrastructure with automatic updates and 99.9% uptime guarantee.",
      color: "bg-sky-50 text-sky-600",
      hoverColor: "hover:bg-sky-50/50"
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Automated Patient Feedback",
      description: "100% digital feedback collection with sentiment analysis to improve patient satisfaction.",
      color: "bg-emerald-50 text-emerald-600",
      hoverColor: "hover:bg-emerald-50/50"
    },
    {
      icon: <Lock size={24} />,
      title: "Enterprise-Grade Security",
      description: "End-to-end encryption, multi-factor authentication, and regular security audits.",
      color: "bg-violet-50 text-violet-600",
      hoverColor: "hover:bg-violet-50/50"
    },
    {
      icon: <ClipboardCheck size={24} />,
      title: "Regulatory Compliance",
      description: "Built-in compliance with HIPAA, GDPR, and other healthcare regulations worldwide.",
      color: "bg-cyan-50 text-cyan-600",
      hoverColor: "hover:bg-cyan-50/50"
    },
    {
      icon: <FileBarChart2 size={24} />,
      title: "Advanced MIS Reporting",
      description: "Customizable reports and dashboards for informed decision-making at all levels.",
      color: "bg-rose-50 text-rose-600",
      hoverColor: "hover:bg-rose-50/50"
    },
    {
      icon: <Activity size={24} />,
      title: "Analytics Dashboard",
      description: "Real-time hospital performance metrics and operational KPIs for data-driven decisions.",
      color: "bg-lime-50 text-lime-600",
      hoverColor: "hover:bg-lime-50/50"
    }
  ];

  return (
    <section 
      id="features" 
      className="py-20 -z-10 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#fff_25%,#166585_100%)]"
      ref={ref}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.span 
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-sky-600 bg-sky-100 rounded-full mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Zap size={16} className="mr-2 fill-sky-500 text-sky-500" />
            Why Choose <span className="font-bold tracking-wider px-1">CARESYNC</span> HMS
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Complete Healthcare Management Solution
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Our integrated platform connects all hospital departments, streamlining operations and improving 
            patient care through digital transformation with reliability and efficiency.
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} index={index} {...feature} />
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button 
            className="px-8 py-3.5 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-sky-700 hover:to-teal-700 inline-flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Request Demo
            <ChevronRight size={18} className="ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CombinedFeaturesSection;