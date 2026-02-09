// components/TestFieldsTable.js
import React from 'react';
import { getReferenceRangeText, getInputTypeDisplay } from '../../../../hooks/useTestDetailHook';

export const TestFieldsTable = ({ fields, testName, testDept }) => {
  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No Test Fields</h3>
        <p className="text-slate-500">No fields have been defined for this test yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
      <div className="bg-linear-to-r from-primary-600 to-teal-600 p-6 text-white">
        <h3 className="text-xl font-bold flex items-center">
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Test Fields ({fields.length})
        </h3>
        <p className="text-primary-100 mt-1">Parameters and reference ranges for this test</p>
      </div>
      
      <div className="flex items-center p-4 bg-emerald-50 border-b">
        <h1 className="font-bold text-gray-900 px-4 py-2">{testName}</h1>
        <h1 className="font-bold text-gray-900 px-4 py-2">{testDept || 'N/A'}</h1>
      </div>

      <div className="p-6 overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Input Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference Range
                </th>
                {fields.some(f => f.options) && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Options
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.map((field, index) => (
                <TestFieldRow key={index} field={field} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TestFieldRow = ({ field, index }) => (
  <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
      {field.name}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        field.inputType === 'dropdown' 
          ? 'bg-purple-100 text-purple-800'
          : field.inputType === 'number'
          ? 'bg-primary-100 text-primary-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {getInputTypeDisplay(field)}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {field.unit || 'N/A'}
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">
      {getReferenceRangeText(field.normalRange)}
    </td>
    {field.options && (
      <td className="px-6 py-4 text-sm text-gray-500">
        {field.options.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {field.options.slice(0, 3).map((option, idx) => (
              <span key={idx} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {option}
              </span>
            ))}
            {field.options.length > 3 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                +{field.options.length - 3} more
              </span>
            )}
          </div>
        ) : (
          'No options'
        )}
      </td>
    )}
  </tr>
);