import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  
  const testimonials = [
    {
      name: "Ayesha Malik",
      role: "Head Nurse",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=150&auto=format&fit=crop",
      text: "The user-friendly interface makes daily tasks like medication administration and patient charting so much faster. It truly helps us focus more on patient care and less on paperwork.",
      rating: 5
    },
    {
      name: "Shafiq Ahmed",
      role: "Hospital Administrator",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
      text: "Implementing this system has streamlined our billing and inventory management, leading to significant cost savings and fewer errors. The analytics provide invaluable insights for strategic planning.",
      rating: 4
    },
    {
      name: "Dr. Ahsan Ali",
      role: "Chief Medical Officer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
      text: "As a Chief Medical Officer, I'm thoroughly impressed by how our new system has integrated all departments, drastically improving patient flow and reducing wait times. It's a game-changer for hospital efficiency.",
      rating: 5
    },
    {
      name: "Dr Fatima Khan",
      role: "Healthcare IT Specialist",
      image: "https://images.unsplash.com/photo-1569913486515-b74bf7751574?q=80&w=150&auto=format&fit=crop",
      text: "From an IT perspective, the seamless integration with existing hardware and the robust security features are outstanding. Deployment was smooth, and ongoing support has been exceptional.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setDirection(1);
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        fill={i < count ? "#8b5cf6" : "#e2e8f0"} 
        className={i < count ? "text-purple-500" : "text-gray-300"} 
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-linear-to-br from-gray-50 to-primary-50 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#38bdf82e_1px,transparent_1px),linear-gradient(to_bottom,#7dd3fc0a_1px,transparent_1px)] bg-[size:14px_24px]"></div><div className="absolute left-0 right-0 top-[-9%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#bae6fd36,#38bdf8)]"></div>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-primary-200 mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-purple-200 mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary-100 text-primary-800 rounded-full mb-4">
            TRUSTED BY HEALTHCARE PROFESSIONALS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
           What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600">
            Hear from healthcare professionals who use our platform daily
          </p>
        </motion.div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md text-purple-600 hover:bg-purple-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 z-10">
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md text-purple-600 hover:bg-purple-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="overflow-hidden h-[400px] relative">
            <AnimatePresence custom={direction}>
              <motion.div
                key={activeTestimonial}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 h-full border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-8 h-full">
                    <div className="md:w-1/3 flex flex-col items-center">
                      <div className="relative mb-6">
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <img
                            src={testimonials[activeTestimonial].image}
                            alt={testimonials[activeTestimonial].name}
                            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                          />
                        </motion.div>
                        <div className="absolute -bottom-3 -right-3 bg-linear-to-r from-purple-500 to-primary-500 text-white p-2 rounded-full shadow-md">
                          <Quote size={20} />
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-gray-900">
                          {testimonials[activeTestimonial].name}
                        </h4>
                        <p className="text-gray-600 mb-3">
                          {testimonials[activeTestimonial].role}
                        </p>
                        <div className="flex justify-center space-x-1">
                          {renderStars(testimonials[activeTestimonial].rating)}
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 flex items-center">
                      <div>
                        <Quote 
                          size={32} 
                          className="text-gray-200 mb-4" 
                        />
                        <motion.blockquote 
                          className="text-gray-700 text-xl md:text-2xl leading-relaxed mb-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          "{testimonials[activeTestimonial].text}"
                        </motion.blockquote>
                        <div className="flex items-center">
                          <div className="flex space-x-1 mr-4">
                            {testimonials.map((_, index) => (
                              <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-all ${index === activeTestimonial ? 'bg-purple-500 w-6' : 'bg-gray-200'}`}
                                onClick={() => {
                                  setDirection(index > activeTestimonial ? 1 : -1);
                                  setActiveTestimonial(index);
                                }}
                                aria-label={`View testimonial from ${testimonials[index].name}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {activeTestimonial + 1} / {testimonials.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-800 mb-6">
            Trusted by leading healthcare institutions worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            {["Hospital", "Clinic", "Medical Group", "Research Center", "University"].map((item, i) => (
              <div key={i} className="text-gray-700 font-medium">
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;