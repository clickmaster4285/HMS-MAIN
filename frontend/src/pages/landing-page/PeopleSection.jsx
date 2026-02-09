import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import Hospital from "../../assets/landing-page/dash-2.png";

const PeopleSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-linear-to-br from-white via-slate-50 to-primary-50 overflow-hidden">
      {/* Background pattern - moved outside content container */}
      <div className="relative h-full w-full bg-white py-20"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

      
      {/* Floating Background Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-sky-300/60 rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 left-10 z-50 w-24 h-24 bg-primary-500/60 rounded-full animate-bounce"></div>

      <div className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
          {/* Content Section */}
          <div className={`order-2 lg:order-1 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="inline-flex items-center px-6 py-2 text-sm font-medium text-sky-700 bg-linear-to-r from-sky-100 to-primary-200 rounded-full mb-6 shadow-sm">
              <Users className="mr-2" size={16} />
              Our Healthcare System
            </div>
            <img className="w-full h-auto rounded-lg shadow-md" src={Hospital} alt="Hospital" />
          </div>
          
          <div className="">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-700 mb-4">
             Explore Cloud-Based Healthcare Software Solutions Tailored for Hospitals, Clinics, and Doctors.
            </h1>
            <p className="text-gray-600 mb-6">
              Get access to top digital solutions via ClickMasters Hospital Managment System (HMS), PMS (Patient Management System), and HIMS (Hospital Information Management System), made with care for medical professionals, clinics, and hospitals of all sizes.
            </p>
            <p className="text-gray-600 mb-6">
             When reviewing an individual clinic, the main tasks include new admissions, discharge management, and nursing documentation reviews.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li className="text-gray-800 font-semibold mb-2">For Individual Clinics</li>
              <li className="text-gray-800 font-semibold mb-2">For Multi-Specialty Medical Centers</li>
              <li className="text-gray-800 font-semibold mb-2">For Hospitals (HIMS)</li>
              <li className="text-gray-800 font-semibold mb-2">For Healthcare Networks & Chains</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default PeopleSection;