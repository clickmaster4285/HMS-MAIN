import { useState } from 'react';
import { toast } from 'react-toastify';
import PatientForm from './components/PatientForm';
import DoctorForm from './components/DoctorForm';
import PrintOptions from './components/PrintOptions';
import ActionButtons from './components/ActionButtons';
import VisitSelector from './components/VisitSelector';
import PatientSearchBar from './components/PatientSearchBar';
import { usePatientForm } from '../../../hooks/usePatientForm';
import './actionbtns.css';
import { useDispatch } from 'react-redux';
import { setSelectedPatient } from '../../../features/patient/patientSlice';

const NewOpd = ({ mode = "create" }) => {
  const dispatch = useDispatch(); // Add this line

  const {
    isLoading,
    isSubmitting,
    formData,
    handleChange,
    handleSave,
    handleDoctorSelect,
    doctorsStatus,
    getFormattedDoctors,
    mode: formMode,
    validGenders,
    validBloodTypes,
    validMaritalStatuses,
    populateForm,
    handleSearch,
    selectedVisitId,
    showVisitSelector,
    handleVisitSelect,
    setShowVisitSelector,
    localSelectedPatient,
    handlePrint,
    handleSaveAndPrint,
    selectedPatient,
  } = usePatientForm(mode);

  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const formTitle = formMode === "create"
    ? "New OPD Registration"
    : `Edit Patient - ${formData.patient_MRNo || 'Loading...'}`;
  const formDescription = formMode === "create"
    ? "Please fill in the patsetSelectedPatientient details below"
    : "Edit the patient details below";

  // Enhanced search handler
  const handlePatientSearch = async (searchTerm) => {
    setIsSearching(true);
    try {
      const results = await handleSearch(searchTerm);
      setSearchResults(results);
      setShowSearchResults(true);

      if (!results || results.length === 0) {
        toast.info("No patients found with that search term");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  // Function to handle patient selection from search results
  const handlePatientSelect = (patient) => {
    dispatch(setSelectedPatient(patient));
    if (formMode === "create") {
    populateForm(patient);
    }
    setShowSearchResults(false);
    setSearchResults([]);

    if (formMode === "edit") {
      setShowVisitSelector(true);
    }
    toast.success(`Patient ${patient.patient_Name} selected`);
  };

  // Function to clear search results
  const clearSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-primary-600 rounded-md text-white px-6 py-8 shadow-md">
          <div className="max-w-9xl mx-auto">
            <div className="flex items-center">
              <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold">{formTitle}</h1>
                <p className="text-primary-100 mt-1">{formDescription}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Search Bar - Only show in create mode */}
        {formMode === "create" && (
          <div className="px-6 pt-6">
            <PatientSearchBar
              onSearch={handlePatientSearch}
              onClear={clearSearch}
              isSearching={isSearching}
            />
          </div>
        )}

        {/* Search Results */}
        {showSearchResults && (
          <div className="px-6 pb-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Search Results ({searchResults.length})
                </h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {searchResults.map(patient => (
                  <div
                    key={patient._id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {patient.patient_Name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          MR: {patient.patient_MRNo} |
                          Contact: {patient.patient_ContactNo} |
                          {patient.patient_CNIC && ` CNIC: ${patient.patient_CNIC}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {patient.totalVisits || 0} previous visits
                        </p>
                        <p className="text-xs text-gray-400">
                          Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {searchResults.length > 0 && (
                <div className="p-3 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={clearSearch}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Close results
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visit Selector Modal */}
        {showVisitSelector && (selectedPatient || localSelectedPatient) && (
          <VisitSelector
            visits={(selectedPatient || localSelectedPatient).visits || []}
            onSelectVisit={handleVisitSelect}
            onClose={() => setShowVisitSelector(false)}
            patientName={(selectedPatient || localSelectedPatient).patient_Name}
          />
        )}

        {/* Edit Mode Notice - Only show when no visit is selected yet */}
        {formMode === "edit" && !selectedVisitId && !showVisitSelector && (
          <div className="px-6 pt-6">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-primary-800">
                    Select a visit to edit
                  </h3>
                  <div className="mt-2 text-sm text-primary-700">
                    <p>Please select which visit you want to modify from the patient's history.</p>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowVisitSelector(true)}
                      className="bg-primary-100 text-primary-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      Choose Visit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Only show the form if we're in create mode OR we have a selected visit in edit mode */}
        {(formMode === "create" || selectedVisitId) && (
          <form onSubmit={handleSaveAndPrint} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Patient Information Form */}
              <PatientForm
                formData={formData}
                handleChange={handleChange}
                mode={formMode}
                validGenders={validGenders}
                validBloodTypes={validBloodTypes}
                validMaritalStatuses={validMaritalStatuses}
              />

              {/* Doctor Information Section */}
              <DoctorForm
                formData={formData}
                handleChange={handleChange}
                doctorsStatus={doctorsStatus}
                getFormattedDoctors={getFormattedDoctors}
                onDoctorSelect={handleDoctorSelect}
              />
            </div>

            {/* <PrintOptions
              formData={formData}
              handleChange={handleChange}
            /> */}

            <ActionButtons
              mode={formMode}
              isSubmitting={isSubmitting}
              onSave={handleSave}
              onSubmit={handleSaveAndPrint}
              onPrint={handlePrint}
            />
          </form>
        )}


      </div>
    </div>
  );
};

export default NewOpd;