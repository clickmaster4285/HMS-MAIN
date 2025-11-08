// IpdForm.js - Clean and simplified version
import React from "react";
import { useIpdForm } from "../../../../hooks/useIpdForm";

// Import your existing components
import PatientSearch from "./PatientSearch";
import MedicalInformation from "./MedicalInformation";
import FormActions from "./FormActions";
import PatientInfoSection from "./PatientInfoSection";
import AdmissionInfoSection from "./AdmissionInfoSection";

const IpdForm = ({ mode = "create" }) => {
  const {
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

    // Mode
    mode: formMode,
  } = useIpdForm(mode);

  // Loading states
  if (formMode === "edit" && getAdmissionStatus === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-primary-600">
          Loading admission details...
        </div>
      </div>
    );
  }

  if (formMode === "edit" && getAdmissionStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-red-500">
          Error loading admission details
        </div>
      </div>
    );
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
            onSaveAndPrint={formMode === "create" ? undefined : null} // You can add this back if needed
            isSubmitting={isAdmissionLoading}
            mode={formMode}
          />
        </form>
      </div>
    </div>
  );
};

export default IpdForm;