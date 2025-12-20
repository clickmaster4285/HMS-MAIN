import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createDoctor, resetDoctorState, updateDoctorById, fetchDoctorById } from '../../../features/doctor/doctorSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getallDepartments } from "../../../features/department/DepartmentSlice";
import {
  FormContainer,
  FormHeader,
  ImageUpload
} from '../../../components/indexCmp';
import { getRoleRoute } from "../../../utils/getRoleRoute";

// Import sub-components
import DoctorBasicInfo, { getBasicInfoRequiredFields } from './addDocComponents/DoctorBasicInfo';
import DoctorContractDetails, { getContractRequiredFields } from './addDocComponents/DoctorContractDetails';
import DoctorQualifications from './addDocComponents/DoctorQualifications';
import DoctorFormActions from './addDocComponents/DoctorFormActions';

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const DoctorForm = ({ mode = 'create' }) => {
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctorId } = useParams();
  const { currentDoctor, status, error } = useSelector(state => state.doctor);
  const { departments } = useSelector(state => state.department);

  // Initialize form state
  const initialFormState = {
    doctor_Name: '',
    doctor_Email: '',
    doctor_Contact: '',
    doctor_Address: '',
    doctor_Department: '',
    doctor_CNIC: '',
    doctor_Type: '',
    doctor_Specialization: '',
    doctor_Qualifications: [],
    doctor_LicenseNumber: '',
    doctor_Fee: 0,
    doctor_password: '',
    doctor_Contract: {
      doctor_Percentage: 0,
      hospital_Percentage: 0,
      contract_Time: '',
      doctor_JoiningDate: '',
    }
  };

  const [previewImage, setPreviewImage] = useState(null);
  const [agreementPreview, setAgreementPreview] = useState(null);
  const [qualificationInput, setQualificationInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [agreementFile, setAgreementFile] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [isEditMode, setIsEditMode] = useState(mode === 'edit');
  const [fieldErrors, setFieldErrors] = useState({});

  const doctorTypes = [
    "Senior Doctor", "General Doctor", "Specialist Doctor", "Assistant Doctor",
    "Internee Doctor", "Consultant", "Surgeon", "Resident Doctor"
  ];

  // Effect for loading data in edit mode
  useEffect(() => {
    if (isEditMode && doctorId) {
      dispatch(fetchDoctorById(doctorId));
    }
    dispatch(getallDepartments());
  }, [dispatch, doctorId, isEditMode]);

  // Effect for populating form in edit mode
  useEffect(() => {
    if (isEditMode && currentDoctor) {
      setFormData({
        doctor_Name: currentDoctor.user.user_Name || '',
        doctor_Email: currentDoctor.user.user_Email || '',
        doctor_Password: currentDoctor.user.user_Password || '',
        doctor_Contact: currentDoctor.user.user_Contact || '',
        doctor_Address: currentDoctor.user.user_Address || '',
        doctor_Department: currentDoctor.doctor_Department || '',
        doctor_CNIC: currentDoctor.user.user_CNIC || '',
        doctor_Type: currentDoctor.doctor_Type || '',
        doctor_Specialization: currentDoctor.doctor_Specialization || '',
        doctor_Qualifications: currentDoctor.doctor_Qualifications || [],
        doctor_LicenseNumber: currentDoctor.doctor_LicenseNumber || '',
        doctor_Fee: currentDoctor.doctor_Fee || 0,
        doctor_Contract: currentDoctor.doctor_Contract || {
          doctor_Percentage: 0,
          hospital_Percentage: 0,
          contract_Time: '',
          doctor_JoiningDate: '',
        }
      });

      if (currentDoctor.doctor_Image?.filePath) {
        setPreviewImage(
          currentDoctor.doctor_Image?.filePath
            ? `${API_URL}${currentDoctor.doctor_Image.filePath}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentDoctor.doctor_Name || "D")}&background=random`
        )
      }
      if (currentDoctor.doctor_Contract?.doctor_Agreement?.filePath) {
        setAgreementFile(null);
        const fileName = currentDoctor.doctor_Contract.doctor_Agreement.filePath.split('/').pop() || "Existing Agreement";
        setAgreementPreview(fileName);
      }
      setImageFile(null);
    }
  }, [currentDoctor, isEditMode, API_URL]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      dispatch(resetDoctorState());
    };
  }, [dispatch]);

  // Reset form function
  const resetLocalForm = () => {
    setFormData(initialFormState);
    setPreviewImage(null);
    setAgreementPreview(null);
    setImageFile(null);
    setAgreementFile(null);
    setQualificationInput("");
    setFieldErrors({});
  };

  // Qualification handlers
  const handleAddQualification = () => {
    if (qualificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        doctor_Qualifications: [...prev.doctor_Qualifications, qualificationInput]
      }));
      setQualificationInput('');
    }
  };

  const handleRemoveQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      doctor_Qualifications: prev.doctor_Qualifications.filter((_, i) => i !== index)
    }));
  };

  // Form field change handlers
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, doctor_Email: value }));

    // Clear any existing email errors
    if (fieldErrors.doctor_Email) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.doctor_Email;
        return newErrors;
      });
    }

    if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      validateEmail(value);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (name.startsWith("contract_")) {
      const contractField = name.replace('contract_', '');
      setFormData(prev => ({
        ...prev,
        doctor_Contract: {
          ...prev.doctor_Contract,
          [contractField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (!file) return;

    // Size validation
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 10MB");
      return;
    }

    // Type validation
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const validAgreementTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (name === "doctor_Image") {
      if (!validImageTypes.includes(file.type)) {
        toast.error("Invalid image format. Please upload JPEG, JPG, or PNG");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setImageFile(file);
    }
    else if (name === "doctor_Agreement") {
      if (!validAgreementTypes.includes(file.type)) {
        toast.error("Invalid file format. Please upload PDF, DOC, or DOCX");
        return;
      }
      setAgreementFile(file);
      setAgreementPreview(file.name);
    }
  };

  // Phone and CNIC formatting
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4)}`;
    }
    return `${phoneNumber.slice(0, 4)}-${phoneNumber.slice(4, 11)}`;
  };

  const formatCNIC = (value) => {
    if (!value) return value;
    const cnicNumber = value.replace(/[^\d]/g, '');
    const cnicNumberLength = cnicNumber.length;

    if (cnicNumberLength < 6) return cnicNumber;
    if (cnicNumberLength < 13) {
      return `${cnicNumber.slice(0, 5)}-${cnicNumber.slice(5)}`;
    }
    return `${cnicNumber.slice(0, 5)}-${cnicNumber.slice(5, 12)}-${cnicNumber.slice(12, 13)}`;
  };

  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setFormData({
      ...formData,
      doctor_Contact: formattedPhoneNumber
    });

    // Clear error when changing
    if (fieldErrors.doctor_Contact) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.doctor_Contact;
        return newErrors;
      });
    }
  };

  const handleCNICChange = (e) => {
    const formattedCNIC = formatCNIC(e.target.value);
    setFormData({
      ...formData,
      doctor_CNIC: formattedCNIC
    });

    // Clear error when changing
    if (fieldErrors.doctor_CNIC) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.doctor_CNIC;
        return newErrors;
      });
    }
  };

  // Percentage handler
  const handlePercentageChange = (e) => {
    const { name, value } = e.target;

    // Ensure we have a valid number
    const numericValue = value === '' ? 0 : parseFloat(value);

    if (isNaN(numericValue)) {
      toast.error("Please enter a valid number for percentage");
      return;
    }

    const clampedValue = Math.min(100, Math.max(0, numericValue));
    const roundedValue = parseFloat(clampedValue.toFixed(2));

    if (name === "contract_doctor_Percentage") {
      setFormData(prev => ({
        ...prev,
        doctor_Contract: {
          ...prev.doctor_Contract,
          doctor_Percentage: roundedValue,
          hospital_Percentage: parseFloat((100 - roundedValue).toFixed(2))
        }
      }));
    } else if (name === "contract_hospital_Percentage") {
      setFormData(prev => ({
        ...prev,
        doctor_Contract: {
          ...prev.doctor_Contract,
          hospital_Percentage: roundedValue,
          doctor_Percentage: parseFloat((100 - roundedValue).toFixed(2))
        }
      }));
    }
  };

  // Error handling function
  const handleApiError = (error) => {
    console.error('API Error:', error);

    // Accept both thrown payload (unwrap) and action error shape
    const payload = error?.payload ?? error;
    if (payload) {
      const { statusCode, message, errorType, field, value, errors } = payload;


      // Handle duplicate key errors
      // Map both backend field names and your form fields
      const fieldNameMap = {
        user_Email: 'email',
        email: 'email',
        user_CNIC: 'CNIC',
        cnic: 'CNIC',
        user_Contact: 'contact number',
        contact: 'contact number',
      };
      const fieldName = fieldNameMap[field] || field || 'value';

      toast.error(
        `This ${fieldName} (${value ?? ''}) is already registered. Please use a different ${fieldName}.`
      );

      // Set field-specific error for highlighting
      setFieldErrors(prev => ({
        ...prev,
        [(field === 'user_Email' || field === 'email') ? 'doctor_Email'
          : (field === 'user_CNIC' || field === 'cnic') ? 'doctor_CNIC'
            : (field === 'user_Contact' || field === 'contact') ? 'doctor_Contact'
              : 'doctor_Email' // sensible default
        ]: `This ${fieldName} is already registered`
      }));
      return;
    }

    // Validation array from backend
    if (errors && Array.isArray(errors) && errors.length) {
      toast.error(`Validation error: ${errors.join(', ')}`);
      return;
    }

    if (message) {
      toast.error(message);
      return;
    }

  if (error.message && error.message.includes('Network Error')) {
    toast.error('Network error. Please check your connection and try again.');
    return;
  }

  if (error.status && error.status >= 500) {
    toast.error('Server error. Please try again later.');
    return;
  }

  toast.error(`Failed to ${isEditMode ? 'update' : 'create'} doctor. Please try again.`);
};

// Form submission handler
const handleSubmit = async (e) => {
  e.preventDefault();

  // Clear previous errors
  setFieldErrors({});

  // Get required fields from all sections
  const basicInfoRequired = getBasicInfoRequiredFields(isEditMode);
  const contractRequired = getContractRequiredFields();

  // Combine all required fields
  const requiredFields = {
    ...basicInfoRequired,
    ...contractRequired
  };

  const missingFields = [];
  const newFieldErrors = {};

  // Check for missing required fields
  Object.entries(requiredFields).forEach(([field, name]) => {
    let value;

    if (field.startsWith("contract_")) {
      const contractField = field.replace('contract_', '');
      value = formData.doctor_Contract[contractField];
    } else {
      value = formData[field];
    }

    if (!value || !value.toString().trim()) {
      missingFields.push(name);
      newFieldErrors[field] = `${name} is required`;
    }
  });

  // Check password for new doctors
  if (!isEditMode && !formData.doctor_password) {
    missingFields.push("Password");
    newFieldErrors.doctor_password = "Password is required";
  }

  // Validate contact format
  if (formData.doctor_Contact && !/^\d{4}-\d{7}$/.test(formData.doctor_Contact)) {
    newFieldErrors.doctor_Contact = "Contact must be in format 03XX-XXXXXXX";
  }

  // Validate email format if provided
  if (formData.doctor_Email && !validateEmail(formData.doctor_Email)) {
    newFieldErrors.doctor_Email = "Please enter a valid email address";
  }

  // If there are validation errors, show them and return
  if (Object.keys(newFieldErrors).length > 0) {
    setFieldErrors(newFieldErrors);

    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
    } else {
      toast.error("Please fix the validation errors");
    }

    // Scroll to first error field
    const firstErrorField = Object.keys(newFieldErrors)[0];
    const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      errorElement.focus();
    }

    return;
  }

  const formToSubmit = new FormData();

  // Append user data
  formToSubmit.append('user_Name', formData.doctor_Name);
  formToSubmit.append('user_Email', formData.doctor_Email || '');
  formToSubmit.append('user_Contact', formData.doctor_Contact);
  formToSubmit.append('user_Address', formData.doctor_Address);
  formToSubmit.append('user_CNIC', formData.doctor_CNIC);
  if (formData.doctor_password?.trim()) {
       formToSubmit.append('user_Password', formData.doctor_password.trim());
     }

  // Append doctor data
  formToSubmit.append('doctor_Department', formData.doctor_Department);
  formToSubmit.append('doctor_Type', formData.doctor_Type);
  formToSubmit.append('doctor_Specialization', formData.doctor_Specialization);
  formToSubmit.append('doctor_LicenseNumber', formData.doctor_LicenseNumber);
  formToSubmit.append('doctor_Fee', String(Number(formData.doctor_Fee)));

  // Append qualifications
  formData.doctor_Qualifications.forEach((qual, i) => {
    formToSubmit.append(`doctor_Qualifications[${i}]`, qual);
  });

  formToSubmit.append('doctor_Contract[doctor_Percentage]', String(Number(formData.doctor_Contract.doctor_Percentage)));
  formToSubmit.append('doctor_Contract[hospital_Percentage]', String(Number(formData.doctor_Contract.hospital_Percentage)));
  formToSubmit.append('doctor_Contract[contract_Time]', formData.doctor_Contract.contract_Time);
  formToSubmit.append('doctor_Contract[doctor_JoiningDate]', formData.doctor_Contract.doctor_JoiningDate);

  // Append files
  if (imageFile) formToSubmit.append('doctor_Image', imageFile);
  if (agreementFile) formToSubmit.append('doctor_Agreement', agreementFile);

  try {
    let result;
    if (isEditMode && doctorId) {
      result = await dispatch(updateDoctorById({ doctorId, updatedData: formToSubmit })).unwrap();
      toast.success("Doctor updated successfully!");
    } else {
      result = await dispatch(createDoctor(formToSubmit)).unwrap();
      toast.success("Doctor created successfully!");
      resetLocalForm();
    }

    // Navigate after success
    setTimeout(() => {
      navigate(getRoleRoute('doctors'));
    }, 1500);

  } catch (err) {
    handleApiError(err);
  }
};

// Form configuration
const formConfig = {
  title: isEditMode ? "Edit Doctor" : "Doctor Registration",
  description: isEditMode ? "Update the doctor details below" : "Please fill in the doctor details below"
};

return (
  <FormContainer>
    <FormHeader
      title={formConfig.title}
      description={formConfig.description}
      bgColor="bg-primary-600"
      textColor="text-white"
    />

    <form className="w-full p-6" onSubmit={handleSubmit}>
      {/* Profile Picture Section */}
      <div className="mb-6">
        <ImageUpload
          previewImage={previewImage}
          handleFileChange={handleFileChange}
          label="Doctor Image"
          helpText="JPG, JPEG, PNG (max 10MB)"
          containerClass="w-48 h-48 mx-auto"
          name="doctor_Image"
        />
      </div>

      {/* Basic Information Section */}
      <DoctorBasicInfo
        formData={formData}
        handleChange={handleChange}
        handleEmailChange={handleEmailChange}
        handlePhoneChange={handlePhoneChange}
        handleCNICChange={handleCNICChange}
        fieldErrors={fieldErrors}
        departments={departments}
        doctorTypes={doctorTypes}
        isEditMode={isEditMode}
      />

      {/* Qualifications Section */}
      <DoctorQualifications
        qualificationInput={qualificationInput}
        setQualificationInput={setQualificationInput}
        formData={formData}
        handleAddQualification={handleAddQualification}
        handleRemoveQualification={handleRemoveQualification}
      />

      {/* Contract Details Section */}
      <DoctorContractDetails
        formData={formData}
        handleChange={handleChange}
        handlePercentageChange={handlePercentageChange}
        fieldErrors={fieldErrors}
        agreementPreview={agreementPreview}
        handleFileChange={handleFileChange}
        isEditMode={isEditMode}
      />

      {/* Form Actions */}
      <DoctorFormActions
        status={status}
        isEditMode={isEditMode}
        onSubmit={handleSubmit}
      />
    </form>
  </FormContainer>
);
};

export default DoctorForm;