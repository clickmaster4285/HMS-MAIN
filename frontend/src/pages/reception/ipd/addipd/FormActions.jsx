// FormActions.js - Updated
import React from 'react';
import { Button } from "../../../../components/common/Buttons";

const FormActions = ({
   onCancel,
   onSubmit,
   onSaveAndPrint,
   isSubmitting,
   mode = "create"
}) => {
   return (
      <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
         <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isSubmitting}
         >
            Cancel
         </Button>

         {mode === "create" && onSaveAndPrint && (
            <Button
               type="button"
               onClick={onSaveAndPrint}
               variant="secondary"
               disabled={isSubmitting}
               isLoading={isSubmitting}
            >
               {isSubmitting ? "Saving..." : "Save & Print"}
            </Button>
         )}

         <Button
            type="submit"
            onClick={onSubmit}
            variant="primary"
            disabled={isSubmitting}
            isLoading={isSubmitting}
         >
            {isSubmitting
               ? (mode === "create" ? "Submitting..." : "Updating...")
               : (mode === "create" ? "Submit Admission" : "Update Admission")
            }
         </Button>
      </div>
   );
};

export default FormActions;