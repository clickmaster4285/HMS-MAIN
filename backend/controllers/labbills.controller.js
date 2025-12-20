const hospitalModel = require('../models/index.model');
const mongoose = require('mongoose');
const utils = require('../utils/utilsIndex');
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");
const getAllTestBills = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      patientId,
      fromDate,
      toDate,
    } = req.query;
    const skip = (page - 1) * limit;

    // Build match query
    const matchQuery = { isDeleted: false };

    if (status) matchQuery.status = status;
    if (patientId && mongoose.isValidObjectId(patientId)) {
      matchQuery.patientTestId = new mongoose.Types.ObjectId(patientId);
    }
    if (fromDate || toDate) {
      matchQuery.createdAt = {};
      if (fromDate) matchQuery.createdAt.$gte = new Date(fromDate);
      if (toDate) matchQuery.createdAt.$lte = new Date(toDate);
    }

    const groupedResults = await hospitalModel.TestResult.aggregate([
      { $match: matchQuery },

      // Lookup patient test info
      {
        $lookup: {
          from: 'patienttests',
          localField: 'patientTestId',
          foreignField: '_id',
          as: 'patientTestInfo',
        },
      },
      { $unwind: '$patientTestInfo' },

      // Lookup test details
      {
        $lookup: {
          from: 'testmanagements',
          localField: 'testId',
          foreignField: '_id',
          as: 'testInfo',
        },
      },
      { $unwind: '$testInfo' },

      // Group by patientTestId
      {
        $group: {
          _id: '$patientTestId',
          createdAt: { $first: '$patientTestInfo.createdAt' },
          updatedAt: { $first: '$patientTestInfo.updatedAt' },
          billingInfo: { $first: '$patientTestInfo' },
          tests: {
            $push: {
              testId: '$testInfo._id',
              name: '$testInfo.testName',
              code: '$testInfo.testCode',
              price: '$testInfo.testPrice',
              status: '$status',
              // Get the matching selectedTest entry
              selectedTest: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$patientTestInfo.selectedTests',
                      as: 'st',
                      cond: { $eq: ['$$st.test', '$testId'] },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },

      // Add fields to calculate test-specific amounts
      {
        $addFields: {
          tests: {
            $map: {
              input: '$tests',
              as: 'test',
              in: {
                testId: '$$test.testId',
                name: '$$test.name',
                code: '$$test.code',
                price: {
                  $ifNull: ['$$test.selectedTest.testDetails.testPrice', 0],
                },
                status: { $ifNull: ['$$test.selectedTest.testStatus', 0] },
                advanceAmount: {
                  $ifNull: ['$$test.selectedTest.testDetails.advanceAmount', 0],
                },
                discountAmount: {
                  $ifNull: [
                    '$$test.selectedTest.testDetails.discountAmount',
                    0,
                  ],
                },
                remainingAmount: {
                  $ifNull: [
                    '$$test.selectedTest.testDetails.remainingAmount',
                    0,
                  ],
                },
                id: { $ifNull: ['$$test.selectedTest._id', 0] },
              },
            },
          },
        },
      },

      // Pagination
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    const formattedResults = groupedResults.map((entry) => {
      const p = entry.billingInfo;
      return {
        _id: entry._id,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        tests: entry.tests,
        billingInfo: {
          totalAmount: p.totalAmount || 0,
          discountAmount: p.discountAmount || 0,
          advanceAmount: p.advanceAmount || 0,
          remainingAmount: p.remainingAmount || 0,
          paidAfterReport: p.paidAfterReport || 0,
          totalPaid: p.totalPaid || 0,
          paymentStatus: p.paymentStatus || 'pending',
          labNotes: p.labNotes || '',
          tokenNumber: p.tokenNumber || '',
          refunded: p.refunded || [],
        },
        patientDetails: {
          _id: p._id,
          patient_MRNo: p.patient_Detail?.patient_MRNo || '',
          patient_Name: p.patient_Detail?.patient_Name || 'Unknown Patient',
          patient_ContactNo: p.patient_Detail?.patient_ContactNo || '',
          patient_Gender: p.patient_Detail?.patient_Gender || '',
        },
      };
    });

    // Get total unique patients
    const totalPatients = await hospitalModel.TestResult.distinct(
      'patientTestId',
      matchQuery
    );
    const totalPages = Math.ceil(totalPatients.length / limit);

    return res.status(200).json({
      success: true,
      data: {
        results: formattedResults,
        pagination: {
          total: totalPatients.length,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
        },
        summary: {
          totalPatients: totalPatients.length,
          totalTests: formattedResults.reduce(
            (sum, r) => sum + r.tests.length,
            0
          ),
          completedTests: formattedResults.reduce(
            (sum, r) =>
              sum + r.tests.filter((t) => t.status === 'completed').length,
            0
          ),
          pendingTests: formattedResults.reduce(
            (sum, r) =>
              sum + r.tests.filter((t) => t.status !== 'completed').length,
            0
          ),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching grouped test results:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching test results',
      error: error.message,
    });
  }
};

const getAllRadiologyBills = async (req, res) => {
  try {
    const bills = await hospitalModel.RadiologyReport.find({
      deleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching radiology bills',
      error: error.message,
    });
  }
};

const getTestBillsByPatientTestId = async (req, res) => {
  try {
    const { patientTestId } = req.params;

    if (!mongoose.isValidObjectId(patientTestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patientTestId format',
      });
    }

    const testResults = await hospitalModel.TestResult.find({
      patientTestId: new mongoose.Types.ObjectId(patientTestId),
      isDeleted: false,
    })
      .populate({
        path: 'testId',
        select: 'testName testCode testPrice',
        model: 'TestManagement',
        options: { allowNull: true },
      })
      .lean();
    if (!testResults || testResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No test results found for this patientTestId',
      });
    }

    const patientTest = await hospitalModel.PatientTest.findById(patientTestId)
      .select(
        'patient_Detail totalAmount discountAmount advanceAmount remainingAmount paidAfterReport paymentStatus labNotes tokenNumber refunded totalPaid'
      )
      .lean();

    if (!patientTest) {
      return res.status(404).json({
        success: false,
        message: 'Patient test record not found',
      });
    }

    const enhancedResults = testResults.map((result) => {
      const testDetails = result.testId || {};
      return {
        _id: result._id,
        status: result.status || 'pending',
        testDetails: {
          name: testDetails.testName || 'N/A',
          code: testDetails.testCode || 'N/A',
          price: testDetails.testPrice || 0,
        },
      };
    });

    const responseData = {
      _id: patientTestId,
      createdAt: patientTest.createdAt,
      updatedAt: patientTest.updatedAt,
      patient: patientTest.patient_Detail,
      billingSummary: {
        totalAmount: patientTest.totalAmount || 0,
        discountAmount: patientTest.discountAmount || 0,
        advanceAmount: patientTest.advanceAmount || 0,
        remainingAmount: patientTest.remainingAmount || 0,
        paidAfterReport: patientTest.paidAfterReport || 0,
        totalPaid: patientTest.totalPaid || 0,
        paymentStatus: patientTest.paymentStatus || 'pending',
        labNotes: patientTest.labNotes || '',
        tokenNumber: patientTest.tokenNumber || '',
        refunded: patientTest.refunded || [],
      },
      testResults: enhancedResults,
      summary: {
        totalTests: enhancedResults.length,
        completedTests: enhancedResults.filter((t) => t.status === 'completed')
          .length,
        pendingTests: enhancedResults.filter((t) => t.status !== 'completed')
          .length,
      },
    };

    return res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching bill details:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching bill details',
      error: error.message,
    });
  }
};

const refundAmountbylab = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { refundReason } = req.body;

    const toNum = (v) => (Number.isFinite(+v) ? +v : 0);
    const clamp0 = (n) => Math.max(0, toNum(n));

    if (!mongoose.isValidObjectId(patientId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid patientId format' });
    }
    if (!refundReason) {
      return res
        .status(400)
        .json({ success: false, message: 'Refund reason is required' });
    }

    const bill = await hospitalModel.PatientTest.findById(patientId);
    if (!bill) {
      return res
        .status(404)
        .json({ success: false, message: 'Patient test not found' });
    }

    // accept multiple client keys: customRefundAmount | amount | refundAmount
    const requestedRaw =
      req.body.customRefundAmount ??
      req.body.amount ??
      req.body.refundAmount ??
      null;

    const requested = clamp0(requestedRaw);
    if (!requested) {
      return res
        .status(400)
        .json({ success: false, message: 'Refund amount must be > 0' });
    }

    // Canonical numbers (same idea as radiology)
    const totalAmount = clamp0(bill.totalAmount);
    const discountAmount = clamp0(bill.discount ?? bill.discountAmount);
    const finalDueBase = clamp0(totalAmount - discountAmount);

    const paidBefore = clamp0(bill.totalPaid);
    const refundableBalance = paidBefore; // cash on hand

    const toRefund = Math.min(requested, refundableBalance);
    if (toRefund <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No refundable amount available' });
    }

    // 1) Reduce PAID by the refund
    const paidAfter = clamp0(paidBefore - toRefund);
    bill.totalPaid = paidAfter;

    // If you mirror paid into advanceAmount in lab, keep it synced
    if (typeof bill.advanceAmount !== 'undefined') {
      bill.advanceAmount = paidAfter;
    }

    // 2) Reduce the DUE by the same refund using a dedicated bucket
    // Lab already has cancelledAmount, so reuse it like waivedAmount in radiology
    bill.cancelledAmount = clamp0(bill.cancelledAmount) + toRefund;

    // Effective due after cancellations
    const effectiveDue = clamp0(finalDueBase - bill.cancelledAmount);

    // 3) Remaining = effectiveDue - totalPaid (refund never increases remaining)
    bill.remainingAmount = clamp0(effectiveDue - bill.totalPaid);

    // Track the refund event (history/audit)
    bill.refunded = bill.refunded || [];
    bill.refunded.push({
      refundAmount: toRefund,
      refundReason,
      refundedAt: new Date(),
      performedByid: req.user?._id || null,
      performedByname: req.user?.user_Name || null,
      method: req.body.method || 'cash',
    });

    // Optional trackers (for reporting)
    // In radiology we expose "how much is still refundable now" as totalPaid
    bill.refundableAmount = bill.totalPaid;

    // Status using effective due (same logic as radiology)
    const allRefunded = Array.isArray(bill.selectedTests)
      ? bill.selectedTests.every((t) =>
          ['refunded', 'cancelled'].includes(t.testStatus)
        )
      : false;

    if (bill.totalPaid === 0) {
      bill.paymentStatus = 'refunded';
    } else if (bill.remainingAmount === 0 && bill.totalPaid >= effectiveDue) {
      bill.paymentStatus = 'paid';
    } else if (bill.totalPaid > 0) {
      bill.paymentStatus = 'partial';
    } else {
      bill.paymentStatus = 'pending';
    }

    bill.history = bill.history || [];
    bill.history.push({
      action: 'refund',
      amount: toRefund,
      reason: refundReason,
      performedBy: req.user?.user_Name || 'system',
      at: new Date(),
    });

    await bill.save();

    return res.status(200).json({ success: true, data: bill });
  } catch (error) {
    console.error('Error processing lab refund:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing lab refund',
      error: error.message,
    });
  }
};

const finalizeRadiologyPayment = async (req, res) => {
  try {
    const { radiologyId } = req.params;
    const { customAmount, refundReason } = req.body;

    if (!mongoose.isValidObjectId(radiologyId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid radiologyId format',
      });
    }

    const radiologyReport = await hospitalModel.RadiologyReport.findById(
      radiologyId
    );
    if (!radiologyReport) {
      return res.status(404).json({
        success: false,
        message: 'Radiology report not found',
      });
    }

    if (radiologyReport.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Bill is already fully paid',
      });
    }

    const remainingAmount = radiologyReport.remainingAmount || 0;
    const paymentAmount = customAmount
      ? parseFloat(customAmount)
      : remainingAmount;

    if (customAmount && (!paymentAmount || paymentAmount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid custom payment amount',
      });
    }

    if (paymentAmount > remainingAmount) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount cannot exceed remaining amount',
      });
    }

    if (customAmount && !refundReason) {
      return res.status(400).json({
        success: false,
        message: 'Refund reason is required for custom payment amounts',
      });
    }

    radiologyReport.totalPaid =
      (radiologyReport.totalPaid || 0) + paymentAmount;
    radiologyReport.remainingAmount = remainingAmount - paymentAmount;
    radiologyReport.paymentStatus =
      radiologyReport.remainingAmount <= 0 ? 'paid' : 'partial';

    if (customAmount && radiologyReport.remainingAmount > 0) {
      radiologyReport.refunded = radiologyReport.refunded || [];
      radiologyReport.refunded.push({
        amount: radiologyReport.remainingAmount,
        reason: refundReason,
        date: new Date(),
      });
      radiologyReport.remainingAmount = 0;
      radiologyReport.paymentStatus = 'paid';
    }

    // Add history entry
    radiologyReport.history = radiologyReport.history || [];
    radiologyReport.history.push({
      action: 'finalize_payment',
      performedBy: req.user?.user_Name || 'system',
    });

    await radiologyReport.save();

    return res.status(200).json({
      success: true,
      data: radiologyReport,
    });
  } catch (error) {
    console.error('Error finalizing radiology payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Error finalizing radiology payment',
      error: error.message,
    });
  }
};

const toNum = (v) => (Number.isFinite(+v) ? +v : 0);
const clamp0 = (n) => Math.max(0, toNum(n));

const readRefundAmount = (r) =>
  toNum(
    r?.refundAmount ??
      r?.amount ??
      r?.value ??
      r?.paidBack ??
      r?.data?.refundAmount
  );

const getRefundedList = (b) => {
  if (Array.isArray(b?.refunded)) return b.refunded;
  if (Array.isArray(b?.billingInfo?.refunded)) return b.billingInfo.refunded;
  if (Array.isArray(b?.refunds)) return b.refunds;
  if (Array.isArray(b?.refundHistory)) return b.refundHistory;
  if (Array.isArray(b?.payment?.refunds)) return b.payment.refunds;
  return [];
};

const derivePaid = (bill) => {
  const explicitTotalPaid = toNum(bill?.totalPaid);
  if (explicitTotalPaid) return explicitTotalPaid;

  const advance = toNum(bill?.advanceAmount);
  const afterReport = toNum(bill?.paidAfterReport);
  const derived = advance + afterReport;
  return derived;
};

const refundRadiologyPayment = async (req, res) => {
  try {
    const { radiologyId } = req.params;
    const { refundReason } = req.body;

    if (!mongoose.isValidObjectId(radiologyId)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid radiologyId format' });
    }
    if (!refundReason) {
      return res
        .status(400)
        .json({ success: false, message: 'Refund reason is required' });
    }

    const bill = await hospitalModel.RadiologyReport.findById(radiologyId);
    if (!bill) {
      return res
        .status(404)
        .json({ success: false, message: 'Radiology report not found' });
    }

    // ----- canonical amounts / current state -----
    const prevRemaining = clamp0(bill.remainingAmount);
    const totalAmount = clamp0(bill.totalAmount); // sum of procedures list
    const discountAmount = clamp0(bill.discount ?? bill.discountAmount);
    const finalDueBase = clamp0(totalAmount - discountAmount); // due before refunds/waives

    // Money currently in hand (already net of any prior refunds if you kept totalPaid updated)
    let paidBefore = derivePaid(bill);

    // Optional: double-check prior refunds (for safety if totalPaid wasn't kept in sync)
    const refundedList = getRefundedList(bill);
    const totalPrevRefunds = refundedList.reduce(
      (sum, r) => sum + readRefundAmount(r),
      0
    );
    // If your DB's totalPaid already reflects prior refunds, do nothing.
    // If not, uncomment the next line to correct it on the fly:
    // paidBefore = clamp0(paidBefore - totalPrevRefunds);

    // Cap refunds by an explicit refundableAmount if provided
    const refundableCap = toNum(bill.refundableAmount) || paidBefore;

    // ----- requested amount -----
    const requestedRaw =
      req.body.customRefundAmount ??
      req.body.amount ??
      req.body.refundAmount ??
      null;

    const requested = clamp0(requestedRaw);
    if (!requested) {
      return res
        .status(400)
        .json({ success: false, message: 'Refund amount must be > 0' });
    }

    // Max we can refund right now
    const refundableBalance = clamp0(Math.min(paidBefore, refundableCap));
    const toRefund = Math.min(requested, refundableBalance);

    if (toRefund <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No refundable amount available' });
    }

    // ----- apply refund (NO way remaining goes up) -----
    // 1) reduce "paid" by refund
    const paidAfter = clamp0(paidBefore - toRefund);
    bill.totalPaid = paidAfter;

    // If your UI mirrors "advanceAmount" as the paid bucket, you may want to mirror it.
    // If you keep advanceAmount as "what was paid initially before report", then DO NOT mirror.
    // Uncomment if you mirror:
    // bill.advanceAmount = Math.min(toNum(bill.advanceAmount), bill.totalPaid);

    // 2) treat refunds as "waived/adjusted" amounts so effective due reflects the cancellation
    const newWaived = clamp0(bill.waivedAmount) + toRefund;
    bill.waivedAmount = Math.min(newWaived, finalDueBase); // never exceed base due

    // 3) recompute effective due and remaining; clamp remaining to never increase
    const effectiveDue = clamp0(finalDueBase - bill.waivedAmount);
    const recomputedRemaining = clamp0(effectiveDue - bill.totalPaid);
    bill.remainingAmount = Math.min(prevRemaining, recomputedRemaining);

    // 4) track refund event (audit/history)
    bill.refunded = refundedList; // ensure array ref
    bill.refunded.push({
      refundAmount: toRefund,
      refundReason,
      refundedAt: new Date(),
      performedByid: req.user?._id || null,
      performedByname: req.user?.user_Name || null,
      method: req.body.method || 'cash',
      totalPaidAtTime: bill.totalPaid, // optional breadcrumb for client calc
      remainingAtTime: bill.remainingAmount, // optional
    });

    // UI helper: how much can still be refunded now (equal to current totalPaid)
    bill.refundableAmount = bill.totalPaid;

    // DO NOT also add to cancelledAmount if waivedAmount is already used for refunds.
    // bill.cancelledAmount = clamp0(bill.cancelledAmount) + toRefund; // leave disabled to avoid double counting

    // ----- status logic -----
    const allRefunded =
      Array.isArray(bill.procedures) &&
      bill.procedures.length > 0 &&
      bill.procedures.every((p) =>
        ['refunded', 'cancelled'].includes(p?.status)
      );

    if (bill.totalPaid === 0) {
      bill.paymentStatus = 'refunded';
    } else if (bill.remainingAmount === 0 && bill.totalPaid >= effectiveDue) {
      bill.paymentStatus = 'paid';
    } else if (bill.totalPaid > 0) {
      bill.paymentStatus = 'partial';
    } else {
      bill.paymentStatus = 'pending';
    }

    // Append to generic history as well
    bill.history = bill.history || [];
    bill.history.push({
      action: 'refund',
      amount: toRefund,
      reason: refundReason,
      performedBy: req.user?.user_Name || 'system',
      at: new Date(),
    });

    await bill.save();

    return res.status(200).json({ success: true, data: bill });
  } catch (error) {
    console.error('Error processing radiology refund:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing radiology refund',
      error: error.message,
    });
  }
};

const getRadiologyBillDetailById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID' });
    }

    const bill = await hospitalModel.RadiologyReport.findById(id).lean();
    if (!bill) {
      return res
        .status(404)
        .json({ success: false, message: 'Radiology bill not found' });
    }

    const formattedBill = {
      _id: bill._id,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
      patientDetails: {
        patient_MRNo: bill.patientMRNO,
        patient_Name: bill.patientName,
        patient_ContactNo: bill.patient_ContactNo || '',
        patient_Gender: bill.sex,
        refund: bill.refunded,
      },
      billingSummary: {
        totalAmount: bill.totalAmount,
        discountAmount: bill.discount,
        advanceAmount: bill.advanceAmount,
        remainingAmount: bill.remainingAmount,
        paidAfterReport: bill.paidAfterReport,
        totalPaid: bill.totalPaid,
        paymentStatus: bill.paymentStatus,
        labNotes: bill.labNotes || '',
        tokenNumber: bill.tokenNumber || '',
        refunded: bill.refunded || [],
      },
      testResults: [],
      summary: {
        totalTests: 1,
        completedTests: bill.paymentStatus === 'paid' ? 1 : 0,
        pendingTests: bill.paymentStatus === 'pending' ? 1 : 0,
      },
      templateName: bill.templateName,
      finalContent: bill.finalContent,
      referBy: bill.referBy,
    };

    res.status(200).json({ success: true, data: formattedBill });
  } catch (error) {
    console.error('Error fetching radiology bill details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getLabBillSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (startDate && !dateRegex.test(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid startDate format. Use YYYY-MM-DD.',
      });
    }
    if (endDate && !dateRegex.test(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid endDate format. Use YYYY-MM-DD.',
      });
    }

    if (!startDate && !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a startDate or endDate',
      });
    }

    let query = {
      $or: [{ isDeleted: false }, { deleted: false }],
    };

    if (startDate && !endDate) {
      const sDate = new Date(startDate);
      if (isNaN(sDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid startDate.',
        });
      }

      const startOfDay = new Date(sDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(sDate.setHours(23, 59, 59, 999));

      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);

      if (isNaN(sDate) || isNaN(eDate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid startDate or endDate.',
        });
      }
      if (sDate > eDate) {
        return res.status(400).json({
          success: false,
          message: 'startDate cannot be later than endDate.',
        });
      }

      const startOfDay = new Date(sDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(eDate.setHours(23, 59, 59, 999));

      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const bills = await hospitalModel.PatientTest.find(query).lean();
    const radiologyBills = await hospitalModel.RadiologyReport.find(
      query
    ).lean();
    const allBills = [...bills, ...radiologyBills];

    return res.status(200).json({
      success: true,
      count: allBills.length,
      data: allBills,
    });
  } catch (error) {
    console.error('Error fetching lab bill summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

module.exports = {
  getAllTestBills,
  getTestBillsByPatientTestId,
  refundAmountbylab,
  finalizeRadiologyPayment,
  refundRadiologyPayment,
  getAllRadiologyBills,
  getRadiologyBillDetailById,
  getLabBillSummary,
};
