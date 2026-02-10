import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { useTestSelection } from './useTestSelection';

const TestInformationForm = ({
  testList,
  testRows,
  handleTestAdd,
  handleTestRowChange,
  handleRemoveRow,
  totalAmount,
  totalDiscount,
  totalPaid,
  totalFinalAmount,
  overallRemaining,
  applyOverallDiscount,
  applyOverallPaid,
  mode,
  paidBoxValue,
  discountBoxValue,
  searchTerm = '',
  onSearchChange = () => { },
  selectedTests = [],
  onSelectedTestsChange = () => { },
}) => {
  const [paidBox, setPaidBox] = useState('');
  const [discountBox, setDiscountBox] = useState('');
  const [showSelectedPreview, setShowSelectedPreview] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  const {
    selectedTests: hookSelectedTests, // Rename to avoid conflict
    showTestList,
    availableTests,
    searchInputRef,
    testListRef,
    setShowTestList,
    handleTestSelection,
    handleSelectAll,
    handleAddSelectedTests,
    handleAddSingleTest,
    handleKeyDown,
    getSelectedTestDetails,
  } = useTestSelection(testList, testRows, handleTestAdd, searchTerm);

  const selectedTestDetails = getSelectedTestDetails();

  // ADD THIS SEARCH HANDLER
  const handleSearchChange = (value) => {
    setLocalSearchTerm(value);

    // Call parent's search handler if provided
    if (onSearchChange) {
      onSearchChange(value);
    }

    // Show/hide test list based on search
    if (value.trim()) {
      setShowTestList(true);
    } else {
      setShowTestList(false);
    }
  };

  // Convert input to non-negative number
  const toNumber = (v) => {
    const n = parseFloat(v);
    return Number.isNaN(n) ? 0 : Math.max(0, n);
  };

  // Format number for display
  const formatCurrency = (v) => (Number.isFinite(v) ? v.toLocaleString() : '—');

  // Debounced updates for discount and paid
  const debouncedApplyDiscount = useCallback(
    debounce((value) => applyOverallDiscount?.(value), 500),
    [applyOverallDiscount]
  );

  const debouncedApplyPaid = useCallback(
    debounce((value) => applyOverallPaid?.(value), 500),
    [applyOverallPaid]
  );

  // Sync input fields with parent values
  useEffect(() => {
    if (paidBoxValue !== undefined && paidBoxValue !== null) {
      setPaidBox(String(toNumber(paidBoxValue)));
    }
  }, [paidBoxValue]);

  useEffect(() => {
    if (discountBoxValue !== undefined && discountBoxValue !== null) {
      setDiscountBox(String(toNumber(discountBoxValue)));
    }
  }, [discountBoxValue]);

  // Handle total discount input
  const handleDiscountChange = (value) => {
    const numericValue = toNumber(value);
    setDiscountBox(value);

    if (numericValue >= totalAmount) {
      setDiscountBox(String(totalAmount));
      debouncedApplyDiscount(totalAmount);
      return;
    }

    debouncedApplyDiscount(numericValue);
  };

  // Handle total paid input
  const handlePaidChange = (value) => {
    const numericValue = toNumber(value);
    setPaidBox(value);

    if (numericValue >= totalFinalAmount) {
      setPaidBox(String(totalFinalAmount));
      debouncedApplyPaid(totalFinalAmount);
      return;
    }

    debouncedApplyPaid(numericValue);
  };

  // Handle row-level changes
  const handleRowChange = (index, field, value) => {
    try {
      const row = testRows[index];
      const numericValue = ['amount', 'discount', 'paid'].includes(field)
        ? toNumber(value)
        : value;

      if (field === 'discount' && numericValue >= toNumber(row.amount)) {
        handleTestRowChange(index, 'discount', toNumber(row.amount));
        return;
      }

      if (field === 'paid') {
        const finalAmount = toNumber(row.amount) - toNumber(row.discount);
        if (numericValue >= finalAmount) {
          handleTestRowChange(index, 'paid', finalAmount);
          return;
        }
      }

      handleTestRowChange(index, field, numericValue);
    } catch (error) {
      toast.error('Failed to update test');
    }
  };

  // Remove individual selected test
  const handleRemoveSelectedTest = (testId) => {
    handleTestSelection(testId);

    if (onSelectedTestsChange) {
      onSelectedTestsChange(hookSelectedTests.filter(id => id !== testId));
    }
  };

  return (
    <div className="space-y-4">
      {/* Test Selection - Optimized Interface */}
      <div className="space-y-3">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tests by name or code... (Double Enter to add selected)"
              value={localSearchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => {
                if (localSearchTerm.trim()) {
                  setShowTestList(true);
                }
              }}
              onKeyDown={handleKeyDown}
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />

            {/* Test List Dropdown */}
            {showTestList && searchTerm.trim() && availableTests.length > 0 && (
              <div
                ref={testListRef}
                className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
                onKeyDown={handleKeyDown}
              >


                <div className="divide-y divide-gray-100">
                  {availableTests.map((test) => (
                    <label
                      key={test._id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test._id)}
                        onChange={() => handleTestSelection(test._id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {test.testName || 'Unnamed Test'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Code: {test.testCode} | Rs. {formatCurrency(toNumber(test.testPrice))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddSingleTest(test._id)}
                        className="px-2 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700"
                      >
                        Add
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Add Selected Button with Preview */}
          <div className="relative">
            <button
              type="button"
              onClick={handleAddSelectedTests}
              onMouseEnter={() => setShowSelectedPreview(true)}
              onMouseLeave={() => setShowSelectedPreview(false)}
              disabled={hookSelectedTests.length === 0}
              className="px-4 py-2 bg-primary-700 text-white rounded h-10.5 hover:bg-primary-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add Selected ({hookSelectedTests.length})
            </button>

            {/* Selected Tests Preview */}
            {showSelectedPreview && selectedTestDetails.length > 0 && (
              <div className="absolute z-30 top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded shadow-lg">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="font-semibold text-gray-900">
                    Selected Tests ({selectedTestDetails.length})
                  </h4>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {selectedTestDetails.map((test, index) => (
                    <div
                      key={test.id}
                      className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">
                          {test.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Code: {test.code} | Rs. {formatCurrency(toNumber(test.price))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSelectedTest(test.id)}
                        className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Remove from selection"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <div className="text-xs text-gray-600">
                    Total: Rs. {formatCurrency(selectedTestDetails.reduce((sum, test) => sum + toNumber(test.price), 0))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Tests Summary (Always visible when there are selections) */}
        {selectedTestDetails.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-blue-900 text-sm">
                Ready to Add ({selectedTestDetails.length} tests)
              </h4>
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-900">
                  Rs. {formatCurrency(selectedTestDetails.reduce((sum, test) => sum + toNumber(test.price), 0))}
                </div>
                <div className="text-xs text-blue-700">
                  Double Enter to add all
                </div>
              </div>
            </div>

            {/* All tests in column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {selectedTestDetails.map((test, index) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-2 bg-white rounded border border-blue-100 hover:bg-blue-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-xs truncate">
                      {test.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      Code: {test.code} | Rs. {formatCurrency(toNumber(test.price))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSelectedTest(test.id)}
                    className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded shrink-0"
                    title="Remove from selection"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {showTestList && searchTerm.trim() && availableTests.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No tests found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Rest of the component remains the same */}
      {/* Test Table */}
      {testRows.length > 0 && (
        <>
          <div className="overflow-x-auto border border-gray-300 shadow-sm rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    '#',
                    'Test',
                    'Amount',
                    'Discount',
                    'Final',
                    'Paid',
                    'Remaining',
                    'Action',
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-2 text-left font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {testRows.map((row, index) => {
                  const amount = toNumber(row.amount);
                  const discount = toNumber(row.discount);
                  const paid = toNumber(row.paid);
                  const final = amount - discount;
                  const remaining = Math.max(0, final - paid);

                  return (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        <div>
                          <div className="font-medium">{row.testName}</div>
                          <div className="text-xs text-gray-500">Code: {row.testCode}</div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={amount}
                          onChange={(e) =>
                            handleRowChange(index, 'amount', e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 shadow-sm rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={discount}
                          onChange={(e) =>
                            handleRowChange(index, 'discount', e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 shadow-sm rounded"
                        />
                      </td>
                      <td className="px-4 py-2 text-green-700 font-medium">
                        {formatCurrency(final)}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={paid}
                          onChange={(e) =>
                            handleRowChange(index, 'paid', e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded border-gray-300 shadow-sm"
                          disabled={mode === 'edit' && paid > 0}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            remaining > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'
                          }
                        >
                          {formatCurrency(remaining)}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Remove this test?')) {
                              handleRemoveRow(index);
                              toast.success('Test removed');
                            }
                          }}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Financial Summary</h3>
                <div className="flex justify-between">
                  <span>Total Tests:</span>
                  <span>{testRows.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span>Rs. {formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Final Amount:</span>
                  <span className="text-green-700 font-medium">
                    Rs. {formatCurrency(totalFinalAmount)}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label>Total Discount:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={discountBox}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      onBlur={(e) => handleDiscountChange(e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 shadow-sm rounded text-right"
                    />
                    <span>Rs.</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label>Total Paid:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={paidBox}
                      onChange={(e) => handlePaidChange(e.target.value)}
                      onBlur={(e) => handlePaidChange(e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 shadow-sm rounded text-right"
                      disabled={mode === 'edit'}
                    />
                    <span>Rs.</span>
                  </div>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Remaining Balance:</span>
                  <span
                    className={
                      overallRemaining > 0 ? 'text-red-600' : 'text-green-600'
                    }
                  >
                    Rs. {formatCurrency(overallRemaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {testRows.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500">No tests added yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Search and select tests above to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default TestInformationForm;