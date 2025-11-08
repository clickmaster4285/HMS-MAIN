import React from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const SuccessModal = ({ modals, setModals, onClose }) => {
  if (!modals.success.show) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setModals(prev => ({ ...prev, success: { show: false, message: '' } }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-lg bg-white/20"></div>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full z-10 transform transition-all">
        <div className="text-center">
          <AiOutlineCheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h3 className="text-lg font-medium text-gray-900 mt-4">
            {modals.success.message}
          </h3>
          <div className="mt-6">
            <button
              onClick={handleClose}
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;