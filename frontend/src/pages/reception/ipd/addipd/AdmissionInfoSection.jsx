import React, { useEffect } from "react";
import { FormSection, FormGrid } from "../../../../components/common/FormSection";
import { InputField } from "../../../../components/common/FormFields";
import { useDispatch, useSelector } from "react-redux";
import { getallDepartments } from "../../../../features/department/DepartmentSlice";
import { getwardsbydepartmentId } from "../../../../features/ward/Wardslice";
import { fetchAllDoctors } from "../../../../features/doctor/doctorSlice"

const AdmissionInfoSection = ({ formData, handleChange }) => {
  const dispatch = useDispatch();
  const { departments, isLoading: deptLoading } = useSelector((state) => state.department);
  const { wardsByDepartment, isLoading: wardLoading } = useSelector((state) => state.ward);
  const selectedWard = wardsByDepartment.find(ward => ward._id === formData.wardId);
  // Add this to your component
  const { doctors, isLoading: doctorLoading } = useSelector((state) => state.doctor);
  // console.log(doctors)

  useEffect(() => {
    dispatch(fetchAllDoctors());
    dispatch(getallDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (formData.departmentId) {
      dispatch(getwardsbydepartmentId(formData.departmentId));
    }
  }, [formData.departmentId, dispatch]);

  const availableBeds = selectedWard?.beds?.length > 0
    ? selectedWard.beds
      .filter(bed => bed && !bed.occupied)
      .map(bed => ({
        value: bed?.bedNumber?.toString()?.trim() || '',
        label: `Bed ${bed?.bedNumber || ''}`,
        className: 'text-green-600'
      }))
    : [];

  const wardOptions = wardsByDepartment?.length > 0
    ? wardsByDepartment.map((ward) => ({
      value: ward._id,
      label: `${ward.name || 'Ward'} (${ward.wardNumber || 'No Number'}) - ${ward.beds?.filter(b => b && !b.occupied)?.length || 0
        }/${ward.beds?.length || 0} available`
    }))
    : [];

  const fieldConfig = [
    {
      name: "admissionDate",
      label: "Admission Date",
      type: "date",
      icon: "calendar",
      required: true,
    },
    {
      name: "admissionType",
      label: "Admission Type",
      type: "select",
      icon: "health",
      options: ["SSP", "Private", "PTCL", "State-Life"],
      required: true,
    },
    {
      name: "doctorId",
      label: "Doctor",
      type: "select",
      icon: "userMd",
      options: doctors.map((doctor) => ({
        value: doctor._id,
        label: doctor.user?.user_Name,
      })),
      // required: true,
      isLoading: doctorLoading,
      placeholder: "Select Doctor",
    },
    {
      name: "departmentId",
      label: "Department",
      type: "select",
      icon: "hospital",
      options: departments.map((dept) => ({
        value: dept._id,
        label: dept.name,
      })),
      required: true,
      placeholder: "Select Department",
      isLoading: deptLoading
    },
    {
      name: "wardId",
      label: "Ward",
      type: "select",
      icon: "home",
      options: wardOptions,
      required: true,
      disabled: !formData.departmentId || wardLoading,
      placeholder: formData.departmentId ? "Select Ward" : "Please select department first",
      isLoading: wardLoading
    },
    {
      name: "bedNumber",
      label: "Bed Number",
      type: "select",
      icon: "bed",
      options: availableBeds.length > 0
        ? availableBeds
        : [{
          value: "",
          key: "no-beds-option",
          label: formData.wardId ? "No available beds" : "Select ward first",
          disabled: true
        }],
      required: true,
      disabled: !formData.wardId || availableBeds.length === 0,
      placeholder: formData.wardId
        ? availableBeds.length > 0
          ? "Select Bed"
          : "No available beds"
        : "Please select ward first",
    },
    {
      name: "admissionFee",
      label: "Admission Fee",
      type: "number",
      icon: "dollar",
      placeholder: "Enter Admission Fee",
      required: true,
    },
    {
      name: "discount",
      label: "Discount",
      type: "number",
      icon: "discount",
      placeholder: "Enter Discount",
      min: "0",
      max: formData.admissionFee || 0,
    },
    {
      name: "totalFee",
      label: "Total Fee",
      type: "text",
      icon: "dollar",
      value: formData.totalFee ? `Rs. ${formData.totalFee}` : "Rs. 0",
      readOnly: true,
      className: "bg-gray-50 font-semibold",
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      icon: "dollar",
      options: ["Unpaid", "Partial", "Paid"],
      value: formData.paymentStatus || "Unpaid",
    },
  ];

  return (
    <FormSection title="Admission Information">
      <FormGrid>
        {fieldConfig.map((field) => (
          <InputField
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            value={field.value || formData[field.name]}
            onChange={handleChange}
            icon={field.icon}
            placeholder={field.placeholder}
            required={field.required}
            options={field.options}
            min={field.min}
            max={field.max}
            readOnly={field.readOnly}
            className={field.className}
            disabled={field.disabled}
            isLoading={field.isLoading}
          />
        ))}
      </FormGrid>
    </FormSection>
  );
};

export default AdmissionInfoSection;