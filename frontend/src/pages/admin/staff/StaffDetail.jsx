// // components/staff/StaffDetail.js
// import React from 'react';
// import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaIdCard, FaGraduationCap } from 'react-icons/fa';

// const StaffDetail = ({ staff }) => {
//   if (!staff) return null;

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-2xl font-bold mb-6">{staff.firstName} {staff.lastName}</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Personal Information */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
//           <DetailItem icon={<FaUser />} label="Name" value={`${staff.firstName} ${staff.lastName}`} />
//           <DetailItem icon={<FaPhone />} label="Phone" value={staff.phone} />
//           <DetailItem icon={<FaEnvelope />} label="Email" value={staff.email || 'N/A'} />
//           <DetailItem icon={<FaMapMarkerAlt />} label="Address" value={staff.address || 'N/A'} />
//           <DetailItem icon={<FaIdCard />} label="CNIC" value={staff.cnic || 'N/A'} />
//         </div>

//         {/* Professional Information */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold border-b pb-2">Professional Information</h3>
//           <DetailItem icon={<FaIdCard />} label="Designation" value={staff.designation || 'N/A'} />
//           <DetailItem icon={<FaGraduationCap />} label="Qualification" value={staff.qualification || 'N/A'} />
//           <DetailItem label="Department" value={staff.department || 'N/A'} />
//           <DetailItem label="Staff Type" value={staff.staffType || 'N/A'} />
//           <DetailItem label="Shift" value={staff.shift || 'N/A'} />
//         </div>

//         {/* Staff Type Specific Details */}
//         {staff.staffType === 'Doctor' && staff.doctorDetails && (
//           <div className="space-y-4 md:col-span-2">
//             <h3 className="text-lg font-semibold border-b pb-2">Doctor Details</h3>
//             <DetailItem label="Specialization" value={staff.doctorDetails.specialization || 'N/A'} />
//             <DetailItem label="License Number" value={staff.doctorDetails.licenseNumber || 'N/A'} />
//             {/* Add more doctor-specific fields */}
//           </div>
//         )}

//         {/* Similar sections for other staff types */}
//       </div>
//     </div>
//   );
// };

// const DetailItem = ({ icon, label, value }) => (
//   <div className="flex items-start">
//     {icon && <span className="mr-2 mt-1 text-gray-500">{icon}</span>}
//     <div>
//       <p className="text-sm font-medium text-gray-500">{label}</p>
//       <p className="text-gray-800">{value}</p>
//     </div>
//   </div>
// );

// export default StaffDetail;