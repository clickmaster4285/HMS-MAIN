import React, { useState } from 'react';
import { AiOutlinePrinter, AiOutlineFileText, AiOutlineClose, AiOutlineFilePdf } from 'react-icons/ai';
import { handlePrint } from '../../../../utils/printUtils';

const PrintOptionsModal = ({ patient, onClose }) => {
   const [printOption, setPrintOption] = useState('thermal');
   const [isPrinting, setIsPrinting] = useState(false);

   const handlePrintClick = async () => {
      if (!printOption) {
         alert('Please select a print option');
         return;
      }

      setIsPrinting(true);

      try {
         // Prepare formData structure that matches what printUtils expects
         const formData = {
            patient_MRNo: patient.patient_MRNo,
            patient_Name: patient.patient_Name,
            patient_ContactNo: patient.patient_ContactNo,
            patient_Guardian: patient.patient_Guardian || {},
            patient_CNIC: patient.patient_CNIC,
            patient_Gender: patient.patient_Gender,
            patient_Age: patient.patient_Age,
            patient_DateOfBirth: patient.patient_DateOfBirth,
            patient_Address: patient.patient_Address,
            patient_BloodType: patient.patient_BloodType,
            patient_MaritalStatus: patient.patient_MaritalStatus,

            // Get the latest visit data
            visitData: patient.visits && patient.visits.length > 0
               ? patient.visits[patient.visits.length - 1]
               : {
                  token: '',
                  purpose: 'Consultation',
                  doctor: patient.doctor || {}
               },

            printOption: printOption
         };
         // Use the existing print utility
         handlePrint(formData, printOption);

         onClose();
      } catch (error) {
         console.error('Printing error:', error);
         alert('Failed to print: ' + error.message);
      } finally {
         setIsPrinting(false);
      }
   };

   const printOptions = [
      {
         value: "thermal",
         label: "Thermal Slip",
         icon: AiOutlinePrinter,
         description: "Small receipt-style print for quick slips"
      },
      {
         value: "a4",
         label: "A4 Form",
         icon: AiOutlineFileText,
         description: "Standard A4 size detailed form"
      },
      {
         value: "pdf",
         label: "PDF Document",
         icon: AiOutlineFilePdf,
         description: "Download as PDF file"
      }
   ];

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/15 backdrop-blur-lg z-50">
         <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            {/* Header */}
            <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
               <h2 className="text-xl font-bold">Print Options</h2>
               <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 text-2xl font-thin focus:outline-none"
                  aria-label="Close"
                  disabled={isPrinting}
               >
                  <AiOutlineClose className="h-6 w-6" />
               </button>
            </div>

            {/* Body */}
            <div className="p-6">
               <div className="mb-6">
                  <p className="text-gray-700 mb-2">Patient: <span className="font-semibold">{patient.patient_Name}</span></p>
                  <p className="text-gray-700">MR#: <span className="font-semibold">{patient.patient_MRNo}</span></p>

                  {/* Display latest visit info if available */}
                  {patient.visits && patient.visits.length > 0 && (
                     <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-600">
                           Last Visit: {new Date(patient.visits[patient.visits.length - 1].visitDate || Date.now()).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                           Token: {patient.visits[patient.visits.length - 1].token || 'N/A'}
                        </p>
                     </div>
                  )}
               </div>

               <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Print Format</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {printOptions.map((option) => (
                        <div
                           key={option.value}
                           className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${printOption === option.value
                                 ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                                 : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                           onClick={() => setPrintOption(option.value)}
                        >
                           <div className="flex items-start">
                              <div className={`shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5 ${printOption === option.value
                                    ? 'border-primary-500 bg-primary-500'
                                    : 'border-gray-300'
                                 }`}>
                                 {printOption === option.value && (
                                    <div className="h-2 w-2 rounded-full bg-white"></div>
                                 )}
                              </div>

                              <div className="flex-1">
                                 <div className="flex items-center">
                                    <option.icon className={`h-6 w-6 ${printOption === option.value ? 'text-primary-600' : 'text-gray-400'
                                       }`} />
                                    <span className="ml-2 font-medium text-gray-900">
                                       {option.label}
                                    </span>
                                 </div>

                                 <p className="mt-2 text-sm text-gray-500">
                                    {option.description}
                                 </p>
                              </div>
                           </div>

                           <input
                              type="radio"
                              name="printOption"
                              value={option.value}
                              checked={printOption === option.value}
                              onChange={() => setPrintOption(option.value)}
                              className="absolute opacity-0 h-0 w-0"
                           />
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
               <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50 font-medium"
                  disabled={isPrinting}
               >
                  Cancel
               </button>
               <button
                  onClick={handlePrintClick}
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50 font-medium"
                  disabled={isPrinting}
               >
                  {isPrinting ? (
                     <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Printing...
                     </>
                  ) : (
                     <>
                        <AiOutlinePrinter className="mr-2 h-5 w-5" />
                        Print
                     </>
                  )}
               </button>
            </div>
         </div>
      </div>
   );
};

export default PrintOptionsModal;