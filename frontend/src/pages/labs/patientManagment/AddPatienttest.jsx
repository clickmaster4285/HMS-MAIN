import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup } from '../../../components/common/Buttons';
import { FormSection } from '../../../components/common/FormSection';
import ReactDOMServer from 'react-dom/server';
import PrintA4 from './PrintPatientTest';
import {
  fetchAllTests,
  SubmitPatientTest,
  fetchPatientByMRNo,
  resetPatientTestStatus,
} from '../../../features/patientTest/patientTestSlice';
import PatientInfoForm from './PatientIno';
import TestInformationForm from './TestInfo';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddlabPatient = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    patient: patientAll,
    loading,
    error,
  } = useSelector((state) => state.patientTest);
  const testList = useSelector((state) => state.patientTest.tests);

  const [isPrinting, setIsPrinting] = useState(false);
  const [mode, setMode] = useState('existing');

  const [patient, setPatient] = useState({
    id: '',
    MRNo: '',
    CNIC: '',
    Name: '',
    ContactNo: '',
    Gender: '',
    Age: '',
    ReferredBy: '',
    Guardian: '',
  });

  const [selectedTestId, setSelectedTestId] = useState('');
  const [testRows, setTestRows] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [dob, setDob] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [useDefaultContact, setUseDefaultContact] = useState(false);
  const [defaultContactNumber] = useState('051-3311342');
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef(null);

  // ===== helpers: integers only + normalization =====
  const toInt = (v) => {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? 0 : Math.max(0, n);
  };

  const normalizeRows = (rows) =>
    rows.map((r) => {
      const amount = toInt(r.amount);
      const discount = Math.min(toInt(r.discount), amount);
      const finalAmount = amount - discount;
      const paid = Math.min(toInt(r.paid), finalAmount);
      const remaining = Math.max(0, finalAmount - paid);
      return { ...r, amount, discount, finalAmount, paid, remaining };
    });

  useEffect(() => {
    dispatch(fetchAllTests());
    return () => dispatch(resetPatientTestStatus());
  }, [dispatch]);

  // default contact toggle
  useEffect(() => {
    if (useDefaultContact) {
      setPatient((prev) => ({ ...prev, ContactNo: defaultContactNumber }));
    } else if (patient.ContactNo === defaultContactNumber) {
      setPatient((prev) => ({ ...prev, ContactNo: '' }));
    }
  }, [useDefaultContact, defaultContactNumber]);

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

  const handleDobChange = (date) => {
    setDob(date);
    setPatient((prev) => ({ ...prev, Age: calculateAge(date) }));
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === 'CNIC' && value.length > 13) ||
      (name === 'ContactNo' && value.length > 15)
    )
      return;
    setPatient({ ...patient, [name]: value });
  };

  const handleSearch = async () => {
    const mrNo = patient.MRNo?.trim();
    if (!mrNo) {
      alert('Please enter MR No.');
      return;
    }

    try {
      const patientData = await dispatch(fetchPatientByMRNo(mrNo)).unwrap();
      if (!patientData) {
        alert('Patient not found.');
        return;
      }

      if (!patientData.contactNo || patientData.contactNo.trim() === '') {
        setUseDefaultContact(true);
      }

      setPatient({
        MRNo: patientData.mrno || '',
        CNIC: patientData.cnic || '',
        Name: patientData.name || '',
        ContactNo: patientData.contactNo || '',
        Gender: patientData.gender || '',
        Age: patientData.age || calculateAge(patientData.DateOfBirth) || '',
        ReferredBy: patientData.referredBy || '',
        Guardian: patientData.gaurdian || '',
      });
    } catch (err) {
      console.error('❌ Patient not found:', err);
      alert(err.payload?.message || 'Patient not found. Please check MR No.');
    }
  };

  const handleTestAdd = (tId) => {
    const id = tId ?? selectedTestId;
    if (!id) return;
    const selected = testList?.find((t) => t._id === id);
    if (!selected) return;

    const today = new Date().toISOString().split('T')[0];
    const priceInt = toInt(selected.testPrice);

    setTestRows((prev) =>
      normalizeRows([
        ...prev,
        {
          testId: selected._id,
          testName: selected.testName,
          testCode: selected.testCode,
          quantity: prev.length + 1,
          sampleDate: today,
          reportDate: today,
          amount: priceInt,
          discount: 0,
          finalAmount: priceInt,
          paid: 0,
          remaining: priceInt,
          notes: '',
        },
      ])
    );
    setSelectedTestId('');
  };

  const handleTestRowChange = (i, field, value) => {
    const rows = [...testRows];
    rows[i][field] = ['amount', 'discount', 'paid'].includes(field)
      ? toInt(value)
      : value;
    setTestRows(normalizeRows(rows));
  };

  const handleRemoveRow = (i) => {
    const updatedRows = testRows.filter((_, idx) => idx !== i);
    const reNumbered = updatedRows.map((row, idx) => ({
      ...row,
      quantity: idx + 1,
    }));
    setTestRows(normalizeRows(reNumbered));
  };

  // totals (integers)
  const totalAmount = testRows.reduce((sum, r) => sum + toInt(r.amount), 0);
  const totalDiscount = testRows.reduce(
    (sum, r) => sum + Math.min(toInt(r.discount), toInt(r.amount)),
    0
  );
  const totalFinalAmount = totalAmount - totalDiscount;
  const totalPaid = testRows.reduce((sum, r) => sum + toInt(r.paid), 0);
  const overallRemaining = Math.max(0, totalFinalAmount - totalPaid);

  const applyOverallDiscount = (overallDiscount) => {
    const discount = toInt(overallDiscount);
    if (discount > totalAmount) {
      toast.error('Total discount cannot exceed total amount');
      return;
    }

    const rows = [...testRows];

    if (discount === totalAmount) {
      const updatedRows = rows.map((row) => ({
        ...row,
        discount: toInt(row.amount),
      }));
      setTestRows(normalizeRows(updatedRows));
      return;
    }

    // Proportional distribution
    const updatedRows = rows.map((row) => {
      const amount = toInt(row.amount);
      if (amount === 0) return { ...row, discount: 0 };
      const exact = discount * (amount / totalAmount);
      const floored = Math.floor(exact);
      return { ...row, discount: floored };
    });

    let applied = updatedRows.reduce((s, r) => s + r.discount, 0);
    let remainder = discount - applied;

    // Sort indices by amount descending
    const sortedIndices = [...rows.keys()].sort(
      (a, b) => toInt(rows[b].amount) - toInt(rows[a].amount)
    );

    for (let i of sortedIndices) {
      const amount = toInt(rows[i].amount);
      while (remainder > 0 && updatedRows[i].discount < amount) {
        updatedRows[i].discount += 1;
        remainder -= 1;
      }
      if (remainder === 0) break;
    }

    setTestRows(normalizeRows(updatedRows));
  };

  const applyOverallPaid = (overallPaid) => {
    const paid = toInt(overallPaid);
    if (paid > totalFinalAmount) {
      toast.error('Total paid cannot exceed total final amount');
      return;
    }

    const rows = [...testRows];

    if (paid === totalFinalAmount) {
      const updatedRows = rows.map((row) => {
        const final = toInt(row.amount) - toInt(row.discount);
        return { ...row, paid: final };
      });
      setTestRows(normalizeRows(updatedRows));
      return;
    }

    // Proportional distribution
    const updatedRows = rows.map((row) => {
      const finalAmt = toInt(row.amount) - toInt(row.discount);
      if (finalAmt === 0) return { ...row, paid: 0 };
      const exact = paid * (finalAmt / totalFinalAmount);
      const floored = Math.floor(exact);
      return { ...row, paid: floored };
    });

    let applied = updatedRows.reduce((s, r) => s + r.paid, 0);
    let remainder = paid - applied;

    // Sort indices by finalAmount descending
    const sortedIndices = [...rows.keys()].sort(
      (a, b) =>
        toInt(rows[b].amount) -
        toInt(rows[b].discount) -
        (toInt(rows[a].amount) - toInt(rows[a].discount))
    );

    for (let i of sortedIndices) {
      const finalAmt = toInt(rows[i].amount) - toInt(rows[i].discount);
      while (remainder > 0 && updatedRows[i].paid < finalAmt) {
        updatedRows[i].paid += 1;
        remainder -= 1;
      }
      if (remainder === 0) break;
    }

    setTestRows(normalizeRows(updatedRows));
  };

  const handlePrint = (data) => {
    const htmlContent = ReactDOMServer.renderToString(
      <PrintA4 formData={data} />
    );
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const submitForm = async (shouldPrint = false) => {
    if (testRows.length === 0) {
      toast.error('Please add at least one test');
      return;
    }

    if (!patient.Name?.trim()) {
      toast.error('Patient name is required');
      return;
    }

    const normalizedRows = normalizeRows(testRows);
    const totalAmountInt = normalizedRows.reduce((s, r) => s + r.amount, 0);
    const totalDiscountInt = normalizedRows.reduce((s, r) => s + r.discount, 0);
    const totalFinalInt = totalAmountInt - totalDiscountInt;
    const totalPaidInt = normalizedRows.reduce((s, r) => s + r.paid, 0);
    const remainingInt = Math.max(0, totalFinalInt - totalPaidInt);

    const payload = {
      patient_MRNo: patient.MRNo,
      patient_CNIC: patient.CNIC,
      patient_Name: patient.Name,
      patient_Guardian: patient.Guardian,
      patient_ContactNo: patient.ContactNo,
      patient_Gender: patient.Gender,
      patient_Age: patient.Age,
      referredBy: patient.ReferredBy,
      isExternalPatient: mode === 'new',
      selectedTests: normalizedRows.map((row) => ({
        test: row.testId,
        testPrice: row.amount,
        discountAmount: row.discount,
        advanceAmount: row.paid,
        remainingAmount: row.remaining,
        sampleDate: row.sampleDate,
        reportDate: row.reportDate,
        notes: row.notes || '',
      })),
      totalAmount: totalAmountInt,
      advanceAmount: totalPaidInt,
      remainingAmount: remainingInt,
      totalPaid: totalPaidInt,
      performedBy: '',
    };

    try {
      setIsPrinting(true);
      const result = await dispatch(SubmitPatientTest(payload)).unwrap();
      toast.success('Data saved successfully!');
      if (!result) throw new Error('Submission failed - no data returned');
      setSubmissionResult(result);

      if (shouldPrint) {
        const dataForPrint = {
          tokenNumber: result.tokenNumber,
          patient: {
            MRNo: result.patient?.mrNo || patient.MRNo,
            Name: patient.Name,
            CNIC: patient.CNIC,
            ContactNo: patient.ContactNo,
            Gender: patient.Gender,
            Age: patient.Age,
            ReferredBy: patient.ReferredBy,
            Guardian: patient.Guardian,
          },
          tests: normalizedRows,
          totalAmount: totalAmountInt,
          totalDiscount: totalDiscountInt,
          totalFinalAmount: totalFinalInt,
          totalPaid: totalPaidInt,
          remaining: remainingInt,
          sampleDate: normalizedRows[0]?.sampleDate,
          reportDate: normalizedRows[0]?.reportDate,
          referredBy: patient.ReferredBy,
        };
        handlePrint(dataForPrint);
      }

      // reset form
      setPatient({
        MRNo: '',
        CNIC: '',
        Name: '',
        ContactNo: '',
        Gender: '',
        Age: '',
        ReferredBy: '',
        Guardian: '',
      });
      setTestRows([]);
      setDob(null);
      setUseDefaultContact(false);
      setSelectedTestId('');
      setPrintData(null);
      setFormKey((k) => k + 1);
    } catch (err) {
      console.error('❌ Submission error:', err);
      toast.error(`Submission failed: ${err.message}`);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleSubmitOnly = async (e) => {
    e.preventDefault();
    await submitForm(false);
    navigate('/lab/all-patients');
  };

  const handleSubmitAndPrint = async (e) => {
    e.preventDefault();
    await submitForm(true);
  };

  // keyboard nav
  const handleKeyDown = (e) => {
    const form = formRef.current;
    if (!form) return;

    // Skip if the target is inside a react-select component
    if (e.target.closest('.react-select__control') ||
      e.target.closest('.react-select__menu') ||
      e.target.closest('.react-select__input')) {
      return;
    }

    const inputs = Array.from(
      form.querySelectorAll('input, select, textarea')
    ).filter((el) =>
      el.type !== 'hidden' &&
      !el.disabled &&
      !el.closest('.react-select__control') &&
      !el.closest('.react-select__menu')
    );

    const index = inputs.indexOf(e.target);
    if (index === -1) return;

    if (['Enter', 'ArrowDown', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      if (index < inputs.length - 1) inputs[index + 1].focus();
    }
    if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      if (index > 0) inputs[index - 1].focus();
    }
  };

  return (
    <form
      onSubmit={handleSubmitOnly}
      ref={formRef}
      onKeyDown={handleKeyDown}
      className="p-6 bg-white rounded shadow-md space-y-10"
    >
      <div className="w-screen -ml-6 bg-teal-600 py-6 text-white text-3xl font-bold shadow">
        <h1 className="ml-4">Add Patient New Test</h1>
      </div>

      <FormSection
        title="Patient Information"
        bgColor="bg-primary-700 text-white"
      >
        <PatientInfoForm
          key={`pinfo-${formKey}`}
          mode={mode}
          patient={patient}
          dob={dob}
          handlePatientChange={handlePatientChange}
          handleSearch={handleSearch}
          handleDobChange={handleDobChange}
          setMode={setMode}
          useDefaultContact={useDefaultContact}
          setUseDefaultContact={setUseDefaultContact}
          defaultContactNumber={defaultContactNumber}
        />
      </FormSection>

      <FormSection title="Test Information" bgColor="bg-primary-700 text-white">
        <TestInformationForm
          key={`tinfo-${formKey}`}
          testList={testList}
          selectedTestId={selectedTestId}
          setSelectedTestId={setSelectedTestId}
          testRows={testRows}
          handleTestAdd={handleTestAdd}
          handleTestRowChange={handleTestRowChange}
          handleRemoveRow={handleRemoveRow}
          totalAmount={totalAmount}
          totalDiscount={totalDiscount}
          totalFinalAmount={totalFinalAmount}
          totalPaid={totalPaid}
          overallRemaining={overallRemaining}
          applyOverallPaid={applyOverallPaid}
          applyOverallDiscount={applyOverallDiscount}
          paidBoxValue={totalPaid}
          discountBoxValue={totalDiscount}
          mode={mode}
        />
      </FormSection>

      <ButtonGroup className="justify-end">
        <Button type="reset" variant="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isPrinting}>
          {isPrinting ? 'Submitting...' : 'Submit'}
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={isPrinting}
          onClick={handleSubmitAndPrint}
        >
          {isPrinting ? 'Processing...' : 'Submit & Print'}
        </Button>
      </ButtonGroup>

      {printData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Print Preview</h2>
              <div className="space-x-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    window.print();
                    setPrintData(null);
                  }}
                >
                  Print Now
                </Button>
                <Button variant="secondary" onClick={() => setPrintData(null)}>
                  Close
                </Button>
              </div>
            </div>
            <PrintA4 formData={printData} />
          </div>
        </div>
      )}
    </form>
  );
};

export default AddlabPatient;
