import { FaUserInjured, FaMoneyBillWave, FaFileInvoiceDollar, FaCalculator } from 'react-icons/fa';

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

const BillingStats = ({ patients }) => {
  // Calculate stats from patients data
  const totalPatients = patients.length;
  const totalDoctorFee = patients.reduce((sum, patient) => sum + (patient.patient_HospitalInformation?.doctor_Fee || 0), 0);
  const totalDiscount = patients.reduce((sum, patient) => sum + (patient.patient_HospitalInformation?.discount || 0), 0);
  const totalRevenue = patients.reduce((sum, patient) => sum + (patient.patient_HospitalInformation?.total_Fee || 0), 0);

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
        title="Total Doctor Fee"
        value={`Rs. ${totalDoctorFee.toLocaleString()}`}
        icon={<FaMoneyBillWave />}
        bgColor="bg-green-100"
        textColor="text-green-800"
      />
      <BillingStatsCard
        title="Total Discount"
        value={`Rs. ${totalDiscount.toLocaleString()}`}
        icon={<FaCalculator />}
        bgColor="bg-yellow-100"
        textColor="text-yellow-800"
      />
      <BillingStatsCard
        title="Total Revenue"
        value={`Rs. ${totalRevenue.toLocaleString()}`}
        icon={<FaFileInvoiceDollar />}
        bgColor="bg-purple-100"
        textColor="text-purple-800"
      />
    </div>
  );
};

export default BillingStats;