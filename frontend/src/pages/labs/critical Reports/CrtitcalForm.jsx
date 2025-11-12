import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createCriticalResult,
  fetchCriticalResults,
  updateCriticalResult,
  deleteCriticalResult,
} from '../../../features/critcalResult/criticalSlice';
import PrintCriticalForm from './PrintCriticalForm';
import CriticalFormHeader from './CriticalFormHeader';
import CriticalResultsTable from './CriticalResultsTable';
import CriticalFormModal from './CriticalFormModal';

const CriticalForm = () => {
  const dispatch = useDispatch();
  const {
    criticalResults = [],
    loading,
    error,
    success,
  } = useSelector((state) => state.criticalResult);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [showPrintForm, setShowPrintForm] = useState(false);
  const [printData, setPrintData] = useState(null);

  useEffect(() => {
    dispatch(fetchCriticalResults());
  }, [dispatch]);

  useEffect(() => {
    if (success && !loading) {
      setIsModalOpen(false);
      setEditingResult(null);
    }
  }, [success, loading]);

  const openModal = (result = null) => {
    setEditingResult(result);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingResult(null);
  };

  const handleSubmit = (criticalResultData) => {
    if (editingResult) {
      dispatch(
        updateCriticalResult({
          id: editingResult._id,
          data: criticalResultData,
        })
      );
    } else {
      dispatch(createCriticalResult(criticalResultData));
    }
  };

  const handleDelete = (id) => {
    if (
      window.confirm('Are you sure you want to delete this critical result?')
    ) {
      dispatch(deleteCriticalResult(id));
    }
  };

  const handlePrint = (result) => {
    setPrintData(result);
    setShowPrintForm(true);
    setTimeout(() => {
      window.print();
      setShowPrintForm(false);
    }, 500);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto bg-white p-6 rounded-md shadow-md">
        <CriticalFormHeader onOpenModal={() => openModal()} />
        <CriticalResultsTable
          criticalResults={criticalResults}
          error={error}
          onEdit={openModal}
          onDelete={handleDelete}
          onPrint={handlePrint}
        />
        <CriticalFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          editingResult={editingResult}
        />
        {showPrintForm && printData && (
          <div className="fixed inset-0 z-50 bg-white p-8">
            <PrintCriticalForm
              form={printData}
              tests={printData.tests}
              labTechSignature={printData.labTechSignature}
              doctorSignature={printData.doctorSignature}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CriticalForm;
