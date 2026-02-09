import React, { useState, useEffect, use } from "react";
import { FaIdCard, FaSearch, } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createOperation, updateOperation, fetchAllOperations } from "../../../features/operationManagment/otSlice";
import { getIpdPatientByMrno } from "../../../features/ipdPatient/IpdPatientSlice";
import { toast } from 'react-toastify';
import { getallDepartments } from '../../../features/department/DepartmentSlice';
import { fetchDoctorsByDepartmentName } from '../../../features/doctor/doctorSlice';
import { InputField, MultiSelectField } from '../../../components/common/FormFields'
import { FormSection, FormGrid } from '../../../components/common/FormSection';
import { ButtonGroup, Button } from '../../../components/common/Buttons'
import { FaSave, FaEdit } from 'react-icons/fa';
// Constants
const anesthesiaTypes = ["General", "Regional", "Local", "Sedation"];
const surgeryTypes = ["Open", "Laparoscopic", "Endoscopic", "Robotic"];
const statusOptions = ["Scheduled", "In Progress", "Completed", "Cancelled"];
const paymentStatusOptions = ["Pending", "Partial", "Paid"];
const paymentMethods = ["Cash", "Card", "Insurance", "Bank Transfer"];

const OTForm = ({ operation, onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mrNo, setMrNo] = useState("");

  // Redux state
  const { isLoading: isOperationLoading, error: operationError } = useSelector(state => state.ot);
  const { currentPatient, isLoading: isPatientLoading, error: patientError } = useSelector((state) => state.ipdPatient);
  const { departments, isLoading: isDeptLoading } = useSelector(state => state.department);
  const { doctors = [], isLoading: isDoctorLoading } = useSelector(state => state.doctor);
  // Form state
  const [formData, setFormData] = useState({
    patient_MRNo: "",
    patient_Name: "",
    procedure: "",
    surgeon: "",
    department: "",
    otTime: { startTime: "", endTime: "" },
    otNumber: "",
    status: "Scheduled",
    otInformation: {
      operationName: "",
      reasonForOperation: "",
      doctor: {
        seniorSurgeon: [],
        assistantDoctors: [],
        nurses: [],
        doctors_Fee: 0,
        anesthesia_Type: "",
        operation_Date: "",
        surgery_Type: "",
        operation_Outcomes: "",
      },
      equipment_Charges: 0,
    },
    total_Operation_Cost: 0,
    operation_PaymentStatus: "Pending",
    payment_Method: ""
  });
  // Derived state
  // Filter doctors by type
  const seniorDoctors = doctors.filter(doctor =>
    ['senior doctor', 'surgeon'].includes(doctor.doctor_Type?.toLowerCase()));

  //   "General Doctor", "Consultant", "Surgeon", "Resident Doctor"
  const assistantDoctors = doctors.filter(doctor =>
    ['assistant doctor', 'internee doctor'].includes(doctor.doctor_Type?.toLowerCase()));

  // Effects
  useEffect(() => {
    dispatch(getallDepartments());
  }, [dispatch]);

  useEffect(() => {   // if some one select department then fetch doctors
    if (formData.department) {
      dispatch(fetchDoctorsByDepartmentName(formData.department))
    }
  }, [formData.department, dispatch]);

  useEffect(() => {
    if (currentPatient) {
      setFormData(prev => ({
        ...prev,
        patient_MRNo: currentPatient.patient_MRNo || "",
        patient_Name: currentPatient.patient_Name || "",
      }));
    }
  }, [currentPatient]);

  useEffect(() => {
    if (operation) {
      setFormData({
        ...operation,
        otInformation: {
          ...(operation.otInformation || {
            operationName: "",
            reasonForOperation: "",
            doctor: {
              seniorSurgeon: [],
              assistantDoctors: [],
              nurses: [],
              doctors_Fee: 0,
              anesthesia_Type: "",
              operation_Date: "",
              surgery_Type: "",
              operation_Outcomes: "",
            },
            equipment_Charges: 0,
          })
        },
      });
    }
  }, [operation]);

  // Helper functions
  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateNestedFormData = (path, updates) => {
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]] = { ...current[path[i]] };
      }

      current[path[path.length - 1]] = {
        ...current[path[path.length - 1]],
        ...updates
      };

      return newData;
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!mrNo) return;
    try {
      await dispatch(getIpdPatientByMrno(mrNo)).unwrap();
    } catch (error) {
      console.error("Failed to fetch patient:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleNestedChange = (path, e) => {
    const { name, value } = e.target;

    if (name === 'seniorSurgeon' || name === 'assistantDoctors') {
      updateNestedFormData([...path, name], Array.isArray(value) ? value : [value]);
    } else {
      updateNestedFormData([...path, name], value);
    }
  };

  const handleOperationNameChange = (e) => {
    setFormData(prev => ({
      ...prev,
      otInformation: {
        ...prev.otInformation,
        operationName: e.target.value
      }
    }));
  };

  const handleReasonChange = (e) => {
    setFormData(prev => ({
      ...prev,
      otInformation: {
        ...prev.otInformation,
        reasonForOperation: e.target.value
      }
    }));
  };

  // Update the time field handlers
  const handleTimeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      otTime: {
        ...prev.otTime,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const action = operation
        ? updateOperation({ mrno: operation.patient_MRNo, operationData: formData })
        : createOperation(formData);

      await dispatch(action).unwrap();
      toast.success(`Operation ${operation ? 'updated' : 'created'} successfully!`);
      dispatch(fetchAllOperations());
      onCancel();
    } catch (error) {
      console.error("Operation error:", error);
      toast.error(error.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDepartmentChange = async (e) => {
    const departmentName = e.target.value;
    setFormData(prev => ({
      ...prev,
      department: departmentName
    }));

    if (departmentName) {
      try {
        await dispatch(fetchDoctorsByDepartmentName(departmentName)).unwrap();
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        toast.error("Failed to load doctors for this department");
      }
    }
  };

  const handleDoctorFeeChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => {
      const newData = {
        ...prev,
        otInformation: {
          ...prev.otInformation,
          doctor: {
            ...prev.otInformation.doctor,
            doctors_Fee: value
          }
        }
      };

      // Calculate total using the new state values
      const total = value + (newData.otInformation.equipment_Charges || 0);
      return {
        ...newData,
        total_Operation_Cost: total
      };
    });
  };

  const handleEquipmentChargesChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData(prev => {
      const newData = {
        ...prev,
        otInformation: {
          ...prev.otInformation,
          equipment_Charges: value
        }
      };

      // Calculate total using the new state values
      const total = (newData.otInformation.doctor.doctors_Fee || 0) + value;
      return {
        ...newData,
        total_Operation_Cost: total
      };
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {operation ? 'Edit Operation' : 'New Operation Schedule'}
      </h2>

      <form onSubmit={handleSubmit}>

        <FormSection title="Search Patient">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="text-gray-400" />
              </div>
              <InputField
                type="text"
                value={mrNo}
                onChange={(e) => setMrNo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter MR Number (e.g., XXXXXXXX-XXXX)"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center"
              disabled={isPatientLoading}
            >
              {isPatientLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <> <FaSearch className="mr-2" /> Search </>
              )}
            </button>
          </div>
          {patientError && (
            <div className="mt-2 text-sm text-red-500">
              {patientError.message || "Failed to fetch patient"}
            </div>
          )}
        </FormSection>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Information */}
          <FormSection title="Patient Information">
            <FormGrid>
              <InputField name="patient_MRNo" label="MR Number" value={formData.patient_MRNo} onChange={handleChange} placeholder="XXXXXXXX-XXXX" icon="idCard" required readOnly />
              <InputField name="patient_Name" label="Patient Name" value={formData.patient_Name} onChange={handleChange} placeholder="Enter Patient Name" icon="user" required readOnly />
            </FormGrid>
          </FormSection>

          <FormSection title="Surgical Team">
            <FormGrid>
              <InputField name="department" label="Department" type="select" value={formData.department} onChange={handleDepartmentChange} options={departments.map(dept => dept.name)} required disabled={isDeptLoading} />

              <MultiSelectField name="seniorSurgeon" label="Senior Surgeons"
                value={Array.isArray(formData.otInformation.doctor.seniorSurgeon)
                  ? formData.otInformation.doctor.seniorSurgeon
                  : []}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    otInformation: {
                      ...prev.otInformation,
                      doctor: {
                        ...prev.otInformation.doctor,
                        seniorSurgeon: Array.isArray(e.target.value)
                          ? e.target.value
                          : [e.target.value]
                      }
                    }
                  }));
                }}
                options={seniorDoctors.map(doctor => ({
                  value: doctor.user.user_Name,
                  label: `${doctor.user.user_Name} (${doctor.doctor_Specialization})`
                }))}
                required
                disabled={isDoctorLoading || !formData.department}
              />

              <MultiSelectField name="assistantDoctors" label="Assistant Doctors"
                value={Array.isArray(formData.otInformation.doctor.assistantDoctors)
                  ? formData.otInformation.doctor.assistantDoctors
                  : []}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    otInformation: {
                      ...prev.otInformation,
                      doctor: {
                        ...prev.otInformation.doctor,
                        assistantDoctors: Array.isArray(e.target.value)
                          ? e.target.value
                          : [e.target.value]
                      }
                    }
                  }));
                }}
                options={assistantDoctors.map(doctor => ({
                  value: doctor.user.user_Name,
                  label: `${doctor.user.user_Name} (${doctor.doctor_Type})`
                }))}
                disabled={isDoctorLoading || !formData.department}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nurses</label>
                <input
                  type="text"
                  name="nurses"
                  value={formData.otInformation?.doctor?.nurses?.join(', ') || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    otInformation: {
                      ...prev.otInformation,
                      doctor: {
                        ...prev.otInformation.doctor,
                        nurses: e.target.value.split(',').map(item => item.trim())
                      }
                    }
                  }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Comma separated names"
                />
              </div>
            </FormGrid>
          </FormSection>

          {/* Scheduling */}
          <FormSection title="Scheduling">
            <FormGrid>
              <InputField name="otNumber" label="OT Number" value={formData.otNumber} onChange={handleChange} icon="number" required />

              <InputField name="operation_Date" label="Operation Date" type="date" icon="calendar" required
                value={formData.otInformation?.doctor?.operation_Date?.split('T')[0] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  otInformation: {
                    ...prev.otInformation,
                    doctor: {
                      ...prev.otInformation.doctor,
                      operation_Date: e.target.value
                    }
                  }
                }))} />

              <InputField type="time" name="startTime" label="Start Time" value={formData.otTime.startTime} onChange={(e) => handleTimeChange('startTime', e.target.value)} required />

              <InputField type="time" name="endTime" label="End Time" value={formData.otTime.endTime} onChange={(e) => handleTimeChange('endTime', e.target.value)} required />
            </FormGrid>
          </FormSection>

          <FormSection title="Operation Details">
            <FormGrid>
              <InputField name="anesthesia_Type" label="Anesthesia Type" type="select"
                value={formData.otInformation?.doctor?.anesthesia_Type || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  otInformation: {
                    ...prev.otInformation,
                    doctor: {
                      ...prev.otInformation.doctor,
                      anesthesia_Type: e.target.value
                    }
                  }
                }))} options={anesthesiaTypes} required />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Type*</label>
                <select
                  name="surgery_Type"
                  value={formData.otInformation?.doctor?.surgery_Type || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    otInformation: {
                      ...prev.otInformation,
                      doctor: {
                        ...prev.otInformation.doctor,
                        surgery_Type: e.target.value
                      }
                    }
                  }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                // required
                >
                  <option value="">Select Type</option>
                  {surgeryTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <InputField type="text" name="operationName" label="Operation Name" value={formData.otInformation.operationName || ''} onChange={handleOperationNameChange} required />

              <InputField type="text" name="reasonForOperation" label="Reason for Operation" value={formData.otInformation.reasonForOperation || ''} onChange={handleReasonChange} required />

            </FormGrid>
          </FormSection>

          {/* Financial Information */}
          <FormSection title="Financial Information">
            <FormGrid>
              <InputField type="number" name="doctor_Fee" label="Doctor's Fee (PKR)" icon="dollar" value={formData.otInformation?.doctor?.doctors_Fee || 0}
                onChange={handleDoctorFeeChange} />

              <InputField type="number" label="Equipment Charges (PKR)" icon="dollar" name="equipment_Charges" value={formData.otInformation?.equipment_Charges || 0} onChange={handleEquipmentChargesChange} />


              <InputField type="text" name="total_Operation_Cost" label="Total Cost (PKR)" value={formData.total_Operation_Cost} readOnly icon="dollar" />

              <InputField name="operation_PaymentStatus" label="Payment Status" type="select" value={formData.operation_PaymentStatus} onChange={handleChange} options={paymentStatusOptions} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  name="payment_Method"
                  value={formData.payment_Method}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Method</option>
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </FormGrid>
          </FormSection>

          <FormSection title="Additional Information" >
            <FormGrid>
              <InputField type="text" name="procedure" label="Procedure" value={formData.procedure} onChange={handleChange} required />

              <InputField name="status" label="Status" type="select" value={formData.status} onChange={handleChange} options={statusOptions} required />

              <InputField type="text" name="operation_Outcomes" label="Operation Outcomes" value={formData.otInformation?.doctor?.operation_Outcomes} onChange={handleChange} />

            </FormGrid>
          </FormSection>
        </div>
        {operationError && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {operationError.message || 'Operation failed'}
          </div>
        )}


        <ButtonGroup className="justify-end mt-8">
          <Button type="button" onClick={onCancel} variant="secondary" disabled={isOperationLoading}>Cancel</Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isOperationLoading || isPatientLoading}
            isSubmitting={isOperationLoading}
            icon={operation ? FaEdit : FaSave}
          >
            {operation ? 'Update Operation' : 'Save Operation'}
          </Button>
        </ButtonGroup>
      </form>
    </div>
  );

};

export default OTForm;