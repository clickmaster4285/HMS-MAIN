/**
 * Radiology / Lab Test Result Seeder
 * Inserts 10,000 test result records
 */

const mongoose = require("mongoose");
require("dotenv").config();

// 🔁 IMPORT MODEL (adjust path if needed)
const RadiologyReport = require("./models/testResult.model");

// 🔌 DB CONNECTION
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

const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// 🔗 STATIC IDS (replace if needed)
const patientTestIds = [
  new mongoose.Types.ObjectId("6957657db0ce2260647f7982"),
];

const testIds = [
  new mongoose.Types.ObjectId("68c959e077bcae4407283213"),
];

// 🧪 RESULT TEMPLATE
const baseResults = [
  { fieldName: "TSH", unit: "mIU/L" },
  { fieldName: "FT4", unit: "mg/dL" },
  { fieldName: "Total T4", unit: "other" },
  { fieldName: "FT3", unit: "pg/mL" },
  { fieldName: "Total T3", unit: "mg/dL" },
];

// 🎯 GENERATE ONE REPORT
const generateReport = () => {
  const createdAt = randomDate(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    new Date()
  );

  return {
    patientTestId: randomFromArray(patientTestIds),
    testId: randomFromArray(testIds),
    patientGender: Math.random() > 0.5 ? "male" : "female",

    results: baseResults.map((r) => ({
      fieldName: r.fieldName,
      value: randomNumber(1, 5).toString(),
      unit: r.unit,
      isNormal: Math.random() > 0.5,
      notes: "",
    })),

    status: "completed",
    performedBy: "Sohaib mushtaq",
    notes: "",
    isDeleted: false,

    createdAt,
    updatedAt: createdAt,
  };
};

// 🚀 SEED FUNCTION
const seedReports = async () => {
  try {
    const TOTAL = 10000;
    const BATCH_SIZE = 500;

    console.log(`🚀 Seeding ${TOTAL} radiology reports...\n`);

    let inserted = 0;

    for (let i = 0; i < TOTAL; i += BATCH_SIZE) {
      const batch = [];

      for (let j = 0; j < Math.min(BATCH_SIZE, TOTAL - i); j++) {
        batch.push(generateReport());
      }

      await RadiologyReport.insertMany(batch, { ordered: false });
      inserted += batch.length;

      console.log(`✅ Inserted ${inserted}/${TOTAL}`);
    }

    console.log("\n🎉 RADIOLOGY REPORT SEEDING COMPLETED");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

// ▶️ RUN
seedReports();

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
