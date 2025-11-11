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
  setErrors((p) => ({ ...p, dob: '' }));

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

const handleAgeInputChange = (e) => {
  const value = e.target.value;
  setAgeInput(value);

  if (ageTimer.current) clearTimeout(ageTimer.current);
  ageTimer.current = setTimeout(() => {
    if (!value.trim()) {
      setErrors((prev) => ({ ...prev, ageManual: '' }));
      setDob(null);
      setPatient((prev) => ({ ...prev, Age: '' }));
      return;
    }

    const d = parseFlexibleAgeToDob(value);
    if (d && d <= new Date()) {
      setDob(d);
      const ageStr = ageStringFromDob(d);
      setPatient((prev) => ({ ...prev, Age: ageStr }));
      setAgeInput(ageStr); // normalize the input to computed value
      setErrors((prev) => ({ ...prev, ageManual: '' }));
    } else {
      setErrors((prev) => ({ ...prev, ageManual: 'Invalid age format' }));
    }
  }, 600);
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

      {mode === 'new' ? (
        <>
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
    </>
  );
};

export default PatientDetails;
