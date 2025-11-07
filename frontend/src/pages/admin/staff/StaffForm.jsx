import React from 'react';
import { FormSection, FormGrid } from '../../../components/common/FormSection';
import {
  InputField,
  RadioGroup,
} from '../../../components/common/FormFields';
import DatePickerField from "../../../components/common/DatePickerField";
import TimePickerField from "../../../components/common/TimePickerField";
import SelectField from "../../../components/common/SelectField";
import {
  FaUser, FaEnvelope, FaPhone, FaIdCard, FaLock, FaMapMarkerAlt, FaBriefcase, FaUserTie, FaBuilding, FaGraduationCap, FaVenusMars, FaTint, FaClock, FaUserCircle, FaUsers, FaMobileAlt
} from 'react-icons/fa';

const StaffForm = ({
  formData,
  handleChange,
  handleNestedChange,
  handleArrayChange,
  departments,
  isEditing
}) => {
  const staffRoles = [
    { value: 'Receptionist', label: 'Receptionist' },
    { value: 'Lab', label: 'Lab' },
    { value: 'Radiology', label: 'Radiology' },
    { value: 'Nurse', label: 'Nurse' }
  ];

  const shifts = ['Morning', 'Evening', 'Night', 'Rotational'];

  return (
    <div className="space-y-6">
      <FormSection title="Basic Information">
        <FormGrid>
          <InputField
            name="user_Name"
            label="Full Name"
            value={formData.user_Name}
            onChange={handleChange}
            icon={<FaUser className="text-gray-400" />}
            placeholder="Enter full name"
            required
          />
          <InputField
            name="user_Email"
            label="Email"
            type="email"
            value={formData.user_Email}
            onChange={handleChange}
            icon={<FaEnvelope className="text-gray-400" />}
            placeholder="example@hospital.com"
          />
          <InputField
            name="user_Contact"
            label="Phone"
            value={formData.user_Contact}
            onChange={handleChange}
            icon={<FaPhone className="text-gray-400" />}
            placeholder="03001234567"
            required
          />
          <InputField
            name="user_CNIC"
            label="CNIC"
            value={formData.user_CNIC}
            onChange={handleChange}
            icon={<FaIdCard className="text-gray-400" />}
            placeholder="42201-1234567-1"
            required
          />
          <InputField
            name="user_Password"
            label={isEditing ? "New Password (leave blank to keep current)" : "Password"}
            type="password"
            value={formData.user_Password}
            onChange={handleChange}
            icon={<FaLock className="text-gray-400" />}
            placeholder={isEditing ? "Enter new password" : "Create a password"}
            required={!isEditing} // Required only for new staff
          />
          <InputField
            name="user_Address"
            label="Address"
            value={formData.user_Address}
            onChange={handleChange}
            icon={<FaMapMarkerAlt className="text-gray-400" />}
            placeholder="Street, City, Country"
          />
        </FormGrid>
      </FormSection>

      <FormSection title="Professional Information">
        <FormGrid>
          <SelectField
            name="user_Access"
            label="Role"
            value={formData.user_Access}
            onChange={handleChange}
            options={staffRoles}
            icon={<FaUserTie className="text-gray-400" />}
            placeholder="Select staff role"
            required
          />
          <InputField
            name="designation"
            label="Designation"
            value={formData.designation}
            onChange={handleChange}
            icon={<FaBriefcase className="text-gray-400" />}
            placeholder="e.g. Senior Nurse"
          />
          <SelectField
            name="department"
            label="Department"
            value={formData.department}
            onChange={handleChange}
            options={departments.map(dept => dept.name)}
            icon={<FaBuilding className="text-gray-400" />}
            placeholder="Select department"
            required
          />
          <InputField
            name="qualifications"
            label="Qualifications"
            value={formData.qualifications.join(', ')}
            onChange={(e) => handleArrayChange('qualifications', e.target.value)}
            icon={<FaGraduationCap className="text-gray-400" />}
            placeholder="MBBS, FCPS (comma separated)"
          />
        </FormGrid>
      </FormSection>

      <FormSection title="Personal Details">
        <FormGrid>
          <RadioGroup
            name="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]}
            icon={<FaVenusMars className="text-gray-400" />}
          />
          <DatePickerField
            name="dateOfBirth"
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(value) => handleChange({ target: { name: 'dateOfBirth', value } })}
            placeholder="Select birth date"
          />

          <SelectField
            name="shift"
            label="Shift"
            value={formData.shift}
            onChange={handleChange}
            options={shifts}
            icon={<FaClock className="text-gray-400" />}
            placeholder="Select shift"
          />
        </FormGrid>
      </FormSection>

      <FormSection title="Shift Timing">
        <FormGrid>
          <TimePickerField
            name="shiftTiming.start"
            label="Start Time"
            value={formData.shiftTiming.start}
            onChange={(value) => handleNestedChange('shiftTiming', 'start', value)}
            placeholder="Select start time"
          />
          <TimePickerField
            name="shiftTiming.end"
            label="End Time"
            value={formData.shiftTiming.end}
            onChange={(value) => handleNestedChange('shiftTiming', 'end', value)}
            placeholder="Select end time"
          />
        </FormGrid>
      </FormSection>

      <FormSection title="Emergency Contact">
        <FormGrid>
          <InputField
            name="emergencyContact.name"
            label="Name"
            value={formData.emergencyContact.name}
            onChange={(e) => handleNestedChange('emergencyContact', 'name', e.target.value)}
            icon={<FaUserCircle className="text-gray-400" />}
            placeholder="Emergency contact name"
          />
          <InputField
            name="emergencyContact.relation"
            label="Relation"
            value={formData.emergencyContact.relation}
            onChange={(e) => handleNestedChange('emergencyContact', 'relation', e.target.value)}
            icon={<FaUsers className="text-gray-400" />}
            placeholder="e.g. Father, Mother, Spouse"
          />
          <InputField
            name="emergencyContact.phone"
            label="Phone"
            value={formData.emergencyContact.phone}
            onChange={(e) => handleNestedChange('emergencyContact', 'phone', e.target.value)}
            icon={<FaMobileAlt className="text-gray-400" />}
            placeholder="Emergency contact number"
          />
        </FormGrid>
      </FormSection>
    </div>
  );
};

export default StaffForm;