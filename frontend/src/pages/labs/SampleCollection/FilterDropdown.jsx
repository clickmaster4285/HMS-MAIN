import React, { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';

const FilterDropdown = ({ view, setView }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { label: 'Pending Collection', value: 'Pending' },
    { label: 'Collected Samples', value: 'Collected' },
    { label: 'Recollection Requests', value: 'Re-Collection' },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition-all duration-200 ${
          open ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-300'
        }`}
      >
        <Filter size={18} className={`transition-colors ${open ? 'text-primary-600' : 'text-gray-600'}`} />
        <span className="text-sm font-medium text-gray-700">
          {options.find((opt) => opt.value === view)?.label || 'Filter'}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 animate-fade-in-up transition-all duration-200">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                setView(option.value);
                setOpen(false);
              }}
              className={`px-5 py-3 cursor-pointer transition-all duration-150 rounded-md mx-2 mt-2 hover:bg-primary-50 hover:text-primary-700 ${
                view === option.value ? 'bg-primary-100 text-primary-800 font-semibold' : 'text-gray-700'
              }`}
            >
              {option.label}
            </div>
          ))}
          <div className="h-2" />
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
