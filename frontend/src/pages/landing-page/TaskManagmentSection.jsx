import React from "react";

const HospitalWorkflowSection = () => {
  const departments = [
    {
      id: 1,
      title: "OPD Department",
      subtitle: "Outpatient Department",
      color: "bg-sky-600",
      textColor: "text-sky-100",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      ),
      features: [
        "Patient registration and check-in",
        "Doctor consultation scheduling",
        "Vital signs recording",
        "Prescription generation",
        "Follow-up appointment booking",
      ],
    },
    {
      id: 2,
      title: "IPD Department",
      subtitle: "Inpatient Department",
      color: "bg-purple-600",
      textColor: "text-purple-100",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      ),
      features: [
        "Patient admission process",
        "Bed allocation management",
        "Daily rounds tracking",
        "Treatment progress monitoring",
        "Discharge process and billing",
      ],
    },
    {
      id: 3,
      title: "Operation Theater",
      subtitle: "Surgical Management",
      color: "bg-red-600",
      textColor: "text-red-100",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      ),
      features: [
        "Surgery scheduling",
        "Anesthesia management",
        "Surgical team assignment",
        "Equipment sterilization tracking",
        "Post-op recovery monitoring",
      ],
    },
    {
      id: 4,
      title: "Pharmacy",
      subtitle: "Medication Management",
      color: "bg-green-600",
      textColor: "text-green-100",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      ),
      features: [
        "Prescription processing",
        "Inventory management",
        "Drug interaction checking",
        "Expiry date tracking",
        "Insurance billing integration",
      ],
    },
    {
      id: 5,
      title: "Staff & Doctors",
      subtitle: "Human Resources",
      color: "bg-indigo-600",
      textColor: "text-indigo-100",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      ),
      features: [
        "Staff scheduling and shifts",
        "Doctor specialization tracking",
        "Leave management",
        "Performance evaluation",
        "Training and certification",
      ],
    },
    {
      id: 6,
      title: "Wards & Rooms",
      subtitle: "Facility Management",
      color: "bg-amber-600",
      textColor: "text-amber-100",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
      features: [
        "Room allocation system",
        "Ward capacity monitoring",
        "Equipment inventory",
        "Maintenance scheduling",
        "Cleaning and sanitation tracking",
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-50-z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Hospital Management Workflow</h2>
          <p className="text-lg text-gray-600">Streamline patient care with our comprehensive hospital management system</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {departments.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </div>
      </div>
    </section>
  );
};

const DepartmentCard = ({ department }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-72 transition-transform hover:scale-105">
      <div className={`${department.color} p-4 text-white `}>
        <h3 className="font-bold text-lg flex items-center">
          <svg className="w-9 h-9 bg-white/25 backdrop-blur-md rounded-e-md p-1 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {department.icon}
          </svg>
          {department.title}
        </h3>
        <p className={`${department.textColor} text-sm`}>{department.subtitle}</p>
      </div>
      <div className="p-6">
        <ul className="space-y-3 text-gray-700">
          {department.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-green-500 mt-1 mr-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const CheckCircle = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={`h-5 w-5 ${className}`}
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
};

export default HospitalWorkflowSection;