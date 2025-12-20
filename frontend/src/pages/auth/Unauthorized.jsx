import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertOctagon, ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UnauthorizedUser = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  const createRipple = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const size = Math.max(width, height) * 2;
    
    setRipples(prev => [...prev, {
      x,
      y,
      size,
      id: Date.now()
    }]);
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-red-900 to-gray-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-linear-to-r from-red-900/10 to-purple-900/10"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              opacity: 0.1
            }}
            animate={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse'
              }
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full lg:max-w-2xl max-w-md px-6"
      >
        <motion.div 
          className="glass-container p-8 rounded-2xl border border-white/10 backdrop-blur-lg shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            boxShadow: isHovered 
              ? '0 25px 50px -12px rgba(239, 68, 68, 0.3)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            borderColor: isHovered ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)'
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with animated icon */}
          <motion.div 
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative mb-6">
              <motion.div 
                className="absolute inset-0 bg-red-900/30 rounded-full blur-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 0.9, 0.7]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="relative flex justify-center p-4 bg-white/5 rounded-full border-2 border-red-900/50"
                whileHover={{ rotate: 10 }}
              >
                <ShieldAlert size={72} className="text-red-400" strokeWidth={1.2} />
              </motion.div>
            </div>
            
            <motion.h1 
              className="text-5xl font-bold mb-3 bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            >
              ACCESS DENIED
            </motion.h1>
            
            <motion.p 
              className="text-gray-300 mb-8 text-lg text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Unauthorized access detected! You don't have permission to view this content.
            </motion.p>
          </motion.div>
          
          {/* Buttons with ripple effect */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <motion.button
              onClick={(e) => {
                createRipple(e);
                navigate(-1);
              }}
              className="relative flex items-center justify-center gap-2 flex-1 bg-linear-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl font-medium overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <AnimatePresence>
                {ripples.map(ripple => (
                  <motion.span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      left: ripple.x - ripple.size / 2,
                      top: ripple.y - ripple.size / 2,
                      width: ripple.size,
                      height: ripple.size,
                    }}
                  />
                ))}
              </AnimatePresence>
              <ArrowLeft size={20} />
              Go Back
            </motion.button>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 flex-1 border-2 border-gray-600 text-gray-300 px-6 py-4 rounded-xl font-medium hover:bg-gray-700/50 hover:text-white transition-all"
              >
                <LogIn size={20} />
                Go to Login
              </Link>
            </motion.div>
          </div>
          
          <motion.p 
            className="mt-8 text-sm text-gray-400 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Your attempt has been logged for security purposes.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Glass morphism styles */}
      <style jsx="true">{`
        .glass-container {
          background: rgba(15, 23, 42, 0.5);
          box-shadow: 0 8px 32px 0 ;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
};

export default UnauthorizedUser;