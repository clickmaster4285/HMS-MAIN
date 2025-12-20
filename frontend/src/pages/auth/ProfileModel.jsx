import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, UserPlus, X } from 'lucide-react';
import Doctor from '../../assets/user/doctorImg.png';
import Nurse from '../../assets/user/nurseImg.png';
import Patient from '../../assets/user/patientImg.png';
import Reception from '../../assets/user/receptionImg.png';

const profiles = [
  {
    role: "Doctor",
    name: "Dr. Sarah Khan",
    color: "bg-linear-to-br from-primary-500 to-primary-600",
    icon: Doctor,
    textColor: "text-white",
    description: "Access patient records and medical history"
  },
  {
    role: "Reception",
    name: "Sonia",
    color: "bg-linear-to-br from-primary-400 to-primary-500",
    icon: Reception,
    textColor: "text-white",
    description: "Manage appointments and patient registration"
  },
  {
    role: "Nurse",
    name: "Nurse Ayesha",
    color: "bg-linear-to-br from-primary-600 to-primary-700",
    icon: Nurse,
    textColor: "text-white",
    description: "Patient care and treatment administration"
  },
  {
    role: "Patient",
    name: "Ali Ahmed",
    color: "bg-linear-to-br from-primary-300 to-primary-400",
    icon: Patient,
    textColor: "text-white",
    description: "View medical records and appointments"
  },
];

const ProfileModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger the opening animation
    setIsOpen(true);
  }, []);

  const handleSelect = (profile) => {
    setSelectedProfile(profile);
    setIsExiting(true);
    
    // Navigate after animation completes
    setTimeout(() => {
      navigate('/login', {
        state: { selectedRole: profile.role }
      });
    }, 500);
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => navigate(-1), 500);
  };

  const handleCreateNew = () => {
    navigate('/create-profile');
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl p-6 w-full max-w-6xl max-h-[90vh] shadow-2xl relative flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 px-4 pt-2">
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-primary-800"
              >
                Select Your Profile
              </motion.h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="text-primary-600 hover:text-primary-800 p-2 rounded-full transition-colors"
              >
                <X size={28} strokeWidth={2} />
              </motion.button>
            </div>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-center mb-8 px-6"
            >
              Choose your role to access the system with appropriate permissions
            </motion.p>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 pb-6 overflow-y-auto flex-grow">
              {profiles.map((profile, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.4 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(profile)}
                  className="flex flex-col items-center cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-primary-200 bg-linear-to-b from-white to-gray-50"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-28 h-28 mb-5 rounded-full flex items-center justify-center shadow-md ${profile.color} ${profile.textColor}`}
                  >
                    <img
                      src={profile.icon}
                      alt={profile.role}
                      className="w-20 h-20 object-contain"
                    />
                  </motion.div>
                  <h3 className="text-xl font-bold text-primary-800">{profile.role}</h3>
                  <p className="text-primary-600 font-medium mt-1">{profile.name}</p>
                  <p className="text-gray-500 text-sm mt-3 text-center">
                    {profile.description}
                  </p>
                  <div className="mt-4 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    Select Profile
                  </div>
                </motion.div>
              ))}

              {/* Add New Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateNew}
                className="flex flex-col items-center justify-center cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:shadow-lg border-2 border-dashed border-primary-300 hover:border-primary-400 bg-linear-to-b from-white to-gray-50"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-28 h-28 mb-5 rounded-full flex items-center justify-center bg-primary-50 text-primary-400 border-2 border-dashed border-primary-300"
                >
                  <UserPlus size={40} strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-xl font-bold text-primary-800">Add New</h3>
                <p className="text-primary-600 font-medium mt-1">Create Profile</p>
                <p className="text-gray-500 text-sm mt-3 text-center">
                  Register a new user profile
                </p>
                <div className="mt-4 px-4 py-2 bg-primary-50 text-primary-600 border border-primary-200 rounded-full text-sm font-medium">
                  Get Started
                </div>
              </motion.div>
            </div>

            {/* Footer */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-primary-50 px-6 py-4 border-t border-primary-100 flex justify-center"
            >
              <p className="text-primary-700 text-sm">
                Need help? <span className="font-medium underline cursor-pointer">Contact support</span>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;