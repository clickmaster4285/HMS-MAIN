import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  Star, 
  Users, 
  HeartPulse, 
  Headset,
  Activity,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";

const StatsSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [hasAnimated, setHasAnimated] = useState(false);

  const stats = [
    { 
      value: "4.9", 
      label: "Average rating from hospital staff", 
      icon: <Star className="w-10 h-10 text-yellow-400" />,
      color: "text-yellow-400"
    },
    { 
      value: "250+", 
      label: "Healthcare IT & medical expert team members", 
      icon: <Users className="w-10 h-10 text-sky-400" />,
      color: "text-sky-400"
    },
    { 
      value: "98%", 
      label: "Patient satisfaction improvement rate", 
      icon: <HeartPulse className="w-10 h-10 text-emerald-400" />,
      color: "text-emerald-400"
    },
    { 
      value: "24/7", 
      label: "Technical support & clinical assistance available", 
      icon: <Headset className="w-10 h-10 text-purple-400" />,
      color: "text-purple-400"
    },
  ];

  useEffect(() => {
    if (inView && !hasAnimated) {
      controls.start("visible");
      setHasAnimated(true);
    }
  }, [controls, inView, hasAnimated]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100
      }
    }
  };

  return (
    <section
      className="py-20 bg-linear-to-r from-primary-900 to-sky-900 text-white relative overflow-hidden"
      ref={ref}
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Healthcare Excellence in Numbers</h2>
          <p className="text-sky-200 max-w-2xl mx-auto text-lg">
            Our commitment to quality care is reflected in these milestones
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 group"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-white bg-opacity-20 mb-4 group-hover:bg-opacity-30 transition-colors">
                {stat.icon}
              </div>
              <motion.div
                className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
              >
                {stat.value}
              </motion.div>
              <p className="text-gray-700 font-medium">{stat.label}</p>
              <motion.div
                className="h-1 bg-sky-400 mt-4 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;