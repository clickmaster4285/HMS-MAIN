// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { createDoctor, resetDoctorState, updateDoctorById, fetchDoctorById } from '../../../../features/doctor/doctorSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { toast } from 'react-toastify';
// import {
//   faUser, faEnvelope, faPhone, faMapMarkerAlt, faStethoscope,
//   faGraduationCap, faIdCard, faPercentage, faCalendarAlt,
//   faFileContract, faMoneyBillWave, faClock, faFileImage,
//   faTableList, faUserDoctor, faFileSignature
// } from "@fortawesome/free-solid-svg-icons";
// import { getallDepartments } from "../../../../features/department/DepartmentSlice";
// import { useDoctorAvatar } from '../../../../hooks/useDoctorAvatar';
// import { useGenerateDoctorAvatarMutation } from '../../../../features/avatar/avatarApi';


// const DoctorForm = ({ mode = 'create' }) => {
//   const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
//   const [generateAvatar] = useGenerateDoctorAvatarMutation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { doctorId } = useParams();
//   const { currentDoctor, status, error } = useSelector(state => state.doctor);
//   const { departments } = useSelector(state => state.department);
//   // Initialize form state
//   const initialFormState = {
//     doctor_Name: '',
//     doctor_Email: '',
//     doctor_Contact: '',
//     doctor_Address: '',
//     doctor_Department: '',
//     doctor_CNIC: '',
//     doctor_Type: '',
//     doctor_Gender: 'male',
//     doctor_Specialization: '',
//     doctor_Qualifications: [],
//     doctor_LicenseNumber: '',
//     doctor_Fee: 0,
//     doctor_Contract: {
//       doctor_Percentage: 0,
//       hospital_Percentage: 0,
//       contract_Time: '',
//       doctor_JoiningDate: '',
//     }
//   };

//   const [formData, setFormData] = useState(initialFormState);
//   const avatarUrl = useDoctorAvatar({
//     doctor_Name: formData.doctor_Name,
//     doctor_Gender: formData.doctor_Gender,
//     doctor_Image: currentDoctor?.doctor_Image
//   });

//   const [previewImage, setPreviewImage] = useState(null);
//   const [agreementPreview, setAgreementPreview] = useState(null);
//   const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
//   const [qualificationInput, setQualificationInput] = useState("");
//   const [imageFile, setImageFile] = useState(null);
//   const [agreementFile, setAgreementFile] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(mode === 'edit');

//   useEffect(() => {
//     if (isEditMode && doctorId) {
//       dispatch(fetchDoctorById(doctorId));
//     }
//     dispatch(getallDepartments());
//   }, [dispatch, doctorId, isEditMode]);

//   useEffect(() => {
//     if (isEditMode && currentDoctor) {
//       setFormData({
//         doctor_Name: currentDoctor.doctor_Name || '',
//         doctor_Email: currentDoctor.doctor_Email || '',
//         doctor_Contact: currentDoctor.doctor_Contact || '',
//         doctor_Address: currentDoctor.doctor_Address || '',
//         doctor_Department: currentDoctor.doctor_Department || '',
//         doctor_CNIC: currentDoctor.doctor_CNIC || '',
//         doctor_Type: currentDoctor.doctor_Type || '',
//         doctor_Gender: currentDoctor.doctor_Gender || 'male',
//         doctor_Specialization: currentDoctor.doctor_Specialization || '',
//         doctor_Qualifications: currentDoctor.doctor_Qualifications || [],
//         doctor_LicenseNumber: currentDoctor.doctor_LicenseNumber || '',
//         doctor_Fee: currentDoctor.doctor_Fee || 0,
//         doctor_Contract: currentDoctor.doctor_Contract || {
//           doctor_Percentage: 0,
//           hospital_Percentage: 0,
//           contract_Time: '',
//           doctor_JoiningDate: '',
//         }
//       });

//       if (currentDoctor.doctor_Image?.filePath) {
//         setPreviewImage(
//           currentDoctor.doctor_Image?.filePath
//             ? `${API_URL}${currentDoctor.doctor_Image.filePath}`
//             : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDoctor.doctor_Name || "D")}&background=random`
//         )
//       }
//       if (currentDoctor.doctor_Contract?.doctor_Agreement?.filePath) {
//         setAgreementFile(null);
//         // Extract filename from path or use a generic label
//         const fileName = currentDoctor.doctor_Contract.doctor_Agreement.filePath.split('/').pop() || "Existing Agreement";
//         setAgreementPreview(fileName);
//       }
//       setImageFile(null);
//     }

//   }, [currentDoctor, isEditMode]);

//   const resetLocalForm = () => {
//     setFormData(initialFormState);
//     setPreviewImage(null);
//     setAgreementPreview(null);
//     setImageFile(null);
//     setAgreementFile(null);
//     setQualificationInput("");
//   };

//   useEffect(() => {
//     return () => {
//       dispatch(resetDoctorState());
//     };
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(getallDepartments());
//   }, [dispatch]);

//   const handleAddQualification = () => {
//     if (qualificationInput.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         doctor_Qualifications: [...prev.doctor_Qualifications, qualificationInput]
//       }));
//       setQualificationInput('');
//     }
//   };

//   const handleRemoveQualification = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       doctor_Qualifications: prev.doctor_Qualifications.filter((_, i) => i !== index)
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith("contract_")) {
//       const contractField = name.replace('contract_', '');
//       setFormData(prev => ({
//         ...prev,
//         doctor_Contract: {
//           ...prev.doctor_Contract,
//           [contractField]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const name = e.target.name;
  
//     if (file) {
//       if (file.size > 1 * 1024 * 1024) {
//         toast.error("File size should be less than 1MB");
//         return;
//       }
//       if (name === "doctor_Image") {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setPreviewImage(reader.result);
//           setImageFile(file);
//         };
//         reader.readAsDataURL(file);
//       } else if (name === "doctor_Agreement") {
//         setAgreementFile(file);
//         setAgreementPreview(file.name);
//       }
//     }
//   };

//   useEffect(() => {
//     console.log("Current Avatar State:", {
//       hasPreview: !!previewImage,
//       hasImageFile: !!imageFile,
//       previewType: previewImage?.startsWith('data:') ? 'data-url' : 'external-url'
//     });
//   }, [previewImage, imageFile]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Debug log
//     console.log("Preview Image:", previewImage);
//     // Debug: Log current form state
//     console.log("Form Data Before Submission:", {
//       ...formData,
//       previewImage: previewImage ? "Image exists" : "No image",
//       imageFile: imageFile ? "File exists" : "No file",
//       agreementFile: agreementFile ? "File exists" : "No file"
//     });

//     if (previewImage?.startsWith('data:image/svg+xml')) {
//       try {
//         const pngBlob = await convertSvgToPng(previewImage);
//         const pngFile = new File([pngBlob], 'avatar.png', { type: 'image/png' });
//         formToSubmit.append('doctor_Image', pngFile);
//       } catch (error) {
//         console.error("SVG to PNG conversion failed:", error);
//         // Fallback to basic avatar URL instead of file
//         formToSubmit.append('doctor_Image_URL', 
//           `https://api.dicebear.com/6.x/avataaars/png?seed=${formData.doctor_Name}&size=128`);
//       }
//     }

//     if (!isEditMode && !imageFile && !previewImage?.startsWith('data:image/svg+xml')) {
//       toast.error("Please upload an image or use the generated avatar");
//       return;
//     }

//     if (!isEditMode && !agreementFile) {
//       toast.error("Please upload an agreement file");
//       return;
//     }

//     const formToSubmit = new FormData();

//     // Append all form data
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === 'doctor_Qualifications') {
//         value.forEach((qual, i) => formToSubmit.append(`doctor_Qualifications[${i}]`, qual));
//       } else if (key !== 'doctor_Contract') {
//         formToSubmit.append(key, value);
//       }
//     });

//     // Append contract data
//     Object.entries(formData.doctor_Contract).forEach(([key, value]) => {
//       formToSubmit.append(`doctor_Contract[${key}]`, value);
//     });

//     // Handle avatar - only one block needed
//     if (imageFile) {
//       formToSubmit.append('doctor_Image', imageFile);
//     } else if (previewImage?.startsWith('data:image/svg+xml')) {
//       const blob = await fetch(previewImage).then(r => r.blob());
//       const file = new File([blob], 'avatar.svg', { type: 'image/svg+xml' });
//       formToSubmit.append('doctor_Image', file);
//     }

//     if (agreementFile) {
//       formToSubmit.append('doctor_Agreement', agreementFile);
//     }

//     // Debug: Verify FormData contents
//     console.log("=== FormData Contents ===");
//     for (let [key, value] of formToSubmit.entries()) {
//       console.log(key, value instanceof File ? `File: ${value.name}` : value);
//     }
//     try {
//       if (isEditMode && doctorId) {
//         await dispatch(updateDoctorById({ doctorId, updatedData: formToSubmit })).unwrap();
//         toast.success("Doctor updated successfully!");
//       } else {
//         await dispatch(createDoctor(formToSubmit)).unwrap();
//         toast.success("Doctor created successfully!");
//         resetLocalForm();
//       }
//       navigate('/doctors');
//     } catch (err) {
//       toast.error(err.message || `Failed to ${isEditMode ? 'update' : 'create'} doctor`);
//     }
//   };

//   const convertSvgToPng = async (svgDataUrl) => {
//     const img = new Image();
//     img.src = svgDataUrl;
//     await new Promise((resolve) => { img.onload = resolve; });
    
//     const canvas = document.createElement('canvas');
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0);
    
//     return new Promise((resolve) => {
//       canvas.toBlob(resolve, 'image/png');
//     });
//   };

//   const handleUseGeneratedAvatar = async () => {
//     if (!formData.doctor_Name || formData.doctor_Name.length < 2) {
//       toast.error("Please enter a valid doctor name (at least 2 characters)");
//       return;
//     }
  
//     setIsGeneratingAvatar(true);
//     try {
//       const response = await generateAvatar({
//         name: formData.doctor_Name,
//         gender: formData.doctor_Gender
//       }).unwrap();
  
//       // Ensure previewImage is always set
//       setPreviewImage(response || `https://api.dicebear.com/6.x/avataaars/svg?seed=${formData.doctor_Name}&size=128`);
//       setImageFile(null);
//       toast.success("Avatar generated successfully!");
//     } catch (error) {
//       // Fallback to basic avatar
//       setPreviewImage(`https://api.dicebear.com/6.x/avataaars/svg?seed=${formData.doctor_Name}&size=128`);
//       toast.error("Used fallback avatar");
//     } finally {
//       setIsGeneratingAvatar(false);
//     }
//   };

//   const formatPhoneNumber = (value) => {
//     if (!value) return value;
//     const phoneNumber = value.replace(/[^\d]/g, '');
//     const phoneNumberLength = phoneNumber.length;

//     if (phoneNumberLength < 4) return phoneNumber;
//     if (phoneNumberLength < 8) {
//       return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`;
//     }
//     return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4, 11)}`;
//   };

//   const formatCNIC = (value) => {
//     if (!value) return value;
//     const cnicNumber = value.replace(/[^\d]/g, '');
//     const cnicNumberLength = cnicNumber.length;

//     if (cnicNumberLength < 6) return cnicNumber;
//     if (cnicNumberLength < 13) {
//       return `${cnicNumber.slice(0, 5)}-${cnicNumber.slice(5)}`;
//     }
//     return `${cnicNumber.slice(0, 5)}-${cnicNumber.slice(5, 12)}-${cnicNumber.slice(12, 13)}`;
//   };

//   const handlePhoneChange = (e) => {
//     const formattedPhoneNumber = formatPhoneNumber(e.target.value);
//     setFormData({
//       ...formData,
//       doctor_Contact: formattedPhoneNumber
//     });
//   };

//   const handleCNICChange = (e) => {
//     const formattedCNIC = formatCNIC(e.target.value);
//     setFormData({
//       ...formData,
//       doctor_CNIC: formattedCNIC
//     });
//   };

//   const handlePercentageChange = (e) => {
//     const { name, value } = e.target;
//     const numericValue = Math.min(100, Math.max(0, Number(value) || 0)); // Ensure between 0-100

//     if (name === "contract_doctor_Percentage") {
//       setFormData(prev => ({
//         ...prev,
//         doctor_Contract: {
//           ...prev.doctor_Contract,
//           doctor_Percentage: numericValue,
//           hospital_Percentage: 100 - numericValue
//         }
//       }));
//     } else if (name === "contract_hospital_Percentage") {
//       setFormData(prev => ({
//         ...prev,
//         doctor_Contract: {
//           ...prev.doctor_Contract,
//           hospital_Percentage: numericValue,
//           doctor_Percentage: 100 - numericValue
//         }
//       }));
//     }
//   };


//   useEffect(() => {
//     if (status === 'succeeded') {
//       if (!isEditMode) {
//         resetLocalForm();
//       }
//       dispatch(resetDoctorState());
//     } else if (status === 'failed') {
//       toast.error(error || `Failed to ${isEditMode ? 'update' : 'create'} doctor`);
//       dispatch(resetDoctorState());
//     }
//   }, [status, error, navigate, dispatch, isEditMode]);

//   const contractFields = [
//     { label: "Doctor Percentage", name: "contract_doctor_Percentage", icon: faPercentage, placeholder: "Enter Doctor Percentage", type: "number", onChange: handlePercentageChange, min: 0, max: 100 },
//     { label: "Hospital Percentage", name: "contract_hospital_Percentage", icon: faPercentage, placeholder: "Enter Hospital Percentage", type: "number", onChange: handlePercentageChange, min: 0, max: 100 },
//     { label: "Contract Time", name: "contract_contract_Time", icon: faClock, placeholder: "Enter Contract Time" },
//     { label: "Joining Date", name: "contract_doctor_JoiningDate", icon: faCalendarAlt, placeholder: "Enter Joining Date", type: "date" },
//   ];
//   const doctorTypes = ["Senior Doctor", "General Doctor", "Specialist Doctor", "Assistant Doctor", "Internee Doctor", "Consultant", "Surgeon", "Resident Doctor"
//   ];

//   const formConfig = {
//     title: isEditMode ? "Edit Doctor" : "Doctor Registration",
//     description: isEditMode ? "Update the doctor details below" : "Please fill in the doctor details below",
//     submitText: isEditMode ? "Update Doctor" : "Register Doctor",
//     loadingText: isEditMode ? "Updating..." : "Processing..."
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//       {/* Header Section */}
//       <div className="bg-primary-600 rounded-t-md text-white px-6 py-8 shadow-md">
//         <div className="flex items-center">
//           <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
//           <div>
//             <h1 className="text-3xl font-bold">{formConfig.title}</h1>
//             <p className="text-primary-100 mt-1">{formConfig.description}</p>
//           </div>
//         </div>
//       </div>

//       {/* Form Content */}
//       <form className="w-full p-6" onSubmit={handleSubmit}>
//         {/* Doctor Image Upload */}
//         <div className="mb-8">
//           <div className="flex items-center mb-6">
//             <div className="h-10 w-1 bg-primary-600 mr-3 rounded-full"></div>
//             <h2 className="text-xl font-semibold text-gray-800">Profile Picture</h2>
//             {!isEditMode && <span className="text-red-500 ml-1">*</span>}
//           </div>

//           <div className="flex flex-col items-center">
//             <div className="relative w-48 h-48 mb-4">
//               <img
//                 src={previewImage || avatarUrl}
//                 alt={`${formData.doctor_Name || 'Doctor'} Avatar`}
//                 className="w-full h-full rounded-lg object-cover border-4 border-primary-100 bg-primary-100"
//                 onError={(e) => {
//                   e.target.src = `https://api.dicebear.com/6.x/avataaars/svg?seed=${formData.doctor_Name || 'Doctor'}&size=128&backgroundColor=b6e3f4&radius=50`;
//                 }}
//               />
//             </div>

//             <div className="flex gap-4">
//               <button
//                 type="button"
//                 onClick={() => document.getElementById("doctor_Image").click()}
//                 className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
//               >
//                 {previewImage ? "Change Image" : "Upload Image"}
//               </button>

//               {!previewImage && (
//                 <button
//                   type="button"
//                   onClick={handleUseGeneratedAvatar}
//                   disabled={isGeneratingAvatar}
//                   className={`px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 ${isGeneratingAvatar ? 'opacity-50 cursor-not-allowed' : ''
//                     }`}
//                 >
//                   {isGeneratingAvatar ? 'Generating...' : 'Use Generated Avatar'}
//                 </button>
//               )}
//             </div>

//             <input
//               type="file"
//               id="doctor_Image"
//               name="doctor_Image"
//               className="hidden"
//               onChange={handleFileChange}
//               accept="image/*"
//             />
//           </div>
//         </div>

//         <div className="mb-8">
//           <div className="flex items-center mb-6">
//             <div className="h-10 w-1 bg-primary-600 mr-3 rounded-full"></div>
//             <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               { label: "Full Name", name: "doctor_Name", icon: faUser, placeholder: "Enter Doctor Name" },
//               { label: "Email Address", name: "doctor_Email", icon: faEnvelope, placeholder: "Enter Doctor Email", type: "email" },
//               { label: "Contact Number", name: "doctor_Contact", icon: faPhone, placeholder: "03XX-XXXXXXX", type: "tel", onChange: handlePhoneChange, maxLength: 12 },
//               { label: "CNIC Number", name: "doctor_CNIC", icon: faIdCard, placeholder: "XXXXX-XXXXXXX-X", onChange: handleCNICChange, maxLength: 15 },
//               { label: "Address", name: "doctor_Address", icon: faMapMarkerAlt, placeholder: "Enter Address" },
//               { label: "Department", name: "doctor_Department", icon: faStethoscope, type: "select", options: departments.map(dept => dept.name), value: formData.doctor_Department },
//               { label: "Specialization", name: "doctor_Specialization", icon: faUserDoctor, placeholder: "Enter Specialization" },
//               { label: "Doctor Type", name: "doctor_Type", icon: faTableList, type: "select", options: doctorTypes },
//               { label: "Gender", name: "doctor_Gender", icon: faUser, type: "select", options: ["male", "female", "other"] },
//               { label: "License Number", name: "doctor_LicenseNumber", icon: faFileSignature, placeholder: "Enter License Number" },
//               { label: "Consultation Fee", name: "doctor_Fee", icon: faMoneyBillWave, placeholder: "Enter Fee", type: "number" },
//             ].map((field, index) => (
//               <div key={index} className="space-y-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {field.label} <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FontAwesomeIcon icon={field.icon} className="text-primary-600" />
//                   </div>
//                   {field.type === "select" ? (
//                     <select
//                       name={field.name}
//                       value={formData[field.name]}
//                       onChange={handleChange}
//                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 appearance-none"
//                       required
//                     >
//                       <option value="">Select {field.label}</option>
//                       {field.options.map((option, i) => (
//                         <option key={i} value={option}>{option}</option>
//                       ))}
//                     </select>
//                   ) : (
//                     <input
//                       type={field.type || "text"}
//                       name={field.name}
//                       placeholder={field.placeholder}
//                       value={field.onChange ? formData[field.name] : (formData[field.name] || "")}
//                       onChange={field.onChange || handleChange}
//                       className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//                       required
//                       maxLength={field.maxLength}
//                     />
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Qualifications Section */}
//         <div className="mb-8">
//           <div className="flex items-center mb-6">
//             <div className="h-10 w-1 bg-primary-600 mr-3 rounded-full"></div>
//             <h2 className="text-xl font-semibold text-gray-800">Qualifications</h2>
//           </div>

//           <div className="flex gap-4 mb-6">
//             <div className="flex-1 relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faGraduationCap} className="text-primary-600" />
//               </div>
//               <input
//                 type="text"
//                 value={qualificationInput}
//                 onChange={(e) => setQualificationInput(e.target.value)}
//                 placeholder="Add Qualification"
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//               />
//             </div>
//             <button
//               type="button"
//               onClick={handleAddQualification}
//               className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
//             >
//               Add
//             </button>
//           </div>

//           <div className="space-y-2 ">
//             {formData.doctor_Qualifications?.map((qualification, index) => (
//               <div key={index} className="flex border border-primary-500 border-t-primary-200 items-center justify-between bg-gray-50 py-2 px-4 rounded-md">
//                 <span className="text-gray-800 underline italic font-medium">{qualification}</span>
//                 <button
//                   type="button"
//                   onClick={() => handleRemoveQualification(index)}
//                   className="bg-red-500 px-2 py-1 text-white rounded-md hover:bg-gray-300 focus:outline-none"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Contract Details Section */}
//         <div className="mb-8">
//           <div className="flex items-center mb-6">
//             <div className="h-10 w-1 bg-primary-600 mr-3 rounded-full"></div>
//             <h2 className="text-xl font-semibold text-gray-800">Contract Details</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {contractFields.map((field, index) => (
//               <div key={index} className="space-y-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {field.label} <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <FontAwesomeIcon icon={field.icon} className="text-primary-600" />
//                   </div>
//                   <input
//                     type={field.type || "text"}
//                     name={field.name}
//                     placeholder={field.placeholder}
//                     value={formData.doctor_Contract[field.name.replace('contract_', '')] || ""}
//                     onChange={field.onChange || handleChange}
//                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
//                     required={field.type !== "date"}
//                     min={field.min}
//                     max={field.max}
//                   />
//                   {field.type === "number" && field.name.includes("Percentage") && (
//                     <span className="absolute right-9 top-2 text-gray-500">%</span>
//                   )}
//                 </div>
//                 {field.name.includes("Percentage") && (
//                   <div className="h-2 bg-gray-200 rounded-full mt-1">
//                     <div
//                       className={`h-full rounded-full ${field.name.includes("doctor") ? 'bg-sky-500' : 'bg-primary-500'}`}
//                       style={{ width: `${formData.doctor_Contract[field.name.replace('contract_', '')]}%` }}
//                     ></div>
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* Agreement File Input */}
//             <div className="space-y-1">
//               <label className="block text-sm font-medium text-gray-700">
//                 Agreement File {!isEditMode && <span className="text-red-500">*</span>}
//               </label>
//               <div
//                 className="border-2 border-dashed border-primary-300 rounded-md p-4 text-center cursor-pointer hover:border-primary-500 transition-colors"
//                 onClick={() => document.getElementById("doctor_Agreement").click()}
//               >
//                 {agreementPreview ? (
//                   <div className="text-primary-800">
//                     <FontAwesomeIcon icon={faFileContract} className="text-3xl mb-2" />
//                     <p className="text-sm font-medium">
//                       {isEditMode && !agreementFile ? "Current: " : ""}
//                       {agreementPreview}
//                     </p>
//                     {isEditMode && !agreementFile && (
//                       <p className="text-xs text-gray-500 mt-1">Click to upload new file</p>
//                     )}
//                     {isEditMode && !agreementFile && currentDoctor?.doctor_Contract?.doctor_Agreement?.filePath && (
//                       <a
//                         href={`${API_URL}${currentDoctor.doctor_Contract.doctor_Agreement.filePath}`}
//                         onClick={() => toast.success("Download started")}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-primary-600 hover:underline text-xs block mt-2"
//                       >
//                         Download current agreement
//                       </a>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="text-primary-800">
//                     <FontAwesomeIcon icon={faFileContract} className="text-3xl mb-2" />
//                     <p className="text-sm font-medium">Upload Agreement File</p>
//                     <p className="text-xs text-gray-500">PDF, DOC, DOCX</p>
//                   </div>
//                 )}
//                 <input
//                   type="file"
//                   id="doctor_Agreement"
//                   name="doctor_Agreement"
//                   onChange={handleFileChange}
//                   className="hidden"
//                   accept=".pdf,.doc,.docx"
//                   required={!isEditMode}
//                 />
//               </div>
//             </div>
//           </div>
//           {/* Move this inside the agreement file input div, right after the input */}
//         </div>

//         {/* Form Actions */}
//         <div className="flex justify-between pt-6 border-t border-gray-200">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={status === 'loading' || isGeneratingAvatar}
//             className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${status === 'loading' || isGeneratingAvatar ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//           >
//             {status === 'loading' ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 {formConfig.loadingText}
//               </span>
//             ) : (
//               formConfig.submitText
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DoctorForm; 