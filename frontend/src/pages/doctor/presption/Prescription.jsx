import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Prescription = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [printMode, setPrintMode] = useState(false);

  // Sample prescription data
  const prescription = {
    patientName: "John Doe",
    patientAge: 35,
    patientGender: "Male",
    date: new Date().toLocaleDateString(),
    doctorName: "Dr. Sarah Smith",
    doctorSpecialty: "Cardiology",
    doctorLicense: "MED123456",
    medications: [
      {
        id: 1,
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take at bedtime"
      },
      {
        id: 2,
        name: "Metoprolol",
        dosage: "50mg",
        frequency: "Twice daily",
        duration: "60 days",
        instructions: "With meals"
      }
    ],
    diagnosis: "Hyperlipidemia and hypertension",
    additionalInstructions: "Follow up in 3 months. Maintain low-fat diet and regular exercise."
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 50);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 30 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-8 px-4 ${printMode ? 'print-mode' : ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-linear-to-r from-primary-600 to-primary-400 p-6 text-white">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-center">Medical Prescription</h1>
            <div className="mt-4 text-center space-y-1">
              <p className="font-semibold">Healthy Heart Clinic</p>
              <p className="text-sm">123 Medical Drive, Health City</p>
              <p className="text-sm">Phone: (555) 123-4567</p>
            </div>
          </motion.div>
        </div>

        {/* Patient and Doctor Info */}
        <div className="grid md:grid-cols-2 gap-6 p-6 border-b">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h2 className="text-xl font-semibold text-primary-600">Patient Information</h2>
            <div className="space-y-1">
              <p><span className="font-medium">Name:</span> {prescription.patientName}</p>
              <p><span className="font-medium">Age/Gender:</span> {prescription.patientAge} / {prescription.patientGender}</p>
              <p><span className="font-medium">Date:</span> {prescription.date}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <h2 className="text-xl font-semibold text-primary-600">Prescribing Physician</h2>
            <div className="space-y-1">
              <p><span className="font-medium">Name:</span> {prescription.doctorName}</p>
              <p><span className="font-medium">Specialty:</span> {prescription.doctorSpecialty}</p>
            </div>
          </motion.div>
        </div>

        {/* Medications */}
        <div className="p-6 border-b">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-primary-600 mb-4">Medications</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <AnimatePresence>
                    {prescription.medications.map((med, index) => (
                      <motion.tr
                        key={med.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">{med.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{med.dosage}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{med.frequency}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{med.instructions}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Diagnosis and Instructions */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-2"
          >
            <h2 className="text-xl font-semibold text-primary-600">Diagnosis</h2>
            <p className="bg-primary-50 p-3 rounded-lg">{prescription.diagnosis}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-2"
          >
            <h2 className="text-xl font-semibold text-primary-600">Additional Instructions</h2>
            <p className="bg-primary-50 p-3 rounded-lg">{prescription.additionalInstructions}</p>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-end"
          >
            <div className="text-center">
              <div className="h-16 border-t-2 border-primary-400 w-32 mx-auto mb-2"></div>
              <p className="font-semibold">{prescription.doctorName}, MD</p>
              <p className="text-sm text-gray-600">License #: {prescription.doctorLicense}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {!printMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-6 space-x-4"
        >
          <button
            onClick={handlePrint}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md"
          >
            Print Prescription
          </button>
          <button className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-md">
            Save to Profile
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Prescription;