import React from "react";
import { ChevronRight, ArrowRight, Star, Zap, Activity, BarChart2, Smartphone } from "lucide-react";
import Hero_Img from "../../assets/images/hero_img.png";
import Doc1 from "../../assets/doctor/doc-1 (2).png";
import { motion } from 'framer-motion';
import { useSelector } from "react-redux";

const HeroSection = () => {
    const {
      staffList,
      deletedStaffList,
      loading,
      error,
    } = useSelector((state) => state.staff);
    console.log("Staff List tesing:", staffList);
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-950 to-primary-900 text-white pt-24 pb-32 md:pt-32 md:pb-48">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-[800px] h-[800px] rounded-full bg-primary-500/5 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full bg-primary-500/5 blur-[100px] animate-[pulse_12s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[80px] animate-[pulse_10s_ease-in-out_infinite]"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          {/* Text Content */}
          <div className="lg:w-[48%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-6">
                <Zap className="w-4 h-4 mr-2 text-primary-300 fill-primary-300" />
                <span className="text-sm font-medium text-primary-100">Next-Gen Hospital Management</span>
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">CARESYNC</span> HMS
              </h1>
              <p className="text-xl md:text-2xl font-light mb-8 text-gray-300 leading-relaxed">
                Transform healthcare delivery with our AI-powered platform that <span className="font-medium text-white">streamlines operations, enhances patient care,</span> and provides real-time insights for data-driven decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="#"
                  className="relative overflow-hidden group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 py-4 px-8 rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-primary-500/30"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started <ChevronRight className="ml-2" size={18} />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </motion.a>

                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  href="#"
                  className="relative overflow-hidden group border-2 border-white/20 hover:border-white/40 hover:bg-white/5 backdrop-blur-sm transition-all duration-300 py-4 px-8 rounded-xl font-medium flex items-center justify-center"
                >
                  <span className="relative z-10 flex items-center group-hover:text-white">
                    Learn More <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                  </span>
                  <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </motion.a>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
            >
              {/* Avatar Stack */}
              <div className="flex -space-x-3 relative">
                {[1, 2, 3, 4].map((i) => (
                  <motion.img
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 20}.jpg`}
                    className="w-12 h-12 rounded-full border-2 border-white/80 hover:z-10 hover:scale-110 transition-transform duration-200 shadow-md"
                    alt={`User ${i}`}
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                ))}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 }}
                  className="absolute -right-3 top-0 bg-primary-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                >
                  +4K
                </motion.span>
              </div>

              {/* Rating and Trust Info */}
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <Star
                        size={18}
                        className="text-yellow-400 fill-yellow-400 drop-shadow-sm"
                      />
                    </motion.div>
                  ))}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="ml-1 text-sm font-medium text-white"
                  >
                    5.0
                  </motion.span>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-sm text-gray-300 mt-1"
                >
                  Trusted by <span className="font-semibold text-white">500+</span> hospitals worldwide
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* Image Content */}
          <div className="lg:w-[52%] flex justify-center relative mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full max-w-2xl"
            >
              {/* Main Hero Image */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
                <img
                  className="w-full h-auto object-cover"
                  src={Hero_Img}
                  alt="Hospital Management System Dashboard"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              {/* Floating Analytics Card */}
              <motion.div
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -5 }}
                className="absolute -bottom-28 -left-10 z-20 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200/30 overflow-hidden transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-3 flex justify-between items-center">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-white" />
                    <h3 className="font-semibold text-white">Performance Metrics</h3>
                  </div>
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/80"></div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                      <span>Patient Satisfaction</span>
                      <span className="font-medium text-primary-600">94%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full"
                        style={{ width: "94%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                      <span>Staff Efficiency</span>
                      <span className="font-medium text-primary-600">87%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full"
                        style={{ width: "87%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-primary-600">4.8K</div>
                      <div className="text-xs text-gray-500">Daily Patients</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-primary-600">92%</div>
                      <div className="text-xs text-gray-500">Retention</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-primary-600">24/7</div>
                      <div className="text-xs text-gray-500">Support</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Doctor Image Card */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.03 }}
                className="absolute -top-12 -right-8 lg:-right-16 z-20"
              >
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  <img
                    src={Doc1}
                    alt="Doctor using CARESYNC HMS"
                    className="w-48 lg:w-60 h-auto rounded-xl object-cover transition-all duration-500 hover:brightness-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                   
                  </div>
                </div>
              </motion.div>

              {/* Mobile App Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ y: -5, rotate: -2 }}
                className="absolute -top-28 left-8 lg:left-16 z-20 w-40 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200/50 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-3 py-2 text-white text-xs font-medium flex justify-between items-center">
                  <div className="flex items-center">
                    <Smartphone className="w-3 h-3 mr-1.5" />
                    <span>Mobile App</span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-end justify-between h-16 mb-2">
                    <div className="w-2 h-8 bg-primary-400 rounded-t-sm"></div>
                    <div className="w-2 h-5 bg-primary-400 rounded-t-sm"></div>
                    <div className="w-2 h-9 bg-primary-500 rounded-t-sm"></div>
                    <div className="w-2 h-4 bg-primary-300 rounded-t-sm"></div>
                    <div className="w-2 h-7 bg-primary-400 rounded-t-sm"></div>
                    <div className="w-2 h-6 bg-primary-400 rounded-t-sm"></div>
                    <div className="w-2 h-8 bg-primary-500 rounded-t-sm"></div>
                  </div>
                  <div className="text-xs text-center text-gray-600 font-medium">Weekly Usage</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;