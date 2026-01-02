const Expense = require('../models/expenses.model');
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");

// Helper function for date range parsing (similar to patient tests)
function parseDateRange(dateRange, startDate, endDate) {
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return { $gte: start, $lte: end };
  }

  if (dateRange) {
    const now = new Date();
    switch (dateRange.toLowerCase()) {
      case 'today':
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        return { $gte: todayStart, $lte: todayEnd };
      
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
        return { $gte: yesterdayStart, $lte: yesterdayEnd };
      
      case 'thisweek':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return { $gte: weekStart, $lte: weekEnd };
      
      case 'thismonth':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        return { $gte: monthStart, $lte: monthEnd };
      
      case 'lastmonth':
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        return { $gte: lastMonthStart, $lte: lastMonthEnd };
      
      case 'thisyear':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        return { $gte: yearStart, $lte: yearEnd };
    }
  }

  return null;
}



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
    // Query parameters with defaults
    const {
      page = 1,
      limit = 20,
      search,
      expenseType,
      doctor,
      dateRange,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      status, // For deleted status
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { deleted: false }; // Default: show non-deleted
    const andConditions = [query];

    // Helper to push conditions safely
    const addCondition = (condition) => {
      if (condition) andConditions.push(condition);
    };

    // 1. Text Search (doctor name, description)
    if (search && search.trim()) {
      const searchParts = search.trim().split(/\s+/);
      const textSearch = [];
      let parsedExpenseType = null;
      let parsedDoctor = null;
      let parsedMinAmount = null;
      let parsedMaxAmount = null;
      let parsedStatus = null;

      // Parse search parts for specific filters
      searchParts.forEach((part) => {
        if (part.startsWith('type:')) {
          parsedExpenseType = part.slice(5).trim();
        } else if (part.startsWith('doctor:')) {
          parsedDoctor = part.slice(7).trim();
        } else if (part.startsWith('minAmount:')) {
          const amount = parseFloat(part.slice(10).trim());
          if (!isNaN(amount)) parsedMinAmount = amount;
        } else if (part.startsWith('maxAmount:')) {
          const amount = parseFloat(part.slice(10).trim());
          if (!isNaN(amount)) parsedMaxAmount = amount;
        } else if (part.startsWith('status:')) {
          parsedStatus = part.slice(7).trim().toLowerCase();
        } else {
          textSearch.push(part);
        }
      });

      // Free text search (doctor name or description)
      if (textSearch.length > 0) {
        const searchRegex = textSearch.join(' ');
        const orConditions = [
          { doctor: { $regex: searchRegex, $options: 'i' } },
          { description: { $regex: searchRegex, $options: 'i' } },
        ];
        
        // Also search by expense type
        const expenseTypes = ['doctor', 'hospital'];
        const matchedType = expenseTypes.find(type => 
          type.toLowerCase().includes(searchRegex.toLowerCase())
        );
        if (matchedType) {
          orConditions.push({ expenseType: matchedType });
        }

        addCondition({ $or: orConditions });
      }

      // Apply parsed filters from search string
      if (parsedExpenseType && ['doctor', 'hospital'].includes(parsedExpenseType.toLowerCase())) {
        addCondition({ expenseType: parsedExpenseType.toLowerCase() });
      }
      
      if (parsedDoctor) {
        addCondition({ doctor: { $regex: parsedDoctor, $options: 'i' } });
      }
      
      if (parsedMinAmount !== null) {
        addCondition({ total: { $gte: parsedMinAmount } });
      }
      
      if (parsedMaxAmount !== null) {
        addCondition({ total: { $lte: parsedMaxAmount } });
      }
      
      if (parsedStatus === 'deleted') {
        // Override default deleted filter
        const index = andConditions.findIndex(cond => cond.deleted === false);
        if (index > -1) {
          andConditions[index] = { deleted: true };
        }
      } else if (parsedStatus === 'all') {
        // Remove deleted filter to show all
        const index = andConditions.findIndex(cond => cond.hasOwnProperty('deleted'));
        if (index > -1) {
          andConditions.splice(index, 1);
        }
      }
    }

    // 2. Direct filters (only if not already in search string)
    if (expenseType && expenseType.trim() && !search?.includes('type:')) {
      const type = expenseType.trim().toLowerCase();
      if (['doctor', 'hospital'].includes(type)) {
        addCondition({ expenseType: type });
      }
    }

    if (doctor && doctor.trim() && !search?.includes('doctor:')) {
      addCondition({ doctor: { $regex: doctor.trim(), $options: 'i' } });
    }

    // 3. Amount range filters (direct params)
    if (minAmount && !search?.includes('minAmount:')) {
      const amount = parseFloat(minAmount);
      if (!isNaN(amount)) {
        addCondition({ total: { $gte: amount } });
      }
    }
    
    if (maxAmount && !search?.includes('maxAmount:')) {
      const amount = parseFloat(maxAmount);
      if (!isNaN(amount)) {
        addCondition({ total: { $lte: amount } });
      }
    }

    // 4. Date Range Filter
    const dateFilter = parseDateRange(dateRange, startDate, endDate);
    if (dateFilter) {
      addCondition({ date: dateFilter });
    }

    // 5. Status filter (for deleted records)
    if (status && status.trim() && !search?.includes('status:')) {
      const statusValue = status.trim().toLowerCase();
      if (statusValue === 'deleted') {
        // Override default deleted filter
        const index = andConditions.findIndex(cond => cond.deleted === false);
        if (index > -1) {
          andConditions[index] = { deleted: true };
        }
      } else if (statusValue === 'all') {
        // Remove deleted filter to show all
        const index = andConditions.findIndex(cond => cond.hasOwnProperty('deleted'));
        if (index > -1) {
          andConditions.splice(index, 1);
        }
      }
      // If status is 'active', keep the default deleted: false
    }

    // 6. Build final query
    const finalQuery = andConditions.length > 1 ? { $and: andConditions } : query;


    // 7. Build sort object
    const sort = {};
    switch (sortBy) {
      case 'date':
        sort.date = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'total':
        sort.total = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'doctor':
        sort.doctor = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'createdAt':
        sort.createdAt = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sort.date = -1; // Default sort by date descending
    }

    // Execute queries in parallel
    const [expenses, total] = await Promise.all([
      Expense.find(finalQuery)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),

      Expense.countDocuments(finalQuery),
    ]);

    // 8. Calculate totals for current filtered results
    const totals = await Expense.aggregate([
      { $match: finalQuery },
      {
        $group: {
          _id: null,
          totalDoctorWelfare: { $sum: "$doctorWelfare" },
          totalOTExpenses: { $sum: "$otExpenses" },
          totalOtherExpenses: { $sum: "$otherExpenses" },
          grandTotal: { $sum: "$total" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalDoctorWelfare: 1,
          totalOTExpenses: 1,
          totalOtherExpenses: 1,
          grandTotal: 1,
          count: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        expenses,
        summary: totals[0] || {
          totalDoctorWelfare: 0,
          totalOTExpenses: 0,
          totalOtherExpenses: 0,
          grandTotal: 0,
          count: 0
        },
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching expenses',
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