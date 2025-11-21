import React from 'react';
import { Link } from 'react-router-dom';

const BillingHeader = ({ title, showBack = false }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">
        {showBack && (
          <Link to="/bills" className="mr-2 text-primary-600 hover:text-primary-800">
            &larr;
          </Link>
        )}
        {title}
      </h1>
      <div className="text-sm text-gray-600">
        {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default BillingHeader;