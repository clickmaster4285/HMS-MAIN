import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { 
  Activity,
  ClipboardList,
  User,
  Bed,
} from "lucide-react";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Dashboard1 from "../../assets/landing-page/d-1.png";
import Dashboard2 from "../../assets/landing-page/d-2.png";
import Dashboard3 from "../../assets/landing-page/d-3.png";
import Dashboard4 from "../../assets/landing-page/d-4.png";


const DashboardShowcaseSection = () => {
  const dashboards = [
    {
      image: Dashboard1,
      title: "Patient Overview Dashboard",
      description: "Comprehensive view of patient statistics, admissions, and department utilization",
      features: ["Real-time patient count", "Bed occupancy rates", "Department-wise metrics"],
      color: "sky"
    },
    {
      image: Dashboard2,
      title: "Administration & Performance",
      description: "Medical staff performance and treatment effectiveness metrics",
      features: ["Doctor productivity", "Treatment success rates", "Medication tracking"],
      color: "green"
    },
    {
      image: Dashboard3,
      title: "Reception & Billing",
      description: "Revenue, expenses, and insurance claim processing dashboard",
      features: ["Billing analytics", "Insurance claims status", "Revenue streams"],
      color: "amber"
    },
    {
      image: Dashboard4,
      title: "Human Resources",
      description: "Hospital resource allocation and staff scheduling",
      features: ["Staff scheduling", "Equipment utilization", "OR time management"],
      color: "purple"
    }
  ];

  // Color mapping
  const colorMap = {
    sky: { bg: "bg-sky-100", text: "text-sky-600", border: "border-sky-200" },
    green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
    amber: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-200" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" }
  };

  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-sky-600 bg-sky-100 rounded-full mb-4">
            Hospital Analytics
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Intelligent Hospital Management Dashboards
          </h2>
          <p className="text-lg text-gray-600">
            Real-time data visualization and analytics to optimize patient care and hospital operations.
          </p>
        </motion.div>

        {/* Swiper Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="rounded-2xl shadow-xl border border-gray-100"
          >
            {dashboards.map((dashboard, index) => (
              <SwiperSlide key={index}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Dashboard Image */}
                  <div className="p-2">
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm h-full">
                      <img 
                        src={dashboard.image} 
                        alt={dashboard.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Mockup Browser Bar */}
                      <div className="absolute top-0 left-0 right-0 bg-gray-900 h-10 flex items-center px-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1 text-center text-xs text-gray-300 truncate px-4 font-mono">
                          hospital-management.com/{dashboard.title.toLowerCase().replace(/\s+/g, '-')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Details */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-3 h-3 rounded-full ${colorMap[dashboard.color].bg}`}></div>
                      <span className="text-sm font-medium text-gray-500">Dashboard Preview</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{dashboard.title}</h3>
                    <p className="text-gray-600 mb-6">{dashboard.description}</p>
                    
                    <div className="space-y-3 mb-8">
                      {dashboard.features.map((feature, i) => (
                        <div key={i} className="flex items-start">
                          <div className={`mt-1 mr-3 shrink-0 ${colorMap[dashboard.color].text}`}>
                            <CheckCircle size={18} />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button className={`self-start px-6 py-2 rounded-lg ${colorMap[dashboard.color].bg} ${colorMap[dashboard.color].text} font-medium hover:opacity-90 transition-opacity`}>
                      Learn More
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* Quick Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto"
        >
          {[
            { icon: <Activity size={24} />, title: "Real-time Analytics", color: "sky" },
            { icon: <ClipboardList size={24} />, title: "Patient Records", color: "green" },
            { icon: <User size={24} />, title: "Staff Management", color: "purple" },
            { icon: <Bed size={24} />, title: "Bed Occupancy", color: "amber" }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className={`bg-white p-5 rounded-xl border ${colorMap[feature.color].border} shadow-sm hover:shadow-md transition-all text-center`}
            >
              <div className={`w-12 h-12 mx-auto ${colorMap[feature.color].bg} rounded-lg flex items-center justify-center mb-3`}>
                {React.cloneElement(feature.icon, { className: colorMap[feature.color].text })}
              </div>
              <h4 className="font-medium text-gray-900">{feature.title}</h4>
              <p className="text-sm text-gray-500 mt-2">Comprehensive tracking and reporting</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Custom CheckCircle icon component (can be replaced with Lucide if available)
const CheckCircle = ({ size = 18, className = "" }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
};

export default DashboardShowcaseSection;