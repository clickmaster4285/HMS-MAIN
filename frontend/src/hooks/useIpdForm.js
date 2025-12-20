// hooks/useIpdForm.js - FINAL FIXED VERSION
import { useState, useEffect, useCallback, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  admitPatient,
  updatePatientAdmission,
  getIpdPatientByMrno,
  resetAdmissionState,
} from "../features/ipdPatient/IpdPatientSlice";
import { fetchPatientByMrNo } from "../features/patient/patientSlice";
import { getwardsbydepartmentId } from "../features/ward/Wardslice";

export const useIpdForm = (mode = "create") => {
  const [hasPopulatedForm, setHasPopulatedForm] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false); 
  const { mrNo: mrNoFromParams } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use shallowEqual for Redux selectors
  const wardsByDepartment = useSelector((state) => state.ward?.wardsByDepartment || [], shallowEqual);
  const doctors = useSelector((state) => state.doctor?.doctors || [], shallowEqual);
  const departments = useSelector((state) => state.department?.departments || [], shallowEqual);

  const patientsState = useSelector((state) => state.patients);
  const {
    isLoading: isPatientLoading,
    isError: isPatientError,
    errorMessage: patientErrorMessage
  } = patientsState || {};

  const ipdPatientState = useSelector((state) => state.ipdPatient);
  const {
    isLoading: isAdmissionLoading,
    isError: isAdmissionError,
    error: admissionError,
    isSuccess: isAdmissionSuccess,
  } = ipdPatientState || {};

  const currentAdmission = useSelector((state) => state.ipdPatient.currentPatient);
  const getAdmissionStatus = useSelector((state) => state.ipdPatient.status.search);
  // State
  const [mrNo, setMrNo] = useState(mode === "edit" ? mrNoFromParams : "");
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

  // Blood groups - static data
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Helper functions
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

  const populateFormFromAdmission = useCallback((admission) => {
    const patient = admission.patient;
    const wardInfo = admission.ward_Information || {};

    // FIXED: Better department matching
    const department = departments.find(dept => {
      // Try multiple matching strategies
      const deptName = dept.name?.toLowerCase();
      const wardType = wardInfo.ward_Type?.toLowerCase();

      return deptName === wardType ||
        deptName?.includes(wardType) ||
        wardType?.includes(deptName) ||
        dept.name === wardInfo.ward_Type;
    });
    const formDataUpdate = {
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

      // Ward information - FIXED: Include departmentId
      departmentId: department?._id || "",
      wardId: wardInfo.ward_Id || "",
      bedNumber: wardInfo.bed_No || "",

      // Financials
      admissionFee: admission.financials?.admission_Fee || "",
      discount: admission.financials?.discount || 0,
      totalFee: admission.financials?.total_Charges || 0,
      paymentStatus: admission.financials?.payment_Status || "Unpaid",
    };
    setFormData(prev => ({ ...prev, ...formDataUpdate }));

    // Load wards for the department if department is found
    if (department?._id) {
      dispatch(getwardsbydepartmentId(department._id));
    } else {
      console.warn("No department found for ward type:", wardInfo.ward_Type);
    }
  }, [departments, dispatch]);

  const resetForm = useCallback(() => {
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
  }, []);

  const preparePayload = useCallback(() => {
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

    // ✅ ADD DISCHARGE LOGIC
    if (mode === "edit" && formData.dischargePatient) {
      payload.status = "Discharged";
      payload.admission_Details.discharge_Date = new Date();
    }

    if (formData.doctorId) {
      payload.admission_Details.admitting_Doctor = formData.doctorId;
    }

    return payload;
  }, [formData, wardsByDepartment, departments, mode]);

  const validateForm = useCallback(() => {
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
  }, [formData, mode, currentAdmission, wardsByDepartment]);

  // Event handlers
  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!mrNo.trim()) {
      toast.error("Please enter an MR Number");
      return;
    }

    setIsSearching(true);
    try {
      const resultAction = await dispatch(fetchPatientByMrNo(mrNo));

      if (resultAction && resultAction.type === fetchPatientByMrNo.fulfilled.type) {
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
      } else if (resultAction && resultAction.type === fetchPatientByMrNo.rejected.type) {
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
  }, [mrNo, dispatch]);

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
      case "dob": {
        const age = calculateAge(value);
        setFormData(prev => ({ ...prev, dob: value, age }));
        break;
      }

      case "cnic": {
        const formattedCNIC = formatCNIC(value);
        setFormData(prev => ({ ...prev, cnic: formattedCNIC }));
        break;
      }

      case "patientContactNo":
      case "guardianContact": {
        const formattedPhone = formatPhoneNumber(value);
        setFormData(prev => ({ ...prev, [name]: formattedPhone }));
        break;
      }

      case "admissionFee": {
        const fee = parseFloat(value) || 0;
        setFormData(prev => ({
          ...prev,
          admissionFee: fee,
          totalFee: fee - (parseFloat(prev.discount) || 0),
        }));
        break;
      }

      case "discount": {
        const discountValue = parseFloat(value) || 0;
        setFormData(prev => ({
          ...prev,
          discount: discountValue,
          totalFee: (prev.admissionFee || 0) - discountValue,
        }));
        break;
      }

      default:
        setFormData(prev => ({ ...prev, [name]: value }));
        break;
    }
  }, []);

  useEffect(() => {
    if (mode === "edit" && mrNoFromParams) {
      dispatch(getIpdPatientByMrno(mrNoFromParams));
    }
  }, [mode, mrNoFromParams, dispatch]);

  useEffect(() => {
    if (mode === "edit" && currentAdmission && !hasPopulatedForm) {   
      populateFormFromAdmission(currentAdmission);
      setHasPopulatedForm(true);
    }
  }, [mode, currentAdmission, hasPopulatedForm, populateFormFromAdmission]);

  useEffect(() => {
    return () => {
      // Reset when component unmounts or mode changes
      setHasPopulatedForm(false);
    };
  }, [mode, mrNoFromParams]);

  useEffect(() => {
      dispatch(resetAdmissionState());
  }, [mode, dispatch]);

  // In handleSubmit function - Fix error handling
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.patientId) {
      toast.error("Please search for a patient first");
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([, message]) => {
        toast.error(message);
      });
      return;
    }

    setHasSubmitted(true); // ✅ MARK THAT WE'VE SUBMITTED

    try {
      const payload = preparePayload();

      if (mode === "create") {
        const result = await dispatch(admitPatient(payload));
        if (admitPatient.rejected.match(result)) {
          const errorMsg = result.payload?.message || result.error?.message || "Admission failed";
          toast.error(`Admission error: ${errorMsg}`);
        }
      } else {
        const updatePayload = {
          mrNo: formData.mrNumber,
          admissionData: payload
        };

        const result = await dispatch(updatePatientAdmission(updatePayload));
        if (updatePatientAdmission.rejected.match(result)) {
          const errorMsg = result.payload?.message ||
            result.error?.message ||
            (typeof result.payload === 'string' ? result.payload : "Update failed");
          toast.error(`Update error: ${errorMsg}`);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage = mode === "create"
        ? "Failed to submit form. Please try again."
        : "Failed to update admission. Please try again.";
      toast.error(errorMessage);
      setHasSubmitted(false); // ✅ RESET ON ERROR
    }
  }, [
    formData.patientId,
    formData.mrNumber,
    validateForm,
    preparePayload,
    mode,
    dispatch,
  ]);

  useEffect(() => {
    // ✅ ONLY process success/error if we actually submitted the form
    if (!hasSubmitted) return;

    if (isAdmissionSuccess) {
      const successMessage = mode === "create"
        ? "Patient admitted successfully!"
        : "Admission updated successfully!";

      toast.success(successMessage);
      dispatch(resetAdmissionState());

      if (mode === "create") {
        resetForm();
        setTimeout(() => navigate("/receptionist/ipd/Admitted"), 1000);
      } else {
        setTimeout(() => navigate("/receptionist/ipd/Admitted"), 1000);
        setHasSubmitted(false);
      }
    }

    if (isAdmissionError) {
      const errorMessage = mode === "create"
        ? `Admission failed: ${admissionError}`
        : `Update failed: ${admissionError}`;

      toast.error(errorMessage);
      dispatch(resetAdmissionState());
      setHasSubmitted(false); // ✅ RESET ON ERROR
    }
  }, [
    hasSubmitted, // ✅ ADD THIS DEPENDENCY
    isAdmissionSuccess,
    isAdmissionError,
    admissionError,
    dispatch,
    navigate,
    mode,
    resetForm,
  ]);

  return {
    // State
    mrNo,
    setMrNo,
    formData,
    isSearching,
    bloodGroups,
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
    mode: mode,
  };
};