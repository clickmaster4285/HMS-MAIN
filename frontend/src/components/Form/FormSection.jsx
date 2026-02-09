// src/components/common/Form/FormSection.jsx
import React from 'react';
import PropTypes from 'prop-types';
import FormHeader from './FormHeader';

const FormSection = ({ 
  title, 
  children, 
  showHeader = false,
  headerProps,
  sectionClass = 'mb-8'
}) => (
  <div className={sectionClass}>
    {showHeader ? (
      <FormHeader title={title} {...headerProps} />
    ) : (
      <div className="flex items-center mb-6">
        <div className="h-10 w-1 bg-primary-600 mr-3 rounded-full" />
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
    )}
    {children}
  </div>
);

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showHeader: PropTypes.bool,
  headerProps: PropTypes.object,
  sectionClass: PropTypes.string
};

export default FormSection;