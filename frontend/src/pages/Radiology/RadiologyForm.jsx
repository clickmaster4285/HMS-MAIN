import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { EditForm } from './EditForm';
import {
  fetchAllRadiologyReports,
  fetchAvailableTemplates,
  createRadiologyReport,
  fetchReportByMrno,
  fetchRadiologyReportById,
  updateRadiologyReport,
  resetRadiologyStatus,
} from '../../features/Radiology/RadiologySlice';
import PatientDetails from './RadiologyFormComponents/PatientDetails';
// import FinancialDetails from './RadiologyFormComponents/FinancialDetails';
import { ProcedureTemplates } from './RadiologyFormComponents/ProcedureTemplates';
import ModeToggle from './RadiologyFormComponents/ModeToggle';
import FormActions from './RadiologyFormComponents/FormActions';
import {
  ageStringFromDob,
  parseFlexibleAgeToDob,
} from './RadiologyFormComponents/ageUtils';

const RadiologyForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { templates, isLoading, isError, error, currentReport } = useSelector(
    (s) => s.radiology
  );

  const [searchParams] = useSearchParams();
  const qpMode = searchParams.get('mode');
  const editId = searchParams.get('id');
  const isEdit = qpMode === 'edit' && !!editId;

  const [mode, setMode] = useState(isEdit ? 'edit' : 'existing');

  useEffect(() => {
    setMode(isEdit ? 'edit' : 'existing');
  }, [isEdit]);

  // Patient
  const [patient, setPatient] = useState({
    MRNo: '',
    Name: '',
    CNIC: '',
    Guardian: '',
    Gender: '',
    ContactNo: '',
    ReferredBy: '',
    Age: '',
  });
  const [dob, setDob] = useState(null);
  const [ageInput, setAgeInput] = useState('');
  const ageTimer = useRef(null);

  // Global financials (user edits these ONLY)
  const [discount, setDiscount] = useState(''); // total discount for all studies
  const [paidAmount, setPaidAmount] = useState(''); // total paid for all studies

  // Studies (each: { templateName, totalAmount, discount, totalPaid, remainingAmount, referBy })
  const [studies, setStudies] = useState([]);
  // add near other state
  const [applyRefByAll, setApplyRefByAll] = useState(true);

  // Misc
  const [useDefaultContact, setUseDefaultContact] = useState(false);
  const defaultContactNumber = '051-3311342';
  const prevContactNoRef = useRef('');
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // Helpers
  const sum = (arr, key) => arr.reduce((a, s) => a + (Number(s[key]) || 0), 0);
  const totalOfStudies = React.useMemo(
    () => sum(studies, 'totalAmount'),
    [studies]
  );

  // Water-filling split that respects caps (integers, rupees)
  const splitEvenWithCaps = (caps, total) => {
    const n = caps.length;
    let remaining = Math.max(0, Math.floor(Number(total) || 0));
    const out = Array(n).fill(0);
    let active = caps
      .map((cap, i) => ({ i, cap: Math.max(0, Math.floor(cap || 0)) }))
      .filter((x) => x.cap > 0);

    while (remaining > 0 && active.length > 0) {
      const share = Math.max(1, Math.floor(remaining / active.length));
      const nextActive = [];
      for (const a of active) {
        if (remaining <= 0) break;
        const give = Math.min(share, a.cap - out[a.i]);
        if (give > 0) {
          out[a.i] += give;
          remaining -= give;
        }
        if (out[a.i] < a.cap) nextActive.push(a);
      }
      // if no one could receive (caps exhausted), break to avoid infinite loop
      if (nextActive.length === active.length) break;
      active = nextActive;
    }

    // If tiny remainder still left (due to rounding), hand it out 1 by 1 to anyone with cap left
    let idx = 0;
    while (remaining > 0) {
      // find next with capacity
      let handed = false;
      for (let k = 0; k < n; k++) {
        const j = (idx + k) % n;
        if (out[j] < Math.max(0, Math.floor(caps[j] || 0))) {
          out[j] += 1;
          remaining -= 1;
          idx = j + 1;
          handed = true;
          if (remaining === 0) break;
        }
      }
      if (!handed) break;
    }
    return out;
  };
  useEffect(() => {
    // when this screen unmounts (or route key changes), wipe the slice
    return () => {
      dispatch(resetRadiologyStatus());
    };
  }, [dispatch, location.key]);
  useEffect(() => {
    dispatch(fetchAvailableTemplates());
    dispatch(fetchAllRadiologyReports());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && editId) {
      dispatch(fetchRadiologyReportById(editId));
    }
  }, [dispatch, isEdit, editId]);

  const prefillLock = useRef(false);

  useEffect(() => {
    if (!currentReport) return;

    const r = currentReport;

    // Derive common patient fields
    const mrno = r.patientMRNO || '';
    const name = r.patientName || r.patient_Name || r.Name || '';
    const phone = r.patient_ContactNo || r.ContactNo || r.phone || '';
    const gender = r.sex || r.patient_Gender || r.Gender || '';
    const dobIso = r.dob || r.DOB || r.dateOfBirth || r.age || null;
    const derivedDob = dobIso ? new Date(dobIso) : null;
    const ageStr = r.patient_Age || r.ageString || '';

    // Only compute refBy if we’re editing
    const refByWhenEdit =
      r?.studies?.[0]?.referBy ??
      r?.referBy ??
      r?.patient_HospitalInformation?.referredBy ??
      r?.ReferredBy ??
      '';

    // Map studies only if we’re editing
    const mappedStudies =
      Array.isArray(r.studies) && mode === 'edit'
        ? r.studies.map((s) => ({
            templateName: s.templateName,
            totalAmount: Number(s.totalAmount || 0),
            discount: Number(s.discount || 0),
            totalPaid: Number(s.totalPaid || 0),
            remainingAmount: Number(s.remainingAmount || 0),
            // per-study referBy only in edit mode
            referBy: s.referBy || refByWhenEdit || '',
            paymentStatus: s.paymentStatus || 'pending',
          }))
        : []; // empty in "existing" mode

    // Top-level financials only in edit mode
    const topDisc =
      mode === 'edit' ? Number(r.discount ?? r.aggTotalDiscount ?? 0) : null;
    const topPaid =
      mode === 'edit' ? Number(r.totalPaid ?? r.aggTotalPaid ?? 0) : null;

    prefillLock.current = true;

    setPatient((prev) => ({
      ...prev,
      MRNo: mrno || prev.MRNo || '',
      Name: name || '',
      ContactNo: phone || '',
      Gender: gender || '',
      // ReferredBy only when editing; leave blank in "existing"
      ReferredBy: mode === 'edit' ? refByWhenEdit || '' : '',
      Age: derivedDob ? ageStringFromDob(derivedDob) : ageStr || prev.Age || '',
    }));

    setDob(derivedDob);
    setAgeInput(derivedDob ? ageStringFromDob(derivedDob) : ageStr || '');

    // In "existing", this will be []
    setStudies(mappedStudies);

    // In "existing", keep these empty
    setDiscount(
      mode === 'edit' && Number.isFinite(topDisc) ? String(topDisc) : ''
    );
    setPaidAmount(
      mode === 'edit' && Number.isFinite(topPaid) ? String(topPaid) : ''
    );

    setTimeout(() => {
      prefillLock.current = false;
    }, 0);
  }, [currentReport, mode]);

  // Auto-distribute global discount & paid across studies
  React.useEffect(() => {
    if (prefillLock.current) return; // <-- do not auto-split while prefilling

    if (!studies.length) return;
    if (!studies.length) return;

    const total = totalOfStudies;

    // Cap globals for safety
    const globalDiscount = Math.min(
      Math.max(0, Math.floor(Number(discount) || 0)),
      Math.max(0, total)
    );
    const maxPaidAllowed = Math.max(0, total - globalDiscount);
    const globalPaid = Math.min(
      Math.max(0, Math.floor(Number(paidAmount) || 0)),
      maxPaidAllowed
    );

    // 1) Split discount with cap = study.totalAmount
    const amountCaps = studies.map((s) =>
      Math.max(0, Math.floor(Number(s.totalAmount) || 0))
    );
    const perStudyDiscount = splitEvenWithCaps(amountCaps, globalDiscount);

    // 2) Split paid with cap = study.totalAmount - perStudyDiscount
    const paidCaps = studies.map((s, i) => amountCaps[i] - perStudyDiscount[i]);
    const perStudyPaid = splitEvenWithCaps(paidCaps, globalPaid);

    // Build next array with remainingAmount
    const next = studies.map((s, i) => {
      const totalAmt = amountCaps[i];
      const d = perStudyDiscount[i];
      const p = perStudyPaid[i];
      const remaining = Math.max(0, totalAmt - d - p);
      return {
        ...s,
        discount: d,
        totalPaid: p,
        remainingAmount: remaining,
      };
    });

    // Only update if anything actually changed to avoid loops
    const changed = studies.some(
      (s, i) =>
        Math.floor(Number(s.discount) || 0) !== next[i].discount ||
        Math.floor(Number(s.totalPaid) || 0) !== next[i].totalPaid ||
        Math.floor(Number(s.remainingAmount) || 0) !== next[i].remainingAmount
    );
    if (changed) setStudies(next);
  }, [studies.length, totalOfStudies, discount, paidAmount]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prefill from currentReport (unchanged from your version; truncated for brevity)

  const handleSearchExisting = async () => {
    setErrors((prev) => ({ ...prev, MRNo: '' }));
    const mrn = patient.MRNo?.trim();
    if (!mrn) {
      setErrors((prev) => ({ ...prev, MRNo: 'MRN is required' }));
      return;
    }
    try {
      await dispatch(fetchReportByMrno(mrn)).unwrap();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        MRNo: String(err?.message || 'Patient not found'),
      }));
      setPatient((prev) => ({
        ...prev,
        Name: '',
        ContactNo: '',
        Gender: '',
        ReferredBy: '',
        Age: '',
      }));
      setDob(null);
      setAgeInput('');
    }
  };

  const validate = () => {
    const e = {};
    if (mode === 'existing' && !patient.MRNo?.trim())
      e.MRNo = 'MRN is required';
    if (!patient.Name?.trim()) e.Name = 'Patient name is required';
    if (!patient.ContactNo?.trim()) e.ContactNo = 'Contact is required';
    if (!dob) e.dob = 'Date of Birth is required';
    if (dob && dob > new Date()) e.dob = 'DOB cannot be in the future';
    if (!patient.Gender) e.Gender = 'Gender is required';
    if (!patient.ReferredBy?.trim()) e.ReferredBy = 'Referred By is required';

    if (!studies.length) e.templateName = 'Template is required'; // <-- fix: was setStudies.length

    const total = totalOfStudies;
    const disc = Math.floor(Number(discount) || 0);
    const paid = Math.floor(Number(paidAmount) || 0);

    if (disc < 0) e.discount = 'Value cannot be negative';
    if (paid < 0) e.paidAmount = 'Value cannot be negative';
    if (disc > total) e.discount = 'Discount cannot exceed Total';
    if (paid > total - Math.min(disc, total))
      e.paidAmount = 'Paid cannot exceed (Total - Discount)';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // helpers
  const n = (v) => Math.max(0, Math.floor(Number(v) || 0));

  const computeAggs = (studies, overallDiscount, overallPaid) => {
    const total = studies.reduce((a, s) => a + n(s.totalAmount), 0);
    const disc = Math.min(n(overallDiscount), total);
    const paid = Math.min(n(overallPaid), Math.max(0, total - disc));
    const remaining = Math.max(0, total - disc - paid);

    const status =
      remaining === 0 ? 'paid' : paid > 0 || disc > 0 ? 'partial' : 'pending';

    return { total, disc, paid, remaining, status };
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const aggs = computeAggs(studies, discount, paidAmount);

    // decide per-study referBy based on mode
    const studyRows = studies.map((s) => ({
      templateName: s.templateName,
      totalAmount: n(s.totalAmount),
      discount: n(s.discount),
      totalPaid: n(s.totalPaid),
      remainingAmount: n(s.remainingAmount),
      paymentStatus:
        n(s.remainingAmount) === 0
          ? 'paid'
          : n(s.totalPaid) > 0 || n(s.discount) > 0
          ? 'partial'
          : 'pending',
      ...(isEdit ? {} : { referBy: (patient.ReferredBy || '').trim() }), // ⬅️ add only on CREATE
    }));

    const payload = {
      patient: {
        patientMRNO: patient.MRNo?.trim() || '',
        patientName: patient.Name?.trim() || '',
        patient_ContactNo: patient.ContactNo?.trim() || '',
        age: dob ? new Date(dob).toISOString() : null,
        sex: patient.Gender || '',
      },
      studies: studyRows,
      totalAmount: aggs.total,
      discount: aggs.disc,
      totalPaid: aggs.paid,
      remainingAmount: aggs.remaining,
      paymentStatus: aggs.status,
      aggTotalAmount: aggs.total,
      aggTotalDiscount: aggs.disc,
      aggTotalPaid: aggs.paid,
      aggRemainingAmount: aggs.remaining,
      aggPaymentStatus: aggs.status,

      // still send these for consistency
      referBy: (patient.ReferredBy || '').trim(),
      cascadeReferBy: !!applyRefByAll,
    };

    try {
      if (isEdit && editId) {
        await dispatch(
          updateRadiologyReport({ id: editId, reportData: payload })
        ).unwrap();
      } else {
        await dispatch(createRadiologyReport(payload)).unwrap();
      }
      await dispatch(fetchAllRadiologyReports());
      reset();
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit: err?.message || 'Failed to save. Please try again.',
      }));
    }
  };

  const reset = () => {
    setPatient({
      MRNo: '',
      Name: '',
      CNIC: '',
      Guardian: '',
      Gender: '',
      ContactNo: '',
      ReferredBy: '',
      Age: '',
    });
    setDob(null);
    setAgeInput('');
    setDiscount('');
    setPaidAmount('');
    setStudies([]);
    setUseDefaultContact(false);
    setErrors({});
    navigate('/lab/RadiologyPennal');
  };

  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      moveFocus(e.shiftKey ? -1 : 1);
      return;
    }
    if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) {
      e.preventDefault();
      moveFocus(1);
      return;
    }
    if (e.altKey && (e.key === 'ArrowUp' || e.key === 'ArrowLeft')) {
      e.preventDefault();
      moveFocus(-1);
      return;
    }
  };

  const getNavElements = () => {
    if (!formRef.current) return [];
    const nodes = Array.from(
      formRef.current.querySelectorAll(
        'input[data-nav], select[data-nav], textarea[data-nav], [data-nav] input, [data-nav] select, [data-nav] textarea'
      )
    ).filter((el, idx, arr) => {
      const style = window.getComputedStyle(el);
      const visible = style.display !== 'none' && style.visibility !== 'hidden';
      const enabled = !el.disabled && !el.getAttribute('aria-hidden');
      return visible && enabled && arr.indexOf(el) === idx;
    });
    return nodes;
  };

  const moveFocus = (delta) => {
    const els = getNavElements();
    if (!els.length) return;
    const activeIndex = els.findIndex(
      (el) =>
        el === document.activeElement || el.contains(document.activeElement)
    );
    const nextIndex =
      activeIndex === -1
        ? 0
        : Math.max(0, Math.min(els.length - 1, activeIndex + delta));
    const target = els[nextIndex];
    if (target) {
      target.focus();
      try {
        if (target.select) target.select();
      } catch {}
    }
  };

  return (
    <div className="">
      <div
        className="max-w-full mx-auto py-6 px-4 bg-white shadow-md"
        ref={formRef}
        onKeyDown={handleFormKeyDown}
      >
        <h1 className="text-3xl bg-primary-600 p-4 text-white font-semibold mb-4">
          Add Radiology New Record
        </h1>

        {isError && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {error || 'Something went wrong.'}
          </div>
        )}

        <ModeToggle mode={mode} setMode={setMode} disabled={isEdit} />
        {isEdit && (
          <div className="mb-3 rounded border border-amber-200 bg-amber-50 p-2 text-amber-800 text-sm">
            Editing existing report (ID: {editId})
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PatientDetails
            mode={mode}
            patient={patient}
            setPatient={setPatient}
            dob={dob}
            setDob={setDob}
            ageInput={ageInput}
            setAgeInput={setAgeInput}
            useDefaultContact={useDefaultContact}
            setUseDefaultContact={setUseDefaultContact}
            defaultContactNumber={defaultContactNumber}
            prevContactNoRef={prevContactNoRef}
            errors={errors}
            setErrors={setErrors}
            handleSearchExisting={handleSearchExisting}
            ageTimer={ageTimer}
          />

          <ProcedureTemplates
            templates={templates}
            studies={studies}
            setStudies={setStudies}
            errors={errors}
            setErrors={setErrors}
            mode={mode}
          />
          {/* Simple Financials: user sets totals ONCE, auto-split handles the rest */}
        </div>
        <EditForm
          mode={mode}
          totalOfStudies={totalOfStudies}
          discount={discount}
          setDiscount={setDiscount}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          errors={errors}
          setErrors={setErrors}
        />
        {errors.submit && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {errors.submit}
          </div>
        )}

        <FormActions
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          navigate={navigate}
          submitLabel={isEdit ? 'Update Report' : 'Create Report'}
        />
      </div>
    </div>
  );
};

export default RadiologyForm;
