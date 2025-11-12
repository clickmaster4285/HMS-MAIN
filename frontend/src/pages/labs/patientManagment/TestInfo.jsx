import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { debounce } from 'lodash';

const TestInformationForm = ({
  testList,
  selectedTestId,
  setSelectedTestId,
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
}) => {
  const [paidBox, setPaidBox] = useState('');
  const [discountBox, setDiscountBox] = useState('');

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
      // Allow full amount
      setDiscountBox(String(totalAmount)); // Cap at totalAmount
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
      // Allow full amount
      setPaidBox(String(totalFinalAmount)); // Cap at totalFinalAmount
      debouncedApplyPaid(totalFinalAmount);
      return;
    }

    debouncedApplyPaid(numericValue);
  };

  // Validate and add test
  const handleAddTest = () => {
    if (!selectedTestId) {
      toast.error('Please select a test');
      return;
    }

    if (testRows.some((row) => row.testId === selectedTestId)) {
      toast.error('This test is already added');
      return;
    }

    try {
      handleTestAdd(selectedTestId);
      setSelectedTestId('');
      toast.success('Test added');
    } catch (error) {
      toast.error('Failed to add test');
    }
  };

  // Handle row-level changes
  const handleRowChange = (index, field, value) => {
    try {
      const row = testRows[index];
      const numericValue = ['amount', 'discount', 'paid'].includes(field)
        ? toNumber(value)
        : value;

      if (field === 'discount' && numericValue >= toNumber(row.amount)) {
        handleTestRowChange(index, 'discount', toNumber(row.amount)); // Cap at amount
        return;
      }

      if (field === 'paid') {
        const finalAmount = toNumber(row.amount) - toNumber(row.discount);
        if (numericValue >= finalAmount) {
          handleTestRowChange(index, 'paid', finalAmount); // Cap at final amount
          return;
        }
      }

      handleTestRowChange(index, field, numericValue);
    } catch (error) {
      toast.error('Failed to update test');
    }
  };

  // Prepare test options for dropdown
  const options = (Array.isArray(testList) ? testList : [])
    .filter((test) => !testRows.some((row) => row.testId === test._id))
    .map((test) => ({
      value: test._id,
      label: `${test.testName || 'Unnamed'} - Rs ${formatCurrency(
        toNumber(test.testPrice)
      )}`,
    }));

  return (
    <div className="space-y-4">
      {/* Test Selection */}
      <div className="flex gap-4 items-center">
        <Select
          className="flex-1"
          value={options.find((o) => o.value === selectedTestId) || null}
          onChange={(option) => {
            const value = option?.value || '';
            setSelectedTestId(value);
            if (value) {
              // Call the add logic immediately
              if (testRows.some((row) => row.testId === value)) {
                toast.error('This test is already added');
                return;
              }
              try {
                handleTestAdd(value);
                setSelectedTestId('');
                toast.success('Test added');
              } catch (error) {
                toast.error('Failed to add test');
              }
            }
          }}
          options={options}
          placeholder="Select a test..."
          isDisabled={!options.length}
        />
      </div>

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
                      <td className="px-4 py-2">{row.testName}</td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min="0"
                          value={amount}
                          onChange={(e) =>
                            handleRowChange(index, 'amount', e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 shadow-sm  rounded"
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
                          className="w-full px-2 py-1 border border-gray-300 shadow-sm  rounded"
                        />
                      </td>
                      <td className="px-4 py-2 text-green-700">
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
                            remaining > 0 ? 'text-red-600' : 'text-green-600'
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
                          className="text-red-600 hover:text-red-800"
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
                  <span className="text-green-700">
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
                <div className="flex justify-between border-t pt-2">
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
            Select a test above to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default TestInformationForm;
