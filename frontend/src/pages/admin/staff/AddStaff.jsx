import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createStaff,
  updateStaff,
  getStaffById,
  clearError,
  clearSuccessMessage
} from '../../../features/staff/Staffslice';

import { getallDepartments } from '../../../features/department/DepartmentSlice';
import StaffForm from './StaffForm';
import { getRoleRoute } from "../../../utils/getRoleRoute";

const StaffFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { staffDetails, loading, error, successMessage } = useSelector((state) => state.staff);
  const { departments } = useSelector((state) => state.department);

  const initialFormData = {
    user_Name: '',
    user_Email: '',
    user_Contact: '',
    user_Address: '',
    user_CNIC: '',
    user_Password: '',
    user_Access: '',
    designation: '',
    department: '',
    qualifications: [],
    gender: '',
    dateOfBirth: '',
    emergencyContact: {
      name: '',
      relation: '',
      phone: ''
    },
    shift: '',
    shiftTiming: {
      start: '',
      end: ''
    }
  };

  const [formData, setFormData] = useState(initialFormData);

  // Utility functions
  const validateCNIC = (cnic) => /^\d{5}-\d{7}-\d{1}$/.test(cnic);
  const validatePhone = (phone) => /^03\d{2}-\d{7}$/.test(phone);

  useEffect(() => {
    dispatch(getallDepartments());

    if (isEditing) {
      dispatch(getStaffById(id));
    }
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && staffDetails) {
      const formattedData = {
        user_Name: staffDetails.user?.user_Name || '',
        user_Email: staffDetails.user?.user_Email || '',
        user_Password: '', // Keep empty for security in edit mode
        user_Contact: staffDetails.user?.user_Contact || '',
        user_Address: staffDetails.user?.user_Address || '',
        user_CNIC: staffDetails.user?.user_CNIC || '',
        user_Access: staffDetails.user?.user_Access || '',
        designation: staffDetails.designation || '',
        department: staffDetails.department || '',
        qualifications: staffDetails.qualifications || [],
        gender: staffDetails.gender || '',
        dateOfBirth: staffDetails.dateOfBirth ?
          new Date(staffDetails.dateOfBirth).toISOString().split('T')[0] : '',
        shift: staffDetails.shift || '',
        shiftTiming: {
          start: staffDetails.shiftTiming?.start || '',
          end: staffDetails.shiftTiming?.end || ''
        },
        emergencyContact: staffDetails.emergencyContact || {
          name: '',
          relation: '',
          phone: ''
        }
      };
      setFormData(formattedData);
    }
  }, [isEditing, staffDetails]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
      dispatch(clearError());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearSuccessMessage());
    }
  }, [error, successMessage, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'user_CNIC') {
      if (value.replace(/-/g, '').length > 13) return;

      const formattedCNIC = value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d{0,7})(\d{0,1})/, (_, p1, p2, p3) => {
          let result = p1;
          if (p2) result += `-${p2}`;
          if (p3) result += `-${p3}`;
          return result;
        });
      setFormData(prev => ({ ...prev, [name]: formattedCNIC }));
      return;
    }

    if (name === 'user_Contact') {
      if (value.replace(/-/g, '').length > 11) return;

      const formattedPhone = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(\d{0,7})/, (_, p1, p2) => p2 ? `${p1}-${p2}` : p1);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (field, subfield, value) => {
    if (field === 'emergencyContact' && subfield === 'name' && /\d/.test(value)) {
      toast.error("Name cannot contain numbers");
      return;
    }

    if (field === 'emergencyContact' && subfield === 'phone') {
      if (value.replace(/-/g, '').length > 11) return;

      const formattedPhone = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(\d{0,7})/, (_, p1, p2) => p2 ? `${p1}-${p2}` : p1);
      value = formattedPhone;
    }

    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value
      }
    }));
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add password validation
    if (!isEditing && (!formData.user_Password || formData.user_Password.length < 2)) {
      toast.error("Password must be at least 2 characters long");
      return;
    }

    if (isEditing && formData.user_Password && formData.user_Password.length < 2) {
      toast.error("New password must be at least 2 characters long");
      return;
    }

    // Validate CNIC
    if (!validateCNIC(formData.user_CNIC)) {
      toast.error("Invalid CNIC format. Expected format: 12345-1234567-1");
      return;
    }

    // Validate Phone
    if (!validatePhone(formData.user_Contact)) {
      toast.error("Invalid phone format. Expected format: 0300-1234567");
      return;
    }

    // Validate Emergency Contact Phone
    if (formData.emergencyContact.phone && !validatePhone(formData.emergencyContact.phone)) {
      toast.error("Invalid emergency contact phone format. Expected format: 0300-1234567");
      return;
    }

    // Validate Shift Timing
    if (formData.shiftTiming.start && formData.shiftTiming.end) {
      const parseTime = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;
        if (period === 'PM' && hours < 12) totalMinutes += 12 * 60;
        if (period === 'AM' && hours === 12) totalMinutes -= 12 * 60;
        return totalMinutes;
      };

      const startMins = parseTime(formData.shiftTiming.start);
      const endMins = parseTime(formData.shiftTiming.end);
      const effectiveEndMins = endMins < startMins ? endMins + (24 * 60) : endMins;

      if (effectiveEndMins <= startMins) {
        toast.error("End time must be after start time");
        return;
      }
    }

    // Validate Date of Birth
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();

      if (isNaN(dob.getTime())) {
        toast.error("Please enter a valid date of birth");
        return;
      }

      if (dob > today) {
        toast.error("Date of birth cannot be in the future");
        return;
      }
    }

    const convertTo24Hour = (time12h) => {
      if (!time12h) return null;
      const [time, period] = time12h.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours, 10);
      minutes = minutes || '00';
      if (period === 'PM' && hours < 12) hours += 12;
      else if (period === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    const submissionData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth || null,
      shiftTiming: {
        start: formData.shiftTiming.start ? convertTo24Hour(formData.shiftTiming.start) : null,
        end: formData.shiftTiming.end ? convertTo24Hour(formData.shiftTiming.end) : null,
      },
      user_Email: formData.user_Email || undefined,
    };

    try {
      let result;
      if (isEditing) {
        result = await dispatch(updateStaff({ id, staffData: submissionData }));
      } else {
        result = await dispatch(createStaff(submissionData));
      }

      if (result.error) {
        const errorPayload = result.payload;
        if (errorPayload?.errorType === 'DUPLICATE_KEY') {
          toast.error(`This ${errorPayload.field} is already registered`);
        } else if (errorPayload?.message) {
          toast.error(errorPayload.message);
        } else {
          toast.error("Operation failed. Please try again.");
        }
      } else if (result.payload?.success) {
        toast.success(isEditing ? "Staff updated successfully" : "Staff created successfully");
        navigate(getRoleRoute('staff'));
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || "An unexpected error occurred");
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="">
      <div className="bg-primary-600 rounded-md text-white px-6 py-8 mb-6 shadow-md">
        <div className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-1 bg-primary-300 mr-4 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold">
                  {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h1>
                <p className="text-primary-100 mt-1">
                  {isEditing ? 'Update staff details and information' : 'Add new staff member to the system'}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-white text-primary-600 rounded-md hover:bg-primary-50 transition-colors duration-200 font-medium"
            >
              Back to Staff List
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <StaffForm
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            handleArrayChange={handleArrayChange}
            departments={departments}
            isEditing={isEditing}
          />
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Staff' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffFormPage;