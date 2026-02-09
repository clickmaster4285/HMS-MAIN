import React from "react";

const CTASection = () => {
  return (
    <section className="relative py-24 bg-linear-to-br from-indigo-50 via-sky-100 to-primary-100 text-gray-700 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-sky-500 rounded-full mix-blend-overlay filter blur-xl animate-float"></div>
        <div className="absolute bottom-10 right-20 w-60 h-60 bg-indigo-600 rounded-full mix-blend-overlay filter blur-xl animate-float-delay"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block border border-gray-300 mb-4 px-6 py-2 text-sm font-semibold text-gray-700 bg-black/10 rounded-full backdrop-blur-sm">
            ✨ Change is what makes difference
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-sky-400">transform</span> your hospital operations?
          </h2>
          <p className="text-xl mb-10 text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Join <span className="font-semibold text-gray-900">ClickMasters HMS</span> and deliver better patient care with data-driven insights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://clickmasters.pk/contact-us/"
              className="relative group bg-white text-primary-700 hover:bg-gray-50 transition-all duration-300 py-4 px-10 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span className="relative z-10">Start Free Trial</span>
              <span className="absolute inset-0 bg-linear-to-r from-cyan-400 to-sky-400 opacity-0 group-hover:opacity-10 transition-opacity rounded-lg"></span>
            </a>
            <a 
              href="https://clickmasters.pk/contact-us/"
              className="relative group border-2 border-black/30 hover:border-black/50 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 py-4 px-10 rounded-lg font-semibold hover:-translate-y-0.5"
            >
              <span className="relative z-10">Schedule Demo</span>
              <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md"></span>
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-700/60">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;