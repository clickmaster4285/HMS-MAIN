// hooks/useIpdForm.js
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
   admitPatient,
   updatePatientAdmission,
   getIpdPatientByMrno,
   resetAdmissionState,
   selectGetAdmissionStatus,
   selectCurrentAdmission,
} from "../features/ipdPatient/IpdPatientSlice";
import { fetchPatientByMrNo } from "../features/patient/patientSlice";
import { getwardsbydepartmentId } from "../features/ward/Wardslice";

export const useIpdForm = (mode = "create") => {
   const { admissionId } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();

   // Redux selectors
   const { wardsByDepartment } = useSelector((state) => state.ward || {});
   const { doctors } = useSelector((state) => state.doctor || {});
   const { departments } = useSelector((state) => state.department || {});
   const {
      isLoading: isPatientLoading,
      isError: isPatientError,
      errorMessage: patientErrorMessage,
   } = useSelector((state) => state.patients || {});

   const {
      isLoading: isAdmissionLoading,
      isError: isAdmissionError,
      error: admissionError,
      isSuccess: isAdmissionSuccess,
   } = useSelector((state) => state.ipdPatient || {});

   const currentAdmission = useSelector(selectCurrentAdmission);
   const getAdmissionStatus = useSelector(selectGetAdmissionStatus);

   // State
   const [mrNo, setMrNo] = useState("");
   const [isSearching, setIsSearching] = useState(false);
   const [formData, setFormData] = useState({
      patientId: '',
      mrNumber: "",
      referredBy: "",
      wardType: "",
      wardNumber: "",
      admissionDate: new Date().toISOString().split("T")[0],
      admissionType: "SSP",
      doctorId: "",
      departmentId: "",
      wardId: "",
      bedNumber: "",
      admissionFee: "",
      discount: 0,
      totalFee: 0,
      customWardType: "",
      paymentStatus: "Unpaid",
      diagnosis: "",
      // Patient info fields
      patientName: "",
      patientContactNo: "",
      dob: "",
      cnic: "",
      age: "",
      address: "",
      gender: "",
      guardianName: "",
      guardianRelation: "",
      guardianContact: "",
      bloodGroup: "",
      maritalStatus: "",
   });

   const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

   // Load admission data for edit mode
   useEffect(() => {
      if (mode === "edit" && formData.mrNumber) {
         dispatch(getIpdPatientByMrno(formData.mrNumber));
      }
   }, [mode, formData.mrNumber, dispatch]);

   // Populate form when admission data is loaded for edit mode
   useEffect(() => {
      if (mode === "edit" && currentAdmission) {
         populateFormFromAdmission(currentAdmission);
      }
   }, [currentAdmission, mode]);

   // Set department based on ward type when in edit mode
   useEffect(() => {
      if (mode === "edit" && currentAdmission?.ward_Information?.ward_Type && departments.length > 0) {
         const department = departments.find(dept =>
            dept.name === currentAdmission.ward_Information.ward_Type
         );
         if (department) {
            setFormData(prev => ({
               ...prev,
               departmentId: department._id
            }));
            dispatch(getwardsbydepartmentId(department._id));
         }
      }
   }, [currentAdmission, departments, mode, dispatch]);

   // Handle success and error states
   useEffect(() => {
      if (isAdmissionSuccess) {
         const successMessage = mode === "create"
            ? "Patient admitted successfully!"
            : "Admission updated successfully!";

         toast.success(successMessage);
         dispatch(resetAdmissionState());
         resetForm();
         setTimeout(() => navigate("/receptionist/ipd/Admitted"), 1000);
      }
      if (isAdmissionError) {
         const errorMessage = mode === "create"
            ? `Admission failed: ${admissionError}`
            : `Update failed: ${admissionError}`;

         toast.error(errorMessage);
         dispatch(resetAdmissionState());
      }
   }, [isAdmissionSuccess, isAdmissionError, admissionError, dispatch, navigate, mode]);

   // Helper functions
   const populateFormFromAdmission = (admission) => {
      const patient = admission.patient;

      setFormData(prev => ({
         ...prev,
         patientId: patient?._id || '',
         mrNumber: patient?.patient_MRNo || "",
         patientName: patient?.patient_Name || "",
         patientContactNo: patient?.patient_ContactNo || "",
         dob: patient?.patient_DateOfBirth
            ? new Date(patient.patient_DateOfBirth).toISOString().split('T')[0]
            : "",
         cnic: patient?.patient_CNIC || "",
         age: patient?.patient_Age?.toString() || "",
         address: patient?.patient_Address || "",
         gender: patient?.patient_Gender || "",
         guardianName: patient?.patient_Guardian?.guardian_Name || "",
         guardianRelation: patient?.patient_Guardian?.guardian_Relation || "",
         guardianContact: patient?.patient_Guardian?.guardian_Contact || "",
         bloodGroup: patient?.patient_BloodType || "",
         maritalStatus: patient?.patient_MaritalStatus || "",

         // Admission details
         admissionDate: admission.admission_Details?.admission_Date
            ? new Date(admission.admission_Details.admission_Date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
         admissionType: admission.admission_Details?.admission_Type || "SSP",
         doctorId: admission.admission_Details?.admitting_Doctor?._id || "",
         diagnosis: admission.admission_Details?.diagnosis || "",

         // Ward information
         departmentId: "",
         wardId: admission.ward_Information?.ward_Id || "",
         bedNumber: admission.ward_Information?.bed_No || "",

         // Financials
         admissionFee: admission.financials?.admission_Fee || "",
         discount: admission.financials?.discount || 0,
         totalFee: admission.financials?.total_Charges || 0,
         paymentStatus: admission.financials?.payment_Status || "Unpaid",
      }));

      setMrNo(patient?.patient_MRNo || "");
   };

   const calculateAge = (dobString) => {
      if (!dobString) return "";
      const dob = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()))
         age--;
      return age.toString();
   };

   const formatPhoneNumber = (value) => {
      const cleanedValue = value.replace(/\D/g, "");
      let formattedValue = cleanedValue;
      if (cleanedValue.length > 4)
         formattedValue = `${cleanedValue.substring(0, 4)}-${cleanedValue.substring(4, 11)}`;
      return formattedValue.substring(0, 12);
   };

   const formatCNIC = (value) => {
      const cleanedValue = value.replace(/\D/g, "");
      let formattedValue = cleanedValue;
      if (cleanedValue.length > 5)
         formattedValue = `${cleanedValue.substring(0, 5)}-${cleanedValue.substring(5)}`;
      if (cleanedValue.length > 12)
         formattedValue = `${formattedValue.substring(0, 13)}-${cleanedValue.substring(13)}`;
      return formattedValue.substring(0, 15);
   };

   // Event handlers
   const handleSearch = async (e) => {
      e.preventDefault();
      if (!mrNo.trim()) {
         toast.error("Please enter an MR Number");
         return;
      }

      setIsSearching(true);
      try {
         const resultAction = await dispatch(fetchPatientByMrNo(mrNo));

         if (fetchPatientByMrNo.fulfilled.match(resultAction)) {
            const patientData = resultAction.payload;

            if (!patientData) {
               toast.error(`Patient with MR ${mrNo} not found`);
               return;
            }

            const guardian = patientData?.patient_Guardian || {};

            setFormData(prev => ({
               ...prev,
               patientId: patientData._id,
               mrNumber: patientData?.patient_MRNo || mrNo,
               patientName: patientData?.patient_Name || "",
               patientContactNo: patientData?.patient_ContactNo || "",
               dob: patientData?.patient_DateOfBirth
                  ? new Date(patientData.patient_DateOfBirth).toISOString().split('T')[0]
                  : "",
               cnic: patientData?.patient_CNIC || "",
               age: patientData?.patient_Age?.toString() || "",
               address: patientData?.patient_Address || "",
               gender: patientData?.patient_Gender || "",
               guardianName: guardian?.guardian_Name || "",
               guardianRelation: guardian?.guardian_Relation || "",
               guardianContact: guardian?.guardian_Contact || "",
               bloodGroup: patientData?.patient_BloodType || "",
               maritalStatus: patientData?.patient_MaritalStatus || "",
            }));

            toast.success("Patient data loaded successfully!");

         } else if (fetchPatientByMrNo.rejected.match(resultAction)) {
            const error = resultAction.payload || resultAction.error?.message || "Unknown error";
            if (typeof error === 'string' && error.includes("not found")) {
               toast.error(`Patient with MR ${mrNo} not found`);
            } else {
               toast.error(`Error: ${error}`);
            }
         }
      } catch (error) {
         console.error("Search error:", error);
         toast.error("An unexpected error occurred during search");
      } finally {
         setIsSearching(false);
      }
   };

   const handleChange = useCallback((e) => {
      const { name, value } = e.target;

      // Reset ward and bed when department changes
      if (name === "departmentId") {
         setFormData(prev => ({
            ...prev,
            departmentId: value,
            wardId: "",
            bedNumber: "",
         }));
         return;
      }

      // Reset bed when ward changes
      if (name === "wardId") {
         setFormData(prev => ({
            ...prev,
            wardId: value,
            bedNumber: "",
         }));
         return;
      }

      // Handle different input types
      switch (name) {
         case "dob":
            const age = calculateAge(value);
            setFormData(prev => ({ ...prev, dob: value, age }));
            break;

         case "cnic":
            const formattedCNIC = formatCNIC(value);
            setFormData(prev => ({ ...prev, cnic: formattedCNIC }));
            break;

         case "patientContactNo":
         case "guardianContact":
            const formattedPhone = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, [name]: formattedPhone }));
            break;

         case "admissionFee":
            const fee = parseFloat(value) || 0;
            setFormData(prev => ({
               ...prev,
               admissionFee: fee,
               totalFee: fee - (parseFloat(prev.discount) || 0),
            }));
            break;

         case "discount":
            const discountValue = parseFloat(value) || 0;
            setFormData(prev => ({
               ...prev,
               discount: discountValue,
               totalFee: (prev.admissionFee || 0) - discountValue,
            }));
            break;

         default:
            setFormData(prev => ({ ...prev, [name]: value }));
            break;
      }
   }, []);

   const preparePayload = () => {
      const selectedWard = wardsByDepartment.find(ward => ward._id === formData.wardId);
      const selectedDepartment = departments.find(dept => dept._id === formData.departmentId);

      const payload = {
         patientId: formData.patientId,
         admission_Details: {
            admission_Date: new Date(formData.admissionDate),
            diagnosis: formData.diagnosis,
            admission_Type: formData.admissionType,
         },
         ward_Information: {
            ward_Id: formData.wardId,
            ward_Type: selectedDepartment?.name || "",
            ward_No: selectedWard?.wardNumber || "",
            bed_No: formData.bedNumber,
            pdCharges: formData.pdCharges || 0
         },
         financials: {
            admission_Fee: parseFloat(formData.admissionFee) || 0,
            discount: parseFloat(formData.discount) || 0,
            payment_Status: formData.paymentStatus || "Unpaid",
            total_Charges: (parseFloat(formData.admissionFee) || 0) - (parseFloat(formData.discount) || 0),
         }
      };

      if (formData.doctorId) {
         payload.admission_Details.admitting_Doctor = formData.doctorId;
      }

      return payload;
   };

   const resetForm = () => {
      setFormData({
         patientId: '',
         mrNumber: "",
         referredBy: "",
         wardType: "",
         wardNumber: "",
         admissionDate: new Date().toISOString().split("T")[0],
         admissionType: "SSP",
         doctorId: "",
         departmentId: "",
         wardId: "",
         bedNumber: "",
         admissionFee: "",
         discount: 0,
         totalFee: 0,
         customWardType: "",
         paymentStatus: "Unpaid",
         diagnosis: "",
         patientName: "",
         patientContactNo: "",
         dob: "",
         cnic: "",
         age: "",
         address: "",
         gender: "",
         guardianName: "",
         guardianRelation: "",
         guardianContact: "",
         bloodGroup: "",
         maritalStatus: "",
      });
      setMrNo("");
   };

   const validateForm = () => {
      const errors = {};

      if (!formData.patientId) {
         errors.patient = "Please search and select a patient first";
      }
      if (!formData.mrNumber.trim()) errors.mrNumber = "MR Number is required";
      if (!formData.admissionDate) errors.admissionDate = "Admission Date is required";
      if (!formData.departmentId) errors.departmentId = "Department is required";
      if (!formData.wardId) errors.wardId = "Ward is required";
      if (!formData.bedNumber) errors.bedNumber = "Bed is required";
      if (!formData.admissionFee || parseFloat(formData.admissionFee) <= 0) {
         errors.admissionFee = "Valid Admission Fee is required";
      }
      if (!formData.paymentStatus) errors.paymentStatus = "Payment Status is required";
      if (!formData.diagnosis.trim()) errors.diagnosis = "Diagnosis is required";

      // Bed availability check
      if (mode === "create" ||
         (mode === "edit" && formData.bedNumber !== currentAdmission?.ward_Information?.bed_No)) {
         const selectedWard = wardsByDepartment.find(w => w._id === formData.wardId);
         if (selectedWard) {
            const selectedBed = selectedWard.beds.find(b => b.bedNumber === formData.bedNumber);
            if (selectedBed?.occupied) {
               errors.bedNumber = "Selected bed is occupied";
            }
         } else if (formData.wardId) {
            errors.wardId = "Invalid ward selected";
         }
      }

      return errors;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.patientId) {
         toast.error("Please search for a patient first");
         return;
      }

      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
         Object.entries(errors).forEach(([field, message]) => {
            toast.error(message);
         });
         return;
      }

      try {
         const payload = preparePayload();

         if (mode === "create") {
            const result = await dispatch(admitPatient(payload));
            if (admitPatient.rejected.match(result)) {
               handleSubmissionError(result.payload);
            }
         } else {
            const updatePayload = {
               mrNo: formData.mrNumber, // Use MR number instead of admissionId
               admissionData: payload
            };
            const result = await dispatch(updatePatientAdmission(updatePayload));
            if (updatePatientAdmission.rejected.match(result)) {
               handleSubmissionError(result.payload, true);
            }
         }
      } catch (error) {
         console.error("Submission error:", error);
         const errorMessage = mode === "create"
            ? "Failed to submit form. Please try again."
            : "Failed to update admission. Please try again.";
         toast.error(errorMessage);
      }
   };

   const handleSubmissionError = (error, isUpdate = false) => {
      if (error?.message) {
         if (error.message.includes("already admitted")) {
            toast.error("This patient is already admitted");
         } else if (error.message.includes("Bed")) {
            toast.error(error.message);
         } else {
            const prefix = isUpdate ? "Update error: " : "Admission error: ";
            toast.error(prefix + error.message);
         }
      } else {
         const message = isUpdate ? "Update failed. Please try again." : "Admission failed. Please try again.";
         toast.error(message);
      }
   };

   // Return all the state and functions needed by the component
   return {
      // State
      mrNo,
      setMrNo,
      formData,
      isSearching,
      bloodGroups,

      // Redux state
      wardsByDepartment,
      doctors,
      departments,
      isPatientLoading,
      isPatientError,
      patientErrorMessage,
      isAdmissionLoading,
      isAdmissionError,
      currentAdmission,
      getAdmissionStatus,

      // Handlers
      handleSearch,
      handleChange,
      handleSubmit,
      resetForm,

      // Mode
      mode,
   };
};