import React from 'react';
import { InputField, Checkbox } from '../../../../components/common/FormFields';
import { FormSection, FormGrid } from '../../../../components/common/FormSection';
import DoctorSelect from './DoctorSelect';

const DoctorForm = ({
   formData,
   handleChange,
   doctorsStatus,
   getFormattedDoctors,
   onDoctorSelect
}) => {
   const doctorOptions = doctorsStatus === 'loading'
      ? []
      : getFormattedDoctors().map(doctor => ({
         value: doctor.id,
         label: `${doctor.name} (${doctor.department}) - ${doctor.specialization}`,
         data: doctor
      }));

   const selectedDoctor = doctorOptions.find(option =>
      option.data.id === formData.visitData.doctor
   );

   const paymentMethods = [
      { value: 'cash', label: 'Cash' },
      { value: 'card', label: 'Card' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'online', label: 'Online' },
      { value: 'other', label: 'Other' }
   ];

   const totalFee = Math.max(0, (formData.doctorDetails.fee || 0) - (formData.visitData.discount || 0));
   const amountDue = Math.max(0, totalFee - (formData.visitData.amountPaid || 0));

   return (
      <FormSection title="Visit Information">
         <DoctorSelect
            doctorsStatus={doctorsStatus}
            doctorOptions={doctorOptions}
            selectedDoctor={selectedDoctor}
            onDoctorChange={onDoctorSelect}
         />

         <FormGrid className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
               name="visitData.purpose"
               label="Visit Purpose"
               icon="work"
               value={formData.visitData.purpose}
               onChange={handleChange}
               placeholder="Enter visit purpose"
               // required
               fullWidth
            />

            <InputField
               name="visitData.disease"
               label="Disease/Condition"
               icon="health"
               value={formData.visitData.disease}
               onChange={handleChange}
               placeholder="Enter disease or condition"
               fullWidth
            />

            {/* <InputField
               label="Doctor Gender"
               icon="man"
               value={formData.doctorDetails.gender}
               readOnly
            /> */}

            <InputField
               label="Qualification"
               icon="graduation"
               value={formData.doctorDetails.qualification}
               readOnly
            />

            <InputField
               label="Department"
               icon="work"
               value={formData.doctorDetails.department}
               readOnly
            />

            <InputField
               label="Specialization"
               icon="work"
               value={formData.doctorDetails.specialization}
               readOnly
            />

            <InputField
               label="Consultation Fee"
               icon="dollar"
               value={formData.doctorDetails.fee ? `Rs. ${formData.doctorDetails.fee}` : ""}
               readOnly
            />

            <InputField
               name="visitData.discount"
               label="Discount"
               icon="discount"
               type="number"
               value={formData.visitData.discount}
               onChange={handleChange}
               placeholder="Enter discount"
               min="0"
               max={formData.doctorDetails.fee || 0}
            />

            <InputField
               label="Total Fee"
               icon="dollar"
               value={totalFee ? `Rs. ${totalFee}` : ""}
               readOnly
               className="font-semibold"
            />

            <InputField
               name="visitData.amountPaid"
               label="Amount Paid"
               icon="dollar"
               type="number"
               value={formData.visitData.amountPaid}
               onChange={handleChange}
               placeholder="Enter amount paid"
               min="0"
               max={totalFee}
            />

            <InputField
               label="Amount Due"
               icon="dollar"
               value={amountDue ? `Rs. ${amountDue}` : ""}
               readOnly
               className={amountDue > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}
            />

            <InputField
               name="visitData.paymentMethod"
               label="Payment Method"
               icon="creditCard"
               type="select"
               value={formData.visitData.paymentMethod}
               onChange={handleChange}
               options={paymentMethods}
            />

            <Checkbox
               name="visitData.verbalConsentObtained"
               label="Verbal Consent Obtained"
               checked={formData.visitData.verbalConsentObtained}
               onChange={handleChange}
            />

         </FormGrid>
      </FormSection>
   );
};

export default DoctorForm;