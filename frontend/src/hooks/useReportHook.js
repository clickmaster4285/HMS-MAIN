// hooks/useReportHook.js
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPatientTestById } from '../features/patientTest/patientTestSlice';
import { updatePatientTestResults } from '../features/testResult/TestResultSlice';

export const useReportHook = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { patientTestById, status, error } = useSelector(
    (state) => state.patientTest
  );

  const [formData, setFormData] = useState({
    results: {},
    status: 'completed',
    notes: '',
    performedBy: '',
  });
  
  const [statusByTest, setStatusByTest] = useState({});
  const [activeTestIndex, setActiveTestIndex] = useState(0);
  const [localStatuses, setLocalStatuses] = useState({});

  const selectedTests = patientTestById?.patientTest?.selectedTests || [];
  const testDefinitions = patientTestById?.testDefinitions || [];

  // Extract patient data
  const patientData = patientTestById?.patientTest
    ? {
        patientName: patientTestById.patientTest.patient_Detail?.patient_Name,
        gender: patientTestById.patientTest.patient_Detail?.patient_Gender,
        age: patientTestById.patientTest.patient_Detail?.patient_Age,
        mrNumber: patientTestById.patientTest.patient_Detail?.patient_MRNo,
        cnic: patientTestById.patientTest.patient_Detail?.patient_CNIC,
        contactNo: patientTestById.patientTest.patient_Detail?.patient_ContactNo,
        testDate: patientTestById.patientTest.createdAt,
        referredBy: patientTestById.patientTest.patient_Detail?.referredBy,
        paymentStatus: patientTestById.patientTest.paymentStatus,
        finalAmount: patientTestById.patientTest.finalAmount,
        tokenNumber: patientTestById.patientTest.tokenNumber,
      }
    : null;

  // Fetch patient test data
  useEffect(() => {
    if (id) {
      dispatch(fetchPatientTestById(id));
    }
  }, [dispatch, id]);

  // Initialize form data and statuses
  useEffect(() => {
    if (selectedTests.length > 0 && testDefinitions.length > 0) {
      const initialResults = {};
      const initialStatuses = {};

      selectedTests.forEach((test) => {
        const testDefinition = testDefinitions.find(
          (td) => td._id === test.test
        );
        const testFields = testDefinition?.fields || [];

        // Initialize results with proper structure including inputType and options
        initialResults[test.test] = testFields.map((field) => ({
          fieldName: field.name,
          value: field.value || '',
          notes: field.note || '',
          unit: field.unit || '',
          normalRange: field.normalRange || null,
          fieldId: field._id,
          inputType: field.inputType || 'text',
          options: field.options || [],
          customOptions: field.options || [], // For editable dropdown options
        }));

        initialStatuses[test.test] = getCurrentStatus(test.statusHistory);
      });

      setFormData((prev) => ({
        ...prev,
        results: initialResults,
      }));

      setStatusByTest(initialStatuses);
    }
  }, [selectedTests, testDefinitions]);

  const getCurrentStatus = useCallback((statusHistory) => {
    if (!statusHistory || statusHistory.length === 0) return 'registered';
    const sortedHistory = [...statusHistory].sort(
      (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
    );
    return sortedHistory[0].status;
  }, []);

  // Handle field value changes
  const handleFieldChange = useCallback((testId, fieldIndex, field, value) => {
    setFormData((prev) => {
      const updatedResults = { ...prev.results };
      const testResults = [...(updatedResults[testId] || [])];
      
      testResults[fieldIndex] = {
        ...testResults[fieldIndex],
        [field]: value,
      };

      return {
        ...prev,
        results: {
          ...updatedResults,
          [testId]: testResults,
        },
      };
    });

    // Auto-update status when values are entered
    if (field === 'value' && value.trim() !== '') {
      setStatusByTest((prev) => ({
        ...prev,
        [testId]: 'completed',
      }));
    }
  }, []);

  // Handle dropdown option changes
  const handleOptionChange = useCallback((testId, fieldIndex, newOptions) => {
    setFormData((prev) => {
      const updatedResults = { ...prev.results };
      const testResults = [...(updatedResults[testId] || [])];
      
      testResults[fieldIndex] = {
        ...testResults[fieldIndex],
        options: newOptions,
        customOptions: newOptions, // Update both options and customOptions
      };

      return {
        ...prev,
        results: {
          ...updatedResults,
          [testId]: testResults,
        },
      };
    });
  }, []);

  // Save current test
  const saveCurrentTest = useCallback(async (currentTestId) => {
    const def = testDefinitions.find((td) => td._id === currentTestId);
    if (!def || !Array.isArray(def.fields)) {
      console.warn('Skipping update: no fields for test', currentTestId);
      return;
    }

    const rows = formData?.results?.[currentTestId] || [];

    const updateData = {
      results: rows
        .filter((r) => r?.fieldName?.trim()?.length)
        .map((r) => ({
          fieldName: r.fieldName,
          value: r.value,
          notes: r.notes,
          testId: currentTestId,
          inputType: r.inputType,
          options: r.options,
        })),
      status: statusByTest[currentTestId] ?? 'pending',
      notes: formData.notes ?? '',
      performedBy: formData.performedBy ?? '',
    };

    try {
      await dispatch(
        updatePatientTestResults({
          patientTestId: id,
          testId: currentTestId,
          updateData,
        })
      ).unwrap();

      setLocalStatuses((prev) => ({
        ...prev,
        [currentTestId]: updateData.status,
      }));

      return true;
    } catch (error) {
      console.error('Failed to save test:', error);
      throw error;
    }
  }, [formData, testDefinitions, statusByTest, dispatch, id]);

  return {
    // State
    formData,
    setFormData,
    statusByTest,
    setStatusByTest,
    activeTestIndex,
    setActiveTestIndex,
    localStatuses,
    
    // Data
    selectedTests,
    testDefinitions,
    patientData,
    patientTestById,
    
    // Loading states
    status,
    error,
    
    // Handlers
    handleFieldChange,
    handleOptionChange,
    saveCurrentTest,
    
    // Helpers
    getCurrentStatus,
  };
};