const hospitalModel = require('../models/index.model');
const mongoose = require('mongoose');
const utils = require('../utils/utilsIndex');
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");


const createPatientTest = async (req, res) => {
  try {
    const b = req.body;

    const {
      patient_MRNo,
      patient_CNIC,
      patient_Name,
      patient_Guardian,
      patient_ContactNo,
      patient_Gender,
      patient_Age,
      referredBy,
      selectedTests,
      labNotes,
      performedBy,
      isExternalPatient = false,
      advanceAmount, // optional overall paid passed from UI
    } = b;

    // Basic validation
    if (!Array.isArray(selectedTests) || selectedTests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one test is required",
        requiredFields: ["selectedTests"],
      });
    }

    // --- Build patient_Detail ---
    let patient_Detail;
    let tokenNumber;
    let generatedMRNo;

    const currentDate = new Date().toISOString().split("T")[0];
    tokenNumber = await utils.generateUniqueToken(currentDate);

    if (isExternalPatient) {
      // External patients must provide minimal info
      if (!patient_Name || !patient_ContactNo || !patient_Gender || !patient_Age) {
        return res.status(400).json({
          success: false,
          message:
            "For external patients, name, contact number, gender, and age are required",
        });
      }
      generatedMRNo = await utils.generateUniqueMrNo(currentDate);
      patient_Detail = {
        patient_MRNo: generatedMRNo,
        patient_CNIC: patient_CNIC || "",
        patient_Name,
        patient_Guardian: patient_Guardian || "",
        patient_ContactNo,
        patient_Gender,
        patient_Age,
        referredBy: referredBy || "Self",
        isExternal: true,
      };
    } else {
      // Non-external:
      // Prefer fields you already sent from the Add form (flat shape).
      // If MRNo/CNIC are provided but you didn't send other fields,
      // try to load them from Patient collection.
      let base = {
        patient_MRNo: patient_MRNo || "",
        patient_CNIC: patient_CNIC || "",
        patient_Name: patient_Name || "",
        patient_Guardian: patient_Guardian || "",
        patient_ContactNo: patient_ContactNo || "",
        patient_Gender: patient_Gender || "",
        patient_Age: patient_Age || "",
        referredBy: referredBy || "Self",
        isExternal: false,
      };

      const hasEnoughInBody =
        base.patient_MRNo || (base.patient_Name && base.patient_ContactNo);

      if (!hasEnoughInBody) {
        // Try to fetch from Patient collection by MRNo or CNIC
        if (!patient_MRNo && !patient_CNIC) {
          return res.status(400).json({
            success: false,
            message: "Provide patient_MRNo or patient_CNIC (non-external).",
          });
        }

        const found = await hospitalModel.Patient.findOne({
          $or: [{ patient_MRNo }, { patient_CNIC }],
        }).select(
          "patient_MRNo patient_CNIC patient_Name patient_Guardian patient_ContactNo patient_Gender patient_Age referredBy"
        );

        if (!found) {
          return res.status(404).json({
            success: false,
            message: "Patient not found",
          });
        }

        base = {
          patient_MRNo: found.patient_MRNo || "",
          patient_CNIC: found.patient_CNIC || "",
          patient_Name: found.patient_Name || "",
          patient_Guardian: found.patient_Guardian || "",
          patient_ContactNo: found.patient_ContactNo || "",
          patient_Gender: found.patient_Gender || "",
          patient_Age: found.patient_Age || "",
          referredBy: found.referredBy || referredBy || "Self",
          isExternal: false,
        };
      }

      patient_Detail = base;
    }

    // --- Validate tests exist and enrich names/codes if needed ---
    const testIds = selectedTests.map((t) => {
      if (!mongoose.Types.ObjectId.isValid(t.test)) {
        throw new Error(`Invalid test ID format: ${t.test}`);
      }
      return new mongoose.Types.ObjectId(t.test);
    });

    const tests = await hospitalModel.TestManagment.find({
      _id: { $in: testIds },
    }).select("testName testCode testPrice");

    if (tests.length !== selectedTests.length) {
      const foundTestIds = tests.map((t) => t._id.toString());
      const missingTests = testIds
        .filter((id) => !foundTestIds.includes(id.toString()))
        .map((id) => id.toString());

      return res.status(404).json({
        success: false,
        message: "One or more tests not found",
        missingTests,
      });
    }

    // --- Normalize tests + compute per-row financials ---
    const mappedTests = selectedTests.map((row) => {
      const doc = tests.find((t) => t._id.equals(row.test));
      const price = Number(
        row.testPrice ??
        (doc ? doc.testPrice : 0) ??
        0
      );
      const discount = Math.max(0, Number(row.discountAmount ?? 0));
      const paid = Math.max(0, Number(row.advanceAmount ?? 0));
      const final = Math.max(0, price - discount);
      const remaining = Math.max(0, final - paid);

      return {
        test: row.test,
        testDetails: {
          testName: doc?.testName || row.testName || "",
          testCode: doc?.testCode || row.testCode || "",
          testPrice: price,
          discountAmount: discount,
          advanceAmount: paid,
          remainingAmount: remaining,
          sampleStatus: row.sampleStatus || "pending",
          reportStatus: row.reportStatus || "not_started",
          testDate: row.sampleDate
            ? new Date(row.sampleDate).toISOString()
            : new Date().toISOString(),
        },
        testDate: new Date(),
        statusHistory: [
          {
            status: "registered",
            changedAt: new Date(),
            changedBy: performedBy || "system",
          },
        ],
        notes: row.notes || "",
      };
    });

    // --- Totals (server-of-record) ---
    const sumPrice = mappedTests.reduce((s, t) => s + (t.testDetails.testPrice || 0), 0);
    const sumDiscount = mappedTests.reduce((s, t) => s + (t.testDetails.discountAmount || 0), 0);
    const sumPaidFromRows = mappedTests.reduce((s, t) => s + (t.testDetails.advanceAmount || 0), 0);

    // If client sent an overall advanceAmount, prefer that; else sum row-level
    const totalPaid = Number.isFinite(Number(advanceAmount))
      ? Number(advanceAmount)
      : sumPaidFromRows;

    const computedFinal = Math.max(0, sumPrice - sumDiscount);
    const remainingAmount = Math.max(0, computedFinal - totalPaid);

    // --- Payment status ---
   let paymentStatus;
if (remainingAmount === 0) {
  // If remaining amount is 0 (either paid in full OR full discount), mark as paid
  paymentStatus = "paid";
} else if (totalPaid > 0) {
  paymentStatus = "partial";
} else {
  paymentStatus = "pending";
}

    // --- Create document ---
    const doc = {
      isExternalPatient: !!isExternalPatient,
      tokenNumber,
      patient_Detail,
      selectedTests: mappedTests,
      totalAmount: sumPrice,          // raw sum
      discountAmount: sumDiscount,
      advanceAmount: totalPaid,
      totalPaid: totalPaid,           // keep both if your schema expects both
      remainingAmount: remainingAmount,
      paidAfterReport: 0,
      paymentStatus,
      refunded: [],
      labNotes: labNotes || "",
      performedBy: performedBy || (req.user && req.user.user_Name) || "",
      history: [
        {
          action: "create",
          performedBy: (req.user && req.user.user_Name) || performedBy || "system",
        },
      ],
    };

    const created = await hospitalModel.PatientTest.create(doc);

emitGlobalEvent(req, EVENTS.PATIENT_TEST, "create", {
  id: created._id
});
    return res.status(201).json({
      success: true,
      message: "Lab test order created successfully",
      data: {
        patientTestId: created._id,
        tokenNumber: created.tokenNumber,
        patient: {
          mrNo: created.patient_Detail.patient_MRNo,
          name: created.patient_Detail.patient_Name,
          patient_Guardian: created.patient_Detail.patient_Guardian,
          contact: created.patient_Detail.patient_ContactNo,
        },
        tests: created.selectedTests.map((t) => ({
          testId: t.test,
          testName: t.testDetails.testName,
          price: t.testDetails.testPrice,
          discount: t.testDetails.discountAmount,
          paid: t.testDetails.advanceAmount,
          remaining: t.testDetails.remainingAmount,
          status: t.testDetails.sampleStatus,
        })),
        financialSummary: {
          totalAmount: created.totalAmount,
          totalDiscount: created.discountAmount,
          totalPaid: created.totalPaid,
          totalRemaining: created.remainingAmount,
          paymentStatus: created.paymentStatus,
        },
        createdAt: created.createdAt,
        totalTests: created.selectedTests.length,
        status: "created",
      },
    });
  } catch (error) {
    console.error("Error creating lab patient test:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate test order detected",
        error: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllPatientTests = async (req, res) => {
  try {
    const { page = 1, limit = 100000, search } = req.query;
    const skip = (page - 1) * limit;

    let query = { isDeleted: false };

    if (search) {
      query.$or = [
        { 'patient_Detail.patient_MRNo': { $regex: search, $options: 'i' } },
        { 'patient_Detail.patient_Name': { $regex: search, $options: 'i' } },
        { 'patient_Detail.patient_CNIC': { $regex: search, $options: 'i' } },
      ];
    }

    const patientTests = await hospitalModel.PatientTest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await hospitalModel.PatientTest.countDocuments(query);

    // Map over each patientTest and attach their own testDefinitions
    const patientTestsWithDefinitions = await Promise.all(
      patientTests.map(async (pt) => {
        const testCodes =
          pt.selectedTests
            ?.map((t) => t.testDetails?.testCode)
            .filter(Boolean) || [];

        const testDefinitions = await hospitalModel.TestManagment.find({
          testCode: { $in: testCodes },
        }).lean();

        const testResultIds = testDefinitions.map((test) =>
          test._id.toString()
        );

        const testResults = await hospitalModel.TestResult.find({
          testId: { $in: testResultIds },
        }).lean();

        // Create result lookup: testId -> fieldName -> result
        const resultLookup = {};
        for (const result of testResults) {
          const testId = result.testId.toString();
          if (!resultLookup[testId]) resultLookup[testId] = {};

          for (const res of result.results || []) {
            resultLookup[testId][res.fieldName] = {
              value: res.value || null,
              note: res.notes || null,
            };
          }
        }

        // Enrich each testDefinition
        const enrichedTestDefinitions = testDefinitions.map((td) => {
          const testId = td._id.toString();
          const resultsForThisTest = resultLookup[testId] || {};

          const enrichedFields = (td.fields || []).map((field) => {
            const matchedResult = resultsForThisTest[field.name] || {};
            return {
              ...field,
              value: matchedResult.value ?? null,
              note: matchedResult.note ?? null,
            };
          });

          return {
            ...td,
            fields: enrichedFields,
          };
        });

        return {
          ...pt,
          testDefinitions: enrichedTestDefinitions,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        patientTests: patientTestsWithDefinitions,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching patient tests:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


const getPatientTestById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient test ID format',
      });
    }

    const patientTest = await hospitalModel.PatientTest.findOne({
      _id: id,
      isDeleted: false,
    }).lean();

    if (!patientTest) {
      return res.status(404).json({
        success: false,
        message: 'Patient test not found',
      });
    }
    const testIds = patientTest.selectedTests?.map((t) => t.test);

    const testDefinitions = await hospitalModel.TestManagment.find({
      _id: { $in: testIds },
    }).lean();

    const testResultIds = testDefinitions.map((test) => test._id.toString());

    const testResults = await hospitalModel.TestResult.find({
      testId: { $in: testResultIds },
      patientTestId: id,
    }).lean();

    // Build result lookup: testId -> fieldName -> result info
    const resultLookup = {};
    for (const result of testResults) {
      const testId = result.testId.toString();
      if (!resultLookup[testId]) resultLookup[testId] = {};

      for (const res of result.results || []) {
        resultLookup[testId][res.fieldName] = {
          value: res.value ?? null,
          note: res.notes ?? null,
        };
      }
    }
    // Enrich testDefinitions
    const enrichedTestDefinitions = testDefinitions.map((td) => {
      const testId = td._id.toString();
      const resultsForThisTest = resultLookup[testId] || {};

      const enrichedFields = (td.fields || []).map((field) => {
        const matchedResult = resultsForThisTest[field.name];
        return {
          ...field,
          value: matchedResult?.value ?? null,
          note: matchedResult?.note ?? null,
        };
      });

      return {
        ...td,
        fields: enrichedFields,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        patientTest,
        testDefinitions: enrichedTestDefinitions,
      },
    });
  } catch (error) {
    console.error('Error fetching patient test:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const getPatientTestByMRNo = async (req, res) => {
  try {
    const { mrNo } = req.params;

    // Try fetching from PatientTest
    const patienttest = await hospitalModel.PatientTest.findOne({
      $or: [
        { 'patient_Detail.patient_MRNo': String(mrNo).trim() },
        { 'patient_Detail.patient_CNIC': String(mrNo).trim() },
      ],
    }).lean();

    // Try fetching from Patient
    const patient = await hospitalModel.Patient.findOne({
      $or: [
        { patient_MRNo: String(mrNo).trim() },
        { patient_CNIC: String(mrNo).trim() },
      ],
    }).lean();

    if (!patienttest && !patient) {
      return res.status(404).json({
        success: false,
        message: 'No patient test or patient found.',
      });
    }

    // Extract fields from PatientTest if exists
    if (patienttest) {
      const detail = patienttest.patient_Detail || {};
      return res.status(200).json({
        success: true,
        data: {
          cnic: detail.patient_CNIC || null,
          name: detail.patient_Name || null,
          patient_Guardian: detail.patient_Guardian || null,
          contactNo: detail.patient_ContactNo || null,
          maritalStatus: null, // not available in PatientTest
          age: detail.patient_Age || null,
          gender: detail.patient_Gender || null,
          DateOfBirth: null, // not available in PatientTest
          referredBy: detail.referredBy || null,
          mrno: detail.patient_MRNo || null,
        },
      });
    }

    // Otherwise extract from Patient
    if (patient) {
      return res.status(200).json({
        success: true,
        data: {
          cnic: patient.patient_CNIC || null,
          name: patient.patient_Name || null,
          patient_Guardian: patient.patient_Guardian || null,
          contactNo: patient.patient_ContactNo || null,
          maritalStatus: patient.patient_MaritalStatus || null,
          age: patient.patient_Age || null,
          gender: patient.patient_Gender || null,
          gaurdian: patient.patient_Guardian?.guardian_Name || null,
          mrno: patient.patient_MRNo || null,
          DateOfBirth: patient.patient_DateOfBirth || null,
          referredBy: patient.patient_HospitalInformation?.referredBy || null,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching patient info:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const softDeletePatientTest = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient test ID format',
      });
    }

    const patientTest = await hospitalModel.PatientTest.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: { isDeleted: true },
        $push: {
          history: {
            action: 'soft_delete',
            performedBy: req.user.user_Name || 'system',
          },
        },
      },
      { new: true }
    );

    if (!patientTest) {
      return res.status(404).json({
        success: false,
        message: 'Patient test not found or already deleted',
      });
    }

emitGlobalEvent(req, EVENTS.PATIENT_TEST, "softDelete", { id });

    return res.status(200).json({
      success: true,
      message: 'Patient test soft deleted successfully',
      data: {
        patientTestId: patientTest._id,
        deletedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error soft deleting patient test:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const restorePatientTest = async (req, res) => {
  try {
    const { id } = req.params;

    const patientTest = await hospitalModel.PatientTest.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { $set: { isDeleted: false } },
      { new: true }
    );

    if (!patientTest) {
      return res.status(404).json({
        success: false,
        message: 'Patient test not found or not deleted',
      });
    }

emitGlobalEvent(req, EVENTS.PATIENT_TEST, "restore", {
  id: patientTest._id,
  action: "restore"
});

    return res.status(200).json({
      success: true,
      message: 'Patient test restored successfully',
    });
  } catch (error) {
    console.error('Error restoring patient test:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

const PatientTestStates = async (req, res) => {
  try {
    const PatientTest = hospitalModel.PatientTest;
    const TestResult = hospitalModel.TestResult;

    // Aggregate test statistics
    const stats = await PatientTest.aggregate([
      { $match: { isDeleted: false } },
      {
        $facet: {
          totalTests: [{ $count: 'count' }],
          testStatus: [
            {
              $unwind: '$selectedTests',
            },
            {
              $group: {
                _id: null,
                completed: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$selectedTests.testDetails.reportStatus',
                          'completed',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                pending: {
                  $sum: {
                    $cond: [
                      {
                        $eq: [
                          '$selectedTests.testDetails.sampleStatus',
                          'pending',
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                urgent: {
                  $sum: {
                    $cond: [
                      { $eq: ['$selectedTests.testDetails.testCode', 'cns'] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          revenue: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$totalAmount' },
                totalDiscount: { $sum: '$advanceAmount' },
                totalRemainingAmount: { $sum: '$remainingAmount' },
                totalAdvancePayment: { $sum: '$advancePayment' },
                totalPaidAfterReport: {
                  $sum: { $ifNull: ['$paidAfterReport', 0] },
                },
                pendingRevenue: {
                  $sum: {
                    $cond: [
                      { $eq: ['$paymentStatus', 'pending'] },
                      '$remainingAmount',
                      0,
                    ],
                  },
                },
                paidRevenue: {
                  $sum: {
                    $cond: [
                      { $eq: ['$paymentStatus', 'paid'] },
                      {
                        $add: [
                          '$advancePayment',
                          { $ifNull: ['$paidAfterReport', 0] },
                        ],
                      },
                      0,
                    ],
                  },
                },
                refundedRevenue: {
                  $sum: {
                    $reduce: {
                      input: '$refunded',
                      initialValue: 0,
                      in: { $add: ['$$value', '$$this.refundAmount'] },
                    },
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalTests: { $arrayElemAt: ['$totalTests.count', 0] },
          completedTests: { $arrayElemAt: ['$testStatus.completed', 0] },
          pendingTests: { $arrayElemAt: ['$testStatus.pending', 0] },
          urgentTests: { $arrayElemAt: ['$testStatus.urgent', 0] },

          // Revenue metrics
          totalRevenue: { $arrayElemAt: ['$revenue.totalRevenue', 0] },
          totalDiscount: { $arrayElemAt: ['$revenue.totalDiscount', 0] },
          totalRemainingAmount: {
            $arrayElemAt: ['$revenue.totalRemainingAmount', 0],
          },
          totalAdvancePayment: {
            $arrayElemAt: ['$revenue.totalAdvancePayment', 0],
          },
          totalPaidAfterReport: {
            $arrayElemAt: ['$revenue.totalPaidAfterReport', 0],
          },
          pendingRevenue: { $arrayElemAt: ['$revenue.pendingRevenue', 0] },
          paidRevenue: { $arrayElemAt: ['$revenue.paidRevenue', 0] },
          refundedRevenue: { $arrayElemAt: ['$revenue.refundedRevenue', 0] },

          // Calculated fields
          remainingRevenue: {
            $subtract: [
              { $arrayElemAt: ['$revenue.totalRemainingAmount', 0] },
              { $arrayElemAt: ['$revenue.paidRevenue', 0] },
            ],
          },
        },
      },
    ]);

    // Fetch alerts based on test status and payment issues
    const alerts = await PatientTest.aggregate([
      { $match: { isDeleted: false } },
      { $unwind: '$selectedTests' },
      {
        $lookup: {
          from: 'testresults',
          localField: '_id',
          foreignField: 'patientTestId',
          as: 'testResults',
        },
      },
      {
        $project: {
          _id: 1,
          testId: '$selectedTests._id',
          testName: '$selectedTests.testDetails.testName',
          testCode: '$selectedTests.testDetails.testCode',
          sampleStatus: '$selectedTests.testDetails.sampleStatus',
          reportStatus: '$selectedTests.testDetails.reportStatus',
          testDate: '$selectedTests.testDate',
          patientName: '$patient_Detail.patient_Name',
          paymentStatus: 1,
          remainingAmount: 1,
          advancePayment: 1,
          paidAfterReport: 1,
        },
      },
      {
        $match: {
          $or: [
            { sampleStatus: 'pending' },
            { reportStatus: { $ne: 'completed' } },
            {
              $expr: {
                $and: [
                  { $eq: ['$paymentStatus', 'pending'] },
                  { $gt: ['$remainingAmount', 0] },
                ],
              },
            },
            { testCode: 'cns' },
          ],
        },
      },
    ]);

    // Process alerts
    const now = new Date();
    const processedAlerts = alerts
      .map((alert) => {
        const testDate = new Date(alert.testDate);
        const hoursDiff = Math.abs(now - testDate) / 36e5;
        let alertType = '';
        let priority = 'medium';

        if (hoursDiff > 24 && alert.sampleStatus !== 'collected') {
          alertType = `Sample for ${alert.testName} expired`;
          priority = 'high';
        } else if (alert.testCode === 'cns') {
          alertType = `Critical test pending: ${alert.testName}`;
          priority = 'critical';
        } else if (
          alert.paymentStatus === 'pending' &&
          alert.remainingAmount > 0
        ) {
          const paidAmount =
            (alert.advancePayment || 0) + (alert.paidAfterReport || 0);
          const remainingAmount = alert.remainingAmount - paidAmount;
          alertType = `Unpaid amount ${remainingAmount} for ${alert.patientName}`;
          priority = remainingAmount > 500 ? 'high' : 'medium';
        }

        return {
          id: `${alert._id}-${alert.testId}`,
          message: alertType,
          timeStatus:
            hoursDiff > 24 ? `${Math.floor(hoursDiff)} hours ago` : 'Pending',
          priority,
          testType: alert.testName,
          patient: alert.patientName,
        };
      })
      .filter((alert) => alert.message);

    const result = {
      stats: {
        totalTests: stats[0]?.totalTests || 0,
        completedTests: stats[0]?.completedTests || 0,
        pendingTests: stats[0]?.pendingTests || 0,
        urgentTests: stats[0]?.urgentTests || 0,

        // Revenue metrics
        totalRevenue: stats[0]?.totalRevenue || 0,
        totalDiscount: stats[0]?.totalDiscount || 0,
        totalRemainingAmount: stats[0]?.totalRemainingAmount || 0,
        totalAdvancePayment: stats[0]?.totalAdvancePayment || 0,
        totalPaidAfterReport: stats[0]?.totalPaidAfterReport || 0,
        pendingRevenue: stats[0]?.pendingRevenue || 0,
        paidRevenue: stats[0]?.paidRevenue || 0,
        refundedRevenue: stats[0]?.refundedRevenue || 0,
        remainingRevenue: stats[0]?.remainingRevenue || 0,
      },
      alerts: processedAlerts,
      tests: await PatientTest.find({ isDeleted: false }).lean(),
    };


    res.status(200).json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message,
    });
  }
};

const paymentAfterReport = async (req, res) => {
  const { patientId } = req.params;
  try {
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'patientId is required',
      });
    }

    const patientTest = await hospitalModel.PatientTest.findById(patientId);
    if (!patientTest) {
      return res.status(404).json({
        success: false,
        message: 'Patient test record not found',
      });
    }

    const oldRemaining = patientTest.remainingAmount;
    const newPaidAfterReport = patientTest.paidAfterReport + oldRemaining;
    const newTotalPaid = patientTest.totalPaid + oldRemaining;

    // Add history entry
    patientTest.history = patientTest.history || [];
    patientTest.history.push({
      action: 'finalize_payment',
      performedBy: req.user.user_Name || 'system',
    });

    const updatedPatientTest =
      await hospitalModel.PatientTest.findByIdAndUpdate(
        patientId,
        {
          $set: {
            paidAfterReport: newPaidAfterReport,
            totalPaid: newTotalPaid,
            remainingAmount: 0,
            paymentStatus: 'paid',
            refundableAmount: 0,
            performedBy: req.user.user_Name || 'system',
          },
        },
        { new: true }
      ).select('-__v -isDeleted -createdAt -updatedAt');

emitGlobalEvent(req,EVENTS.PATIENT_TEST, "paymentFinalized", {
  id: patientId,
  action: "paymentFinalized"
});


    return res.status(200).json({
      success: true,
      message: 'Payment finalized successfully',
      data: {
        patientTest: updatedPatientTest,
        performedBy: updatedPatientTest.performedBy,
        financialStatus: {
          previousRemaining: oldRemaining,
          newPaidAfterReport: newPaidAfterReport,
          newTotalPaid: newTotalPaid,
          newRemaining: 0,
          paymentStatus: 'paid',
        },
      },
    });
  } catch (error) {
    console.error('Error finalizing payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
// 🔑 helpers
const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const clamp0 = (v) => Math.max(0, v);

const updatePatientTest = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    console.log("Update Patient Test Payload:", body);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid patient test ID format' });
    }

    const existing = await hospitalModel.PatientTest.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: 'Patient test not found' });
    }

    // Block if any test already progressed beyond "registered"
    const hasNonRegistered = existing.selectedTests.some(
      (t) => t.testStatus !== 'registered'
    );
    if (hasNonRegistered) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot update - one or more tests have status other than 'registered'",
      });
    }

    // ---- patient + simple fields (keep zeros by using ??) ----
    const $set = {
      patient_Detail: {
        patient_MRNo:
          body.patient_Detail?.patient_MRNo ??
          existing.patient_Detail.patient_MRNo,
        patient_CNIC:
          body.patient_Detail?.patient_CNIC ??
          existing.patient_Detail.patient_CNIC,
        patient_Name:
          body.patient_Detail?.patient_Name ??
          existing.patient_Detail.patient_Name,
        patient_Guardian:
          body.patient_Detail?.patient_Guardian ??
          existing.patient_Detail.patient_Guardian,
        patient_ContactNo:
          body.patient_Detail?.patient_ContactNo ??
          existing.patient_Detail.patient_ContactNo,
        patient_Gender:
          body.patient_Detail?.patient_Gender ??
          existing.patient_Detail.patient_Gender,
        patient_Age:
          body.patient_Detail?.patient_Age ??
          existing.patient_Detail.patient_Age,
        referredBy:
          body.patient_Detail?.referredBy ?? existing.patient_Detail.referredBy,
      },
      labNotes: body.labNotes ?? existing.labNotes,
      performedBy: body.performedBy ?? existing.performedBy,
      isExternalPatient: body.isExternalPatient ?? existing.isExternalPatient,
      tokenNumber: body.tokenNumber ?? existing.tokenNumber,
    };

    // ---- selectedTests: rebuild from payload if provided, else keep existing ----
    let selectedTests;
    if (Array.isArray(body.selectedTests) && body.selectedTests.length) {
      selectedTests = body.selectedTests.map((t) => {
        const td = t.testDetails || {};
        const price = toNum(td.testPrice);
        const discount = clamp0(toNum(td.discountAmount));
        const final = clamp0(price - discount);
        const paid = clamp0(toNum(td.advanceAmount));
        const paidCapped = Math.min(paid, final);
        const remaining = clamp0(final - paidCapped);

        return {
          ...t,
          testDetails: {
            ...td,
            testPrice: price,
            discountAmount: discount,
            advanceAmount: paidCapped,
            remainingAmount: remaining,
          },
        };
      });
    } else {
      // No incoming tests: normalize existing so totals are still correct
      selectedTests = existing.selectedTests.map((t) => {
        const td = t.testDetails || {};
        const price = toNum(td.testPrice);
        const discount = clamp0(toNum(td.discountAmount));
        const final = clamp0(price - discount);
        const paid = clamp0(toNum(td.advanceAmount));
        const paidCapped = Math.min(paid, final);
        const remaining = clamp0(final - paidCapped);
        return {
          ...t.toObject(),
          testDetails: {
            ...td,
            testPrice: price,
            discountAmount: discount,
            advanceAmount: paidCapped,
            remainingAmount: remaining,
          },
        };
      });
    }

    $set.selectedTests = selectedTests;

    // ---- recompute totals + paymentStatus (authoritative) ----
    const totalPrice = selectedTests.reduce(
      (s, t) => s + toNum(t.testDetails?.testPrice),
      0
    );
    const totalDiscount = selectedTests.reduce(
      (s, t) => s + clamp0(toNum(t.testDetails?.discountAmount)),
      0
    );
    const totalPaid = selectedTests.reduce(
      (s, t) => s + clamp0(toNum(t.testDetails?.advanceAmount)),
      0
    );

    const finalTotal = clamp0(totalPrice - totalDiscount); // sum of (price - discount)
    const remainingAmount = clamp0(finalTotal - totalPaid);

    $set.totalAmount = finalTotal;
    $set.discountAmount = totalDiscount;
    $set.totalPaid = totalPaid;
    $set.advanceAmount = totalPaid; // keep legacy in sync
    $set.remainingAmount = remainingAmount;

    $set.paymentStatus =
  remainingAmount === 0
    ? "paid"  // Changed from conditional to always "paid"
    : totalPaid > 0
      ? "partial"
      : "pending";

    // (optional) mirror to financialSummary if your UI reads it
    $set['financialSummary.totalAmount'] = finalTotal;
    $set['financialSummary.totalPaid'] = totalPaid;
    $set['financialSummary.totalDiscount'] = totalDiscount;
    $set['financialSummary.totalRemaining'] = remainingAmount;
    $set['financialSummary.paymentStatus'] = $set.paymentStatus;

    const $push = {
      history: {
        action: 'update',
        performedBy: req.user?.user_Name || 'system',
        at: new Date(),
      },
    };

    const updated = await hospitalModel.PatientTest.findByIdAndUpdate(
      id,
      { $set, $push },
      { new: true, runValidators: true }
    );

emitGlobalEvent(req, EVENTS.PATIENT_TEST, "update", {
  id,
  action: "update"
});

    return res.status(200).json({
      success: true,
      message: 'Patient test updated successfully',
      data: updated,
    });
  } catch (err) {
    console.error('Error updating patient test:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
};

module.exports = {
  createPatientTest,
  getAllPatientTests,
  getPatientTestById,
  restorePatientTest,
  softDeletePatientTest,
  getPatientTestByMRNo,
  PatientTestStates,
  paymentAfterReport,
  updatePatientTest,
};
