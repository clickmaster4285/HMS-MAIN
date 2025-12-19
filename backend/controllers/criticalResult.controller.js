const CriticalResult = require('../models/criticalResult.model');
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");
// ✅ Create a new Critical Result
const createCriticalResult = async (req, res) => {
  try {
    const newResult = new CriticalResult(req.body);
    await newResult.save();
    emitGlobalEvent(req, EVENTS.CRITICAL_RESULT, "create", newResult);
    res.status(201).json({ success: true, data: newResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all Critical Results
const getAllCriticalResults = async (req, res) => {
  try {
    const results = await CriticalResult.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Critical Result by ID
const getCriticalResultById = async (req, res) => {
  try {
    const result = await CriticalResult.findById(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: 'Result not found' });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Critical Result
const updateCriticalResult = async (req, res) => {
  try {
    const updated = await CriticalResult.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: 'Result not found' });
    }
    emitGlobalEvent(req, EVENTS.CRITICAL_RESULT, "update", updated);  
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete Critical Result
const deleteCriticalResult = async (req, res) => {
  try {
    const deleted = await CriticalResult.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: 'Result not found' });
    }
    emitGlobalEvent(req, EVENTS.CRITICAL_RESULT, "delete", deleted);
    res
      .status(200)
      .json({ success: true, message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// controllers/critical.controller.js
const getSummaryByDate = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    if (!startDate && !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a startDate or endDate',
      });
    }

    // normalize to YYYY-MM-DD strings
    const toYMD = (d) => new Date(d).toISOString().slice(0, 10);
    if (startDate) startDate = toYMD(startDate);
    if (endDate) endDate = toYMD(endDate);
    if (!endDate) endDate = startDate; // single-day query

    // If your schema has "isDeleted" use it here
    const base = {}; // e.g. { isDeleted: false }

    // Primary filter by the string "date" field
    const dateRangeString = { $gte: startDate, $lte: endDate };

    // Optional fallback by createdAt (if some docs lack "date")
    const s0 = new Date(`${startDate}T00:00:00.000Z`);
    const e0 = new Date(`${endDate}T23:59:59.999Z`);

    const query = {
      ...base,
      $or: [{ date: dateRangeString }, { createdAt: { $gte: s0, $lte: e0 } }],
    };

    const criticals = await CriticalResult.find(query)
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: criticals.length,
      data: criticals,
    });
  } catch (error) {
    console.error('Error fetching critical summary:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching critical summary',
      error: error.message,
    });
  }
};

module.exports = {
  createCriticalResult,
  getAllCriticalResults,
  getCriticalResultById,
  updateCriticalResult,
  deleteCriticalResult,
  getSummaryByDate,
};
