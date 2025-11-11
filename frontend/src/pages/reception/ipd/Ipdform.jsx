// IpdForm.js - FIXED VERSION
import React from "react";
import { useIpdForm } from "../../../hooks/useIpdForm";
import PatientSearch from "./addipd/PatientSearch";
import MedicalInformation from "./addipd/MedicalInformation";
import FormActions from "./addipd/FormActions";
import PatientInfoSection from "./addipd/PatientInfoSection";
import AdmissionInfoSection from "./addipd/AdmissionInfoSection";

const LoadingState = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <div className="text-xl font-semibold text-primary-600">{message}</div>
    </div>
  </div>
);

const IpdForm = ({ mode = "create" }) => {
  const ipdFormData = useIpdForm(mode);

  if (!ipdFormData) {
    return <div>Loading form...</div>;
  }

  const {
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
    currentAdmission,
    getAdmissionStatus,
    handleSearch,
    handleChange,
    handleSubmit,
    mode: formMode,
  } = ipdFormData;

  console.log("Form data:", formData);
  console.log("Current admission:", currentAdmission);
  console.log("Admission status:", getAdmissionStatus);

  // FIXED: Proper loading states for edit mode
  if (formMode === "edit") {
    if (getAdmissionStatus === 'pending' || getAdmissionStatus === 'idle') {
      return <LoadingState message="Loading admission details..." />;
    }

    // Wait for form to be properly populated
    if (getAdmissionStatus === 'succeeded' && currentAdmission &&
      (!formData.patientId || !formData.mrNumber || !formData.departmentId)) {
      return <LoadingState message="Preparing form data..." />;
    }

    if (getAdmissionStatus === 'failed') {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl font-semibold text-red-500">
            Error loading admission details
          </div>
        </div>
      );
    }

    if (getAdmissionStatus === 'succeeded' && !currentAdmission) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl font-semibold text-red-500">
            No admission data found for this patient
          </div>
        </div>
      );
    }
  }

  if (isPatientError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-red-500">
          Error: {patientErrorMessage}
        </div>
      </div>
    );
  }

  if (isPatientLoading || isAdmissionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-primary-600">
          Please wait...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-primary-600 p-6 text-white">
        <h1 className="text-2xl font-bold">
          {formMode === "create" ? "IPD Patient Admission Form" : "Edit IPD Admission"}
        </h1>
        <p className="text-primary-100">
          {formMode === "create"
            ? "Please fill in all required patient details below"
            : "Update the admission details below"}
        </p>
      </div>

      <div className="p-6">
        {formMode === "create" && (
          <PatientSearch
            mrNo={mrNo}
            setMrNo={setMrNo}
            handleSearch={handleSearch}
            isLoading={isPatientLoading}
            isSearching={isSearching}
          />
        )}

        {formMode === "edit" && formData.mrNumber && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="h-8 w-1 bg-blue-600 mr-3 rounded-full"></div>
              <div>
                <h3 className="text-lg font-semibold text-blue-800">
                  Editing Admission for MR: {formData.mrNumber}
                </h3>
                <p className="text-blue-600 text-sm">
                  Patient: {formData.patientName} | Current Status: {currentAdmission?.status || 'Admitted'}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <PatientInfoSection
            formData={formData}
            handleChange={handleChange}
            bloodGroups={bloodGroups}
            required
            mode={formMode}
          />

          <AdmissionInfoSection
            formData={formData}
            handleChange={handleChange}
            required
            mode={formMode}
            wardsByDepartment={wardsByDepartment}
            departments={departments}
            doctors={doctors}
          />

          <MedicalInformation
            formData={formData}
            handleChange={handleChange}
          />

          <FormActions
            onCancel={() => window.history.back()}
            onSubmit={handleSubmit}
            onSaveAndPrint={formMode === "create" ? undefined : null}
            isSubmitting={isAdmissionLoading}
            mode={formMode}
          />
        </form>
      </div>
    </div>
  );
};

export default IpdForm;