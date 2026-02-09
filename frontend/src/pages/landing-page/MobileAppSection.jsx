import React from "react";
import { Shield, Calendar, Bell, Lock, Stethoscope, Activity, Users, ClipboardList } from "lucide-react";
import Img from "../../assets/landing-page/screens.png"

const MobileAppSection = () => {
  return (
    <section className="py-20 bg-linear-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Content Section */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Enhancing Patient Experience with ClickMasters HMS</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Our hospital management system is designed to prioritize patient well-being, providing seamless communication, easy access to information, and personalized care.
            </p>

            <div className="space-y-6">
              {/* Security Feature */}
              <div>
                <div className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center mb-3 transition-colors shadow-md">
                  <Calendar size={18} className="mr-2" />
                  Streamlined Appointment Scheduling
                </div>
                <p className="text-gray-600">
                  Patients can easily book, reschedule, and manage their appointments online, reducing wait times and improving convenience.
                </p>
              </div>

              {/* EHR Feature */}
              <div className="flex items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="shrink-0 bg-green-100 p-3 rounded-lg mr-4">
                  <Bell size={20} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-800">Real-time Updates and Notifications</h3>
                  <p className="text-gray-600">
                    Patients receive timely reminders, updates on their treatment progress, and important information via SMS, email, or our mobile app.
                  </p>
                </div>
              </div>

              {/* Telemedicine Feature */}
              <div className="flex items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="shrink-0 bg-purple-100 p-3 rounded-lg mr-4">
                  <Lock size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-800">Secure Patient Portal</h3>
                  <p className="text-gray-600">
                    Patients can access their medical records, lab results, and communicate with their healthcare providers through a secure, user-friendly portal.
                  </p>
                </div>
              </div>

              <div className="flex items-start bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="shrink-0 bg-sky-100 p-3 rounded-lg mr-4">
                  <Stethoscope size={20} className="text-sky-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-800">Integrated Telemedicine Options</h3>
                  <p className="text-gray-600">
                    Virtual consultations offer convenient access to healthcare from anywhere, enhancing patient comfort and expanding reach.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Mobile App Mockup */}
          <div className="order-1 md:order-2 flex justify-center relative">
            <div className="relative">
              <img
                src={Img}
                alt="Mobile App Mockup"
                className="w-full max-w-2xl rounded-lg shadow-lg"
              />

              {/* Decorative Elements */}
              <div className="absolute -right-6 -top-6 w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
                <Activity size={24} className="text-primary-600" />
              </div>
              <div className="absolute -left-6 bottom-10 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;