import React, { useEffect, useState } from 'react';
import { createInventoryRecord, updateInventoryRecord, getAllInventory, deleteInventory } from '../../../features/inventory/InventorySlice';
import { getallDepartments } from '../../../features/department/DepartmentSlice';
import { getwardsbydepartmentId } from '../../../features/ward/Wardslice';
import { useDispatch, useSelector } from 'react-redux';

const Inventory = () => {
  // Sample data for dropdowns
  const categories = ['Bed', 'Furniture', 'Medical Equipment', 'Surgical Instrument', 'Pharmaceutical', 'Consumable'];
  const status = ['Available', 'In Use', 'Maintenance', 'Disposed'];
  const bedType = ['Standard', 'ICU', 'Pediatric', 'Bariatric'];
  const furnitureType = ['Chair', 'Table', 'Cabinet', 'Stretcher'];
  const equipmentType = ['Diagnostic', 'Therapeutic', 'LifeSupport'];
  const instrumentType = ['Scalpel', 'Forceps', 'Clamp', 'Retractor'];
  const dosageForm = ['Tablet', 'Capsule', 'Injection', 'Ointment'];
  const consumableType = ['Gloves', 'Syringe', 'Bandage', 'Catheter'];

  // State management
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    quantity: 1,
    currentStock: '',
    department: '',
    room: '',
    wards: '',
    supplier: '',
    purchaseDate: '',
    warrantyExpiry: '',
    status: '',
    specifications: {
      bedType: '',
      adjustable: false,
      hasWheels: false,
      mattressType: '',
      furnitureType: '',
      material: '',
      maxLoad: '',
      equipmentType: '',
      requiresCalibration: false,
      lastCalibrationDate: '',
      calibrationFrequency: '',
      instrumentType: '',
      isSterile: false,
      sterilizationDate: '',
      drugName: '',
      dosageForm: '',
      expiryDate: '',
      storageTemp: '',
      consumableType: '',
      isDisposable: false,
      packageSize: '',
    }
  });

  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [viewForm, setViewForm] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const closeModal = () => setViewForm(false);

  // Redux state and dispatch
  const dispatch = useDispatch();
  const { inventoryList } = useSelector((state) => state.inventory);
  const { departments } = useSelector((state) => state.department);
  const { wardsByDepartment } = useSelector((state) => state.ward);



  // Fetch data on component mount
  useEffect(() => {
    dispatch(getAllInventory());
    dispatch(getallDepartments());
  }, [dispatch]);


  useEffect(() => {
    if (formData.department) {
      dispatch(getwardsbydepartmentId(formData.department));
    }
  }, [dispatch, formData.department]);

  //  Filter inventory
  const filteredInventory = inventoryList.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.room && item.room.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form operations
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // Handle specification changes
  const handleSpecificationChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleSpecificationNumberInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: parseFloat(value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await dispatch(updateInventoryRecord({
          id: editMode,
          inventoryData: formData
        }));
      } else {
        await dispatch(createInventoryRecord(formData));
      }
      resetForm();
      dispatch(getAllInventory());
    } catch (error) {
      console.error("Failed to save inventory item:", error);
    }
  };

  const handleEdit = (item) => {
    const formatDate = (date) =>
      date ? new Date(date).toISOString().split('T')[0] : '';

    // Format top-level date fields
    const formattedItem = {
      ...item,
      purchaseDate: formatDate(item.purchaseDate),
      warrantyExpiry: formatDate(item.warrantyExpiry),
    };

    // Format date fields inside specifications
    const formattedSpecifications = {
      ...item.specifications,
      lastCalibrationDate: formatDate(item.specifications?.lastCalibrationDate),
      sterilizationDate: formatDate(item.specifications?.sterilizationDate),
      expiryDate: formatDate(item.specifications?.expiryDate),
    };

    // Set form data
    setFormData({
      ...formattedItem,
      specifications: {
        bedType: '',
        adjustable: false,
        hasWheels: false,
        mattressType: '',
        furnitureType: '',
        material: '',
        maxLoad: '',
        equipmentType: '',
        requiresCalibration: false,
        lastCalibrationDate: '',
        calibrationFrequency: '',
        instrumentType: '',
        isSterile: false,
        sterilizationDate: '',
        drugName: '',
        dosageForm: '',
        expiryDate: '',
        storageTemp: '',
        consumableType: '',
        isDisposable: false,
        packageSize: '',
        ...formattedSpecifications, // override defaults with actual values
      }
    });


    setEditMode(item._id || item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory record?')) {
      try {
        await dispatch(deleteInventory(id));
        // No need to dispatch getAllInventory() here since the state is already updated
      } catch (error) {
        console.error("Failed to delete inventory item:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      description: '',
      quantity: 1,
      currentStock: '',
      department: '',
      room: '',
      wards: '',
      supplier: '',
      purchaseDate: '',
      warrantyExpiry: '',
      status: '',
      specifications: {
        bedType: '',
        adjustable: false,
        hasWheels: false,
        mattressType: '',
        furnitureType: '',
        material: '',
        maxLoad: '',
        equipmentType: '',
        requiresCalibration: false,
        lastCalibrationDate: '',
        calibrationFrequency: '',
        instrumentType: '',
        isSterile: false,
        sterilizationDate: '',
        drugName: '',
        dosageForm: '',
        expiryDate: '',
        storageTemp: '',
        consumableType: '',
        isDisposable: false,
        packageSize: '',
      }
    });
    setEditMode(false);
    setShowForm(false);
  };

  return (
    <div className=" ">
      {/* Header Section */}
      <div className="bg-primary-600 text-white rounded-md px-6 py-8 shadow-md">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center">
            <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold">Hospital Inventory Management</h1>
              <p className="text-primary-100 mt-1">Track and manage all hospital inventory items</p>
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
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search inventory by name, department, or category..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {showForm ? 'Cancel' : 'Add Inventory Item'}
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required >
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id || dept}>{dept.name}</option>
                    ))}
                  </select>
                </div>


                <div>
                  <label htmlFor="wards" className="block text-sm font-medium text-gray-700 mb-1">Wards</label>
                  <select
                    id="wards"
                    name="wards"
                    value={formData.wards}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Wards</option>
                    {wardsByDepartment.map((ward) => (

                      <option key={ward._id} value={ward.wardNumber}>{ward.wardNumber}</option>
                    ))}


                    )
                  </select>
                </div>

                <div>
                  <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                  <select
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Room</option>
                    {wardsByDepartment.map((ward) => (
                      <option key={ward._id} value={ward.wardNumber}>{ward.wardNumber}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Item Name*</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">description</label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {formData.category === 'Bed' && (<>

                  <div>
                    <label htmlFor="bedType" className="block text-sm font-medium text-gray-700 mb-1">Bed Type</label>
                    <select
                      id="bedType"
                      name="bedType"
                      value={formData.specifications.bedType}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Bed type</option>
                      {bedType.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="adjustable" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <input
                        type="checkbox"
                        id="adjustable"
                        name="adjustable"
                        checked={formData.specifications.adjustable}
                        onChange={handleSpecificationChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span>Adjustable</span>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="hasWheels" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <input
                        type="checkbox"
                        id="hasWheels"
                        name="hasWheels"
                        checked={formData.specifications.hasWheels}
                        onChange={handleSpecificationChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span>Has Wheels</span>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="mattressType" className="block text-sm font-medium text-gray-700 mb-1">Mattress Type</label>
                    <input
                      type="text"
                      id="mattressType"
                      name="mattressType"
                      value={formData.specifications.mattressType}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </>)}

                {formData.category === 'Furniture' &&
                  (<>
                    <div>
                      <label htmlFor="furnitureType" className="block text-sm font-medium text-gray-700 mb-1">Furniture Type</label>
                      <select
                        id="furnitureType"
                        name="furnitureType"
                        value={formData.specifications.furnitureType}
                        onChange={handleSpecificationChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">Select Furniture type</option>
                        {furnitureType.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="material" className="block text-sm font-medium text-gray-700 mb-1">Furniture Material</label>
                      <input
                        type="text"
                        id="material"
                        name="material"
                        value={formData.specifications.material}
                        onChange={handleSpecificationChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="maxLoad" className="block text-sm font-medium text-gray-700 mb-1">Furniture Maxload</label>
                      <input
                        type="number"
                        id="maxLoad"
                        name="maxLoad"
                        min="1"
                        value={formData.specifications.maxLoad}
                        onChange={handleSpecificationNumberInput}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </>
                  )}

                {formData.category === 'Medical Equipment' && (<>
                  <div>
                    <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-700 mb-1">Equipment Type</label>
                    <select
                      id="equipmentType"
                      name="equipmentType"
                      value={formData.specifications.equipmentType}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Equipment type</option>
                      {equipmentType.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="requiresCalibration" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <input
                        type="checkbox"
                        id="requiresCalibration"
                        name="requiresCalibration"
                        checked={formData.specifications.requiresCalibration}
                        onChange={handleSpecificationChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span>Requires Calibration</span>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="lastCalibrationDate" className="block text-sm font-medium text-gray-700 mb-1">Last Calibration Date</label>
                    <input
                      type="date"
                      id="lastCalibrationDate"
                      name="lastCalibrationDate"
                      value={formData.specifications.lastCalibrationDate}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="calibrationFrequency" className="block text-sm font-medium text-gray-700 mb-1">Calibration Frequency</label>
                    <input
                      type="number"
                      id="calibrationFrequency"
                      name="calibrationFrequency"
                      min="1"
                      value={formData.specifications.calibrationFrequency}
                      onChange={handleSpecificationNumberInput}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </>)}

                {formData.category === 'Surgical Instrument' && (<>
                  <div>
                    <label htmlFor="instrumentType" className="block text-sm font-medium text-gray-700 mb-1">Surgical Instrument Type</label>
                    <select
                      id="instrumentType"
                      name="instrumentType"
                      value={formData.specifications.instrumentType}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Surgical Instrument type</option>
                      {instrumentType.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="isSterile" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <input
                        type="checkbox"
                        id="isSterile"
                        name="isSterile"
                        checked={formData.specifications.isSterile}
                        onChange={handleSpecificationChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span>Is Sterile</span>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="sterilizationDate" className="block text-sm font-medium text-gray-700 mb-1">Sterilization Date</label>
                    <input
                      type="date"
                      id="sterilizationDate"
                      name="sterilizationDate"
                      value={formData.specifications.sterilizationDate}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </>)}

                {formData.category === 'Pharmaceutical' && (<>
                  <div>
                    <label htmlFor="drugName" className="block text-sm font-medium text-gray-700 mb-1">Drug Name</label>
                    <input
                      type="text"
                      id="drugName"
                      name="drugName"
                      value={formData.specifications.drugName}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="dosageForm" className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
                    <select
                      id="dosageForm"
                      name="dosageForm"
                      value={formData.specifications.dosageForm}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Dosage Form</option>
                      {dosageForm.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
                    <input
                      type="date"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.specifications.expiryDate}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required />
                  </div>

                  <div>
                    <label htmlFor="storageTemp" className="block text-sm font-medium text-gray-700 mb-1">Storage Temperature</label>
                    <input
                      type="text"
                      id="storageTemp"
                      name="storageTemp"
                      value={formData.specifications.storageTemp}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </>)}

                {formData.category === 'Consumable' && (<>
                  <div>
                    <label htmlFor="consumableType" className="block text-sm font-medium text-gray-700 mb-1">Consumable Type</label>
                    <select
                      id="consumableType"
                      name="consumableType"
                      value={formData.specifications.consumableType}
                      onChange={handleSpecificationChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select Consumable type</option>
                      {consumableType.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="isDisposable" className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                      <input
                        type="checkbox"
                        id="isDisposable"
                        name="isDisposable"
                        checked={formData.specifications.isDisposable}
                        onChange={handleSpecificationChange}
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span>Is Disposable</span>
                    </label>
                  </div>

                  <div>
                    <label htmlFor="packageSize" className="block text-sm font-medium text-gray-700 mb-1">Package Size</label>
                    <input
                      type="number"
                      id="packageSize"
                      name="packageSize"
                      min="1"
                      value={formData.specifications.packageSize}
                      onChange={handleSpecificationNumberInput}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </>)}

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity*</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleNumberInput}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700 mb-1">Current Stock*</label>
                  <input
                    type="number"
                    id="currentStock"
                    name="currentStock"
                    min="0"
                    value={formData.currentStock}
                    onChange={handleNumberInput}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input
                    type="text"
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Date*
                  </label>
                  <input
                    type="date"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="warrantyExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                    Warrenty Expiry*
                  </label>
                  <input
                    type="date"
                    id="warrantyExpiry"
                    name="warrantyExpiry"
                    value={formData.warrantyExpiry}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select Status</option>
                    {status.map((stat, index) => (
                      <option key={index} value={stat}>{stat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {editMode ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        )}


        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ward
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Warrenty Expiry
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <tr key={item._id || item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof item.department === 'object'
                          ? item.department.name
                          : departments.find(d => d._id === item.department)?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.room || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.wards || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.category === 'Medical Equipment' ? 'bg-primary-100 text-primary-800' :
                          item.category === 'Furniture' ? 'bg-green-100 text-green-800' :
                            item.category === 'Surgical Instrument' ? 'bg-purple-100 text-purple-800' :
                              'bg-yellow-100 text-yellow-800'
                          }`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.currentStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => {
                            setViewForm(true);
                            setViewRecord(item);
                          }}
                          className="text-green-600 hover:text-green-900 ml-4"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'No inventory items match your search.' : 'No inventory items found.'}
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>

        {/* View selected form */}


        {viewForm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] max-w-4xl w-full mx-4 border border-gray-200 overflow-hidden transform transition-all duration-200 scale-[0.98] animate-[scaleIn_0.2s_ease-out_forwards]">
              <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-linear-to-r from-primary-50 to-primary-100">
                <h2 className="text-2xl font-bold text-primary-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Inventory Record Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-red-500 text-2xl transition-all duration-200 hover:scale-110 focus:outline-none"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-h-[70vh] overflow-y-auto">
                {/* Helper function to format dates */}
                {(() => {
                  const formatDate = (dateString) => {
                    if (!dateString) return 'N/A';
                    const date = new Date(dateString);
                    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  };



                  return (
                    <>
                      <div className="space-y-2">
                        <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Item Name</p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-lg font-medium text-gray-800">{viewRecord.name || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Department</p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-lg font-medium text-gray-800"> {typeof viewRecord.department === 'object'
                            ? viewRecord.department.name
                            : departments.find(d => d._id === viewRecord.department)?.name || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Wards</p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-lg font-medium text-gray-800">{viewRecord.wards || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Room</p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-lg font-medium text-gray-800">{viewRecord.room || 'N/A'}</p>
                        </div>
                      </div>

                      {viewRecord.description && (
                        <div className="space-y-2 md:col-span-2">
                          <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Description</p>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-lg font-medium text-gray-800">{viewRecord.description}</p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Quantity</p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center">
                          <p className="text-lg font-medium text-gray-800">{viewRecord.quantity || '0'}</p>
                          <span className="ml-2 text-sm text-gray-500">units</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Current Stock</p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center">
                          <p className="text-lg font-medium text-gray-800">{viewRecord.currentStock || '0'}</p>
                          <span className="ml-2 text-sm text-gray-500">units</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Category</p>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <p className="text-lg font-medium text-gray-800">{viewRecord.category || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Specifications sections */}
                      {viewRecord.specifications?.bedType && (
                        <div className="space-y-2">
                          <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Bed Type</p>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-lg font-medium text-gray-800">{viewRecord.specifications.bedType}</p>
                          </div>
                        </div>
                      )}

                      {viewRecord.specifications?.adjustable !== undefined && (
                        <div className="space-y-2">
                          <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Adjustable</p>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-lg font-medium text-gray-800">
                              {viewRecord.specifications.adjustable ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Add all other specification fields similarly */}

                      <div className="space-y-2">
                        <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Purchase Date</p>
                        <div className={`p-3 rounded-lg border ${viewRecord.purchaseDate ? 'bg-gray-50 border-gray-100' : 'bg-yellow-50 border-yellow-100'}`}>
                          <p className="text-lg font-medium text-gray-800">
                            {formatDate(viewRecord.purchaseDate) || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Warranty Expiry</p>
                        <div className={`p-3 rounded-lg border ${viewRecord.warrantyExpiry ? 'bg-gray-50 border-gray-100' : 'bg-yellow-50 border-yellow-100'}`}>
                          <p className="text-lg font-medium text-gray-800">
                            {formatDate(viewRecord.warrantyExpiry) || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {viewRecord.supplier && (
                        <div className="space-y-2">
                          <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Supplier</p>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-lg font-medium text-gray-800">{viewRecord.supplier}</p>
                          </div>
                        </div>
                      )}

                      {viewRecord.status && (
                        <div className="space-y-2">
                          <p className="text-l font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-lg font-medium text-gray-800">{viewRecord.status}</p>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="px-6 py-4 bg-linear-to-r from-primary-50 to-primary-100 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Inventory;