import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDepartment, getallDepartments, updatedepartmentbyid } from '../../../features/department/DepartmentSlice';

const DepartmentManagement = () => {
  const dispatch = useDispatch();
  const departments = useSelector(state => state.department.departments) || [];
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    status: 'active',
    servicesOffered: '',
  });

  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getallDepartments());
  }, [dispatch]);



const filteredDepts = Array.isArray(departments)
  ? departments.filter(dept =>
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const preparedData = {
      ...formData,
      servicesOffered: formData.servicesOffered.split(',').map(item => item.trim()),
    };

    if (editMode) {
      dispatch(updatedepartmentbyid({ id: currentId, updatedData: preparedData }))
        .then(() => {
          dispatch(getallDepartments());
          resetForm();
        });
    } else {
      dispatch(createDepartment(preparedData))
        .then(() => {
          dispatch(getallDepartments());
          resetForm();
        });
    }
  };


  const handleEdit = (dept) => {
    setFormData({
      name: dept.name || '',
      description: dept.description || '',
      location: dept.location || '',
      status: dept.status || 'active',
      servicesOffered: dept.servicesOffered?.join(', ') || '',
    });
    setEditMode(true);
    setCurrentId(dept._id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      status: 'active',
      servicesOffered: '',
    });
    setEditMode(false);
    setCurrentId(null);
    setShowForm(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-primary-600 rounded-md text-white px-6 py-8 text-center shadow-md">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center">
            <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold">Hospital Departments</h1>
              <p className="text-primary-100 mt-1">Manage all hospital departments and their details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add */}
      <div className="max-w-9xl mx-auto px-6 py-8">
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
                placeholder="Search departments..."
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
              {showForm ? 'Cancel' : 'Add Department'}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editMode ? 'Edit Department' : 'Add New Department'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fields */}
                {/* Each Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Department Name*</label>
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


                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>



                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="servicesOffered" className="block text-sm font-medium text-gray-700 mb-1">Services Offered*</label>
                  <input
                    type="text"
                    id="servicesOffered"
                    name="servicesOffered"
                    value={formData.servicesOffered}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  {editMode ? 'Update Department' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-center">
              <tr>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Services</th>
                <th className="px-6 py-3 ">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-center">
              {filteredDepts.map((dept) => (
                <tr key={dept._id}>
                  <td className="px-6 py-4">{dept.name}</td>
                  <td className="px-6 py-4">{dept.location}</td>
                  <td className="px-6 py-4">{dept.status}</td>
                  <td className="px-6 py-4">
                    {dept.servicesOffered?.map(service => (
                      <span key={service} className="bg-primary-100 text-primary-800 text-xs mx-0.5 px-2 py-1 rounded">{service}</span>
                    ))}
                  </td>
                  <td className="px-6 py-4 ">
                    <button onClick={() => handleEdit(dept)} className="text-edit-600 border p-1 rounded-b-2xl hover:underline mr-3">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;
