import React from 'react';
import { FaMoneyBillWave, FaFileInvoiceDollar, FaPercentage, FaUserInjured } from 'react-icons/fa';
import { GiCash } from 'react-icons/gi';
import { BsCashCoin } from 'react-icons/bs';

const BillingStatsCard = ({ title, value, icon, bgColor, textColor }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md ${bgColor} ${textColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

const IPDBillingStats = ({ patients }) => {
  // Calculate billing stats from patients data
  const totalPatients = patients.length;
  const totalAdmissionFee = patients.reduce((sum, patient) => sum + (patient.financials?.admission_Fee || 0), 0);
  const totalDiscount = patients.reduce((sum, patient) => sum + (patient.financials?.discount || 0), 0);
  const totalCharges = patients.reduce((sum, patient) => sum + (patient.financials?.total_Charges || 0), 0);
  const totalPaid = patients.reduce((sum, patient) => {
    return sum + (patient.financials?.payment_Status === 'Paid' ? (patient.financials?.total_Charges || 0) : 0);
  }, 0);
  const totalUnpaid = totalCharges - totalPaid;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <BillingStatsCard
        title="Total Patients"
        value={totalPatients}
        icon={<FaUserInjured />}
        bgColor="bg-primary-100"
        textColor="text-primary-800"
      />
      <BillingStatsCard
        title="Total Admission Fee"
        value={`Rs. ${totalAdmissionFee.toLocaleString()}`}
        icon={<GiCash />}
        bgColor="bg-green-100"
        textColor="text-green-800"
      />
      <BillingStatsCard
        title="Total Discount"
        value={`Rs. ${totalDiscount.toLocaleString()}`}
        icon={<FaPercentage />}
        bgColor="bg-yellow-100"
        textColor="text-yellow-800"
      />
      <BillingStatsCard
        title="Total Revenue"
        value={`Rs. ${totalCharges.toLocaleString()}`}
        icon={<FaFileInvoiceDollar />}
        bgColor="bg-purple-100"
        textColor="text-purple-800"
      />
      {/* Additional row for paid/unpaid breakdown */}
      <div className="md:col-span-2 grid grid-cols-2 gap-4">
        <BillingStatsCard
          title="Total Paid"
          value={`Rs. ${totalPaid.toLocaleString()}`}
          icon={<BsCashCoin />}
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <BillingStatsCard
          title="Total Unpaid"
          value={`Rs. ${totalUnpaid.toLocaleString()}`}
          icon={<FaMoneyBillWave />}
          bgColor="bg-red-50"
          textColor="text-red-700"
        />
      </div>
    </div>
  );
};

export default IPDBillingStats;