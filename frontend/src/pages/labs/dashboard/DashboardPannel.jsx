import React, { useEffect } from 'react';
import Header from './Header';
import TestSummaryCard from './TestSummaryCard';
import TestTypeOverview from './TestTypeOverview';
import AlertsList from './AlertsList';
import LabTechnicianSummary from './LabTechnicianSummary';
import { getTestHistory } from "../../../features/patientTest/patientTestSlice";
import { useSelector, useDispatch } from "react-redux";
import { motion } from 'framer-motion';

const DashboardPannel = () => {
  const { testHistory, stats, alerts } = useSelector((state) => state.patientTest);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTestHistory());
  }, [dispatch]);
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-6"
      >
        <TestSummaryCard data={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <TestTypeOverview testHistory={testHistory} />
          </div>
          <div>
            <AlertsList alerts={alerts} />
          </div>
        </div>
        <LabTechnicianSummary testHistory={testHistory} />
      </motion.div>
    </div>
  );
};

export default DashboardPannel;