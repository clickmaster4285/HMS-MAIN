import React, { useState } from 'react';
import {
  FaSearch,
  FaPlus,
  FaBoxes,
  FaExchangeAlt,
  FaFileExport,
  FaFileImport,
  FaFileAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaIndustry,
  FaPills,
} from 'react-icons/fa';

const StockManagement = () => {
  const [activeTab, setActiveTab] = useState('stock-in');
  const [stockItems, setStockItems] = useState([
    {
      id: '1',
      skuCode: 'PARA500',
      drugName: 'Paracetamol 500mg',
      batchNumber: 'BTH001',
      manufacturingDate: '2024-01-15',
      expiryDate: '2026-01-15',
      quantity: 1000,
      unitPrice: 2.5,
      supplier: 'PharmaCorp Ltd',
      location: 'Main Store',
    },
    {
      id: '2',
      skuCode: 'AMOX250',
      drugName: 'Amoxicillin 250mg',
      batchNumber: 'BTH002',
      manufacturingDate: '2024-02-10',
      expiryDate: '2025-02-10',
      quantity: 500,
      unitPrice: 5.75,
      supplier: 'MediSupply Co',
      location: 'Cold Storage',
    },
  ]);

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Stock In Form State
  const [stockInForm, setStockInForm] = useState({
    skuCode: '',
    drugName: '',
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: '',
    quantity: '',
    unitPrice: '',
    supplier: '',
    grnNumber: '',
    poNumber: '',
  });

  // Stock Out Form State
  const [stockOutForm, setStockOutForm] = useState({
    skuCode: '',
    quantity: '',
    destination: '',
    reason: '',
  });

  // Stock Adjustment Form State
  const [adjustmentForm, setAdjustmentForm] = useState({
    skuCode: '',
    quantity: '',
    adjustmentType: 'damaged',
    reason: '',
  });

  const handleStockIn = (e) => {
    e.preventDefault();
    const newItem = {
      id: Date.now().toString(),
      skuCode: stockInForm.skuCode,
      drugName: stockInForm.drugName,
      batchNumber: stockInForm.batchNumber,
      manufacturingDate: stockInForm.manufacturingDate,
      expiryDate: stockInForm.expiryDate,
      quantity: parseInt(stockInForm.quantity),
      unitPrice: parseFloat(stockInForm.unitPrice),
      supplier: stockInForm.supplier,
      location: 'Main Store',
    };

    const newTransaction = {
      id: Date.now().toString(),
      type: 'in',
      skuCode: stockInForm.skuCode,
      drugName: stockInForm.drugName,
      quantity: parseInt(stockInForm.quantity),
      date: new Date().toISOString().split('T')[0],
      grnNumber: stockInForm.grnNumber,
    };

    // Check if item with same SKU and batch exists
    const existingItemIndex = stockItems.findIndex(
      (item) =>
        item.skuCode === newItem.skuCode &&
        item.batchNumber === newItem.batchNumber
    );

    if (existingItemIndex !== -1) {
      const updatedItems = [...stockItems];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      setStockItems(updatedItems);
    } else {
      setStockItems([...stockItems, newItem]);
    }

    setTransactions([...transactions, newTransaction]);
    setStockInForm({
      skuCode: '',
      drugName: '',
      batchNumber: '',
      manufacturingDate: '',
      expiryDate: '',
      quantity: '',
      unitPrice: '',
      supplier: '',
      grnNumber: '',
      poNumber: '',
    });
  };

  const handleStockOut = (e) => {
    e.preventDefault();
    const item = stockItems.find(
      (item) => item.skuCode === stockOutForm.skuCode
    );
    if (item && item.quantity >= parseInt(stockOutForm.quantity)) {
      const updatedItems = stockItems.map((item) =>
        item.skuCode === stockOutForm.skuCode
          ? {
              ...item,
              quantity: item.quantity - parseInt(stockOutForm.quantity),
            }
          : item
      );
      setStockItems(updatedItems);

      const newTransaction = {
        id: Date.now().toString(),
        type: 'out',
        skuCode: stockOutForm.skuCode,
        drugName: item.drugName,
        quantity: parseInt(stockOutForm.quantity),
        destination: stockOutForm.destination,
        reason: stockOutForm.reason,
        date: new Date().toISOString().split('T')[0],
      };

      setTransactions([...transactions, newTransaction]);
      setStockOutForm({
        skuCode: '',
        quantity: '',
        destination: '',
        reason: '',
      });
    }
  };

  const handleStockAdjustment = (e) => {
    e.preventDefault();
    const item = stockItems.find(
      (item) => item.skuCode === adjustmentForm.skuCode
    );
    if (item) {
      const adjustmentQty = parseInt(adjustmentForm.quantity);
      const updatedItems = stockItems.map((item) =>
        item.skuCode === adjustmentForm.skuCode
          ? { ...item, quantity: Math.max(0, item.quantity - adjustmentQty) }
          : item
      );
      setStockItems(updatedItems);

      const newTransaction = {
        id: Date.now().toString(),
        type: 'adjustment',
        skuCode: adjustmentForm.skuCode,
        drugName: item.drugName,
        quantity: adjustmentQty,
        reason: `${adjustmentForm.adjustmentType}: ${adjustmentForm.reason}`,
        date: new Date().toISOString().split('T')[0],
      };

      setTransactions([...transactions, newTransaction]);
      setAdjustmentForm({
        skuCode: '',
        quantity: '',
        adjustmentType: 'damaged',
        reason: '',
      });
    }
  };

  const getExpiringItems = (days) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    return stockItems.filter((item) => {
      const expiryDate = new Date(item.expiryDate);
      return expiryDate <= futureDate && expiryDate > today;
    });
  };

  const filteredStockItems = stockItems.filter(
    (item) =>
      item.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.drugName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.drugName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      {/* Header Section */}
      <div className="bg-primary-600 text-white rounded-md px-6 py-8 shadow-md">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center">
            <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold">
                Pharmaceutical Stock Management
              </h1>
              <p className="text-primary-100 mt-1">
                Comprehensive inventory management for pharmaceutical supplies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-9xl mx-auto px-6 py-8">
        {/* Search and Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by SKU, drug name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex space-x-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('stock-in')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'stock-in'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaFileImport className="mr-2" />
                Stock In
              </button>
              <button
                onClick={() => setActiveTab('stock-out')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'stock-out'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaFileExport className="mr-2" />
                Stock Out
              </button>
              <button
                onClick={() => setActiveTab('adjustment')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'adjustment'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaExchangeAlt className="mr-2" />
                Adjustment
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'summary'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaFileAlt className="mr-2" />
                Summary
              </button>
            </div>
          </div>
        </div>

        {/* Stock In Tab */}
        {activeTab === 'stock-in' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaFileImport className="mr-2 text-primary-600" />
              Goods Receipt (Stock In)
            </h2>

            <form
              onSubmit={handleStockIn}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU Code*
                </label>
                <div className="relative">
                  <FaPills className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={stockInForm.skuCode}
                    onChange={(e) =>
                      setStockInForm({
                        ...stockInForm,
                        skuCode: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drug Name*
                </label>
                <div className="relative">
                  <FaPills className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={stockInForm.drugName}
                    onChange={(e) =>
                      setStockInForm({
                        ...stockInForm,
                        drugName: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Number*
                </label>
                <div className="relative">
                  <FaBoxes className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={stockInForm.batchNumber}
                    onChange={(e) =>
                      setStockInForm({
                        ...stockInForm,
                        batchNumber: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manufacturing Date*
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={stockInForm.manufacturingDate}
                    onChange={(e) =>
                      setStockInForm({
                        ...stockInForm,
                        manufacturingDate: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date*
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={stockInForm.expiryDate}
                    onChange={(e) =>
                      setStockInForm({
                        ...stockInForm,
                        expiryDate: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity*
                </label>
                <div className="relative">
                  <FaBoxes className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    value={stockInForm.quantity}
                    onChange={(e) =>
                      setStockInForm({
                        ...stockInForm,
                        quantity: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit Price*
                </label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={stockInForm.unitPrice}
                    onChange={(e) =>
                      setStockInForm({
                        ...stockInForm,
                        unitPrice: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier*
                </label>
                <div className="relative">
                  <FaIndustry className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={stockInForm.supplier}
                    onChange={(e) =>
                      setStockInForm({
                        ...stockInForm,
                        supplier: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GRN Number*
                </label>
                <div className="relative">
                  <FaFileAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={stockInForm.grnNumber}
                    onChange={(e) =>
                      setStockInForm({
                        ...stockInForm,
                        grnNumber: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 mt-4 flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white py-2 px-6 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Add Stock
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStockInForm({
                      skuCode: '',
                      drugName: '',
                      batchNumber: '',
                      manufacturingDate: '',
                      expiryDate: '',
                      quantity: '',
                      unitPrice: '',
                      supplier: '',
                      grnNumber: '',
                      poNumber: '',
                    })
                  }
                  className="border border-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-250 focus:ring-offset-2 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stock Out Tab */}
        {activeTab === 'stock-out' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaFileExport className="mr-2 text-primary-600" />
              Stock Out (Transfer)
            </h2>

            <form
              onSubmit={handleStockOut}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU Code*
                </label>
                <div className="relative">
                  <FaPills className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={stockOutForm.skuCode}
                    onChange={(e) =>
                      setStockOutForm({
                        ...stockOutForm,
                        skuCode: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Select SKU</option>
                    {stockItems.map((item) => (
                      <option key={item.id} value={item.skuCode}>
                        {item.skuCode} - {item.drugName} (Qty: {item.quantity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity*
                </label>
                <div className="relative">
                  <FaBoxes className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    value={stockOutForm.quantity}
                    onChange={(e) =>
                      setStockOutForm({
                        ...stockOutForm,
                        quantity: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination*
                </label>
                <div className="relative">
                  <FaBoxes className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={stockOutForm.destination}
                    onChange={(e) =>
                      setStockOutForm({
                        ...stockOutForm,
                        destination: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Select Destination</option>
                    <option value="Ward A">Ward A</option>
                    <option value="Ward B">Ward B</option>
                    <option value="OPD Counter 1">OPD Counter 1</option>
                    <option value="OPD Counter 2">OPD Counter 2</option>
                    <option value="Branch Pharmacy">Branch Pharmacy</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <div className="relative">
                  <FaFileAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={stockOutForm.reason}
                    onChange={(e) =>
                      setStockOutForm({
                        ...stockOutForm,
                        reason: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    placeholder="Transfer reason"
                  />
                </div>
              </div>

              <div className="md:col-span-2 mt-4 flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white py-2 px-6 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Transfer Stock
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setStockOutForm({
                      skuCode: '',
                      quantity: '',
                      destination: '',
                      reason: '',
                    })
                  }
                  className="border border-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-250 focus:ring-offset-2 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stock Adjustment Tab */}
        {activeTab === 'adjustment' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaExchangeAlt className="mr-2 text-primary-600" />
              Stock Adjustment
            </h2>

            <form
              onSubmit={handleStockAdjustment}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU Code*
                </label>
                <div className="relative">
                  <FaPills className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={adjustmentForm.skuCode}
                    onChange={(e) =>
                      setAdjustmentForm({
                        ...adjustmentForm,
                        skuCode: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Select SKU</option>
                    {stockItems.map((item) => (
                      <option key={item.id} value={item.skuCode}>
                        {item.skuCode} - {item.drugName} (Qty: {item.quantity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment Quantity*
                </label>
                <div className="relative">
                  <FaBoxes className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    value={adjustmentForm.quantity}
                    onChange={(e) =>
                      setAdjustmentForm({
                        ...adjustmentForm,
                        quantity: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adjustment Type*
                </label>
                <div className="relative">
                  <FaExchangeAlt className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={adjustmentForm.adjustmentType}
                    onChange={(e) =>
                      setAdjustmentForm({
                        ...adjustmentForm,
                        adjustmentType: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  >
                    <option value="damaged">Damaged</option>
                    <option value="expired">Expired</option>
                    <option value="stolen">Stolen</option>
                    <option value="audit">Audit Adjustment</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason*
                </label>
                <div className="relative">
                  <FaFileAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={adjustmentForm.reason}
                    onChange={(e) =>
                      setAdjustmentForm({
                        ...adjustmentForm,
                        reason: e.target.value,
                      })
                    }
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    placeholder="Detailed reason for adjustment"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 mt-4 flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-primary-600 text-white py-2 px-6 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Adjust Stock
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAdjustmentForm({
                      skuCode: '',
                      quantity: '',
                      adjustmentType: 'damaged',
                      reason: '',
                    })
                  }
                  className="border border-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-250 focus:ring-offset-2 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Current Stock Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaBoxes className="mr-2 text-primary-600" />
                Current Stock Summary
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        SKU Code
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Drug Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Batch Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Expiry Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStockItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                          {item.skuCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.drugName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.batchNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              parseInt(item.quantity) < 50
                                ? 'bg-red-100 text-red-800'
                                : parseInt(item.quantity) < 100
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {item.quantity} units
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.expiryDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Expiring Soon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[30, 60, 90].map((days) => {
                const expiringItems = getExpiringItems(days);
                return (
                  <div
                    key={days}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <FaCalendarAlt className="mr-2 text-yellow-600" />
                      Expiring in {days} days ({expiringItems.length} items)
                    </h3>
                    <div className="space-y-2">
                      {expiringItems.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          className="text-sm bg-yellow-50 p-3 rounded border border-yellow-100"
                        >
                          <div className="font-medium">{item.drugName}</div>
                          <div className="text-yellow-700 text-xs mt-1">
                            Batch: {item.batchNumber} | Qty: {item.quantity} |
                            Expires: {item.expiryDate}
                          </div>
                        </div>
                      ))}
                      {expiringItems.length > 5 && (
                        <div className="text-sm text-yellow-700">
                          +{expiringItems.length - 5} more items
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <FaFileAlt className="mr-2 text-primary-600" />
                Recent Transactions
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        SKU
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Drug Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions
                      .slice(-10)
                      .reverse()
                      .map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                transaction.type === 'in'
                                  ? 'bg-green-100 text-green-800'
                                  : transaction.type === 'out'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {transaction.type.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">
                            {transaction.skuCode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.drugName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {transaction.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.grnNumber &&
                              `GRN: ${transaction.grnNumber}`}
                            {transaction.destination &&
                              `To: ${transaction.destination}`}
                            {transaction.reason &&
                              `Reason: ${transaction.reason}`}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManagement;
