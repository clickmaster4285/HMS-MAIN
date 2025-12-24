const mongoose = require("mongoose");
require("dotenv").config();

// 🔁 IMPORT YOUR MODEL
const LabPatient = require("./models/patientTest.model"); 
// ⚠️ Adjust path & model name if different

// 🔌 DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// 🧠 HELPERS
const randomFromArray = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomNumber = (len = 4) =>
  Math.floor(Math.random() * Math.pow(10, len));

const names = ["Ali", "Ahmed", "Usman", "Bilal", "Hassan", "Hamza"];
const doctors = ["Dr. Noor", "Dr. Hira", "Dr. Khan", "Dr. Aslam"];
const tests = [
  { name: "TFT", code: "TFT", price: 4600 },
  { name: "CBC", code: "CBC", price: 1800 },
  { name: "LFT", code: "LFT", price: 3200 },
  { name: "RFT", code: "RFT", price: 2800 },
];

// 🎯 GENERATE ONE PATIENT
const generatePatient = () => {
  const test = randomFromArray(tests);

  return {
    isExternalPatient: true,
    tokenNumber: randomNumber(3),
    patient_Detail: {
      patient_MRNo: `2025${randomNumber(6)}`,
      patient_Guardian: randomFromArray(names),
      patient_CNIC: `32${randomNumber(11)}`,
      patient_Name: randomFromArray(names),
      patient_ContactNo: `03${randomNumber(9)}`,
      patient_Gender: randomFromArray(["Male", "Female"]),
      patient_Age: `${Math.floor(Math.random() * 80) + 1} years`,
      referredBy: randomFromArray(doctors),
    },
    selectedTests: [
      {
        testStatus: "registered",
        testDetails: {
          advanceAmount: test.price,
          discountAmount: 0,
          remainingAmount: 0,
          testName: test.name,
          testCode: test.code,
          testPrice: test.price,
          sampleStatus: "pending",
          reportStatus: "not_started",
        },
        testDate: new Date(),
        statusHistory: [
          {
            status: "registered",
            changedAt: new Date(),
            changedBy: "system",
          },
        ],
      },
    ],
    totalAmount: test.price,
    advanceAmount: test.price,
    discountAmount: 0,
    remainingAmount: 0,
    cancelledAmount: 0,
    refundableAmount: 0,
    refunded: [],
    paymentStatus: "paid",
    paidAfterReport: 0,
    totalPaid: test.price,
    labNotes: "",
    history: [
      {
        action: "create",
        performedBy: "Seeder Script",
        createdAt: new Date(),
      },
    ],
    performedBy: "Seeder Script",
    isDeleted: false,
  };
};

// 🚀 INSERT 2000 PATIENTS
const seedPatients = async () => {
  try {
    const patients = Array.from({ length: 100000 }, generatePatient);
    await LabPatient.insertMany(patients);
    console.log("✅ 2000 random patients inserted");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedPatients();
