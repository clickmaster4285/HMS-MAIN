import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPatientTestById,
  fetchAllTests,
  updatepatientTest,
} from '../../../features/patientTest/patientTestSlice';
import { Button, ButtonGroup } from '../../../components/common/Buttons';
import { FormSection } from '../../../components/common/FormSection';
import PatientInfoForm from './PatientIno';
import TestInformationForm from './TestInfo';

// Helpers
// put at top of EditPatientTest.jsx
const getId = (v) => {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (v.$oid) return v.$oid;
  if (v._id && typeof v._id === 'string') return v._id;
  if (v._id && typeof v._id === 'object' && v._id.$oid) return v._id.$oid;
  if (v.$id) return v.$id;
  return String(v);
};

const ymd = (d) => {
  if (!d) return new Date().toISOString().slice(0, 10);
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? new Date().toISOString().slice(0, 10)
    : dt.toISOString().slice(0, 10);
};

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

const EditPatientTest = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const testList = useSelector((state) => state.patientTest.tests);
  const patientTestById = useSelector(
    (state) => state.patientTest.patientTestById
  );

  const [patient, setPatient] = useState({
    MRNo: '',
    CNIC: '',
    Name: '',
    ContactNo: '',
    Gender: '',
    Age: '',
    DOB: '',
    ReferredBy: '',
    Guardian: '',
    MaritalStatus: '',
  });

  const [selectedTestId, setSelectedTestId] = useState('');
  const [testRows, setTestRows] = useState([]);

  const [meta, setMeta] = useState({
    isExternalPatient: false,
    tokenNumber: '',
    paymentStatus: 'unpaid',
  });

  const [billing, setBilling] = useState({
    totalAmount: 0,
    discountAmount: 0,
    advanceAmount: 0,
    remainingAmount: 0,
    cancelledAmount: 0,
    refundableAmount: 0,
    paidAfterReport: 0,
  });

  const [dob, setDob] = useState(null);
  const [additionalPayment, setAdditionalPayment] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);

  useEffect(() => {
    dispatch(fetchPatientTestById(id));
    dispatch(fetchAllTests());
  }, [dispatch, id]);

useEffect(() => {
  if (!patientTestById) return;

  const rec = patientTestById.patientTest || patientTestById;
  const detail = rec.patient_Detail || {};

  setPatient({
    MRNo: detail.patient_MRNo || '',
    CNIC: detail.patient_CNIC || '',
    Name: detail.patient_Name || '',
    ContactNo: detail.patient_ContactNo || '',
    Gender: detail.patient_Gender || '',
    Age: detail.patient_Age || '',
    DOB: detail.patient_DOB || '',
    ReferredBy: detail.referredBy || '',
    Guardian: detail.patient_Guardian || '',
    MaritalStatus: detail.maritalStatus || '',
  });

  // Set the dob state from patient_DOB - IMPORTANT!
  if (detail.patient_DOB) {
    const dobDate = new Date(detail.patient_DOB);
    if (!isNaN(dobDate.getTime())) {
      setDob(dobDate);
    }
  }

  // Rest of your existing code remains the same...
  // Build rows from record
  const rows = (rec.selectedTests || []).map((t, idx) => {
    const td = t.testDetails || {};
    const price = Number(td.testPrice ?? 0);
    const disc = Number(td.discountAmount ?? 0);
    const paid = Number(td.advanceAmount ?? 0);
    const final = Math.max(0, price - disc);
    const remaining = Math.max(0, final - paid);

    return {
      srNo: idx + 1,
      testId: getId(t.test),
      testName: td.testName || '',
      testCode: td.testCode || '',
      sampleDate: ymd(td.testDate || t.testDate),
      reportDate: '',
      amount: price,
      discount: disc,
      finalAmount: final,
      paid: paid,
      remaining: remaining,
      sampleStatus: td.sampleStatus || t.sampleStatus || 'pending',
      reportStatus: td.reportStatus || t.reportStatus || 'not_started',
      testStatus: t.testStatus || 'registered',
      statusHistory: t.statusHistory || [],
      notes: t.notes || '',
    };
  });

  setTestRows(rows);

  // Recalculate totals from rows
  const sumAmount = rows.reduce((s, r) => s + (r.amount || 0), 0);
  const sumDiscount = rows.reduce((s, r) => s + (r.discount || 0), 0);
  const sumFinal = sumAmount - sumDiscount;
  const sumPaid = rows.reduce((s, r) => s + (r.paid || 0), 0);
  const sumRemaining = Math.max(0, sumFinal - sumPaid);

  let paymentStatus = 'unpaid';
  if (sumRemaining === 0 && sumPaid > 0) paymentStatus = 'paid';
  else if (sumPaid > 0) paymentStatus = 'partial';

  setMeta({
    isExternalPatient: !!rec.isExternalPatient,
    tokenNumber: rec.tokenNumber ?? '',
    paymentStatus,
  });

  setBilling({
    totalAmount: sumAmount,
    discountAmount: sumDiscount,
    advanceAmount: sumPaid,
    remainingAmount: sumRemaining,
    cancelledAmount: rec.cancelledAmount ?? 0,
    refundableAmount: rec.refundableAmount ?? 0,
    paidAfterReport: rec.paidAfterReport ?? 0,
  });

  // Seed history
  const initialPayments = [];
  if (sumPaid > 0) {
    initialPayments.push({
      date: new Date().toISOString(),
      amount: sumPaid,
      type: 'initial',
      description: 'Initial payment',
    });
  }
  setPaymentHistory(initialPayments);
  setTotalPayments(sumPaid);
  setAdditionalPayment(0);
}, [patientTestById]);

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => navigate(-1);

  const handleTestAdd = () => {
    if (!selectedTestId) return;
    const selected = testList.find((t) => t._id === selectedTestId);
    if (!selected) return;

    const price = Number(selected.testPrice || 0);
    const disc = Number(selected.discountAmount || 0);
    const final = Math.max(0, price - disc);

    setTestRows((prev) => [
      ...prev,
      {
        srNo: prev.length + 1,
        testId: selected._id,
        testName: selected.testName || '',
        testCode: selected.testCode || '',
        sampleDate: ymd(new Date()),
        reportDate: '',
        amount: price,
        discount: disc,
        finalAmount: final,
        paid: 0,
        remaining: final,
        sampleStatus: 'pending',
        reportStatus: 'not_started',
        testStatus: 'registered',
        statusHistory: [],
        notes: '',
      },
    ]);

    setSelectedTestId('');
  };

  const handleTestRowChange = (i, field, value) => {
    const rows = [...testRows];

    if (['amount', 'discount', 'paid'].includes(field)) {
      const num = Math.max(0, Number(value));
      rows[i][field] = num;

      const price = Number(rows[i].amount || 0);
      const disc = Number(rows[i].discount || 0);
      const paid = Number(rows[i].paid || 0);
      const final = Math.max(0, price - disc);
      rows[i].finalAmount = final;
      rows[i].remaining = Math.max(0, final - paid);
    } else {
      rows[i][field] = value;
    }

    setTestRows(rows);

    const totalAmount = rows.reduce((s, r) => s + (r.amount || 0), 0);
    const totalDiscount = rows.reduce((s, r) => s + (r.discount || 0), 0);
    const totalFinal = totalAmount - totalDiscount;
    const totalPaid = rows.reduce((s, r) => s + (r.paid || 0), 0);
    const remaining = Math.max(0, totalFinal - totalPaid);

    setBilling((prev) => ({
      ...prev,
      totalAmount,
      discountAmount: totalDiscount,
      advanceAmount: totalPaid,
      remainingAmount: remaining,
    }));

    let paymentStatus = 'unpaid';
    if (remaining === 0 && totalPaid > 0) paymentStatus = 'paid';
    else if (totalPaid > 0) paymentStatus = 'partial';
    setMeta((prev) => ({ ...prev, paymentStatus }));
  };

  const handleRemoveRow = (i) => {
    const updatedRows = testRows.filter((_, idx) => idx !== i);
    const reNumbered = updatedRows.map((row, idx) => ({
      ...row,
      srNo: idx + 1,
    }));
    setTestRows(reNumbered);

    const totalAmount = reNumbered.reduce((s, r) => s + (r.amount || 0), 0);
    const totalDiscount = reNumbered.reduce((s, r) => s + (r.discount || 0), 0);
    const totalFinal = totalAmount - totalDiscount;
    const totalPaid = reNumbered.reduce((s, r) => s + (r.paid || 0), 0);
    const remaining = Math.max(0, totalFinal - totalPaid);

    setBilling((prev) => ({
      ...prev,
      totalAmount,
      discountAmount: totalDiscount,
      advanceAmount: totalPaid,
      remainingAmount: remaining,
    }));

    let paymentStatus = 'unpaid';
    if (remaining === 0 && totalPaid > 0) paymentStatus = 'paid';
    else if (totalPaid > 0) paymentStatus = 'partial';
    setMeta((prev) => ({ ...prev, paymentStatus }));
  };

  const applyOverallDiscount = (overallDiscount) => {
    if (!testRows.length) return;

    // Keep the original rows and totals to preserve totalPaid
    const prevRows = testRows.map((r) => ({ ...r }));
    const prevTotalPaid = prevRows.reduce((s, r) => s + asNum(r.paid), 0);

    // Work on a fresh clone
    const rows = prevRows.map((r) => ({ ...r }));

    // Capacity for discount on each row = its amount
    const caps = rows.map((r) => Math.max(0, asNum(r.amount)));
    const totalCapacity = caps.reduce((s, c) => s + c, 0);

    // Clamp target to what we can actually discount
    const target = Math.max(0, Math.min(asNum(overallDiscount), totalCapacity));

    // ---- Allocate the target discount (proportional, with full redistribution) ----
    let alloc = rows.map((r, i) =>
      Math.floor(target * (caps[i] / (totalCapacity || 1)))
    );
    let allocated = alloc.reduce((s, a) => s + a, 0);
    let leftover = target - allocated;

    // Spread rounding leftovers to largest capacity rows
    const orderByCap = rows.map((_, i) => i).sort((a, b) => caps[b] - caps[a]);
    for (const i of orderByCap) {
      if (leftover <= 0) break;
      if (alloc[i] < caps[i]) {
        alloc[i] += 1;
        leftover -= 1;
      }
    }

    // Cap per row and collect overflow
    let overflow = 0;
    for (let i = 0; i < alloc.length; i++) {
      if (alloc[i] > caps[i]) {
        overflow += alloc[i] - caps[i];
        alloc[i] = caps[i];
      }
    }

    // Redistribute any overflow to rows with remaining room
    if (overflow > 0) {
      const byRemaining = rows
        .map((_, i) => i)
        .sort((a, b) => caps[b] - alloc[b] - (caps[a] - alloc[a]));
      for (const i of byRemaining) {
        if (overflow <= 0) break;
        const room = caps[i] - alloc[i];
        if (room <= 0) continue;
        const give = Math.min(room, overflow);
        alloc[i] += give;
        overflow -= give;
      }
    }

    // Apply discounts and compute new finals
    for (let i = 0; i < rows.length; i++) {
      const amount = asNum(rows[i].amount);
      const rowDiscount = Math.max(0, Math.min(alloc[i], amount));
      const final = Math.max(0, amount - rowDiscount);
      rows[i].discount = rowDiscount;
      rows[i].finalAmount = final;
    }

    // ---- Preserve total paid: redistribute previous total paid across new finals ----
    const maxPayable = rows.reduce((s, r) => s + asNum(r.finalAmount), 0);
    const targetPaid = Math.min(prevTotalPaid, maxPayable);

    // Start from zero paid, then fill up to each row's final
    for (const r of rows) {
      r.paid = 0;
      r.remaining = r.finalAmount;
    }

    // Greedy: pay rows with most remaining final first
    let toPay = targetPaid;
    const byCapacity = rows
      .map((_, i) => i)
      .sort((a, b) => rows[b].finalAmount - rows[a].finalAmount);

    for (const i of byCapacity) {
      if (toPay <= 0) break;
      const cap = Math.max(0, asNum(rows[i].finalAmount) - asNum(rows[i].paid));
      if (cap <= 0) continue;
      const give = Math.min(cap, toPay);
      rows[i].paid += give;
      rows[i].remaining = Math.max(0, rows[i].finalAmount - rows[i].paid);
      toPay -= give;
    }

    // Any excess beyond new finals becomes refundable
    const refundableExtra = Math.max(0, prevTotalPaid - targetPaid);

    // Recompute totals
    const totalAmount = rows.reduce((s, r) => s + asNum(r.amount), 0);
    const totalDiscount = rows.reduce((s, r) => s + asNum(r.discount), 0);
    const totalPaid = rows.reduce((s, r) => s + asNum(r.paid), 0);
    const remaining = Math.max(0, totalAmount - totalDiscount - totalPaid);

    setTestRows(rows);
    setBilling((prev) => ({
      ...prev,
      totalAmount,
      discountAmount: totalDiscount,
      advanceAmount: totalPaid, // ✅ stays the same unless overpaid overall
      remainingAmount: remaining,
      refundableAmount: asNum(prev.refundableAmount) + refundableExtra, // ✅ extra goes here
    }));

    setMeta((prev) => ({
      ...prev,
      paymentStatus:
        remaining === 0 && totalPaid > 0
          ? 'paid'
          : totalPaid > 0
          ? 'partial'
          : 'unpaid',
    }));
  };

  // Put this helper inside the component
  const asNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  const applyAdditionalDiscount = () => {
    const add = Math.max(0, Number(additionalDiscount) || 0);

    // current totals from rows (source of truth)
    const totalAmount = testRows.reduce((s, r) => s + asNum(r.amount), 0);
    const currentDiscount = testRows.reduce((s, r) => s + asNum(r.discount), 0);

    // you can never discount more than totalAmount
    const maxExtra = Math.max(0, totalAmount - currentDiscount);

    if (add <= 0 || add > maxExtra) {
      toast.error('Invalid additional discount amount');
      return;
    }

    // target overall discount = current + add
    const targetOverallDiscount = currentDiscount + add;

    // use your existing distributor to apply proportionally and clamp per-row
    applyOverallDiscount(targetOverallDiscount);

    // reset field
    setAdditionalDiscount(0);
  };
  // --- REPLACE your current applyOverallPaid with this ---
  const applyOverallPaid = (overallPaid) => {
    // Clone rows so we can mutate safely
    const rows = [...testRows];

    // Totals
    const totalAmount = rows.reduce((s, r) => s + asNum(r.amount), 0);
    const totalDiscount = rows.reduce((s, r) => s + asNum(r.discount), 0);
    const maxFinal = Math.max(0, totalAmount - totalDiscount);

    // Clamp the target overall paid
    const target = Math.min(Math.max(0, asNum(overallPaid)), maxFinal);

    // Current sum paid from rows
    const currentTotalPaid = rows.reduce((s, r) => s + asNum(r.paid), 0);
    let delta = target - currentTotalPaid;

    // If no positive increase, just recompute billing and exit
    if (delta <= 0) {
      const newRemaining = Math.max(0, maxFinal - currentTotalPaid);
      setBilling((prev) => ({
        ...prev,
        totalAmount,
        discountAmount: totalDiscount,
        advanceAmount: currentTotalPaid,
        remainingAmount: newRemaining,
      }));
      setMeta((prev) => ({
        ...prev,
        paymentStatus:
          newRemaining === 0 && currentTotalPaid > 0
            ? 'paid'
            : currentTotalPaid > 0
            ? 'partial'
            : 'unpaid',
      }));
      return;
    }

    // Greedy distribute the delta to rows with the largest remaining capacity
    const idxs = rows
      .map((_, i) => i)
      .sort((a, b) => {
        const capA =
          Math.max(0, asNum(rows[a].amount) - asNum(rows[a].discount)) -
          asNum(rows[a].paid);
        const capB =
          Math.max(0, asNum(rows[b].amount) - asNum(rows[b].discount)) -
          asNum(rows[b].paid);
        return capB - capA; // descending by remaining cap
      });

    for (const i of idxs) {
      if (delta <= 0) break;
      const final = Math.max(
        0,
        asNum(rows[i].amount) - asNum(rows[i].discount)
      );
      const cap = Math.max(0, final - asNum(rows[i].paid));
      if (cap <= 0) continue;

      const give = Math.min(cap, delta);
      rows[i].paid = asNum(rows[i].paid) + give;
      rows[i].finalAmount = final;
      rows[i].remaining = Math.max(0, final - rows[i].paid);
      delta -= give;
    }

    // Update rows
    setTestRows(rows);

    // Recompute totals
    const newTotalPaid = rows.reduce((s, r) => s + asNum(r.paid), 0);
    const newRemaining = Math.max(0, maxFinal - newTotalPaid);

    // ✅ Record only the delta in history (not the overall total)
    const added = newTotalPaid - currentTotalPaid;
    if (added > 0) {
      setPaymentHistory((prev) => [
        ...prev,
        {
          date: new Date().toISOString(),
          amount: added,
          type: 'additional',
          description: 'Additional payment',
        },
      ]);
      setTotalPayments((prev) => prev + added);
    }

    // Update billing & payment status
    setBilling((prev) => ({
      ...prev,
      totalAmount,
      discountAmount: totalDiscount,
      advanceAmount: newTotalPaid,
      remainingAmount: newRemaining,
    }));

    setMeta((prev) => ({
      ...prev,
      paymentStatus:
        newRemaining === 0 && newTotalPaid > 0
          ? 'paid'
          : newTotalPaid > 0
          ? 'partial'
          : 'unpaid',
    }));
  };

  const applyAdditionalPayment = () => {
    const add = Math.max(0, Number(additionalPayment) || 0);

    // Compute current totals from rows (source of truth)
    const amount = testRows.reduce((s, r) => s + asNum(r.amount), 0);
    const discount = testRows.reduce((s, r) => s + asNum(r.discount), 0);
    const maxFinal = Math.max(0, amount - discount);
    const currentPaid = testRows.reduce((s, r) => s + asNum(r.paid), 0);
    const canPayMore = Math.max(0, maxFinal - currentPaid);

    if (add <= 0) {
      toast.error('Enter a payment greater than 0');
      return;
    }
    if (add > canPayMore) {
      toast.error(
        `Payment cannot exceed remaining balance (${formatCurrency(
          canPayMore
        )})`
      );
      return;
    }

    applyOverallPaid(currentPaid + add);
    setAdditionalPayment(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patient.Name || !patient.Gender || !patient.ContactNo) {
      toast.error('Please fill all required patient fields');
      return;
    }

    if (testRows.length === 0) {
      toast.error('Please add at least one test');
      return;
    }

    const totalAmount = testRows.reduce((s, r) => s + (r.amount || 0), 0);
    const totalDiscount = testRows.reduce((s, r) => s + (r.discount || 0), 0);
    const totalFinal = totalAmount - totalDiscount;
    const totalPaid = testRows.reduce((s, r) => s + (r.paid || 0), 0);
    const remaining = Math.max(0, totalFinal - totalPaid);

    const payload = {
      patientTestId: id,
      patient_Detail: {
        patient_MRNo: patient.MRNo,
        patient_CNIC: patient.CNIC,
        patient_Name: patient.Name,
        patient_Guardian: patient.Guardian,
        patient_ContactNo: patient.ContactNo,
        patient_Gender: patient.Gender,
        patient_Age: patient.Age,
        patient_DOB: dob,
        referredBy: patient.ReferredBy,
        maritalStatus: patient.MaritalStatus,
      },
      isExternalPatient: meta.isExternalPatient,
      selectedTests: testRows.map((row) => ({
        test: row.testId,
        testDetails: {
          testName: row.testName,
          testCode: row.testCode,
          testPrice: row.amount,
          discountAmount: row.discount,
          advanceAmount: row.paid,
          remainingAmount: row.remaining,
          testDate: row.sampleDate,
          sampleStatus: row.sampleStatus,
          reportStatus: row.reportStatus,
        },
        testStatus: row.testStatus,
        statusHistory: row.statusHistory,
        notes: row.notes,
      })),
      financialSummary: {
        totalAmount,
        totalDiscount,
        totalPaid,
        totalRemaining: remaining,
        cancelledAmount: billing.cancelledAmount,
        refundableAmount: billing.refundableAmount,
        paidAfterReport: billing.paidAfterReport,
        paymentStatus: meta.paymentStatus,
      },
      tokenNumber: meta.tokenNumber,
    };

    try {
      await dispatch(updatepatientTest(payload)).unwrap();
      toast.success('Patient test updated successfully');
      navigate(-1);
    } catch (err) {
      console.error('❌ Update error:', err);
      toast.error(`Update failed: ${err.message}`);
    }
  };
  const totalAmount = testRows.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const currentDiscount = testRows.reduce(
    (s, r) => s + (Number(r.discount) || 0),
    0
  );
  const discountCapacity = Math.max(0, totalAmount - currentDiscount);
  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded shadow-md space-y-10"
    >
      <div className="w-screen -ml-6 bg-teal-600 py-6 text-white text-3xl font-bold shadow">
        <h1 className="ml-4">Edit Patient Test</h1>
      </div>

      <FormSection
        title="Patient Information"
        bgColor="bg-primary-700 text-white"
      >
        <PatientInfoForm
          mode="edit"
          patient={patient}
          dob={dob}
          handlePatientChange={handlePatientChange}
          handleSearch={() => {}}
          handleDobChange={setDob}
          setMode={() => {}}
          useDefaultContact={false}
          setUseDefaultContact={() => {}}
          defaultContactNumber=""
        />
      </FormSection>

      <FormSection title="Test Information" bgColor="bg-primary-700 text-white">
        <TestInformationForm
          testList={testList}
          selectedTestId={selectedTestId}
          setSelectedTestId={setSelectedTestId}
          testRows={testRows}
          handleTestAdd={handleTestAdd}
          handleTestRowChange={handleTestRowChange}
          handleRemoveRow={handleRemoveRow}
          totalAmount={billing.totalAmount}
          totalDiscount={billing.discountAmount}
          totalFinalAmount={billing.totalAmount - billing.discountAmount}
          totalPaid={billing.advanceAmount}
          overallRemaining={billing.remainingAmount}
          applyOverallDiscount={applyOverallDiscount}
          applyOverallPaid={applyOverallPaid}
          mode="edit"
          paidBoxValue={billing.advanceAmount}
          discountBoxValue={billing.discountAmount}
        />
      </FormSection>

      <FormSection
        title="Billing Information"
        bgColor="bg-primary-700 text-white"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="max-w-xs">
              <label className="block text-sm font-medium text-gray-700">
                Remaining Balance
              </label>
              <input
                type="number"
                readOnly
                value={Number(billing.remainingAmount || 0).toFixed(2)}
                className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-700"
              />
              <p className="mt-1 text-xs text-gray-500">
                This updates automatically as you type in “Set Total Paid”.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {billing.remainingAmount > 0 && (
                <div className="mt-4">
                  <label
                    htmlFor="additionalPayment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Additional Payment
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="number"
                      id="additionalPayment"
                      name="additionalPayment"
                      value={additionalPayment}
                      onChange={(e) => {
                        const v = Math.max(0, Number(e.target.value));
                        setAdditionalPayment(v);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (
                            additionalPayment > 0 &&
                            additionalPayment <= billing.remainingAmount
                          ) {
                            applyAdditionalPayment();
                          }
                        }
                      }}
                      min="0"
                      max={billing.remainingAmount}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter amount"
                    />

                    <Button
                      type="button"
                      variant="primary"
                      onClick={applyAdditionalPayment}
                      disabled={
                        additionalPayment <= 0 ||
                        additionalPayment > billing.remainingAmount
                      }
                      className="rounded-l-none"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <label
                  htmlFor="additionalDiscount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Discount
                </label>

                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    id="additionalDiscount"
                    name="additionalDiscount"
                    value={additionalDiscount}
                    onChange={(e) => {
                      const v = Math.max(0, Number(e.target.value));
                      setAdditionalDiscount(v);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (
                          additionalDiscount > 0 &&
                          additionalDiscount <= discountCapacity
                        ) {
                          applyAdditionalDiscount();
                        }
                      }
                    }}
                    min="0"
                    max={discountCapacity}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Enter discount"
                  />

                  <Button
                    type="button"
                    variant="primary"
                    onClick={applyAdditionalDiscount}
                    disabled={
                      additionalDiscount <= 0 ||
                      additionalDiscount > discountCapacity
                    }
                    className="rounded-l-none"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {paymentHistory.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Payment History</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-md">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                          Description
                        </th>
                        <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paymentHistory.map((payment, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {payment.description}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                            <span className="text-green-600 font-medium">
                              +{formatCurrency(payment.amount)}
                            </span>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-medium">
                        <td
                          colSpan="2"
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right"
                        >
                          Discount:
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                          {formatCurrency(billing.discountAmount)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50 font-medium">
                        <td
                          colSpan="2"
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right"
                        >
                          Total Amount:
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                          {formatCurrency(billing.totalAmount)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50 font-medium">
                        <td
                          colSpan="2"
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right"
                        >
                          Total Payments:
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                          {formatCurrency(totalPayments)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50 font-medium">
                        <td
                          colSpan="2"
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right"
                        >
                          Remaining Payments:
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-right">
                          {formatCurrency(billing.remainingAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </FormSection>

      <ButtonGroup className="justify-end">
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Update
        </Button>
      </ButtonGroup>
    </form>
  );
};

export default EditPatientTest;
