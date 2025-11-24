import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchPatientByMRNo } from '../../../features/patientTest/patientTestSlice';
import { fetchAllDoctors } from "../../../features/doctor/doctorSlice";

const CriticalFormModal = ({ isOpen, onClose, onSubmit, editingResult }) => {
  const dispatch = useDispatch();

  // IMPORTANT: your slice uses `loading`, not `isLoading`
  const {
    patient,
    loading: patientLoading,
    error: patientError,
  } = useSelector((state) => state.patientTest);

  // Get doctors from Redux store
  const { doctors, loading: doctorsLoading } = useSelector((state) => state.doctor);
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    patientName: '',
    gender: '',
    age: '',
    mrNo: '',
    sampleCollectionTime: '',
    reportDeliveryTime: '',
    informedTo: '',
    contactNo: '',
  });

  const [tests, setTests] = useState([{ testName: '', criticalValue: '' }]);
  const [labTechSignature, setLabTechSignature] = useState('');
  const [doctorSignature, setDoctorSignature] = useState('');
  const [useDefaultContact, setUseDefaultContact] = useState(false);
  const [defaultContactNumber] = useState('051-3311342');
  const [dob, setDob] = useState(null);
  const [ageError, setAgeError] = useState('');
  const [showCustomDoctor, setShowCustomDoctor] = useState(false);
  const [customDoctor, setCustomDoctor] = useState('');

  const req = (label) => (
    <span className="inline-flex items-center gap-1">
      <span>{label}</span>
      <span className="text-red-600">*</span>
    </span>
  );

  // ---- useEffect hooks -----------------------------------------------------

  // Fetch all doctors when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAllDoctors());
    }
  }, [dispatch, isOpen]);

  // Default contact toggle
  useEffect(() => {
    if (useDefaultContact) {
      setForm((prev) => ({ ...prev, contactNo: defaultContactNumber }));
    } else if (form.contactNo === defaultContactNumber) {
      setForm((prev) => ({ ...prev, contactNo: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDefaultContact, defaultContactNumber]);

  // If you still want to react to store's `patient`, map field names correctly
  useEffect(() => {
    if (patient) {
      const dobField = patient.DateOfBirth || patient.dateOfBirth;
      const ageStr =
        patient.age || (dobField ? calculateAge(dobField) : '') || '';

      const calculatedDob = dobField
        ? new Date(dobField)
        : calculateDobFromAge(ageStr);

      setForm((prev) => ({
        ...prev,
        patientName: patient.name || patient.Name || '',
        gender: patient.gender || patient.Gender || '',
        age: ageStr,
        contactNo: patient.contactNo || patient.ContactNo || '',
        // keep modal-only fields from prev
        sampleCollectionTime: prev.sampleCollectionTime,
        reportDeliveryTime: prev.reportDeliveryTime,
        informedTo: prev.informedTo,
      }));
      setDob(calculatedDob || null);

      const c = patient.contactNo || patient.ContactNo || '';
      setUseDefaultContact(!c || c.trim() === '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient]);

  // Prefill when editing an existing result
  useEffect(() => {
    if (editingResult) {
      const age = editingResult.age || '';
      const calculatedDob = editingResult.dob
        ? new Date(editingResult.dob)
        : calculateDobFromAge(age);

      // Check if the informedTo value exists in doctors list
      const informedToValue = editingResult.informedTo || '';
      const isDoctorInList = doctors.some(doctor =>
        doctor?.user?.user_Name === informedToValue
      );
      // doctor?.doctor_Department === Department
      setForm({
        date: editingResult.date || new Date().toISOString().split('T')[0],
        patientName: editingResult.patientName || '',
        gender: editingResult.gender || '',
        age,
        contactNo: editingResult.contactNo || '',
        mrNo: editingResult.mrNo || '',
        sampleCollectionTime: editingResult.sampleCollectionTime || '',
        reportDeliveryTime: editingResult.reportDeliveryTime || '',
        informedTo: isDoctorInList ? informedToValue : '',
      });
      setTests(editingResult.tests || [{ testName: '', criticalValue: '' }]);
      setLabTechSignature(editingResult.labTechSignature || '');
      setDoctorSignature(editingResult.doctorSignature || '');
      setDob(calculatedDob || null);
      setUseDefaultContact(editingResult.contactNo === defaultContactNumber);
      setAgeError('');

      // Show custom doctor input if the doctor is not in the list
      if (informedToValue && !isDoctorInList) {
        setShowCustomDoctor(true);
        setCustomDoctor(informedToValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingResult, defaultContactNumber, doctors]);

  // ---- helpers -------------------------------------------------------------

  // Age from DOB
  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const d = new Date(birthDate);
    let years = today.getFullYear() - d.getFullYear();
    let months = today.getMonth() - d.getMonth();
    let days = today.getDate() - d.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years} years ${months} months ${days} days`;
  };

  // DOB from age string
  const calculateDobFromAge = (ageStr = '') => {
    const s = String(ageStr).trim();

    // Simple numeric years "33"
    const numericMatch = s.match(/^\d+$/);
    if (numericMatch) {
      const years = parseInt(s, 10);
      setAgeError('');
      const today = new Date();
      const d = new Date(
        today.getFullYear() - years,
        today.getMonth(),
        today.getDate()
      );
      return Number.isNaN(d.getTime()) ? null : d;
    }

    // Full form "X years Y months Z days"
    const fullMatch = s.match(
      /(\d+)\s*years?(?:\s*(\d*)\s*months?)?(?:\s*(\d*)\s*days?)?/i
    );
    if (!fullMatch) {
      if (s) {
        setAgeError(
          'Invalid age format. Use a number (e.g., "33") or "X years Y months Z days".'
        );
      } else {
        setAgeError('');
      }
      return null;
    }

    setAgeError('');
    const today = new Date();
    const years = Number(fullMatch[1] || 0);
    const months = Number(fullMatch[2] || 0);
    const days = Number(fullMatch[3] || 0);

    const d = new Date(
      today.getFullYear() - years,
      today.getMonth() - months,
      today.getDate() - days
    );
    return Number.isNaN(d.getTime()) ? null : d;
  };

  // ---- handlers ------------------------------------------------------------

  const handleDobChange = (date) => {
    setDob(date);
    setForm((prev) => ({ ...prev, age: calculateAge(date) }));
    setAgeError('');
  };

  const handleAgeChange = (e) => {
    const age = e.target.value;
    setForm((prev) => ({ ...prev, age }));
    if (!age.trim()) {
      setDob(null);
      setAgeError('');
      return;
    }
    const calculatedDob = calculateDobFromAge(age);
    setDob(calculatedDob);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInformedToChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setShowCustomDoctor(true);
      setForm((prev) => ({ ...prev, informedTo: '' }));
    } else {
      setShowCustomDoctor(false);
      setCustomDoctor('');
      setForm((prev) => ({ ...prev, informedTo: value }));
    }
  };

  const handleCustomDoctorChange = (e) => {
    const value = e.target.value;
    setCustomDoctor(value);
    setForm((prev) => ({ ...prev, informedTo: value }));
  };

  // IMPORTANT: unwrap the thunk and set local state right away
  const handleFetchPatient = async () => {
    const mr = form.mrNo?.trim();
    if (!mr) return;

    try {
      const p = await dispatch(fetchPatientByMRNo(mr)).unwrap();

      const dobField = p?.DateOfBirth || p?.dateOfBirth;
      const ageStr = p?.age || (dobField ? calculateAge(dobField) : '') || '';
      const calculatedDob = dobField
        ? new Date(dobField)
        : calculateDobFromAge(ageStr);

      setForm((prev) => ({
        ...prev,
        // keep user-entered mrNo unless you want to replace:
        // mrNo: p?.mrno || p?.mrNo || prev.mrNo,
        patientName: p?.name || p?.Name || '',
        gender: p?.gender || p?.Gender || '',
        age: ageStr,
        contactNo: p?.contactNo || p?.ContactNo || '',
        // modal-only fields stay as is
        sampleCollectionTime: prev.sampleCollectionTime,
        reportDeliveryTime: prev.reportDeliveryTime,
        informedTo: prev.informedTo,
      }));
      setDob(calculatedDob || null);
      setUseDefaultContact(!(p?.contactNo || p?.ContactNo)?.trim());
    } catch (err) {
      console.error('Fetch by MR No failed:', err);
      alert(err?.payload?.message || 'Patient not found. Please check MR No.');
    }
  };

  const handleTestChange = (idx, e) => {
    const { name, value } = e.target;
    setTests((prev) =>
      prev.map((test, i) => (i === idx ? { ...test, [name]: value } : test))
    );
  };

  const addTestRow = () => {
    setTests((prev) => [...prev, { testName: '', criticalValue: '' }]);
  };

  const removeTestRow = (idx) => {
    setTests((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ageError) {
      alert('Please correct the age format before submitting.');
      return;
    }
    const payload = {
      ...form,
      dob: dob ? dob.toISOString().split('T')[0] : '',
      tests: tests.filter((t) => t.testName && t.criticalValue),
      labTechSignature,
      doctorSignature,
    };
    onSubmit(payload);
    setForm({
      date: new Date().toISOString().split('T')[0],
      patientName: '',
      gender: '',
      age: '',
      mrNo: '',
      sampleCollectionTime: '',
      reportDeliveryTime: '',
      informedTo: '',
      contactNo: '',
    });
    setTests([{ testName: '', criticalValue: '' }]);
    setLabTechSignature('');
    setDoctorSignature('');
    setDob(null);
    setUseDefaultContact(false);
    setAgeError('');
    setShowCustomDoctor(false);
    setCustomDoctor('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="critical-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-primary-600 backdrop-blur px-5 sm:px-6 py-4 flex items-center justify-between">
          <h3
            id="critical-modal-title"
            className="text-lg sm:text-xl font-semibold text-white"
          >
            {editingResult ? 'Edit Critical Result' : 'Add New Critical Result'}
          </h3>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('Date')}
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('MR No')}
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    name="mrNo"
                    value={form.mrNo}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleFetchPatient}
                    disabled={patientLoading}
                    className="whitespace-nowrap rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60"
                  >
                    {patientLoading ? '...' : 'Fetch'}
                  </button>
                </div>
                {patientError && (
                  <p className="mt-1 text-sm text-red-600">{patientError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('Patient Name')}
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('Sample Collection Time')}
                </label>
                <input
                  type="text"
                  name="sampleCollectionTime"
                  value={form.sampleCollectionTime}
                  onChange={handleChange}
                  placeholder="e.g. 10:30 AM"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('Report Delivery Time')}
                </label>
                <input
                  type="text"
                  name="reportDeliveryTime"
                  value={form.reportDeliveryTime}
                  onChange={handleChange}
                  placeholder="e.g. 12:15 PM"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('Age')}
                </label>
                <input
                  type="text"
                  name="age"
                  value={form.age}
                  onChange={handleAgeChange}
                  placeholder='e.g. 33 or "33 years 2 months 10 days"'
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                />
                {ageError && (
                  <p className="mt-1 text-sm text-red-600">{ageError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <DatePicker
                  selected={dob}
                  onChange={handleDobChange}
                  dateFormat="yyyy-MM-dd"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                  placeholderText="Select DOB"
                  maxDate={new Date()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('Contact No')}
                </label>
                <div className="mt-1 flex flex-col gap-2">
                  <input
                    type="text"
                    name="contactNo"
                    value={form.contactNo}
                    onChange={handleChange}
                    placeholder="e.g. 0300 0000000"
                    required
                    disabled={useDefaultContact}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500 disabled:bg-gray-100"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={useDefaultContact}
                      onChange={(e) => setUseDefaultContact(e.target.checked)}
                      className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                    />
                    Use default contact ({defaultContactNumber})
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('Informed To')}
                </label>
                {!showCustomDoctor ? (
                  <select
                    name="informedTo"
                    value={form.informedTo}
                    onChange={handleInformedToChange}
                    required
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                  >
                    <option value="">Select Doctor</option>
                    {doctorsLoading ? (
                      <option value="" disabled>Loading doctors...</option>
                    ) : (
                      doctors?.map((doctor) => (
                        <option key={doctor._id} value={doctor?.user?.user_Name}>
                          {doctor?.user?.user_Name} - {doctor?.doctor_Department}
                        </option>
                      ))
                    )}
                    <option value="custom">+ Add Custom Doctor</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDoctor}
                      onChange={handleCustomDoctorChange}
                      placeholder="Enter doctor name"
                      required
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomDoctor(false);
                        setCustomDoctor('');
                        setForm((prev) => ({ ...prev, informedTo: '' }));
                      }}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  {req('Tests')}
                </label>
                <button
                  type="button"
                  onClick={addTestRow}
                  className="text-sm font-medium text-cyan-700 hover:text-cyan-900"
                >
                  + Add Test
                </button>
              </div>

              <div className="space-y-2">
                {tests.map((test, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <input
                      type="text"
                      name="testName"
                      value={test.testName}
                      onChange={(e) => handleTestChange(idx, e)}
                      placeholder="Test Name"
                      required
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                    <input
                      type="text"
                      name="criticalValue"
                      value={test.criticalValue}
                      onChange={(e) => handleTestChange(idx, e)}
                      placeholder="Critical Value"
                      required
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                    {tests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTestRow(idx)}
                        className="h-10 w-10 rounded-lg text-red-600 hover:bg-red-50"
                        aria-label="Remove test row"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('Lab Technician Signature')}
                </label>
                <input
                  type="text"
                  value={labTechSignature}
                  onChange={(e) => setLabTechSignature(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {req('Doctor Signature')}
                </label>
                <input
                  type="text"
                  value={doctorSignature}
                  onChange={(e) => setDoctorSignature(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 py-4 bg-white/90 backdrop-blur border-t border-gray-300 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={patientLoading || !!ageError}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-60"
              >
                {patientLoading
                  ? 'Saving...'
                  : editingResult
                    ? 'Update'
                    : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CriticalFormModal;