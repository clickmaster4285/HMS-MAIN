import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { InputField } from '../../../components/common/FormFields';
import doctorList from '../../../utils/doctors';

const PatientInfoForm = ({
  mode,
  patient,
  dob,
  handlePatientChange,
  handleSearch,
  handleDobChange,
  setMode,
  useDefaultContact,
  setUseDefaultContact,
  defaultContactNumber,
}) => {
  const [ageInput, setAgeInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const debounceTimer = useRef(null);

  // Helper to format age for display (e.g., "21.00" -> "21", "0.20" -> "0.2")
  const formatAgeValue = useCallback((val) => {
    if (!val) return '';
    const stringVal = String(val);
    if (!stringVal.includes('.')) return stringVal;
    
    const [years, months] = stringVal.split('.');
    if (!months || parseInt(months) === 0) return years;
    
    // If months is "10", keep it as "10", but if it's "1", keep as "1"
    return `${years}.${months}`;
  }, []);

  // Initialize ageInput for edit mode
  useEffect(() => {
    if (mode === 'edit' && patient.Age) {
      setAgeInput(formatAgeValue(patient.Age));
    }
  }, [patient.Age, mode, formatAgeValue]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Auto-capitalize function
  const autoCapitalize = useCallback((text) => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  // Handle patient name change with auto-capitalization
  const handleNameChange = useCallback((e) => {
    const { name, value } = e.target;
    const capitalizedValue = autoCapitalize(value);
    
    handlePatientChange({
      target: {
        name: name,
        value: capitalizedValue
      }
    });
  }, [autoCapitalize, handlePatientChange]);

  // Calculate DOB from age input (0.11 = 11 months)
  const calculateDobFromAge = useCallback((ageString) => {
    if (!ageString || ageString === '.') return null;

    const today = new Date();
    let years = 0;
    let months = 0;

    if (ageString.includes('.')) {
      const parts = ageString.split('.');
      years = parseInt(parts[0]) || 0;
      months = parseInt(parts[1]) || 0;
    } else {
      years = parseInt(ageString) || 0;
    }

    const calculatedDob = new Date(today);
    calculatedDob.setFullYear(today.getFullYear() - years);
    calculatedDob.setMonth(today.getMonth() - months);
    
    return calculatedDob;
  }, []);

  // Strict validation and capping logic
  const validateAndCapAge = (value) => {
    // 1. Remove anything not a digit or decimal
    let cleaned = value.replace(/[^0-9.]/g, '');
    
    // 2. Only one decimal allowed
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    // 3. Length restriction (max 5 chars)
    if (cleaned.length > 5) {
      cleaned = cleaned.substring(0, 5);
    }

    // 4. Handle leading zeros for whole numbers
    if (cleaned.length > 1 && cleaned.startsWith('0') && cleaned[1] !== '.') {
      cleaned = cleaned.replace(/^0+/, '');
      if (cleaned === '') cleaned = '0';
    }

    const newParts = cleaned.split('.');
    let yearsPart = newParts[0];
    let monthsPart = newParts[1];

    // 5. Cap years at 99
    if (yearsPart && parseInt(yearsPart) > 99) {
      yearsPart = '99';
    }

    // 6. Cap months at 11
    if (monthsPart !== undefined) {
      if (monthsPart.length > 2) {
        monthsPart = monthsPart.substring(0, 2);
      }
      if (parseInt(monthsPart) > 11) {
        monthsPart = '11';
      }
    }

    return monthsPart !== undefined ? `${yearsPart}.${monthsPart}` : yearsPart;
  };

  const handleAgeInputChange = useCallback((e) => {
    const rawValue = e.target.value;
    
    // Special handling for decimal point to allow typing "0."
    let validatedValue;
    if (rawValue.endsWith('.') && (rawValue.match(/\./g) || []).length === 1) {
      const base = rawValue.slice(0, -1).replace(/[^0-9]/g, '');
      validatedValue = (base === '' ? '0' : Math.min(parseInt(base), 99)) + '.';
    } else {
      validatedValue = validateAndCapAge(rawValue);
    }

    setAgeInput(validatedValue);
    setIsTyping(true);

    // Update parent state immediately for consistency
    handlePatientChange({
      target: {
        name: 'Age',
        value: validatedValue
      }
    });

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setIsTyping(false);
      const dob = calculateDobFromAge(validatedValue);
      handleDobChange(dob);
    }, 500);
  }, [calculateDobFromAge, handleDobChange, handlePatientChange]);

  // Common fields that appear in both modes
  const commonFields = useMemo(() => (
    <>
      {/* 1. Name */}
      <InputField
        name="Name"
        label="Name"
        placeholder="Enter full name"
        icon="user"
        value={patient.Name}
        onChange={handleNameChange}
        required
      />

      {/* 2. Age */}
      {mode === 'new' || mode === 'edit' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age (Max 99.11)<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            placeholder="e.g., 20 or 0.11"
            value={ageInput}
            onChange={handleAgeInputChange}
            className={`border rounded px-3 py-2 h-10.5 w-full shadow-sm transition-colors ${
              ageInput.includes('.') && parseInt(ageInput.split('.')[1]) > 11 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-primary-500'
            }`}
          />
          <div className="flex justify-between mt-1">
            <p className="text-[10px] text-gray-500">Format: Years.Months (0-11)</p>
            {isTyping && (
              <p className="text-[10px] text-primary-600 animate-pulse">Calculating DOB...</p>
            )}
          </div>
        </div>
      ) : (
        <InputField
          name="Age"
          label="Age"
          icon="calendar"
          placeholder="Age auto Generated"
          value={patient.Age}
          onChange={handlePatientChange}
        />
      )}

      {/* 3. Gender */}
      <div>
        <label
          htmlFor="Gender"
          className="block mb-1 font-medium text-gray-700"
        >
          Gender<span className="text-red-500"> *</span>
        </label>
        <select
          id="Gender"
          name="Gender"
          value={patient.Gender || ''}
          onChange={handlePatientChange}
          className="border h-10.5 p-2 rounded w-full border-gray-300 shadow-sm focus:ring-primary-500"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* 4. Contact */}
      <InputField
        name="ContactNo"
        label="Contact No"
        placeholder="Enter Contact No"
        icon="phone"
        value={patient.ContactNo}
        onChange={handlePatientChange}
        required
      />
      <div className="flex items-center">
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="useDefaultContact"
            checked={useDefaultContact}
            onChange={(e) => setUseDefaultContact(e.target.checked)}
            className="mr-2 h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
          <label htmlFor="useDefaultContact" className="text-sm text-gray-600">
            Use default contact number ({defaultContactNumber})
          </label>
        </div>
      </div>
      {/* 5. CNIC */}
      <InputField
        name="CNIC"
        label="CNIC"
        placeholder="Enter CNIC"
        icon="idCard"
        value={patient.CNIC}
        onChange={handlePatientChange}
      />
      <div>
        <label
          htmlFor="ReferredBy"
          className="block mb-1 font-medium text-gray-700"
        >
          Referred By
        </label>
        <select
          id="ReferredBy"
          name="ReferredBy"
          value={patient.ReferredBy || ''}
          onChange={handlePatientChange}
          className="border h-10.5 p-2 rounded w-full border-gray-300 shadow-sm focus:ring-primary-500"
        >
            {doctorList.map((doctor, index) => (
              <option key={index} value={doctor}>
                {doctor}
              </option>
            ))}
        </select>
      </div>
      <InputField
        name="Guardian"
        label="Guardian Name"
        placeholder="Enter full name"
        icon="user"
        value={patient.Guardian}
        onChange={handlePatientChange}
      />
    </>
  ), [patient, ageInput, handleNameChange, handleAgeInputChange, handlePatientChange, mode, isTyping, useDefaultContact, setUseDefaultContact, defaultContactNumber]);


  // Fields specific to existing patient mode
  const existingPatientFields = (
    <div className="col-span-3 flex gap-2 items-end">
      <InputField
        name="MRNo"
        label="MR Number"
        placeholder="MR-NO"
        icon="idCard"
        value={patient.MRNo}
        onChange={handlePatientChange}
        required
      />
      <button
        type="button"
        className="px-4 py-2 bg-primary-700 text-white rounded h-10.5"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );

  // Date of Birth field for new and edit modes
  const dobField = (mode === 'new' || mode === 'edit') && (
    <div>
      <label className="block mb-1 font-medium text-gray-700">
        Date of Birth <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        value={dob ? dob.toISOString().split('T')[0] : ''}
        onChange={(e) =>
          handleDobChange(e.target.value ? new Date(e.target.value) : null)
        }
        className="border rounded px-3 py-2 h-10.5 w-full border-gray-300 shadow-sm"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Only show mode toggle buttons for non-edit modes */}
      {mode !== 'edit' && (
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              mode === 'existing' ? 'bg-primary-700 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setMode('existing')}
          >
            Existing
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${
              mode === 'new' ? 'bg-primary-700 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setMode('new')}
          >
            New
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {mode === 'existing' && existingPatientFields}

        {commonFields}

        {/* Date of Birth field for new and edit modes */}
        {dobField}
      </div>
    </div>
  );
};

export default PatientInfoForm;