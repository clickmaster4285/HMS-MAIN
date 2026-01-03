import React from 'react';
import { InputField } from '../../../../components/common/FormFields';
import { FormSection, FormGrid } from '../../../../components/common/FormSection';
import AgeInput from './AgeInput';

const PatientForm = ({ formData, handleChange, mode, validGenders, validBloodTypes, validMaritalStatuses }) => {
   const guardianRelations = ["Father", "Mother", "Sibling", "Spouse", "Uncle", "Aunt", "Grandfather", "Grandmother", "Other"];

   const handleAgeChange = (age) => {
      // Update form data with new age
      handleChange({
         target: { name: 'patient_Age', value: age }
      });
   };

   const handleDOBChange = (dob) => {
      // Update form data with new DOB
      handleChange({
         target: { name: 'patient_DateOfBirth', value: dob }
      });
   };

   return (
      <FormSection title="Patient Information">
         <FormGrid>
            <InputField
               name="patient_MRNo"
               label="MR Number"
               icon="idCard"
               value={formData.patient_MRNo}
               onChange={handleChange}
               placeholder="Auto-generated MR Number"
               readOnly
            />

            <InputField
               name="patient_Name"
               label="Patient Name"
               icon="user"
               value={formData.patient_Name}
               onChange={handleChange}
               placeholder="Enter Patient Name"
               required
            />

            <div className="col-span-1 lg:col-span-2">
               <AgeInput
                  age={formData.patient_Age}
                  dob={formData.patient_DateOfBirth}
                  onAgeChange={handleAgeChange}
                  onDOBChange={handleDOBChange}
               />
            </div>

            {/* <InputField
               name="patient_DateOfBirth"
               label="Date of Birth"
               icon="calendar"
               type="date"
               value={formData.patient_DateOfBirth}
               max={new Date().toISOString().split('T')[0]}
               onChange={handleChange}
            />

            <InputField
               name="patient_Age"
               label="Age"
               icon="number"
               value={formData.patient_Age}
               onChange={handleChange}
               placeholder="Age will auto-calculate"
               readOnly
            /> */}

            <InputField
               name="patient_ContactNo"
               label="Patient Contact"
               icon="number"
               type="tel"
               value={formData.patient_ContactNo}
               onChange={handleChange}
               placeholder="03XX-XXXXXXX"
               required
            />

            <InputField
               name="patient_Guardian.guardian_Name"
               label="Guardian Name"
               icon="team"
               value={formData.patient_Guardian.guardian_Name}
               onChange={handleChange}
               placeholder="Enter Guardian Name"
            />

            <InputField
               name="patient_Guardian.guardian_Relation"
               label="Guardian Relation"
               icon="team"
               type="select"
               value={formData.patient_Guardian.guardian_Relation}
               onChange={handleChange}
               options={guardianRelations}
               placeholder="Select Relation"
            />

            <InputField
               name="patient_CNIC"
               label="CNIC Number"
               icon="idCard"
               value={formData.patient_CNIC}
               onChange={handleChange}
               placeholder="XXXXX-XXXXXXX-X"
            />

            <InputField
               name="patient_Guardian.guardian_Contact"
               label="Guardian Contact"
               icon="number"
               type="tel"
               value={formData.patient_Guardian.guardian_Contact}
               onChange={handleChange}
               placeholder="03XX-XXXXXXX"
            />

            <InputField
               name="patient_Gender"
               label="Gender"
               icon="man"
               type="select"
               value={formData.patient_Gender}
               onChange={handleChange}
               options={validGenders}
               placeholder="Select Gender"
            />

            <InputField
               name="patient_Address"
               label="Address"
               icon="home"
               value={formData.patient_Address}
               onChange={handleChange}
               placeholder="Enter Full Address"
               fullWidth
            />

            <InputField
               name="patient_MaritalStatus"
               label="Marital Status"
               icon="ring"
               type="select"
               value={formData.patient_MaritalStatus}
               onChange={handleChange}
               options={validMaritalStatuses}
               placeholder="Select Marital Status"
            />

            <InputField
               name="patient_BloodType"
               label="Blood Group"
               icon="heartbeat"
               type="select"
               value={formData.patient_BloodType}
               onChange={handleChange}
               options={validBloodTypes}
               placeholder="Select Blood Group"
            />

            <InputField
               name="visitData.referredBy"
               label="Referred By"
               icon="health"
               value={formData.visitData.referredBy}
               onChange={handleChange}
               placeholder="Enter Referral Name (if any)"
               fullWidth
            />
         </FormGrid>
      </FormSection>
   );
};

export default PatientForm;