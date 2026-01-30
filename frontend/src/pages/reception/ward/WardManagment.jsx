import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getallDepartments } from '../../../features/department/DepartmentSlice';
import { getAllStaff } from '../../../features/staff/staffslice';
import {
  createWard,
  clearWardState,
  getAllWards,
  updateWardById,
  deleteWard,
} from '../../../features/ward/Wardslice';
import WardModal from './WardModal';
import BedManagementModal from './BedManagementModal';
import { toast } from 'react-toastify';
import { useCallback } from 'react';

const WardManagement = () => {
  const dispatch = useDispatch();
  const { departments } = useSelector((state) => state.department);
  const { staffList } = useSelector((state) => state.staff);
  const {
    allWards,
    loading: isCreatingWard,
    error: createError,
    successMessage,
    fetchStatus: wardsLoadingStatus,
    fetchError: loadError,
    deleteStatus: deleteStatus,
    deleteError
  } = useSelector((state) => state.ward);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [isCreatingNewWard, setIsCreatingNewWard] = useState(true);
  const [wardDetails, setWardDetails] = useState({
    name: '',
    department: '',
    wardNumber: null,
    bedCount: null,
    nurses: []
  });
  const [departmentNurses, setDepartmentNurses] = useState([]);

  useEffect(() => {
    dispatch(getAllWards());
    dispatch(getallDepartments());
    dispatch(getAllStaff());
  }, [dispatch]);

  useEffect(() => {
    if (wardDetails.department) {
      const nurses = staffList.filter(staff =>
        staff.department === wardDetails.department &&
        staff.staffType === 'Nurse'
      );
      setDepartmentNurses(nurses);
    } else {
      setDepartmentNurses([]);
    }
  }, [wardDetails.department, staffList]);

  // In WardManagement.jsx
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setWardDetails(prev => ({
      ...prev,
      [name]: name === 'wardNumber' || name === 'bedCount'
        ? (value === '' ? null : Number(value))
        : value
    }));
  }, []);

  // Update the handleAddWard function
  const handleAddWard = () => {
    if (!wardDetails.wardNumber || !wardDetails.department) {
      toast.error('Ward Number and Department are required');
      return;
    }

    // Ensure wardNumber is a number
    const wardNumber = parseInt(wardDetails.wardNumber);
    if (isNaN(wardNumber) || wardNumber < 1) {
      toast.error('Ward number must be a positive number');
      return;
    }

    const wardData = {
      name: wardDetails.name,
      department: wardDetails.department,
      wardNumber: wardNumber, // Send as number, not string
      bedCount: parseInt(wardDetails.bedCount) || 1,
      nurses: wardDetails.nurses || []
    };

    dispatch(createWard(wardData))
      .unwrap()
      .then((result) => {
        setIsModalOpen(false);
        resetWardDetails();
        dispatch(getAllWards());
        toast.success(result.message || 'Ward created successfully!');
      })
      .catch(error => {
        console.error('Failed to create ward:', error);
        const errorMessage = error?.message || 'Failed to create ward. Please try again.';
        toast.error(errorMessage);
      });
  };
  const handleUpdateWard = () => {
    if (!wardDetails._id) {
      console.error("Ward ID is missing");
      toast.error("Ward ID is missing");
      return;
    }

    // Prepare update data - only send changed fields
    const updateData = {
      name: wardDetails.name,
      department: wardDetails.department,
      wardNumber: wardDetails.wardNumber, // This should be the numeric part, not the full format
      bedCount: parseInt(wardDetails.bedCount) || 1,
      nurses: wardDetails.nurses || []
    };

    // Remove undefined or null values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    });

    dispatch(updateWardById({ id: wardDetails._id, wardData: updateData }))
      .unwrap()
      .then((result) => {
        setIsModalOpen(false);
        resetWardDetails();
        dispatch(getAllWards()); // Refresh the list
        toast.success(result.message || 'Ward updated successfully!');
      })
      .catch(error => {
        console.error('Failed to update ward:', error);
        const errorMessage = error?.message || 'Failed to update ward. Please try again.';
        toast.error(errorMessage);
      });
  };

  const handleDeleteWard = (wardId) => {
    if (window.confirm('Are you sure you want to delete this ward?')) {
      dispatch(deleteWard(wardId))
        .unwrap()
        .then(() => {
          dispatch(getAllWards());
        })
        .catch(error => {
          console.error('Failed to delete ward:', error);
          alert(error?.message || 'Failed to delete ward. Please try again.');
        });
    }
  };

  const resetWardDetails = () => {
    setWardDetails({
      name: '',
      department_Name: '',
      wardNumber: null,
      bedCount: null,
      nurses: []
    });
  };

  const handleAddNewWard = () => {
    setIsCreatingNewWard(true);
    resetWardDetails();
    setIsModalOpen(true);
  };

  const handleEditWard = (ward) => {
    setIsCreatingNewWard(false);
    setWardDetails({
      ...ward,
      nurses: ward.nurses || []
    });
    setIsModalOpen(true);
  };

  const handleViewBeds = (ward) => {
    setSelectedWard(ward);
    setIsBedModalOpen(true);
  };

  const calculateBedsStatus = (ward) => {
    if (!ward.beds) return { totalBeds: 0, availableBeds: 0, occupiedBeds: 0 };
    const totalBeds = ward.beds.length;
    const occupiedBeds = ward.beds.filter(bed => bed.occupied).length;
    const availableBeds = totalBeds - occupiedBeds;
    return { totalBeds, availableBeds, occupiedBeds };
  };

  useEffect(() => {
    if (successMessage || createError || loadError || deleteError) {
      const timer = setTimeout(() => dispatch(clearWardState()), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, createError, loadError, deleteError, dispatch]);

  return (
    <div className="">
      <div className="flex justify-between items-center text-white mb-8 bg-primary-600 p-4 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl font-bold">Ward Management</h1>
          <p className="mt-1">Manage hospital wards and their configurations</p>
        </div>
        <button
          onClick={handleAddNewWard}
          className="bg-white hover:bg-gray-200 text-primary-700 font-medium py-2 px-6 rounded-lg shadow-md transition flex items-center"
          disabled={wardsLoadingStatus === 'loading' || isCreatingWard}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Ward
        </button>
      </div>

      {/* Status messages and error displays */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
          {successMessage}
        </div>
      )}
      {createError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {typeof createError === 'object' ? createError.message : createError}
        </div>
      )}
      {loadError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {loadError}
        </div>
      )}
      {deleteError && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {deleteError}
        </div>
      )}

      {/* Wards table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table headers */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {wardsLoadingStatus === 'loading' ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center">
                    Loading wards...
                  </td>
                </tr>
              ) : allWards && allWards.length > 0 ? (
                allWards.map((ward) => {
                  const { totalBeds, availableBeds, occupiedBeds } = calculateBedsStatus(ward);
                  return (
                    <tr key={ward._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ward.department_Name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ward.wardNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ward.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-4">
                            <span className="text-xs font-medium text-gray-500">Total:</span>
                            <span className="ml-1 text-sm font-medium">{totalBeds}</span>
                          </div>
                          <div className="mr-4">
                            <span className="text-xs font-medium text-primary-500">Available:</span>
                            <span className="ml-1 text-sm font-medium">{availableBeds}</span>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-red-500">Occupied:</span>
                            <span className="ml-1 text-sm font-medium">{occupiedBeds}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 divide-x-2 divide-gray-400">
                          <button
                            onClick={() => handleViewBeds(ward)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditWard(ward)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteWard(ward._id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={deleteStatus === 'loading'}
                          >
                            {deleteStatus === 'loading' ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No wards found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <WardModal
          onClose={() => setIsModalOpen(false)}
          onAddWard={handleAddWard}
          onUpdateWard={handleUpdateWard}
          wardDetails={wardDetails}
          onInputChange={handleInputChange}
          departments={departments}
          departmentNurses={departmentNurses}
          isCreating={isCreatingNewWard}
          isProcessing={isCreatingWard}
        />
      )}

      {isBedModalOpen && selectedWard && (
        <BedManagementModal
          ward={selectedWard}
          onClose={() => setIsBedModalOpen(false)}
        />
      )}
    </div>
  );
};

export default WardManagement;