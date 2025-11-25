const hospitalModel = require("../models/index.model");
const mongoose = require("mongoose");
const utils = require("../utils/utilsIndex");

const submitTestResults = async (req, res) => {
  const { patientTestId, testId } = req.params;
  const testIdArray = testId.split(',');

  try {
    const { results: testResults, notes, status = "draft" } = req.body;
    const performedBy = req.user.user_Name;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(patientTestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patientTestId format",
      });
    }

    for (const id of testIdArray) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid testId format: ${id}`,
        });
      }
    }

    // Get patient test record
    const patientTest = await hospitalModel.PatientTest.findOne({
      _id: patientTestId,
      isDeleted: false,
    });

    if (!patientTest) {
      return res.status(404).json({
        success: false,
        message: "Patient test record not found",
      });
    }

    // Process each test
    const updatePromises = testIdArray.map(async (testId) => {
      const testToUpdate = patientTest.selectedTests.find(
        t => t.test.toString() === testId
      );

      if (!testToUpdate) {
        throw { testId, message: "Test not found in patient record" };
      }

      const testDefinition = await hospitalModel.TestManagment.findById(testId);
      if (!testDefinition) {
        throw { testId, message: "Test definition not found" };
      }

      const filteredResults = Array.isArray(testResults)
        ? testResults.filter(result => result.testId === testId || !result.testId)
        : [];

      const preparedResults = testDefinition.fields.map((fieldDef) => {
        const result = filteredResults.find(r => r.fieldName === fieldDef.name);
        if (!result?.value) return null;

        const gender = patientTest.patient_Detail.patient_Gender.toLowerCase();
        const normalRange = fieldDef.normalRange[gender] || fieldDef.normalRange;

        return {
          fieldName: fieldDef.name,
          value: result.value,
          unit: fieldDef.unit,
          normalRange,
          isNormal: checkValueInRange(result.value, normalRange),
          notes: result.notes || "",
          reportedAt: new Date(),
        };
      }).filter(Boolean);

      // Update or create test result
      let testResult = await hospitalModel.TestResult.findOne({
        patientTestId: patientTest._id,
        testId: testToUpdate.test,
      });

      if (!testResult) {
        testResult = new hospitalModel.TestResult({
          patientTestId: patientTest._id,
          testId: testToUpdate.test,
          patientId: patientTest.patient_Detail.patient_MRNo,
          patientGender: patientTest.patient_Detail.patient_Gender.toLowerCase(),
          results: preparedResults,
          status,
          performedBy,
          notes,
        });
      } else {
        testResult.results = preparedResults;
        testResult.status = status;
        testResult.performedBy = performedBy;
        testResult.notes = notes;
      }

      await testResult.save();

      testToUpdate.statusHistory.push({
        status,
        changedAt: new Date(),
        changedBy: performedBy,
      });

      return { testId, success: true, testResult };
    });

    const operationResults = await Promise.allSettled(updatePromises);
    await patientTest.save();

    return res.status(200).json({
      success: true,
      message: "Test results saved successfully",
      data: {
        testResults: operationResults.map(r => r.value || {
          error: r.reason.message,
          testId: r.reason.testId
        }),
        patientDetails: {
          name: patientTest.patient_Detail.patient_Name,
          mrNo: patientTest.patient_Detail.patient_MRNo,
        },
      },
    });
  } catch (error) {
    console.error("Error submitting test results:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting test results",
      error: error.message,
    });
  }
};

const getAllTestResults = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, patientId } = req.query;
    const skip = (page - 1) * limit;

    const query = { isDeleted: false };
    if (status) query.status = status;
    if (patientId) query.patientId = patientId;

    const results = await hospitalModel.TestResult.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: "patientTestId",
        select: "patient_Detail",
      })
      .populate({
        path: "testId",
        select: "testName testCode",
        model: "TestManagment",
      })
      .lean();

    const enhancedResults = results.map(result => ({
      ...result,
      patientDetails: result.patientTestId?.patient_Detail || {
        source: "Not available"
      },
    }));

    const total = await hospitalModel.TestResult.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        results: enhancedResults,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching test results:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching test results",
      error: error.message,
    });
  }
};

const getPatientByResultId = async (req, res) => {
  try {
    const { resultId } = req.params;
    console.log("the id is", resultId)
    if (!mongoose.Types.ObjectId.isValid(resultId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result ID format",
      });
    }

    const testResult = await hospitalModel.TestResult.findOne({
      _id: resultId,
      isDeleted: false,
    })
      .populate({
        path: "patientTestId",
        select: "patient_Detail createdAt",
      })
      .populate({
        path: "testId",
        select: "testName testCode",
        model: "TestManagment createdAt",
      })
      .lean();

    if (!testResult) {
      return res.status(404).json({
        success: false,
        message: "Test result not found",
      });
    }
    console.log("the testResult is ", testResult)
    console.log("the patientDetails is", patientDetails)
    return res.status(200).json({
      success: true,
      data: {
        testResult,
        patientDetails: testResult.patientTestId?.patient_Detail || {
          source: "Not available"
        },
      },
    });
  } catch (error) {
    console.error("Error fetching test result:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching test result",
      error: error.message,
    });
  }
};

// Reporting Controllers
const getSummaryByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate && !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a startDate or endDate'
      });
    }

    let query = { isDeleted: false };

    if (startDate && !endDate) {
      const sDate = new Date(startDate);
      query.createdAt = {
        $gte: new Date(sDate.setHours(0, 0, 0, 0)),
        $lt: new Date(sDate.setHours(23, 59, 59, 999))
      };
    } else if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      query.createdAt = {
        $gte: new Date(sDate.setHours(0, 0, 0, 0)),
        $lte: new Date(eDate.setHours(23, 59, 59, 999))
      };
    }
    const patients = await hospitalModel.PatientTest.find(query)
      .sort({ createdAt: 1 })
      .lean();

    const patientTestIds = patients.map(patient => patient._id);
    const testResults = await hospitalModel.TestResult.find({
      patientTestId: { $in: patientTestIds }
      // console.log("The queryquery are: ",patients)
    }).lean();

    const responseData = patients.map(patient => ({
      testResults: testResults.filter(
        tr => tr.patientTestId.toString() === patient._id.toString()
      ),
      ...patient
    }));

    return res.status(200).json({
      success: true,
      count: responseData.length,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching test summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching test summary',
      error: error.message
    });
  }
};

// Helper Functions
const checkValueInRange = (value, range) => {
  try {
    const numericValue = parseFloat(value);
    return numericValue >= range.min && numericValue <= range.max;
  } catch (e) {
    console.error("Error checking value range:", e);
    return false;
  }
};

module.exports = {
  // Test Results
  submitTestResults,
  getAllTestResults,
  getPatientByResultId,

  // // Payments
  // processTestPayment,
  // processTestRefund,

  // Reporting
  getSummaryByDate
};