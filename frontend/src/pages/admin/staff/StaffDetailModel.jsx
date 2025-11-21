// // components/staff/StaffDetailModal.js
// import React from 'react';
// import StaffDetail from './StaffDetail';

// const StaffDetailModal = ({ staff, onClose }) => {
//   if (!staff) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center border-b p-4">
//           <h2 className="text-xl font-bold">Staff Details</h2>
//           <button 
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             &times;
//           </button>
//         </div>
//         <div className="p-6">
//           <StaffDetail staff={staff} />
//         </div>
//         <div className="border-t p-4 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StaffDetailModal;