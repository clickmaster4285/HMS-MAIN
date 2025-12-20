import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { getSummaryByDate } from '../../../features/critcalResult/criticalSlice';
import {
  FiChevronDown,
  FiChevronUp,
  FiHash,
  FiClock,
  FiUser,
} from 'react-icons/fi';
import ReactDOMServer from 'react-dom/server';
import PrintCriticalSummary from './PrintCriticalSummary';
import { format } from 'date-fns';

// Stable fallback outside component
const INITIAL_SUMMARY_STATE = Object.freeze({
  summary: [],
  loading: false,
  error: null,
});

const CriticalSummary = () => {
  const { date } = useParams();
  const dispatch = useDispatch();

  // ---- selector (resilient to slight slice naming differences) ----
  const summaryState = useSelector((s) => {
    const node =
      s.criticalResult?.summaryState ??
      s.critical?.summaryState ??
      s.criticalResults?.summaryState ??
      s.criticalResult ??
      {};
    return {
      summary: node.summary,
      loading: node.loading,
      error: node.error,
    };
  });

  const { summary, loading, error } = summaryState;

  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'asc',
  });

  // ---- parse date(s) from URL param ----
  let startDate = null;
  let endDate = null;
  if (date) {
    const parts = (date || '').split('_');
    if (parts.length === 2) {
      [startDate, endDate] = parts;
    } else if (parts.length === 1 && parts[0]) {
      startDate = parts[0];
    }
  }

  useEffect(() => {
    // If no dates supplied, you can default to today or skip; current code sends whatever is parsed
    dispatch(getSummaryByDate({ startDate, endDate }));
  }, [dispatch, startDate, endDate]);

  // ---- helpers (safe formatting) ----
  const formatDateOnly = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    return isNaN(dt) ? String(d) : format(dt, 'PP');
  };

  const formatTimeOnly = (t) => {
    if (!t) return '-';
    const dt = new Date(`1970-01-01T${t}:00Z`);
    // if string is not HH:mm, try Date directly
    if (isNaN(dt)) {
      const d2 = new Date(t);
      return isNaN(d2) ? String(t) : format(d2, 'p');
    }
    return format(dt, 'p');
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // ---- take { success, count, data: [...] } → array ----
  const rawRows = useMemo(() => {
    if (Array.isArray(summary)) return summary;
    if (summary && Array.isArray(summary.data)) return summary.data;
    return [];
  }, [summary]);

  // ---- normalize backend fields to UI fields ----
  const normalizeRows = (arr) =>
    arr.map((r, i) => ({
      _id: r._id ?? r.id ?? String(i),
      mrNo: r.mrNo ?? r.patient_MRNo ?? '-',
      patientName: r.patientName ?? r.patient?.name ?? '-',
      gender: r.gender ?? '',
      age: r.age ?? '',
      date: r.date ?? r.createdAt ?? '',
      sampleCollectionTime: r.sampleCollectionTime ?? r.collectionTime ?? '',
      reportDeliveryTime: r.reportDeliveryTime ?? r.deliveredAt ?? '',
      informedTo: r.informedTo ?? '',
      labTechSignature: r.labTechSignature ?? '',
      doctorSignature: r.doctorSignature ?? '',
      tests: Array.isArray(r.tests)
        ? r.tests.map((t) => ({
            testName:
              t.testName ??
              t.name ??
              t.test?.name ??
              t.testDetails?.name ??
              '-',
            criticalValue: t.criticalValue ?? t.value ?? t.result ?? '-',
          }))
        : [],
    }));

  const rows = useMemo(() => normalizeRows(rawRows), [rawRows]);

  // ---- sorting on normalized rows ----
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = keyPath(a, sortConfig.key);
      const bv = keyPath(b, sortConfig.key);

      // if both parse to valid dates, sort as dates
      const ad = new Date(av);
      const bd = new Date(bv);
      const bothDates = !isNaN(ad) && !isNaN(bd);
      if (bothDates) {
        return sortConfig.direction === 'asc' ? ad - bd : bd - ad;
      }

      const as = String(av ?? '').toLowerCase();
      const bs = String(bv ?? '').toLowerCase();
      if (as < bs) return sortConfig.direction === 'asc' ? -1 : 1;
      if (as > bs) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortConfig]);

  const toggleRow = (id) => setExpandedRow((r) => (r === id ? null : id));

  const handlePrint = () => {
    if (!sortedRows.length) return alert('No data to print');
    const stamp = format(new Date(), 'dd-MM-yy HH:mm');

    const html = ReactDOMServer.renderToStaticMarkup(
      <PrintCriticalSummary
        rows={sortedRows}
        dateRange={{ startDate, endDate }}
      />
    );

    const w = window.open('', '_blank');
    if (!w) return alert('Please allow popups for printing');
    w.document.open();
    w.document.write(`
    <!doctype html>
    <html>
      <head><title>Critical_Summary_${stamp}</title></head>
      <body>${html}</body>
      <script>
        window.onload = function () {
          setTimeout(function(){ window.print(); window.close(); }, 400);
        };
      </script>
    </html>
  `);
    w.document.close();
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Critical Results Summary
            </h1>
            <p className="text-gray-500 mt-1">
              {startDate && formatDateOnly(startDate)}
              {endDate && ` - ${formatDateOnly(endDate)}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <span className="font-medium text-gray-700">Total Records: </span>
              <span className="font-bold text-primary-600">
                {sortedRows.length /* or summary?.count ?? sortedRows.length */}
              </span>
            </div>
            <button
              onClick={handlePrint}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              Print Summary
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 bg-gray-50">
                <tr>
                  <Th
                    onClick={() => handleSort('mrNo')}
                    active={sortConfig.key === 'mrNo'}
                    dir={sortConfig.direction}
                  >
                    <FiHash className="text-gray-400" />
                    <span>MR No</span>
                  </Th>
                  <Th
                    onClick={() => handleSort('patientName')}
                    active={sortConfig.key === 'patientName'}
                    dir={sortConfig.direction}
                  >
                    <FiUser className="text-gray-400" />
                    <span>Patient</span>
                  </Th>
                  <th className="px-6 py-4">Gender/Age</th>
                  <Th
                    onClick={() => handleSort('date')}
                    active={sortConfig.key === 'date'}
                    dir={sortConfig.direction}
                  >
                    <FiClock className="text-gray-400" />
                    <span>Date</span>
                  </Th>
                  <th className="px-6 py-4">Tests (count)</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Loading…
                    </td>
                  </tr>
                )}

                {error && !loading && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-red-600"
                    >
                      {error}
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  sortedRows.map((row) => (
                    <React.Fragment key={row._id}>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {row.mrNo}
                        </td>
                        <td className="px-6 py-4">{row.patientName}</td>
                        <td className="px-6 py-4 text-gray-600">
                          {row.gender || '-'}
                          {row.age ? `, ${row.age}` : ''}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span>{formatDateOnly(row.date)}</span>
                            <span className="text-xs text-gray-500">
                              {formatTimeOnly(row.sampleCollectionTime)}{' '}
                              {row.reportDeliveryTime
                                ? `- ${formatTimeOnly(row.reportDeliveryTime)}`
                                : ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                            {Array.isArray(row.tests) ? row.tests.length : 0}{' '}
                            {Array.isArray(row.tests) && row.tests.length !== 1
                              ? 'tests'
                              : 'test'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="p-1 text-primary-600 hover:text-primary-800"
                            onClick={() => toggleRow(row._id)}
                          >
                            {expandedRow === row._id ? (
                              <FiChevronUp />
                            ) : (
                              <FiChevronDown />
                            )}
                          </button>
                        </td>
                      </tr>

                      {expandedRow === row._id && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                                <h3 className="font-medium text-gray-800 mb-3">
                                  Contact
                                </h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">
                                      Informed To:
                                    </span>
                                    <span>{row.informedTo || '-'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">
                                      Lab Tech:
                                    </span>
                                    <span>{row.labTechSignature || '-'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">
                                      Doctor:
                                    </span>
                                    <span>{row.doctorSignature || '-'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="md:col-span-2 bg-white p-4 rounded-lg shadow-xs border border-gray-200">
                                <h3 className="font-medium text-gray-800 mb-3">
                                  Critical Tests
                                </h3>
                                <div className="space-y-2 text-sm">
                                  {Array.isArray(row.tests) &&
                                  row.tests.length ? (
                                    row.tests.map((t, i) => (
                                      <div
                                        key={i}
                                        className="flex justify-between"
                                      >
                                        <span className="font-medium">
                                          {t.testName}
                                        </span>
                                        <span className="text-gray-700">
                                          {t.criticalValue}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-gray-500">
                                      No tests
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}

                {!loading && !error && !sortedRows.length && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No records found for selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- helpers ----------
const keyPath = (obj, path) =>
  path
    .split('.')
    .reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : ''), obj);

const Th = ({ children, onClick, active, dir }) => (
  <th
    className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center gap-1">
      {children}
      {active ? <span>{dir === 'asc' ? '↑' : '↓'}</span> : null}
    </div>
  </th>
);

export default CriticalSummary;
