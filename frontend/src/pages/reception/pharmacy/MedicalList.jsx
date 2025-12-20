import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaEye, FaTrash, FaPills, FaIndustry, FaCalendarAlt, FaMoneyBillWave, FaBoxes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { createMedicineRecord, getAllMedicine, updateMedicineRecord } from '../../../features/medicine/MedicineSlice';

const MedicineList = () => {
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [medicineData, setMedicineData] = useState({
    medicine_Name: '',
    medicine_Company: '',
    medicine_PurchaseData: '',
    medicine_Price: '',
    medicine_ExpiryData: '',
    medicine_Stock: '',
  });
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewRecord, setViewRecord] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);
  const dispatch = useDispatch();

  const closeModal = () => setIsViewOpen(false);

 const medicineList = useSelector((state) => state.medicine?.medicineList || []);
  
  useEffect(() => {
    dispatch(getAllMedicine());
  }, [dispatch]);


  const filteredMedicines = medicineList
    .filter(med => !deletedIds.includes(med._id))
    .filter(med => med.medicine_Name.toLowerCase().includes(search.toLowerCase()));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedicineData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      'medicine_Name',
      'medicine_Company',
      'medicine_PurchaseData',
      'medicine_Price',
      'medicine_ExpiryData',
      'medicine_Stock'
    ];

    const isAnyFieldEmpty = requiredFields.some(field => !medicineData[field]);

    if (isAnyFieldEmpty) {
      alert('Please fill all required fields');
      return;
    }

    try {
      if (editId) {
        await dispatch(updateMedicineRecord({
          id: editId, 
          medicineData: medicineData
        }));
      } else {
        await dispatch(createMedicineRecord(medicineData));
      }

      setMedicineData({
        medicine_Name: '',
        medicine_Company: '',
        medicine_PurchaseData: '',
        medicine_Price: '',
        medicine_ExpiryData: '',
        medicine_Stock: '',
      });
      setEditId(null);
      setIsFormOpen(false);
      dispatch(getAllMedicine());
    } catch (error) {
      console.error("Error submitting medicine:", error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medicine record?')) {
      setDeletedIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="bg-primary-600 text-white rounded-md px-6 py-8 shadow-md">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center">
            <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold">Medicine Inventory</h1>
              <p className="text-primary-100 mt-1">Manage all medicine records and inventory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-9xl mx-auto px-6 py-8">
        {/* Search and Add Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search medicine by name, company..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                setIsFormOpen(true);
                setEditId(null);
                setMedicineData({
                  medicine_Name: '',
                  medicine_Company: '',
                  medicine_PurchaseData: '',
                  medicine_Price: '',
                  medicine_ExpiryData: '',
                  medicine_Stock: '',
                });
              }}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FaPlus className="-ml-1 mr-2 h-4 w-4" />
              Add New Medicine
            </button>
          </div>
        </div>

        {/* Medicine Form */}
        {isFormOpen && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editId ? 'Edit Medicine Record' : 'Add New Medicine'}
            </h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name*</label>
                <div className="relative">
                  <FaPills className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="medicine_Name"
                    placeholder="Medicine Name"
                    value={medicineData.medicine_Name}
                    onChange={handleInputChange}
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company*</label>
                <div className="relative">
                  <FaIndustry className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="medicine_Company"
                    placeholder="Manufacturing Company"
                    value={medicineData.medicine_Company}
                    onChange={handleInputChange}
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date*</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    name="medicine_PurchaseData"
                    value={medicineData.medicine_PurchaseData}
                    onChange={handleInputChange}
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="medicine_Price"
                    placeholder="Price per unit"
                    value={medicineData.medicine_Price}
                    onChange={handleInputChange}
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    name="medicine_ExpiryData"
                    value={medicineData.medicine_ExpiryData}
                    onChange={handleInputChange}
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock*</label>
                <div className="relative">
                  <FaBoxes className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="medicine_Stock"
                    placeholder="Quantity in stock"
                    value={medicineData.medicine_Stock}
                    onChange={handleInputChange}
                    className="pl-10 border border-gray-300 px-4 py-2 rounded w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 mt-4 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="bg-primary-600 text-white py-2 px-6 rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  {editId ? "Update Medicine" : "Add Medicine"}
                </button>

                <button 
                  onClick={() => setIsFormOpen(false)}
                  type="button"
                  className="border border-gray-300 text-gray-700 py-2 px-6 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-250 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Medicine List Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicine Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map((med) => (
                    <tr key={med._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {med.medicine_Name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {med.medicine_Company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {med.medicine_PurchaseData}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {med.medicine_Price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {med.medicine_ExpiryData}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          parseInt(med.medicine_Stock) < 50 ? "bg-red-100 text-red-800" :
                          parseInt(med.medicine_Stock) < 100 ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {med.medicine_Stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setIsFormOpen(true);
                            setEditId(med._id);
                            setMedicineData({
                              medicine_Name: med.medicine_Name,
                              medicine_Company: med.medicine_Company,
                              medicine_PurchaseData: med.medicine_PurchaseData,
                              medicine_Price: med.medicine_Price,
                              medicine_ExpiryData: med.medicine_ExpiryData,
                              medicine_Stock: med.medicine_Stock,
                            });
                          }}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <FaEdit className="inline mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(med._id)}
                          className="text-red-600 hover:text-red-900 mr-4"
                        >
                          <FaTrash className="inline mr-1" /> Delete
                        </button>
                        <button
                          onClick={() => {
                            setIsViewOpen(true);
                            setViewRecord(med);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaEye className="inline mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      {search ? 'No medicines match your search.' : 'No medicines found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Medicine Details Modal - Using previous view design */}
      {isViewOpen && viewRecord && (
        <div className="fixed inset-0 bg-white/15 backdrop-blur-lg flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold text-green-700">Medicine Record Details</h2>
              <button onClick={closeModal} className="text-red-500 hover:text-red-800 text-2xl">&times;</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <p className="text-lg font-semibold text-gray-500">Medicine Name</p>
                <p className="text-lg">{viewRecord.medicine_Name}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-500">Company</p>
                <p className="text-lg">{viewRecord.medicine_Company}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-500">Purchase Date</p>
                <p className="text-lg">{viewRecord.medicine_PurchaseData}</p>
              </div>
              <div>
                <p className="text-lg text-gray-500 font-semibold">Price</p>
                <p className="text-lg">{viewRecord.medicine_Price}</p>
              </div>
              <div>
                <p className="text-lg text-gray-500 font-semibold">Expiry Date</p>
                <p className="text-lg">{viewRecord.medicine_ExpiryData}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-500">Stock</p>
                <p className="text-lg">{viewRecord.medicine_Stock} units</p>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center text-sm text-gray-500 border-t pt-4">
              {/* Additional info can go here */}
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary-50 p-4 rounded-md">
                <h3 className="text-xl font-medium text-primary-700">Storage Instructions</h3>
                <p className="text-lg text-gray-600 mt-1">Store in a cool, dry place away from direct sunlight.</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-md">
                <h3 className="text-xl font-medium text-amber-700">Record Status</h3>
                <p className="text-lg text-gray-600 mt-1">
                  {parseInt(viewRecord.medicine_Stock) < 100
                    ? "Low Stock - Reorder Soon"
                    : "Stock Sufficient"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineList;