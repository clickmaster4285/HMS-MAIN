import React from 'react';
import { useNavigate } from 'react-router-dom';

const FormActions = ({ isLoading, handleSubmit, navigate, submitLabel }) => {
  return (
    <div className="flex justify-end gap-3 mt-6">
      <button
        type="button"
        className="px-4 py-2 border rounded border-gray-300 shadow-sm"
        onClick={() => navigate(-1)}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button
        type="button"
        className="px-4 py-2 rounded text-white disabled:opacity-60"
        style={{ backgroundColor: '#00897b' }}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : submitLabel}
      </button>
    </div>
  );
};

export default FormActions;
