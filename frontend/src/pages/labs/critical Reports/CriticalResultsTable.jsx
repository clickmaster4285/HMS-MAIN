import React, { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';

const CriticalResultsTable = ({
  criticalResults,
  error,
  onEdit,
  onDelete,
  onPrint,
}) => {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [preset, setPreset] = useState('ALL');

  // 📅 helpers to compute ranges for presets
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const endOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  const getPresetRange = (key) => {
    const now = new Date();
    switch (key) {
      case 'TODAY':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'YESTERDAY': {
        const y = new Date(now);
        y.setDate(now.getDate() - 1);
        return { start: startOfDay(y), end: endOfDay(y) };
      }
      case '7D': {
        const s = new Date(now);
        s.setDate(now.getDate() - 6);
        return { start: startOfDay(s), end: endOfDay(now) };
      }
      case '30D': {
        const s = new Date(now);
        s.setDate(now.getDate() - 29);
        return { start: startOfDay(s), end: endOfDay(now) };
      }
      default:
        return null; // ALL
    }
  };

  // 🧮 combine text search + date preset filtering
  const filteredResults = useMemo(() => {
    const list = Array.isArray(criticalResults) ? criticalResults : [];
    const q = search.trim().toLowerCase();
    const range = getPresetRange(preset);

    return list.filter((r) => {
      const haystack = [
        r?.mrNo,
        r?.patientName,
        r?.contactNo,
        ...(Array.isArray(r?.tests) ? r.tests.map((t) => t?.testName) : []),
      ]
        .filter(Boolean)
        .map(String)
        .join(' ')
        .toLowerCase();

      const matchesText = !q || haystack.includes(q);
      if (!range) return matchesText;
      const d = r?.date ? new Date(r.date) : null;
      const inRange = d && !isNaN(d) && d >= range.start && d <= range.end;

      return matchesText && inRange;
    });
  }, [criticalResults, search, preset]);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4 w-full">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search MR No, name, test..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-cyan-500 focus:ring-cyan-500"
        />
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter size={16} />
            Filters
          </button>
          {showFilters && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
              {[
                { k: 'ALL', label: 'All Time' },
                { k: 'TODAY', label: 'Today' },
                { k: 'YESTERDAY', label: 'Yesterday' },
                { k: '7D', label: 'Last 7 Days' },
                { k: '30D', label: 'Last 30 Days' },
              ].map((opt) => (
                <button
                  key={opt.k}
                  onClick={() => {
                    setPreset(opt.k);
                    setShowFilters(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    preset === opt.k ? 'bg-cyan-50 text-cyan-700' : ''
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {criticalResults.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">
            No critical results found. Create your first one!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  MR No
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Contact No
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Tests
                </th>
                <th className="px-6 py-5 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result._id} className="hover:bg-gray-50">
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    {new Date(result.date).toLocaleDateString('en-CA')}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                    {result.mrNo}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    {result.patientName}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                    {result.contactNo}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {result.tests && result.tests.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {result.tests.slice(0, 2).map((test, idx) => (
                          <li key={idx}>
                            {test.testName}: {test.criticalValue}
                          </li>
                        ))}
                        {result.tests.length > 2 && (
                          <li>...and {result.tests.length - 2} more</li>
                        )}
                      </ul>
                    ) : (
                      'No tests'
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onPrint(result)}
                      className="text-cyan-600 hover:text-cyan-900 mr-3"
                    >
                      Print
                    </button>
                    <button
                      onClick={() => onEdit(result)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(result._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CriticalResultsTable;
