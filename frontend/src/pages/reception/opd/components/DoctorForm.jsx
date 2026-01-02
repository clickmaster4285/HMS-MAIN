import React, { useState, useEffect } from 'react';
import { InputField, Checkbox } from '../../../../components/common/FormFields';
import { FormSection, FormGrid } from '../../../../components/common/FormSection';
import DoctorSelect from './DoctorSelect';
import PurposeInput from "./PurposeInput"
import { getExpectedTokenPrefix, detectPurposeCategory } from "../../../../utils/purposeOptions"
import { toast } from 'react-toastify';

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

   // State for manual consultation fee when no doctor is selected
   const [manualConsultationFee, setManualConsultationFee] = useState(
      formData.visitData.doctor ? 0 : (formData.visitData.doctorFee || 0)
   );

   // Calculate consultation fee based on whether doctor is selected
   // When doctor is selected, use doctor's fee; otherwise use manual consultation fee
   const doctorFee = formData.doctorDetails.fee || 0;
   const discount = formData.visitData.discount || 0;

   // Current consultation fee (will be saved as doctorFee in DB)
   const consultationFee = formData.visitData.doctor
      ? doctorFee
      : manualConsultationFee;

   // Calculate total fee after discount
   const totalFee = Math.max(0, consultationFee - discount);

   const amountPaid = formData.visitData.amountPaid || 0;
   const amountDue = Math.max(0, totalFee - amountPaid);

   // Update doctorFee in formData when consultation fee changes
   useEffect(() => {
      // Always save consultation fee to doctorFee field
      const feeToSave = formData.visitData.doctor ? doctorFee : manualConsultationFee;
      const discountValue = parseFloat(formData.visitData.discount) || 0;
      const totalFeeValue = Math.max(0, feeToSave - discountValue);

      // Update multiple fields at once
      handleChange({
         target: {
            name: 'visitData.doctorFee',
            value: feeToSave
         }
      });

      handleChange({
         target: {
            name: 'visitData.totalFee',
            value: totalFeeValue
         }
      });
   }, [doctorFee, manualConsultationFee, formData.visitData.doctor, formData.visitData.discount]);

   // Handle doctor selection change
   const handleDoctorChange = (selectedOption) => {
      onDoctorSelect(selectedOption);

      // Reset manual consultation fee when doctor is selected
      if (selectedOption) {
         setManualConsultationFee(0);
      }
   };

   // Handle discount change
   const handleDiscountChange = (e) => {
      const value = e.target.value;
      const numericValue = parseFloat(value) || 0;

      // Ensure discount doesn't exceed consultation fee
      if (numericValue > consultationFee) {
         // Auto-correct to maximum allowed discount
         toast.error(`Discount cannot exceed Rs. ${consultationFee}`);
         handleChange({
            target: {
               name: 'visitData.discount',
               value: consultationFee.toString()
            }
         });
      } else if (numericValue < 0) {
         // Ensure discount is not negative
         handleChange({
            target: {
               name: 'visitData.discount',
               value: '0'
            }
         });
      } else {
         handleChange(e);
      }
   };

   // Handle manual consultation fee change (when no doctor is selected)
   const handleManualConsultationFeeChange = (e) => {
      const value = e.target.value;
      const numericValue = parseFloat(value) || 0;

      if (numericValue < 0) {
         setManualConsultationFee(0);
      } else {
         setManualConsultationFee(numericValue);
      }
   };

   // Handle amount paid change
   const handleAmountPaidChange = (e) => {
      const value = e.target.value;
      const numericValue = parseFloat(value) || 0;

      // Ensure amount paid doesn't exceed total fee
      if (numericValue > totalFee) {
         // Auto-correct to maximum allowed amount
         toast.error(`Amount paid cannot exceed Rs. ${totalFee}`);
         handleChange({
            target: {
               name: 'visitData.amountPaid',
               value: totalFee.toString()
            }
         });
      } else if (numericValue < 0) {
         // Ensure amount paid is not negative
         handleChange({
            target: {
               name: 'visitData.amountPaid',
               value: '0'
            }
         });
      } else {
         handleChange(e);
      }
   };

   // Handle payment method change
   const handlePaymentMethodChange = (e) => {
      handleChange(e);

      // If payment method is cash and amount paid equals total fee, mark as paid
      if (e.target.value === 'cash' && amountPaid >= totalFee && totalFee > 0) {
         handleChange({
            target: {
               name: 'visitData.amountStatus',
               value: 'paid'
            }
         });
      }
   };

   return (
      <FormSection title="Visit Information">
         <PurposeInput
            name="visitData.purpose"
            label="Visit Purpose"
            icon="work"
            value={formData.visitData.purpose}
            onChange={handleChange}
            required={false}
            fullWidth
         />

         <DoctorSelect
            doctorsStatus={doctorsStatus}
            doctorOptions={doctorOptions}
            selectedDoctor={selectedDoctor}
            onDoctorChange={handleDoctorChange}
         />

         <FormGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <InputField
               name="visitData.disease"
               label="Disease/Condition"
               icon="health"
               value={formData.visitData.disease}
               onChange={handleChange}
               placeholder="Enter disease or condition"
               fullWidth
            />

            {/* ALWAYS show Consultation Fee field - behaves differently based on doctor selection */}
            {formData.visitData.doctor ? (
               // DOCTOR SELECTED - Show read-only consultation fee from doctor
               <InputField
                  label="Consultation Fee"
                  icon="dollar"
                  value={doctorFee ? `Rs. ${doctorFee}` : ""}
                  readOnly
               />
            ) : (
               // NO DOCTOR SELECTED - Show editable consultation fee field
               <InputField
                  name="manualConsultationFee"
                  label="Consultation Fee"
                  icon="dollar"
                  type="number"
                  value={manualConsultationFee}
                  onChange={handleManualConsultationFeeChange}
                  placeholder="Enter consultation fee"
                  min="0"
                  required={!formData.visitData.doctor}
               />
            )}

            {/* Discount field - works for both cases */}
            <InputField
               name="visitData.discount"
               label="Discount"
               icon="discount"
               type="number"
               value={discount}
               onChange={handleDiscountChange}
               placeholder="Enter discount"
               min="0"
               max={consultationFee}
               error={discount > consultationFee ? `Discount cannot exceed Rs. ${consultationFee}` : null}
               disabled={consultationFee === 0}
            />

            {/* Total Fee */}
            <InputField
               label="Total Fee"
               icon="dollar"
               value={totalFee ? `Rs. ${totalFee}` : "Rs. 0"}
               readOnly
               className="font-semibold"
            />

            <InputField
               name="visitData.amountPaid"
               label="Amount Paid"
               icon="dollar"
               type="number"
               value={amountPaid}
               onChange={handleAmountPaidChange}
               placeholder="Enter amount paid"
               min="0"
               max={totalFee}
               error={amountPaid > totalFee ? `Amount paid cannot exceed Rs. ${totalFee}` : null}
               disabled={totalFee === 0}
            />

            <InputField
               label="Amount Due"
               icon="dollar"
               value={amountDue ? `Rs. ${amountDue}` : "Rs. 0"}
               readOnly
               className={amountDue > 0 ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}
            />

            <InputField
               name="visitData.paymentMethod"
               label="Payment Method"
               icon="creditCard"
               type="select"
               value={formData.visitData.paymentMethod}
               onChange={handlePaymentMethodChange}
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