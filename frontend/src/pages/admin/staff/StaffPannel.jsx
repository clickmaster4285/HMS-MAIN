import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import {
  getAllStaff,
  softDeleteStaff,
  restoreStaff,
  getDeletedStaff
} from '../../../features/staff/Staffslice';
import DataTable from '../../../components/common/DataTable';
import TabNavigation from '../../../components/common/TabNavigation';
import Modal from '../../../components/common/Modal';
import { getRoleRoute } from "../../../utils/getRoleRoute";

const StaffListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    staffList,
    deletedStaffList,
    loading,
    error,
  } = useSelector((state) => state.staff);
// console.log("Staff List:", staffList);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: null,
  });

  useEffect(() => {
    if (activeTab === 'active') {
      dispatch(getAllStaff());
    } else {
      dispatch(getDeletedStaff());
    }
  }, [dispatch, activeTab]);



  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      message: 'Are you sure you want to delete this staff member?',
      onConfirm: async () => {
        try {
          await dispatch(softDeleteStaff(id));
          dispatch(getAllStaff());
        } catch {
          toast.error('Failed to delete staff');
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  const handleRestore = (id) => {
    setConfirmModal({
      isOpen: true,
      message: 'Are you sure you want to restore this staff member?',
      onConfirm: async () => {
        try {
          await dispatch(restoreStaff(id));
          dispatch(getDeletedStaff());
        } catch {
          toast.error('Failed to restore staff');
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
      }
    });
  };

  const handleEdit = (id) => {
    navigate(getRoleRoute(`staff/edit/${id}`));
  };

  const handleAddNew = () => {
    navigate(getRoleRoute('staff/new'));
  };

  const filteredStaff = (activeTab === 'active' ? staffList : deletedStaffList).filter(staff =>
    staff.user?.user_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.user?.user_Contact?.includes(searchTerm) ||
    (staff.user?.user_Email && staff.user.user_Email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
     {
      field: 'userid',
      header: 'User Id',
      render: (row) => row.user?.user_Identifier || 'N/A'
    },
    {
      field: 'name',
      header: 'Name',
      render: (row) => row.user?.user_Name || 'N/A'
    },
    {
      field: 'email',
      header: 'Email',
      render: (row) => row.user?.user_Email || 'N/A'
    },
    {
      field: 'phone',
      header: 'Phone',
      render: (row) => row.user?.user_Contact || 'N/A'
    },
    {
      field: 'department',
      header: 'Department',
      render: (row) => row.department || 'N/A'
    },
    {
      field: 'designation',
      header: 'Designation',
      render: (row) => row.designation || 'N/A'
    },
    {
      field: 'role',
      header: 'Role',
      render: (row) => row.user?.user_Access || 'N/A'
    },
    {
      field: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex space-x-4">
          {activeTab === 'active' ? (
            <>
              <button
                onClick={() => handleEdit(row._id)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={() => handleDelete(row._id)}
                className="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <FaTrash size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleRestore(row._id)}
              className="text-green-600 hover:text-green-800"
              title="Restore"
            >
              <FaUndo size={18} />
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <div className="bg-primary-600 rounded-md text-white px-6 py-8 mb-6 shadow-md">
        <div className="max-w-9xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold">Staff Management</h1>
                <p className="text-primary-100 mt-1">
                  {activeTab === 'active' ? 'Manage all active staff members' : 'View and restore deleted staff members'}
                </p>
              </div>
            </div>
            {activeTab === 'active' && (
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-white text-primary-600 rounded-md hover:bg-primary-50 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add New Staff</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <TabNavigation
        tabs={[
          { id: 'active', label: 'Active Staff' },
          { id: 'deleted', label: 'Deleted Staff' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder={`Search ${activeTab === 'active' ? 'active' : 'deleted'} staff...`}
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DataTable
        data={filteredStaff}
        columns={columns}
        loading={loading}
        emptyMessage={`No ${activeTab === 'active' ? 'active' : 'deleted'} staff members found`}
      />

      <Modal
        isOpen={confirmModal.isOpen}
        title="Confirm Action"
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      >
        <p className="mb-4">{confirmModal.message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={confirmModal.onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StaffListPage;