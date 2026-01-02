const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
// const RadiologyReport = require("../models/RadiologyReport");
const utils = require('../utils/utilsIndex');
const hospitalModel = require('../models/index.model');

const {
  getStaticPrice,
  normalizeTemplateName,
} = require('../utils/priceHelper');

const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");


// Utility functions
const loadTemplate = (templateNameRaw) => {
  const templateName = normalizeTemplateName(templateNameRaw);
  const filePath = path.join(__dirname, '../templates', templateName);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    throw new Error(`Template file not found: ${templateName}`);
  }
};

const createReport = async (req, res) => {
  try {
    const { patient = {}, studies = [] } = req.body;
    if (!Array.isArray(studies) || studies.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'At least one study is required' });
    }

    // Ensure MRNO + ensure patient exists (no transaction)
    const todayISO = new Date().toISOString().split('T')[0];
    let finalMRNO = (patient.patientMRNO || '').trim();

    if (!finalMRNO) {
      finalMRNO = await utils.generateUniqueMrNo(todayISO);
      await hospitalModel.Patient.updateOne(
        { patient_MRNo: finalMRNO, deleted: false },
        {
          $setOnInsert: {
            patient_MRNo: finalMRNO,
            patient_Name: patient.patientName || 'Unknown',
            gender: patient.sex || '',
            patient_ContactNo: patient.patient_ContactNo || '',
            age: patient.age || null,
            deleted: false,
          },
        },
        { upsert: true }
      );
    } else {
      const exists = await hospitalModel.Patient.findOne({
        patient_MRNo: finalMRNO,
        deleted: false,
      }).lean();
      if (!exists) {
        return res
          .status(400)
          .json({ success: false, message: 'MRNO not found in any patient' });
      }
      // optional header update
      await hospitalModel.Patient.updateOne(
        { patient_MRNo: finalMRNO, deleted: false },
        {
          $set: {
            patient_Name: patient.patientName ?? exists.patient_Name,
            gender: patient.sex ?? exists.gender,
            patient_ContactNo:
              patient.patient_ContactNo ?? exists.patient_ContactNo,
            age: patient.age ?? exists.age,
          },
        }
      );
    }

    const now = new Date();
    const performerName = req.user?.user_Name || 'Unknown';
    const performerId = req.user?.id || undefined;

    const toInt = (v) => Math.max(0, Math.floor(Number(v) || 0));

    // Build studies[]
    const builtStudies = studies.map((s) => {
      if (!s.templateName)
        throw new Error('templateName is required for each study');

      const html = loadTemplate(s.templateName);

      // amount: prefer incoming totalAmount/amount; else static price
      const incomingAmount = s.totalAmount ?? s.amount ?? 0;
      let amount = toInt(incomingAmount);
      let normalizedTemplate = '';

      if (!amount) {
        const { amount: defAmt, templateName: normalized } = getStaticPrice(
          s.templateName
        );
        amount = toInt(defAmt);
        normalizedTemplate = normalized; // ensured ".html"
      } else {
        normalizedTemplate = normalizeTemplateName(s.templateName);
      }

      // accept both totalPaid and paidAmount (for backward compat)
      const discountRaw = s.discount ?? 0;
      const paidRaw = s.totalPaid ?? s.paidAmount ?? s.advanceAmount ?? 0;

      // clamp
      const disc = Math.min(toInt(discountRaw), amount);
      const maxPayable = Math.max(0, amount - disc);
      const paid = Math.min(toInt(paidRaw), maxPayable);
      const remain = Math.max(0, amount - disc - paid);

      const status =
        remain === 0 ? 'paid' : paid > 0 || disc > 0 ? 'partial' : 'pending';

      return {
        templateName: normalizedTemplate,
        finalContent: html,
        referBy: s.referBy || '',

        totalAmount: amount,
        discount: disc,
        advanceAmount: paid, // keep if you use it elsewhere
        totalPaid: paid, // <-- correct key
        remainingAmount: remain,
        refundableAmount: paid, // or 0 if you don’t treat advance as refundable
        paymentStatus: status,

        refunded: [],
        history: [
          { action: 'created', performedBy: performerName, createdAt: now },
        ],
      };
    });

    // Aggregate totals across studies
    const totals = builtStudies.reduce(
      (acc, st) => {
        acc.aggTotalAmount += toInt(st.totalAmount);
        acc.aggTotalDiscount += toInt(st.discount);
        acc.aggTotalPaid += toInt(st.totalPaid);
        acc.aggRemainingAmount += toInt(st.remainingAmount);
        return acc;
      },
      {
        aggTotalAmount: 0,
        aggTotalDiscount: 0,
        aggTotalPaid: 0,
        aggRemainingAmount: 0,
      }
    );

    const aggStatus =
      totals.aggRemainingAmount === 0
        ? 'paid'
        : totals.aggTotalPaid > 0 || totals.aggTotalDiscount > 0
        ? 'partial'
        : 'pending';

    // Save ONE document (also set top-level totals so they’re not 0)
    const saved = await hospitalModel.RadiologyReport.create({
      patientMRNO: finalMRNO,
      patientName: patient.patientName || '',
      patient_ContactNo: patient.patient_ContactNo || '',
      age: patient.age || null,
      sex: patient.sex || '',
      date: now,
      deleted: false,

      studies: builtStudies,

      // top-level totals (mirror of aggregates)
      totalAmount: totals.aggTotalAmount,
      discount: totals.aggTotalDiscount,
      totalPaid: totals.aggTotalPaid,
      remainingAmount: totals.aggRemainingAmount,
      paymentStatus: aggStatus,
      advanceAmount: totals.aggTotalPaid, // optional
      refundableAmount: totals.aggTotalPaid, // optional
      paidAfterReport: 0, // initial

      // also keep agg* if your UI reads these
      ...totals,
      aggPaymentStatus: aggStatus,

      performedBy: { name: performerName, id: performerId },
      createdBy: performerId,
      history: [
        {
          action: 'bundle_created',
          performedBy: performerName,
          createdAt: now,
        },
      ],
    });

    emitGlobalEvent(req, EVENTS.RADIOLOGY, "create", saved);

    return res
      .status(201)
      .json({ success: true, patientMRNO: finalMRNO, data: saved });
  } catch (error) {
    console.error('createBundleReport error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create bundle report',
    });
  }
};

const getAvailableTemplates = async (req, res) => {
  try {
    const templatesDir = path.join(__dirname, '../templates');
    const files = fs.readdirSync(templatesDir);
    const templates = files
      .filter((file) => file.endsWith('.html'))
      .map((file) => file.replace('.html', ''));

    res.status(200).json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error) {
    console.error('Error fetching templates:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available templates',
    });
  }
};
// GET controller: hide deleted reports + hide deleted studies
// GET: hide deleted reports and any studies with _delete/_deleted set to true or "true"

const getReport = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      paymentStatus,
      gender,
      contact,
      dateRange,
      startDate,
      endDate,
      doctor,
      testName,
      minAmount,
      maxAmount,
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { deleted: { $ne: true } };
    const andConditions = [query];

    // Helper to push conditions safely
    const addCondition = (condition) => {
      if (condition) andConditions.push(condition);
    };

    // 1. Text Search (patient name, MRNo, contact)
    if (search && search.trim()) {
      const searchParts = search.trim().split(/\s+/);
      const textSearch = [];
      let parsedStatus = null;
      let parsedPaymentStatus = null;
      let parsedGender = null;
      let parsedContact = null;
      let parsedDoctor = null;
      let parsedTestName = null;

      searchParts.forEach((part) => {
        if (part.startsWith('status:')) {
          parsedStatus = part.slice(7).trim();
        } else if (part.startsWith('paymentStatus:')) {
          parsedPaymentStatus = part.slice(14).trim();
        } else if (part.startsWith('gender:')) {
          parsedGender = part.slice(7).trim();
        } else if (part.startsWith('contact:')) {
          parsedContact = part.slice(8).trim();
        } else if (part.startsWith('doctor:')) {
          parsedDoctor = part.slice(7).trim();
        } else if (part.startsWith('testName:')) {
          parsedTestName = part.slice(9).trim();
        } else {
          textSearch.push(part);
        }
      });

      // Free text search
      if (textSearch.length > 0) {
        const searchRegex = textSearch.join(' ');
        const orConditions = [
          { patientMRNO: { $regex: searchRegex, $options: 'i' } },
          { patientName: { $regex: searchRegex, $options: 'i' } },
          { referBy: { $regex: searchRegex, $options: 'i' } },
          { 'performedBy.name': { $regex: searchRegex, $options: 'i' } },
        ];

        addCondition({ $or: orConditions });
      }

      // Parsed filters from search string
      if (parsedStatus) addCondition({ aggPaymentStatus: parsedStatus });
      if (parsedPaymentStatus) addCondition({ aggPaymentStatus: parsedPaymentStatus });
      if (parsedGender) addCondition({ sex: parsedGender });
      if (parsedContact) {
        addCondition({
          patient_ContactNo: { $regex: parsedContact, $options: 'i' },
        });
      }
      if (parsedDoctor) {
        addCondition({
          referBy: { $regex: parsedDoctor, $options: 'i' },
        });
      }
      if (parsedTestName) {
        addCondition({
          'studies.templateName': { $regex: parsedTestName, $options: 'i' },
        });
      }
    }

    // 2. Direct filters (only if not already in search string)
    if (paymentStatus && paymentStatus.trim() && !search?.includes('paymentStatus:')) {
      addCondition({ aggPaymentStatus: paymentStatus.trim() });
    }

    if (status && status.trim() && !search?.includes('status:')) {
      addCondition({ aggPaymentStatus: status.trim() });
    }

    if (gender && gender.trim() && !search?.includes('gender:')) {
      addCondition({ sex: gender.trim() });
    }

    if (contact && contact.trim() && !search?.includes('contact:')) {
      addCondition({
        patient_ContactNo: { $regex: contact.trim(), $options: 'i' },
      });
    }

    if (doctor && doctor.trim() && !search?.includes('doctor:')) {
      addCondition({
        referBy: { $regex: doctor.trim(), $options: 'i' },
      });
    }

    if (testName && testName.trim() && !search?.includes('testName:')) {
      addCondition({
        'studies.templateName': { $regex: testName.trim(), $options: 'i' },
      });
    }

    // 3. Amount Range Filter
    if (minAmount || maxAmount) {
      const amountQuery = {};
      if (minAmount) {
        amountQuery.$gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        amountQuery.$lte = parseFloat(maxAmount);
      }
      if (Object.keys(amountQuery).length > 0) {
        addCondition({ aggTotalAmount: amountQuery });
      }
    }

    // 4. Date Range Filter (using the date field from schema)
    const dateFilter = parseDateRange(dateRange, startDate, endDate);
    if (dateFilter) {
      // Use the 'date' field from RadiologyReport schema
      addCondition({ date: dateFilter });
    }

    // Helper function to parse date ranges
    function parseDateRange(dateRange, startDate, endDate) {
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return { $gte: start, $lte: end };
      }

      if (dateRange) {
        const now = new Date();
        let start = new Date();
        
        switch (dateRange) {
          case 'today':
            start.setHours(0, 0, 0, 0);
            return { $gte: start, $lte: now };
          case 'yesterday':
            start.setDate(now.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            const endYesterday = new Date(start);
            endYesterday.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: endYesterday };
          case 'last7days':
            start.setDate(now.getDate() - 7);
            return { $gte: start, $lte: now };
          case 'last30days':
            start.setDate(now.getDate() - 30);
            return { $gte: start, $lte: now };
          case 'thisMonth':
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            return { $gte: start, $lte: now };
          case 'lastMonth':
            start.setMonth(now.getMonth() - 1);
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            const endLastMonth = new Date(start);
            endLastMonth.setMonth(endLastMonth.getMonth() + 1);
            endLastMonth.setDate(0);
            endLastMonth.setHours(23, 59, 59, 999);
            return { $gte: start, $lte: endLastMonth };
          default:
            return null;
        }
      }
      
      return null;
    }

    // Final query
    const finalQuery = andConditions.length > 1 ? { $and: andConditions } : query;


    // Execute queries in parallel
    const [reportsRaw, total] = await Promise.all([
      hospitalModel.RadiologyReport.find(finalQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),

      hospitalModel.RadiologyReport.countDocuments(finalQuery),
    ]);

    // Filter out deleted studies and clean up data
    const reports = reportsRaw.map((r) => {
      const studies = (r.studies || [])
        .filter((s) => {
          const del =
            s?._delete === true ||
            s?._delete === 'true' ||
            s?._deleted === true ||
            s?._deleted === 'true';
          return !del;
        })
        .map((s) => {
          // strip flags so frontend never sees them
          const { _delete, _deleted, ...rest } = s || {};
          return rest;
        });

      return { ...r, studies };
    });

    // Get total patients count (optional)
    const totalPatients = await hospitalModel.Patient.countDocuments({ deleted: false });

    res.status(200).json({
      success: true,
      data: {
        reports,
        totalPatients,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching radiology reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch radiology reports.',
      error: error.message,
    });
  }
};

const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid report ID format' });
    }

    const report = await hospitalModel.RadiologyReport.findById(id);
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: 'Report not found' });
    }
    report.studies = Array.isArray(report.studies) ? report.studies : [];

    const now = new Date();
    const performerName = req.user?.user_Name || 'Unknown';
    const performerId = req.user?.id;
    const toInt = (v) => Math.max(0, Math.floor(Number(v) || 0));

    // ---- normalize template once (.html only once) ----
    const safeNormalizeTemplateName = (name) => {
      const raw = String(name || '').trim();
      if (!raw) return '';
      const base = raw.replace(/(\.html)+$/i, '');
      return `${base}.html`;
    };

    // optional wrappers (safe if helpers not present)
    const getStaticPriceSafe = (templateName) => {
      try {
        if (typeof getStaticPrice === 'function') {
          const out = getStaticPrice(templateName) || {};
          if (out.templateName)
            out.templateName = safeNormalizeTemplateName(out.templateName);
          return out;
        }
      } catch (_) {}
      return {
        amount: 0,
        templateName: safeNormalizeTemplateName(templateName),
      };
    };

    const loadTemplateSafe = (templateName) => {
      try {
        if (typeof loadTemplate === 'function')
          return loadTemplate(templateName) ?? '';
      } catch (_) {}
      return '';
    };

    const computeMoneyForStudy = (base, patch = {}) => {
      const amount = toInt(
        patch.totalAmount ?? patch.amount ?? base.totalAmount ?? 0
      );

      const newDiscountRaw =
        patch.discount != null
          ? toInt(patch.discount)
          : toInt(base.discount || 0);
      const addDiscount = toInt(patch.addDiscount || 0);
      let discount = newDiscountRaw + addDiscount;

      let paid = (() => {
        if (patch.totalPaid != null) return toInt(patch.totalPaid);
        if (patch.advanceAmount != null) return toInt(patch.advanceAmount);
        if (patch.paidAmount != null) return toInt(patch.paidAmount);
        return toInt(base.totalPaid || base.advanceAmount || 0);
      })();
      const addPayment = toInt(patch.addPayment || 0);
      paid += addPayment;

      discount = Math.min(discount, amount);
      const maxPayable = Math.max(0, amount - discount);
      paid = Math.min(paid, maxPayable);

      const remaining = Math.max(0, amount - discount - paid);
      const status =
        remaining === 0
          ? 'paid'
          : paid > 0 || discount > 0
          ? 'partial'
          : 'pending';

      return {
        totalAmount: amount,
        discount,
        totalPaid: paid,
        advanceAmount: paid,
        remainingAmount: remaining,
        refundableAmount: paid,
        paymentStatus: status,
      };
    };

    const buildNewStudy = (s) => {
      if (!s?.templateName)
        throw new Error('templateName is required for each study');

      const normalizedTemplate = safeNormalizeTemplateName(s.templateName);
      let amount = toInt(s.totalAmount ?? s.amount ?? 0);
      if (!amount) {
        const { amount: defAmt } = getStaticPriceSafe(normalizedTemplate);
        amount = toInt(defAmt);
      }

      const html =
        s.finalContent != null
          ? s.finalContent
          : loadTemplateSafe(normalizedTemplate);
      const money = computeMoneyForStudy(
        { totalAmount: amount, discount: 0, totalPaid: 0, advanceAmount: 0 },
        s
      );

      return {
        templateName: normalizedTemplate,
        finalContent: html,
        referBy: s.referBy || '',
        ...money,
        refunded: [],
        history: [
          { action: 'created', performedBy: performerName, createdAt: now },
        ],
      };
    };

    // ---------- 1) PATIENT HEADER ----------
    const {
      patient = {},
      patientName,
      patient_ContactNo,
      age,
      sex,
      date,
    } = req.body || {};

    const newHeader = {
      patientName: patient.patientName ?? patientName,
      patient_ContactNo: patient.patient_ContactNo ?? patient_ContactNo,
      age: patient.age ?? age,
      sex: patient.sex ?? sex,
      date,
    };

    if (newHeader.patientName != null)
      report.patientName = newHeader.patientName;
    if (newHeader.patient_ContactNo != null)
      report.patient_ContactNo = newHeader.patient_ContactNo;
    if (newHeader.age != null) report.age = newHeader.age;
    if (newHeader.sex != null) report.sex = newHeader.sex;
    if (newHeader.date != null) report.date = newHeader.date;

    // keep patient doc in sync (no soft-delete filter anymore)
    if (
      newHeader.patientName != null ||
      newHeader.patient_ContactNo != null ||
      newHeader.age != null ||
      newHeader.sex != null
    ) {
      await hospitalModel.Patient.updateOne(
        { patient_MRNo: report.patientMRNO },
        {
          $set: {
            patient_Name:
              newHeader.patientName ?? report.patientName ?? undefined,
            patient_ContactNo:
              newHeader.patient_ContactNo ??
              report.patient_ContactNo ??
              undefined,
            age: newHeader.age ?? report.age ?? undefined,
            gender: newHeader.sex ?? report.sex ?? undefined,
          },
        }
      );
    }

    // ---------- 2) STUDIES: HARD DELETE / EDIT / ADD ----------
    const {
      studies = undefined,
      replaceStudies = false,
      // Explicit hard removals
      removeStudies = [], // mixed: ids or template names
      removeById = [],
      removeByTemplate = [],
    } = req.body || {};

    const isHex24 = (x) => typeof x === 'string' && /^[0-9a-fA-F]{24}$/.test(x);

    // (A) Explicit removals before any edits/additions
    const toRemoveIds = new Set(
      [...removeById, ...removeStudies.filter(isHex24)].map(String)
    );
    const toRemoveNames = new Set(
      [...removeByTemplate, ...removeStudies.filter((x) => !isHex24(x))].map(
        safeNormalizeTemplateName
      )
    );

    if (toRemoveIds.size || toRemoveNames.size) {
      const before = report.studies.length;
      report.studies = report.studies.filter(
        (st) =>
          !toRemoveIds.has(String(st._id)) &&
          !toRemoveNames.has(safeNormalizeTemplateName(st.templateName))
      );
      const removed = before - report.studies.length;
      if (removed > 0) {
        report.history = report.history || [];
        report.history.push({
          action: `removed_${removed}_studies`,
          performedBy: performerName,
          createdAt: now,
        });
      }
    }

    if (Array.isArray(studies)) {
      if (replaceStudies) {
        // Full replacement
        const rebuilt = studies.map((s) => buildNewStudy(s));
        const byName = new Map();
        for (const st of rebuilt)
          byName.set(safeNormalizeTemplateName(st.templateName), st);
        report.studies = Array.from(byName.values()); // last wins
      } else {
        // Edit / Add in place
        const byId = new Map(report.studies.map((st) => [String(st._id), st]));
        const byName = new Map(
          report.studies.map((st) => [
            safeNormalizeTemplateName(st.templateName),
            st,
          ])
        );

        for (const s of studies) {
          const incomingName = s?.templateName
            ? safeNormalizeTemplateName(s.templateName)
            : '';

          if (s?._id && byId.has(String(s._id))) {
            // EDIT by _id (with dedupe on rename)
            const ex = byId.get(String(s._id));

            // rename handling
            if (incomingName) {
              const currentName = safeNormalizeTemplateName(ex.templateName);
              if (incomingName !== currentName) {
                const target = byName.get(incomingName);
                if (target && String(target._id) !== String(ex._id)) {
                  // merge into target then drop ex
                  const money = computeMoneyForStudy(
                    target.toObject ? target.toObject() : target,
                    s
                  );
                  if (s.finalContent != null)
                    target.finalContent = s.finalContent;
                  if (s.referBy != null) target.referBy = s.referBy;
                  Object.assign(target, money);
                  target.history = target.history || [];
                  target.history.push({
                    action: 'edited',
                    performedBy: performerName,
                    createdAt: now,
                  });

                  report.studies = report.studies.filter(
                    (it) => String(it._id) !== String(ex._id)
                  );
                  byId.delete(String(ex._id));
                  byName.delete(currentName);
                  byName.set(incomingName, target);
                  continue;
                } else {
                  ex.templateName = incomingName;
                  byName.delete(currentName);
                  byName.set(incomingName, ex);
                }
              }
            }

            if (s.finalContent != null) ex.finalContent = s.finalContent;
            if (s.referBy != null) ex.referBy = s.referBy;

            const money = computeMoneyForStudy(
              ex.toObject ? ex.toObject() : ex,
              s
            );
            Object.assign(ex, money);

            ex.history = ex.history || [];
            ex.history.push({
              action: 'edited',
              performedBy: performerName,
              createdAt: now,
            });
          } else {
            // ADD new or EDIT by name (no _id)
            if (incomingName && byName.has(incomingName)) {
              const ex = byName.get(incomingName);
              if (s.finalContent != null) ex.finalContent = s.finalContent;
              if (s.referBy != null) ex.referBy = s.referBy;
              const money = computeMoneyForStudy(
                ex.toObject ? ex.toObject() : ex,
                s
              );
              Object.assign(ex, money);
              ex.history = ex.history || [];
              ex.history.push({
                action: 'edited',
                performedBy: performerName,
                createdAt: now,
              });
            } else {
              const fresh = buildNewStudy(s);
              report.studies.push(fresh);
              const key = safeNormalizeTemplateName(fresh.templateName);
              byName.set(key, fresh);
            }
          }
        }

        // safety: collapse any duplicates by templateName (last wins)
        const folded = new Map();
        for (const st of report.studies) {
          folded.set(safeNormalizeTemplateName(st.templateName), st);
        }
        report.studies = Array.from(folded.values());
      }
    }

    // ---------- 2.5) REFER BY CASCADE (change one => change all) ----------
    const pickCascadedReferBy = () => {
      const top = (
        req.body?.referBy ??
        req.body?.patient?.ReferredBy ??
        ''
      ).trim();
      if (top) return top;
      if (Array.isArray(req.body?.studies)) {
        for (const s of req.body.studies) {
          const v = (s?.referBy ?? '').trim();
          if (v) return v;
        }
      }
      return '';
    };

    const candidateReferBy = pickCascadedReferBy();
    const shouldCascade =
      (req.body?.cascadeReferBy ?? true) && candidateReferBy; // default: cascade ON

    if (shouldCascade) {
      for (const st of report.studies) {
        st.referBy = candidateReferBy;
        st.history = st.history || [];
        st.history.push({
          action: 'referby_cascaded',
          performedBy: performerName,
          createdAt: now,
        });
      }
      report.markModified('studies');
    }

    // ---------- 3) TOTALS ----------
    const totals = (report.studies || []).reduce(
      (acc, st) => {
        acc.aggTotalAmount += toInt(st.totalAmount);
        acc.aggTotalDiscount += toInt(st.discount);
        acc.aggTotalPaid += toInt(st.totalPaid);
        acc.aggRemainingAmount += toInt(st.remainingAmount);
        return acc;
      },
      {
        aggTotalAmount: 0,
        aggTotalDiscount: 0,
        aggTotalPaid: 0,
        aggRemainingAmount: 0,
      }
    );

    const aggStatus =
      totals.aggRemainingAmount === 0
        ? 'paid'
        : totals.aggTotalPaid > 0 || totals.aggTotalDiscount > 0
        ? 'partial'
        : 'pending';

    report.totalAmount = totals.aggTotalAmount;
    report.discount = totals.aggTotalDiscount;
    report.totalPaid = totals.aggTotalPaid;
    report.remainingAmount = totals.aggRemainingAmount;
    report.paymentStatus = aggStatus;
    report.advanceAmount = totals.aggTotalPaid;
    report.refundableAmount = totals.aggTotalPaid;

    report.aggTotalAmount = totals.aggTotalAmount;
    report.aggTotalDiscount = totals.aggTotalDiscount;
    report.aggTotalPaid = totals.aggTotalPaid;
    report.aggRemainingAmount = totals.aggRemainingAmount;
    report.aggPaymentStatus = aggStatus;

    report.history = report.history || [];
    report.history.push({
      action: 'bundle_updated',
      performedBy: performerName,
      createdAt: now,
    });

    if (!report.createdBy) report.createdBy = performerId;
    report.performedBy = { name: performerName, id: performerId };

    await report.save();
    
    emitGlobalEvent(req, EVENTS.RADIOLOGY, "update", report);

    return res
      .status(200)
      .json({ success: true, message: 'Report updated', data: report });
  } catch (error) {
    console.error('updateReport error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update report',
    });
  }
};

const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    // also ignore deleted reports
    const reportRaw = await hospitalModel.RadiologyReport.findOne({
      _id: id,
      deleted: { $ne: true },
    }).lean();

    if (!reportRaw) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    // filter out deleted studies
    const studies = (reportRaw.studies || [])
      .filter((s) => {
        const del =
          s?._delete === true ||
          s?._delete === 'true' ||
          s?._deleted === true ||
          s?._deleted === 'true';
        return !del;
      })
      .map((s) => {
        const { _delete, _deleted, ...rest } = s || {};
        return rest;
      });

    const report = { ...reportRaw, studies };

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('Error fetching report by ID:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch report',
    });
  }
};

const getRadiologyReportSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate && !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a startDate or endDate',
      });
    }

    // Construct query
    let query = { deleted: false };

    if (startDate && !endDate) {
      const sDate = new Date(startDate);
      query.date = {
        $gte: new Date(sDate.setHours(0, 0, 0, 0)),
        $lt: new Date(sDate.setHours(23, 59, 59, 999)),
      };
    } else if (startDate && endDate) {
      const sDate = new Date(startDate);
      const eDate = new Date(endDate);
      query.date = {
        $gte: new Date(sDate.setHours(0, 0, 0, 0)),
        $lte: new Date(eDate.setHours(23, 59, 59, 999)),
      };
    }

    // Find matching radiology reports
    const reports = await hospitalModel.RadiologyReport.find(query)
      .sort({ date: 1 })
      .select(
        'patientMRNO patientName patient_ContactNo age sex date templateName referBy createdAt'
      )
      .lean();

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    console.error('Error fetching radiology reports:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// controller
const getReportByMrno = async (req, res) => {
  try {
    const { mrno } = req.params;
    if (!mrno) {
      return res
        .status(400)
        .json({ success: false, message: 'mrno is required' });
    }

    // NOTE: ensure your RadiologyReport schema has { timestamps: true } to use updatedAt
    const doc = await hospitalModel.RadiologyReport.findOne({
      patientMRNO: mrno,
      deleted: false,
    }).sort({ updatedAt: -1 });

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: 'No report found for this MRNO' });
    }

    return res.json({ success: true, data: doc });
  } catch (e) {
    console.error('getReportByMrno error:', e);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch report' });
  }
};

// GET: only return reports & studies that are marked deleted
const softDeleteStudyById = async (req, res) => {
  try {
    const { studyId } = req.params;

    const updated = await hospitalModel.RadiologyReport.findOneAndUpdate(
      { 'studies._id': studyId, deleted: { $ne: true } },
      {
        $set: { 'studies.$._delete': true }, // store as boolean
        $push: {
          'studies.$.history': {
            action: 'soft_deleted',
            performedBy: req.user?.user_Name || 'Unknown',
            createdAt: new Date(),
          },
        },
      },
      { new: true, projection: { studies: { $elemMatch: { _id: studyId } } } }
    ).lean();

    if (!updated || !updated.studies?.[0]) {
      return res
        .status(404)
        .json({ success: false, message: 'Study not found' });
    }

    emitGlobalEvent(req, EVENTS.RADIOLOGY, "soft_delete", updated);

    res
      .status(200)
      .json({ success: true, message: 'Study soft-deleted', studyId });
  } catch (e) {
    console.error('softDeleteStudyById error:', e);
    res.status(500).json({ success: false, message: 'Failed to delete study' });
  }
};



const safeNormalizeTemplateName = (name) => {
  const raw = String(name || '')
    .trim()
    .toLowerCase();;
  if (!raw) return '';
  const base = raw.replace(/(\.html)+$/i, '');
  return `${base}.html`;
};

const isHex24 = (x) => typeof x === 'string' && /^[0-9a-fA-F]{24}$/.test(x);

const updateFinalContent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !isHex24(id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid report ID format' });
    }

    // Accept either:
    // 1) { studyId, finalContent }
    // 2) { templateName, finalContent }
    // 3) { studies: [{ _id | templateName, finalContent }, ...] }
    // finalContent is required for each target.
    const payload = req.body || {};
    const performerName = req.user?.user_Name || 'Unknown';
    const performerId = req.user?.id;
    const now = new Date();

    // collect update intents into a uniform array
    let intents = [];
    if (Array.isArray(payload.studies)) {
      intents = payload.studies.map((s) => ({
        _id: s?._id || payload.studyId, // allow per-item _id
        templateName: s?.templateName,
        finalContent: s?.finalContent,
      }));
    } else {
      intents.push({
        _id: payload.studyId,
        templateName: payload.templateName,
        finalContent: payload.finalContent,
      });
    }

    // validate intents
    intents = intents
      .map((it) => ({
        _id: it?._id,
        templateName: it?.templateName
          ? safeNormalizeTemplateName(it.templateName)
          : '',
        finalContent: it?.finalContent,
      }))
      .filter((it) => typeof it.finalContent === 'string');

    if (intents.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          'Provide at least one target with `finalContent` and either `_id` or `templateName`.',
      });
    }

    const report = await hospitalModel.RadiologyReport.findById(id);
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: 'Report not found' });
    }

    report.studies = Array.isArray(report.studies) ? report.studies : [];

    // index existing studies by id and by normalized templateName
    const byId = new Map(report.studies.map((st) => [String(st._id), st]));
    const byName = new Map(
      report.studies.map((st) => [safeNormalizeTemplateName(st.templateName), st])
    );

    let updatedCount = 0;

    for (const it of intents) {
      let target = null;

      if (it._id && byId.has(String(it._id))) {
        target = byId.get(String(it._id));
      } else if (it.templateName && byName.has(it.templateName)) {
        target = byName.get(it.templateName);
      }

      if (!target) {
        // If strict, skip silently. If you prefer a hard error, collect and report.
        continue;
      }

      // ONLY update the HTML content; do not alter money/headers/totals.
      target.finalContent = it.finalContent;

      target.history = target.history || [];
      target.history.push({
        action: 'content_updated',
        performedBy: performerName,
        createdAt: now,
      });

      updatedCount += 1;
    }

    if (updatedCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          'No matching studies were found by provided `_id` or `templateName`.',
      });
    }

    // mark nested path modified so Mongoose persists changes
    report.markModified('studies');

    // optional: set performer meta without changing createdBy/etc.
    report.performedBy = { name: performerName, id: performerId };
    report.history = report.history || [];
    report.history.push({
      action: `final_content_updated_${updatedCount}_studies`,
      performedBy: performerName,
      createdAt: now,
    });

    await report.save();

    emitGlobalEvent(req, EVENTS.RADIOLOGY, "update_final_content", report);

    return res.status(200).json({
      success: true,
      message: `Updated finalContent for ${updatedCount} stud${updatedCount > 1 ? 'ies' : 'y'}.`,
      data: report,
    });
  } catch (error) {
    console.error('updateFinalContent error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update final content',
    });
  }
};

module.exports = {
  getAvailableTemplates,
  createReport,
  getReport,
  updateReport,
  getReportById,
  getRadiologyReportSummary,
  getReportByMrno,
  softDeleteStudyById,
  updateFinalContent,
};
