import React from 'react';

const FinancialDetails = ({
  totalAmount,
  setTotalAmount,
  paidAmount,
  setPaidAmount,
  discount,
  setDiscount,
  errors,
}) => {
  return (
    <>
      <div data-nav>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Amount
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2 border border-r-0 rounded-l border-gray-200 shadow-sm">
            ₨
          </span>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="border rounded-r px-3 py-2 h-[42px] w-full border-gray-200 shadow-sm"
            min="0"
            step="0.01"
          />
        </div>
        {errors.totalAmount && (
          <p className="text-red-600 text-sm mt-1">{errors.totalAmount}</p>
        )}
      </div>

      <div data-nav>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paid Amount
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2 border border-r-0 rounded-l border-gray-200 shadow-sm">
            ₨
          </span>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            className="border rounded-r px-3 py-2 h-[42px] w-full border-gray-200 shadow-sm"
            min="0"
            step="0.01"
          />
        </div>
        {errors.paidAmount && (
          <p className="text-red-600 text-sm mt-1">{errors.paidAmount}</p>
        )}
      </div>

      <div data-nav>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Discount
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2 border border-r-0 rounded-l border-gray-200 shadow-sm">
            ₨
          </span>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border rounded-r px-3 py-2 h-[42px] w-full border-gray-200 shadow-sm"
            min="0"
            step="0.01"
          />
        </div>
        {errors.discount && (
          <p className="text-red-600 text-sm mt-1">{errors.discount}</p>
        )}
      </div>
    </>
  );
};

export default FinancialDetails;