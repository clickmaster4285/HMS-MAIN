import React from 'react';

const ModeToggle = ({ mode, setMode }) => {
  return (
    <div className="flex gap-3 mb-5">
      <button
        type="button"
        className={`px-4 py-2 rounded ${
          mode === 'existing' ? 'bg-primary-700 text-white' : 'bg-gray-200'
        }`}
        onClick={() => setMode('existing')}
        disabled={mode === 'edit'}
      >
        Existing
      </button>
      <button
        type="button"
        className={`px-4 py-2 rounded ${
          mode === 'new' ? 'bg-primary-700 text-white' : 'bg-gray-200'
        } `}
        onClick={() => setMode('new')}
        disabled={mode === 'edit'}
      >
        New
      </button>
    </div>
  );
};

export default ModeToggle;
