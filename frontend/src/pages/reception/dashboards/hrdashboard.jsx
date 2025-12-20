import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, UserPlus, CheckCircle } from "lucide-react";

const departments = [
  { name: "Engineering", count: 56 },
  { name: "Marketing", count: 34 },
  { name: "Sales", count: 18 },
  { name: "HR", count: 20 },
];

const employees = [
  { name: "Ayesha Khan", position: "Software Engineer", status: "Active" },
  { name: "Faisal Iqbal", position: "Marketing Specialist", status: "Active" },
  { name: "Nadia Ahmed", position: "Sales Associate", status: "Active" },
  { name: "Saad Hussain", position: "HR Coordinator", status: "On Leave" },
];

const HRDashboard = () => {
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="min-h-screen p-8 bg-linear-to-br from-white via-cyan-50 to-cyan-100 text-gray-800"
      animate={{ opacity: trigger ? 1 : 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-4xl font-bold mb-10 text-center text-cyan-800 drop-shadow-sm"
        animate={{ y: trigger ? 0 : -5 }}
        transition={{ duration: 0.6 }}
      >
        HR Dashboard
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <SummaryCard icon={<Users />} label="Total Employees" value="128" trigger={trigger} />
        <SummaryCard icon={<Briefcase />} label="Departments" value="7" trigger={trigger} />
        <SummaryCard icon={<UserPlus />} label="New Hires" value="12" trigger={trigger} />
        <SummaryCard icon={<CheckCircle />} label="Active Staff" value="115" trigger={trigger} />
      </div>

      {/* Department Overview */}
      <motion.div className="bg-white border border-cyan-100 p-6 rounded-2xl mb-12 shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-cyan-700">Department Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {departments.map((dept, idx) => (
            <motion.div
              key={idx}
              className="p-5 bg-cyan-50 border border-cyan-100 rounded-xl text-center shadow hover:shadow-md transition"
              animate={{ scale: trigger ? 1.02 : 1 }}
              transition={{ type: "spring", stiffness: 150 }}
            >
              <h3 className="text-cyan-700 text-lg font-semibold">{dept.name}</h3>
              <p className="text-sm text-cyan-600">{dept.count} Employees</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Employee List */}
      <motion.div className="bg-white border border-cyan-100 p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-cyan-700">Employee List</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-cyan-600">
            <tr>
              <th className="pb-3">Name</th>
              <th className="pb-3">Position</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {employees.map((emp, i) => (
              <tr key={i} className="border-t border-cyan-100">
                <td className="py-3 font-medium">{emp.name}</td>
                <td className="py-3">{emp.position}</td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      emp.status === "Active"
                        ? "bg-cyan-100 text-cyan-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

const SummaryCard = ({ icon, label, value, trigger }) => (
  <motion.div
    className="bg-white border border-cyan-100 p-5 rounded-2xl flex items-center space-x-4 shadow-sm hover:shadow-md transition"
    animate={{ scale: trigger ? 1.02 : 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl text-xl">{icon}</div>
    <div>
      <h4 className="text-sm text-cyan-600">{label}</h4>
      <p className="text-2xl font-bold text-cyan-800">{value}</p>
    </div>
  </motion.div>
);

export default HRDashboard;