import React from "react";
import { Stethoscope, ClipboardList, Bed, Pill, Users, Shield, Calendar, FileSearch, Bell, Activity, ArrowRight } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <ClipboardList className="text-primary-600" size={24} />,
      title: "Electronic Health Records",
      description: "Comprehensive digital patient records accessible across departments with real-time updates and medical history tracking."
    },
    {
      icon: <Bed className="text-green-600" size={24} />,
      title: "IPD Management",
      description: "Streamline inpatient admissions, bed allocation, nursing care, and discharge processes with automated workflows."
    },
    {
      icon: <Stethoscope className="text-purple-600" size={24} />,
      title: "OPD Management",
      description: "Efficient outpatient department operations with appointment scheduling, queue management, and prescription systems."
    },
    {
      icon: <Pill className="text-red-600" size={24} />,
      title: "Pharmacy Integration",
      description: "Automated medicine inventory, prescription management, and insurance claim processing with barcode support."
    },
    {
      icon: <Shield className="text-amber-600" size={24} />,
      title: "Operation Theater",
      description: "Surgical scheduling, staff assignments, equipment management, and post-op care coordination in one platform."
    },
    {
      icon: <Shield className="text-teal-600" size={24} />,
      title: "HIPAA Compliance",
      description: "Enterprise-grade security with role-based access, audit trails, and encrypted data protection for patient privacy."
    },
    {
      icon: <Users className="text-indigo-600" size={24} />,
      title: "Staff Management",
      description: "Comprehensive HR tools for scheduling, payroll, training, and performance tracking of medical personnel."
    },
    {
      icon: <Calendar className="text-pink-600" size={24} />,
      title: "Appointment System",
      description: "Online booking, automated reminders, and resource allocation for optimized patient flow and reduced wait times."
    },
    {
      icon: <FileSearch className="text-orange-600" size={24} />,
      title: "Medical Billing",
      description: "Integrated billing system supporting insurance claims, payment processing, and financial reporting."
    },
    {
      icon: <Bell className="text-cyan-600" size={24} />,
      title: "Alerts & Notifications",
      description: "Critical alerts for lab results, medication schedules, and emergency notifications to relevant staff."
    },
    {
      icon: <Activity className="text-lime-600" size={24} />,
      title: "Analytics Dashboard",
      description: "Real-time hospital performance metrics, patient statistics, and operational KPIs for data-driven decisions."
    }
  ];

  return (
    <section id="features" className="py-20 bg-linear-to-b from-white to-sky-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-block px-8 py-3 text-sm font-medium text-sky-600 bg-sky-100 rounded-full mb-4">
            Hospital Management System
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Healthcare Solutions
          </h2>
          <p className="text-lg text-gray-600">
            Our integrated platform connects all hospital departments, streamlining operations and improving patient care through digital transformation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:border-primary-100 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center mb-4 transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3.5 bg-linear-to-r from-sky-600 to-teal-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:from-sky-700 hover:to-teal-700 flex items-center mx-auto">
            Request Demo
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;