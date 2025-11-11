import { useState } from 'react';
import React from 'react';

// How much more you can discount/pay given current totals

export const EditForm = ({
  mode,
  totalOfStudies,
  discount,
  setDiscount,
  paidAmount,
  setPaidAmount,
  errors,
  setErrors,
}) => {
  const [additionalDiscount, setAdditionalDiscount] = useState('');
  const [additionalPaid, setAdditionalPaid] = useState('');

  const discountCapacity = React.useMemo(() => {
    const total = Math.max(0, Number(totalOfStudies) || 0);
    const disc = Math.max(0, Math.floor(Number(discount) || 0));
    return Math.max(0, total - disc);
  }, [totalOfStudies, discount]);

  const paidCapacity = React.useMemo(() => {
    const total = Math.max(0, Number(totalOfStudies) || 0);
    const disc = Math.min(
      Math.max(0, Math.floor(Number(discount) || 0)),
      total
    );
    const maxPaidAllowed = Math.max(0, total - disc);
    const paid = Math.max(0, Math.floor(Number(paidAmount) || 0));
    return Math.max(0, maxPaidAllowed - paid);
  }, [totalOfStudies, discount, paidAmount]);

  const applyAdditionalDiscount = () => {
    const add = Math.max(0, Math.floor(Number(additionalDiscount) || 0));
    if (add <= 0 || add > discountCapacity) {
      setErrors((prev) => ({
        ...prev,
        additionalDiscount: `Max Rs. ${discountCapacity}`,
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, additionalDiscount: '' }));
    // bump the global discount; your auto-split effect will take care of studies
    setDiscount((prev) =>
      String(Math.max(0, Math.floor(Number(prev) || 0)) + add)
    );
    setAdditionalDiscount('');
  };

  const applyAdditionalPaid = () => {
    const add = Math.max(0, Math.floor(Number(additionalPaid) || 0));
    if (add <= 0 || add > paidCapacity) {
      setErrors((prev) => ({
        ...prev,
        additionalPaid: `Max Rs. ${paidCapacity}`,
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, additionalPaid: '' }));
    // bump the global paid; your auto-split effect will take care of studies
    setPaidAmount((prev) =>
      String(Math.max(0, Math.floor(Number(prev) || 0)) + add)
    );
    setAdditionalPaid('');
  };

  return (
    <>
      <div className="space-y-3">
        {/* Main totals (editable in create; locked in existing mode as you had) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm font-medium">
            <label htmlFor="paidAmount" className="block">
              Paid
            </label>
            <input
              id="paidAmount"
              type="number"
              min={0}
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              placeholder="Overall Paid (Rs)"
              className="mt-1 w-full rounded border border-gray-300 p-2 shadow-sm"
              data-nav
              title="Overall Paid"
              disabled={mode === 'edit'}
              inputMode="numeric"
            />
            {errors.paidAmount && (
              <p className="mt-1 text-sm text-red-600">{errors.paidAmount}</p>
            )}
          </div>

          <div className="text-sm font-medium">
            <label htmlFor="discount" className="block">
              Discount
            </label>
            <input
              id="discount"
              type="number"
              min={0}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Overall Discount (Rs)"
              className="mt-1 w-full rounded border border-gray-300 p-2 shadow-sm"
              data-nav
              title="Overall Discount"
              disabled={mode === 'edit'}
              inputMode="numeric"
            />
            {errors.discount && (
              <p className="mt-1 text-sm text-red-600">{errors.discount}</p>
            )}
          </div>
        </div>

        {/* Edit-only adders */}
        {mode === 'edit' && (
          <div className="mt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Additional Discount */}
              <div className="text-sm font-medium">
                <label htmlFor="additionalDiscount" className="block">
                  Additional Discount
                </label>
                <div className="mt-1 flex">
                  <input
                    id="additionalDiscount"
                    type="number"
                    min={0}
                    max={discountCapacity}
                    value={additionalDiscount}
                    onChange={(e) => setAdditionalDiscount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        applyAdditionalDiscount();
                      }
                    }}
                    placeholder="Enter discount (Rs)"
                    className="flex-1 rounded-l border border-gray-300 p-2 shadow-sm"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={applyAdditionalDiscount}
                    disabled={!additionalDiscount}
                    className="rounded-r bg-primary-600 px-3 text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>

                {errors.additionalDiscount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.additionalDiscount}
                  </p>
                )}
              </div>

              {/* Additional Paid */}
              <div className="text-sm font-medium">
                <label htmlFor="additionalPaid" className="block">
                  Additional Paid
                </label>
                <div className="mt-1 flex">
                  <input
                    id="additionalPaid"
                    type="number"
                    min={0}
                    max={paidCapacity}
                    value={additionalPaid}
                    onChange={(e) => setAdditionalPaid(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        applyAdditionalPaid();
                      }
                    }}
                    placeholder="Enter amount (Rs)"
                    className="flex-1 rounded-l border border-gray-300 p-2 shadow-sm"
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={applyAdditionalPaid}
                    disabled={!additionalPaid}
                    className="rounded-r bg-primary-600 px-3 text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>

                {errors.additionalPaid && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.additionalPaid}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
