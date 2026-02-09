const Expense = require('../models/expenses.model');
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");
exports.createExpense = async (req, res) => {
  try {
    const { expenseType, doctor, doctorWelfare, otExpenses, otherExpenses, description, date } = req.body;

    // Validate required fields based on expense type
    if (!expenseType || !['doctor', 'hospital'].includes(expenseType)) {
      return res.status(400).json({
        success: false,
        message: 'Expense type is required and must be either "doctor" or "hospital"'
      });
    }

    // For doctor expenses, doctor field is required
    if (expenseType === 'doctor' && !doctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor name is required for doctor expenses'
      });
    }

    // Parse values to numbers with defaults
    const welfare = parseFloat(doctorWelfare) || 0;
    const ot = parseFloat(otExpenses) || 0;
    const other = parseFloat(otherExpenses) || 0;

    // Calculate total
    const total = welfare + ot + other;

    // Create new expense
    const expenseData = {
      expenseType,
      doctorWelfare: welfare,
      otExpenses: ot,
      otherExpenses: other,
      total,
      description: description || '',
      date: date || new Date()
    };

    // Add doctor field only for doctor expenses
    if (expenseType === 'doctor') {
      expenseData.doctor = doctor;
    } else {
      expenseData.doctor = null; // Ensure doctor is null for hospital expenses
    }

    const expense = new Expense(expenseData);
    await expense.save();

      emitGlobalEvent(req, EVENTS.EXPENSE, "create", expense);
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating expense',
      error: error.message
    });
  }
}
// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    // query params
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const { doctor } = req.query;

    // soft-delete toggles
    const includeDeleted = String(req.query.includeDeleted || "").toLowerCase() === "true";
    const onlyDeleted = String(req.query.onlyDeleted || "").toLowerCase() === "true";

    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (doctor) filter.doctor = { $regex: doctor, $options: "i" };

    // Soft delete handling
    if (onlyDeleted) {
      filter.deleted = true;
    } else if (!includeDeleted) {
      // default: exclude deleted
      filter.deleted = { $ne: true };
    }
    // if includeDeleted === true, we don't add deleted filter (show all)

    const [expenses, total] = await Promise.all([
      Expense.find(filter)
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Expense.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: expenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching expenses",
      error: error.message,
    });
  }
};


// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Get expense by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching expense',
      error: error.message
    });
  }
};


exports.updateExpense = async (req, res) => {
  try {
    const { doctor, doctorWelfare, otExpenses, otherExpenses, description } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    // Update fields
    if (doctor !== undefined) expense.doctor = doctor;
    if (doctorWelfare !== undefined) expense.doctorWelfare = parseFloat(doctorWelfare);
    if (otExpenses !== undefined) expense.otExpenses = parseFloat(otExpenses);
    if (otherExpenses !== undefined) expense.otherExpenses = parseFloat(otherExpenses);
    if (description !== undefined) expense.description = description;

    await expense.save();

      emitGlobalEvent(req, EVENTS.EXPENSE, "update", expense);

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error('Update expense error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating expense',
      error: error.message
    });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

      emitGlobalEvent(req, EVENTS.EXPENSE, "delete", expense);
    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting expense',
      error: error.message
    });
  }
};

// Soft delete expense
exports.softDeleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // mark as deleted instead of actually removing
    expense.deleted = true;
    await expense.save();

    emitGlobalEvent(req, EVENTS.EXPENSE, "softDelete", expense);

    res.json({
      success: true,
      message: "Expense soft-deleted successfully",
      expense, // returning the updated expense (optional)
    });
  } catch (error) {
    console.error("Soft delete expense error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while soft deleting expense",
      error: error.message,
    });
  }
};



exports.getDoctorSummary = async (req, res) => {
  try {
    const summary = await Expense.getDoctorSummary();

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get doctor summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctor summary',
      error: error.message
    });
  }
};


exports.getGrandTotals = async (req, res) => {
  try {
    const totals = await Expense.getGrandTotals();

    // Since aggregate returns an array, we take the first element
    const result = totals.length > 0 ? totals[0] : {
      grandWelfare: 0,
      grandOT: 0,
      grandOther: 0,
      grandTotal: 0,
      totalEntries: 0,
      totalDoctors: 0
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get grand totals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching grand totals',
      error: error.message
    });
  }
};

// @desc    Get complete summary (doctors + totals)
// @route   GET /api/expenses/summary/complete
// @access  Private
exports.getCompleteSummary = async (req, res) => {
  try {
    const [doctorSummary, grandTotals] = await Promise.all([
      Expense.getDoctorSummary(),
      Expense.getGrandTotals()
    ]);

    const totals = grandTotals.length > 0 ? grandTotals[0] : {
      grandWelfare: 0,
      grandOT: 0,
      grandOther: 0,
      grandTotal: 0,
      totalEntries: 0,
      totalDoctors: 0
    };

    res.json({
      success: true,
      data: {
        doctorSummary,
        grandTotals: totals
      }
    });
  } catch (error) {
    console.error('Get complete summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching complete summary',
      error: error.message
    });
  }
};