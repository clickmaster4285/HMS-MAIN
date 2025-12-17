import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputField } from '../../../components/common/FormFields';
import doctorList from '../../../utils/doctors';
import { ageStringFromDob, parseFlexibleAgeToDob } from './ageUtils';

const PatientDetails = ({
  mode,
  patient,
  setPatient,
  dob,
  setDob,
  ageInput,
  setAgeInput,
  useDefaultContact,
  setUseDefaultContact,
  defaultContactNumber,
  prevContactNoRef,
  errors,
  setErrors,
  handleSearchExisting,
  ageTimer,
}) => {
  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleDobChange = (d) => {
    setErrors((p) => ({ ...p, dob: '', ageManual: '' }));

    if (!d) {
      setDob(null);
      setPatient((prev) => ({ ...prev, Age: '' }));
      setAgeInput('');
      return;
    }

    if (d > new Date()) {
      setErrors((p) => ({ ...p, dob: 'DOB cannot be in the future' }));
      return;
    }

    setDob(d);

    const ageStr = ageStringFromDob(d);
    setPatient((prev) => ({ ...prev, Age: ageStr }));
    setAgeInput(ageStr); // keep the age input in sync with DOB
  };

  // Calculate DOB from age input (similar to your provided method)
  const calculateDobFromAge = (ageString) => {
    if (!ageString) return null;

    const today = new Date();
    const ageParts = ageString.toLowerCase().split(' ');

    let years = 0;
    let months = 0;
    let days = 0;

    // Handle decimal input like "0.2" (meaning 0.2 years = 2.4 months ≈ 2 months)
    if (ageString.includes('.')) {
      const decimalValue = parseFloat(ageString);
      if (!isNaN(decimalValue)) {
        if (decimalValue < 1) {
          // If less than 1 year, treat as months
          months = Math.round(decimalValue * 12);
        } else {
          // If 1 or more years, split into years and months
          years = Math.floor(decimalValue);
          months = Math.round((decimalValue - years) * 12);
        }
      }
    } else {
      // Parse age string (e.g., "20 years", "2 months", "1 year 6 months")
      for (let i = 0; i < ageParts.length; i++) {
        if (ageParts[i] === 'year' || ageParts[i] === 'years') {
          years = parseInt(ageParts[i - 1]) || 0;
        } else if (ageParts[i] === 'month' || ageParts[i] === 'months') {
          months = parseInt(ageParts[i - 1]) || 0;
        } else if (ageParts[i] === 'day' || ageParts[i] === 'days') {
          days = parseInt(ageParts[i - 1]) || 0;
        }
      }

      // If it's just a number, assume it's years
      if (!isNaN(ageString) && years === 0 && months === 0 && days === 0) {
        years = parseInt(ageString);
      }
    }

    // Calculate DOB
    const calculatedDob = new Date(today);
    calculatedDob.setFullYear(today.getFullYear() - years);
    calculatedDob.setMonth(today.getMonth() - months);
    calculatedDob.setDate(today.getDate() - days);

    return calculatedDob;
  };

  // Handle age input change with debounce (similar to your provided method)
  const handleAgeInputChange = (e) => {
    const value = e.target.value;
    setAgeInput(value);

    // Clear existing timeout
    if (ageTimer.current) {
      clearTimeout(ageTimer.current);
    }

    // Set new timeout
    ageTimer.current = setTimeout(() => {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, ageManual: '' }));
        setDob(null);
        setPatient((prev) => ({ ...prev, Age: '' }));
        return;
      }

      // Try using your parseFlexibleAgeToDob first
      const dobFromUtils = parseFlexibleAgeToDob(value);
      if (dobFromUtils && dobFromUtils <= new Date()) {
        setDob(dobFromUtils);
        const ageStr = ageStringFromDob(dobFromUtils);
        setPatient((prev) => ({ ...prev, Age: ageStr }));
        setAgeInput(ageStr);
        setErrors((prev) => ({ ...prev, ageManual: '' }));
        return;
      }

      // Fallback to calculateDobFromAge
      const calculatedDob = calculateDobFromAge(value);
      if (calculatedDob && calculatedDob <= new Date()) {
        setDob(calculatedDob);
        const ageStr = ageStringFromDob(calculatedDob);
        setPatient((prev) => ({ ...prev, Age: ageStr }));
        setAgeInput(ageStr);
        setErrors((prev) => ({ ...prev, ageManual: '' }));
      } else {
        setErrors((prev) => ({ ...prev, ageManual: 'Invalid age format' }));
      }
    }, 800); // 800ms delay as in your example
  };

  const onToggleDefaultContact = (checked) => {
    setUseDefaultContact(checked);
    if (checked) {
      prevContactNoRef.current = patient.ContactNo || '';
      setPatient((prev) => ({ ...prev, ContactNo: defaultContactNumber }));
    } else {
      setPatient((prev) => ({
        ...prev,
        ContactNo: prevContactNoRef.current || '',
      }));
    }
  };

  return (
    <>
      {/* MR Number for existing patients only */}
      {mode === 'existing' && (
        <div className="md:col-span-3 flex gap-2 items-end">
          <div className="" data-nav>
            <InputField
              name="MRNo"
              label="MR Number"
              placeholder="MR-NO"
              icon="idCard"
              value={patient.MRNo}
              onChange={handlePatientChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearchExisting();
                }
              }}
              required
              data-nav
            />
            {errors.MRNo && (
              <p className="text-red-600 text-sm mt-1">{errors.MRNo}</p>
            )}
          </div>
          <button
            type="button"
            className="px-4 h-[42px] bg-primary-700 text-white rounded"
            onClick={handleSearchExisting}
            title="Search by MRN"
          >
            Search
          </button>
        </div>
      )}

      {/* SEQUENCE: 1. Name */}
      <div data-nav>
        <InputField
          name="Name"
          label="Name"
          placeholder="Enter full name"
          icon="user"
          value={patient.Name}
          onChange={handlePatientChange}
          required
        />
      </div>

      {/* SEQUENCE: 2. Age & DOB */}
      {mode === 'new' ? (
        <>
          {/* Age Input Field for new patients */}
          <div data-nav>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age (auto-calculates DOB) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 20, 0.2, 2 months, 1.5"
              value={ageInput}
              onChange={handleAgeInputChange}
              className="border border-gray-300 shadow-sm rounded px-3 py-2 h-[42px] w-full"
            />
            {errors.ageManual && (
              <p className="text-red-600 text-sm mt-1">{errors.ageManual}</p>
            )}
          </div>

          {/* Date of Birth for new patients */}
          <div data-nav>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="border rounded border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 h-[42px]">
              <DatePicker
                selected={dob}
                onChange={handleDobChange}
                dateFormat="yyyy-MM-dd"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
                placeholderText="Select DOB"
                className="w-full h-full px-3 py-2 focus:outline-none"
                onKeyDown={() => {}}
              />
            </div>
            {errors.dob && (
              <p className="text-red-600 text-sm mt-1">{errors.dob}</p>
            )}
          </div>
        </>
      ) : (
        <div className="md:col-span-1" data-nav>
          <InputField
            name="Age"
            label="Age"
            icon="calendar"
            placeholder="Age auto generated"
            value={patient.Age}
            onChange={handlePatientChange}
            readOnly
          />
        </div>
      )}

      {/* SEQUENCE: 3. Gender */}
      <div>
        <label
          htmlFor="Gender"
          className="block mb-1 font-medium text-gray-700"
        >
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          id="Gender"
          name="Gender"
          value={patient.Gender || ''}
          onChange={handlePatientChange}
          className="border h-[42px] p-2 rounded w-full border-gray-200 shadow-sm"
          data-nav
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.Gender && (
          <p className="text-red-600 text-sm mt-1">{errors.Gender}</p>
        )}
      </div>

      {/* SEQUENCE: 4. Contact */}
      <div className="" data-nav>
        <InputField
          name="ContactNo"
          label="Contact No"
          placeholder="Enter Contact No"
          icon="phone"
          value={patient.ContactNo}
          onChange={handlePatientChange}
          required
          disabled={useDefaultContact}
        />
        {errors.ContactNo && (
          <p className="text-red-600 text-sm mt-1">{errors.ContactNo}</p>
        )}
      </div>

      {/* Default contact checkbox */}
      <div className="flex items-center">
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="useDefaultContact"
            checked={useDefaultContact}
            onChange={(e) => onToggleDefaultContact(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="useDefaultContact" className="text-sm text-gray-600">
            Use default contact number ({defaultContactNumber})
          </label>
        </div>
      </div>

      {/* SEQUENCE: 5. CNIC */}
      <div data-nav>
        <InputField
          name="CNIC"
          label="CNIC"
          placeholder="Enter CNIC"
          icon="idCard"
          value={patient.CNIC}
          onChange={handlePatientChange}
        />
      </div>

      {/* SEQUENCE: 6. Referred By */}
      <div className="">
        <label
          htmlFor="ReferredBy"
          className="block mb-1 font-medium text-gray-700"
        >
          Referred By <span className="text-red-500">*</span>
        </label>
        <select
          id="ReferredBy"
          name="ReferredBy"
          value={patient.ReferredBy || ''}
          onChange={handlePatientChange}
          className="border h-[42px] p-2 rounded w-full border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          data-nav
          required
        >
          <option value="">Select Doctor</option>
          {doctorList.map((doctor, index) => (
            <option key={index} value={doctor}>
              {doctor}
            </option>
          ))}
        </select>
        {errors.ReferredBy && (
          <p className="text-red-600 text-sm mt-1">{errors.ReferredBy}</p>
        )}
      </div>

      {/* Guardian Name - Optional field placed at the end */}
      <div data-nav>
        <InputField
          name="Guardian"
          label="Guardian Name"
          placeholder="Enter full name"
          icon="user"
          value={patient.Guardian}
          onChange={handlePatientChange}
        />
      </div>
    </>
  );
};

export default PatientDetails;