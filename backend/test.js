/**
 * Lab Patients Seeder Script
 * Inserts 10,000 patients safely using batch inserts
 */

const mongoose = require("mongoose");
require("dotenv").config();

// 🔁 IMPORT MODEL (adjust path if needed)
const LabPatient = require("./models/patientTest.model");

// 🔌 MONGODB CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });

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

// 🚀 SEED 10,000 PATIENTS (BATCH INSERT)
const seedPatients = async () => {
  try {
    const TOTAL = 10000;
    const BATCH_SIZE = 1000;

    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
      const batch = Array.from(
        { length: BATCH_SIZE },
        generatePatient
      );

      await LabPatient.insertMany(batch, { ordered: false });
      console.log(`✅ Inserted ${i + BATCH_SIZE} / ${TOTAL}`);
    }

    console.log("🎉 Successfully inserted 10,000 patients");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

// ▶️ RUN SCRIPT
seedPatients();
