// src/pages/radiology/RadiologyFormComponents/ProcedureTemplates.jsx
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { softDeleteStudy } from '../../../features/Radiology/RadiologySlice';

// Extract price from names like: "ultrasound-anomaly (RS. 1600).html"
const extractPrice = (tpl = '') => {
  const m = String(tpl).match(/\(RS\.?\s*([\d,]+)\)/i);
  if (m?.[1]) return Number(m[1].replace(/,/g, '')) || 0;
  const n = String(tpl).match(/(\d[\d,]*)/);
  if (n?.[1]) return Number(n[1].replace(/,/g, '')) || 0;
  return 0;
};

export const ProcedureTemplates = ({
  templates,
  studies,
  setStudies,
  errors,
  setErrors,
  mode,
}) => {
  const handlePick = (value) => {
    const tpl = String(value || '').trim();
    if (!tpl) return;

    if (studies.some((s) => s.templateName === tpl)) {
      toast.error('This ultrasound is already added!');
      setErrors?.((prev) => ({ ...prev, templateName: '' }));
      return;
    }

    const price = extractPrice(tpl);
    const newStudy = {
      templateName: tpl,
      totalAmount: price,
      discount: 0, // will be auto-filled by parent
      totalPaid: 0, // will be auto-filled by parent
      remainingAmount: price, // will be auto-filled by parent
      referBy: '', // optional per-study, or you can ignore and use patient.ReferredBy at submit time
    };

    setStudies((prev) => [...prev, newStudy]);
    setErrors?.((prev) => ({ ...prev, templateName: '' }));
  };

  const removeStudy = (idx) => {
    setStudies((prev) => prev.filter((_, i) => i !== idx));
  };

  // Replace your updateStudy with this:
  const updateStudy = (idx, field, rawVal) => {
    setStudies((prev) =>
      prev.map((s, i) => {
        if (i !== idx) return s;
        const next = { ...s };

        if (field === 'referBy') {
          next.referBy = rawVal;
          return next;
        }

        if (field === 'totalAmount') {
          const total = Math.max(0, Math.floor(Number(rawVal) || 0));
          next.totalAmount = total;

          const disc = Math.min(
            Math.max(0, Math.floor(Number(next.discount) || 0)),
            total
          );
          const paidCap = Math.max(0, total - disc);
          const paid = Math.min(
            Math.max(0, Math.floor(Number(next.totalPaid) || 0)),
            paidCap
          );

          next.discount = disc;
          next.totalPaid = paid;
          next.remainingAmount = Math.max(0, total - disc - paid);
          return next;
        }

        return next;
      })
    );
  };

  const pretty = (t) =>
    t
      .replace(/\.html$/i, '')
      .replace(/-/g, ' ')
      .replace(/&/g, ' & ');

  const sum = (arr, key) => arr.reduce((a, s) => a + (Number(s[key]) || 0), 0);
  const formatCurrency = (n) => (Number(n) || 0).toLocaleString('en-PK');

  return (
    <div className="md:col-span-3">
      <label className="block text-xl font-medium text-gray-700 my-3 border-l-4 border-primary-600 pl-2">
        Ultrasound Tests <span className="text-red-500">*</span>
      </label>
      <select
        value=""
        onChange={(e) => handlePick(e.target.value)}
        disabled={mode === 'edit'}
        className="border h-[42px] p-2 rounded w-full border-gray-200 shadow-sm mb-3"
        data-nav
      >
        <option value="">Select template to add…</option>
        {(templates || []).map((t, idx) => (
          <option key={idx} value={t}>
            {pretty(t)}
          </option>
        ))}
      </select>
      {studies.length > 0 && (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm mb-3">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-sm font-medium text-gray-800 "
                >
                  Test Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-right text-sm font-medium text-gray-800r"
                >
                  Amount (Rs)
                </th>
                {mode !== 'edit' && (
                  <th
                    scope="col"
                    className="px-4 py-2 text-center text-sm font-medium text-gray-800r"
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studies.map((s, idx) => (
                <tr key={idx}>
                  <td
                    className="px-4 py-2 whitespace-nowrap text-sm  text-gray-900"
                    title={pretty(s.templateName)}
                  >
                    <span className="truncate max-w-[200px] block">
                      {pretty(s.templateName)}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="Price"
                      value={s.totalAmount}
                      onChange={(e) =>
                        updateStudy(idx, 'totalAmount', e.target.value)
                      }
                      onBlur={(e) =>
                        updateStudy(
                          idx,
                          'totalAmount',
                          Math.floor(Number(e.target.value) || 0)
                        )
                      }
                      className="border border-gray-300 shadow-sm rounded px-2 py-1 text-xs w-24 text-right"
                      title="Total Amount (Rs)"
                      data-nav
                    />
                  </td>
                  {mode !== 'edit' && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 text-sm "
                        onClick={() => removeStudy(idx)}
                        title="Remove"
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          
          </table>
        </div>
      )}

      {studies.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-sm mb-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: headline + key totals */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Financial Summary</h3>

              <div className="flex justify-between">
                <span>Total Tests:</span>
                <span>{studies.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span>Rs. {formatCurrency(sum(studies, 'totalAmount'))}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Final Amount:</span>
                <span className="text-green-700">
                  Rs.{' '}
                  {formatCurrency(
                    sum(studies, 'totalAmount') - sum(studies, 'discount')
                  )}
                </span>
              </div>
            </div>

            {/* Right: discount/paid/remaining (read-only here) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Total Paid:</span>
                <span>Rs. {formatCurrency(sum(studies, 'totalPaid'))}</span>
              </div>

              <div className="flex items-center justify-between">
                <span>Total Discount:</span>
                <span>Rs. {formatCurrency(sum(studies, 'discount'))}</span>
              </div>

              <div className="flex justify-between border-t pt-2">
                <span>Remaining Balance:</span>
                <span
                  className={
                    sum(studies, 'remainingAmount') > 0
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  Rs. {formatCurrency(sum(studies, 'remainingAmount'))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {errors?.templateName && (
        <p className="text-red-600 text-sm mt-1">{errors.templateName}</p>
      )}
    </div>
  );
};
