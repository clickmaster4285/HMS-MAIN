const hospitalModel = require('../models/index.model');
const { getPurposeCategory } = require('../utils/departmentFromPurpose');

exports.getSummary = async (req, res) => {
   try {
      // Get date range from query parameters (default to today)
      const { startDate, endDate } = req.query;

      // Parse dates or default to today
      const today = new Date();
      const start = startDate ? new Date(startDate) : new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const end = endDate ? new Date(endDate) : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      // Adjust end date to include the entire day
      end.setHours(23, 59, 59, 999);

      // Fetch all data in parallel
      const [doctors, opdPatients, ipdRecords, refunds] = await Promise.all([
         hospitalModel.Doctor.find().populate('user', 'user_Name').lean(),
         hospitalModel.Patient.find().select('visits').lean(),
         hospitalModel.AdmittedPatient.find({
            deleted: false,
            createdAt: { $gte: start, $lt: end }
         }).populate('patient', 'patient_Name patient_MRNo').lean(),
         hospitalModel.Refund.find({
            refundDate: { $gte: start, $lt: end }
         }).populate('patient', 'patient_Name patient_MRNo').lean()
      ]);

      // OPD Statistics
      const doctorStats = {};
      const purposeStats = {};
      const opdStats = {
         total: 0,
         withDoctor: 0,
         withoutDoctor: 0,
         revenue: 0,
         today: 0, // This now represents "within date range"
         todayRevenue: 0, // This now represents "revenue within date range"
         totalDiscount: 0, // NEW: Track total discount given
         totalFeesBeforeDiscount: 0 // NEW: Track fees before discount
      };

      // Initialize purpose categories
      ['xray', 'ecg', 'bsr', 'labtest', 'consultation', 'other'].forEach(cat => {
         purposeStats[cat] = { count: 0, revenue: 0, discount: 0, totalFees: 0 };
      });

      // Initialize doctors
      doctors.forEach(doc => {
         const contract = doc.doctor_Contract || { hospital_Percentage: 50, doctor_Percentage: 50 };
         doctorStats[doc._id] = {
            name: doc.user?.user_Name || 'Unknown',
            department: doc.doctor_Department || '',
            specialization: doc.doctor_Specialization || '',
            patientCount: 0,
            revenue: 0,
            discountGiven: 0, // NEW: Track discount for each doctor
            totalFees: 0, // NEW: Track total fees before discount
            hospitalPercentage: contract.hospital_Percentage,
            doctorPercentage: contract.doctor_Percentage,
            todayPatients: 0, // Patients within date range
            todayRevenue: 0, // Revenue within date range
            todayDiscount: 0, // NEW: Today discount
            todayTotalFees: 0 // NEW: Today total fees
         };
      });

      // Add "Hospital Only" entry for patients without doctors
      doctorStats['HOSPITAL_ONLY'] = {
         name: 'Hospital Only (No Doctor)',
         department: 'Various',
         specialization: 'Direct Services',
         patientCount: 0,
         revenue: 0,
         discountGiven: 0,
         totalFees: 0,
         hospitalPercentage: 100,
         doctorPercentage: 0,
         todayPatients: 0,
         todayRevenue: 0,
         todayDiscount: 0,
         todayTotalFees: 0,
         note: 'Patients without assigned doctor - 100% hospital revenue'
      };

      // Process OPD patients
      opdPatients.forEach(patient => {
         if (!patient.visits?.length) return;

         // Process all visits within date range
         patient.visits.forEach(visit => {
            const visitDate = new Date(visit.visitDate);
            const isInDateRange = visitDate >= start && visitDate < end;

            if (isInDateRange) {
               const amount = visit.amountPaid || 0;
               const doctorFee = visit.doctorFee || 0;
               const discount = visit.discount || 0;
               const totalFeeBeforeDiscount = doctorFee; // Or visit.totalFee + discount if you have that

               // Update OPD stats
               opdStats.total++;
               opdStats.revenue += amount;
               opdStats.today++;
               opdStats.todayRevenue += amount;
               opdStats.totalDiscount += discount;
               opdStats.totalFeesBeforeDiscount += totalFeeBeforeDiscount;

               if (visit.doctor) {
                  opdStats.withDoctor++;
                  const doctor = doctorStats[visit.doctor];
                  if (doctor) {
                     doctor.patientCount++;
                     doctor.revenue += amount;
                     doctor.discountGiven += discount;
                     doctor.totalFees += totalFeeBeforeDiscount;
                     doctor.todayPatients++;
                     doctor.todayRevenue += amount;
                     doctor.todayDiscount += discount;
                     doctor.todayTotalFees += totalFeeBeforeDiscount;
                  }
               } else {
                  opdStats.withoutDoctor++;

                  // Add to Hospital Only entry
                  doctorStats['HOSPITAL_ONLY'].patientCount++;
                  doctorStats['HOSPITAL_ONLY'].revenue += amount;
                  doctorStats['HOSPITAL_ONLY'].discountGiven += discount;
                  doctorStats['HOSPITAL_ONLY'].totalFees += totalFeeBeforeDiscount;
                  doctorStats['HOSPITAL_ONLY'].todayPatients++;
                  doctorStats['HOSPITAL_ONLY'].todayRevenue += amount;
                  doctorStats['HOSPITAL_ONLY'].todayDiscount += discount;
                  doctorStats['HOSPITAL_ONLY'].todayTotalFees += totalFeeBeforeDiscount;

                  // Categorize by purpose
                  const purpose = visit.purpose || '';
                  const category = getPurposeCategory(purpose).toLowerCase();
                  const key = category === 'x-ray' ? 'xray' :
                     category === 'lab test' ? 'labtest' :
                        category === 'consultation' ? 'consultation' :
                           category === 'ecg' ? 'ecg' :
                              category === 'bsr' ? 'bsr' : 'other';

                  if (purposeStats[key]) {
                     purposeStats[key].count++;
                     purposeStats[key].revenue += amount;
                     purposeStats[key].discount += discount;
                     purposeStats[key].totalFees += totalFeeBeforeDiscount;
                  }
               }
            }
         });
      });

      // IPD Statistics - Also track discounts for IPD
      const ipdStats = {
         total: ipdRecords.length,
         admitted: 0,
         discharged: 0,
         totalRevenue: 0,
         pendingRevenue: 0,
         collectedRevenue: 0,
         totalDiscount: 0, // NEW: Track IPD discounts
         totalFees: 0, // NEW: Track IPD total fees
         byStatus: {
            admitted: 0,
            discharged: 0
         },
         byWard: {}
      };

      // Process IPD records
      ipdRecords.forEach(record => {
         const financials = record.financials || {};
         const charges = financials.total_Charges || 0;
         const discount = financials.discount || 0;
         const totalFees = charges + discount; // Calculate original fees before discount
         const status = record.status || financials.status || 'Unknown';
         const paymentStatus = financials.payment_Status || 'Unpaid';
         const wardType = record.ward_Information?.ward_Type || 'Unknown';

         ipdStats.totalRevenue += charges;
         ipdStats.totalDiscount += discount;
         ipdStats.totalFees += totalFees;

         if (paymentStatus === 'Paid') {
            ipdStats.collectedRevenue += charges;
         } else {
            ipdStats.pendingRevenue += charges;
         }

         // Count by status
         const patientStatus = record.status || financials.status;

         if (patientStatus === 'Admitted') {
            ipdStats.admitted++;
            ipdStats.byStatus.admitted = (ipdStats.byStatus.admitted || 0) + 1;
         } else if (patientStatus === 'Discharged') {
            ipdStats.discharged++;
            ipdStats.byStatus.discharged = (ipdStats.byStatus.discharged || 0) + 1;
         } else {
            // Fallback: Check if discharge date exists
            if (record.admission_Details?.discharge_Date) {
               ipdStats.discharged++;
               ipdStats.byStatus.discharged = (ipdStats.byStatus.discharged || 0) + 1;
            } else {
               ipdStats.admitted++;
               ipdStats.byStatus.admitted = (ipdStats.byStatus.admitted || 0) + 1;
            }
         }

         // Count by ward
         ipdStats.byWard[wardType] = (ipdStats.byWard[wardType] || 0) + 1;
      });

      // Refund Statistics
      const refundStats = {
         total: refunds.length,
         totalAmount: 0,
         byStatus: {},
         byReason: {},
         byPaymentMethod: {}
      };

      // Process refunds
      refunds.forEach(refund => {
         const amount = refund.refundAmount || 0;
         const status = refund.refundStatus || 'Unknown';
         const reason = refund.refundReason || 'Unknown';
         const method = refund.refundMethod || 'Unknown';

         refundStats.totalAmount += amount;

         // Count by status
         refundStats.byStatus[status] = (refundStats.byStatus[status] || 0) + 1;

         // Count by reason
         refundStats.byReason[reason] = (refundStats.byReason[reason] || 0) + 1;

         // Count by payment method
         refundStats.byPaymentMethod[method] = (refundStats.byPaymentMethod[method] || 0) + 1;
      });

      // Format response
      const formatDoctor = (id, data) => {
         const hospitalShare = (data.revenue * data.hospitalPercentage / 100);
         const doctorShare = (data.revenue * data.doctorPercentage / 100);
         const todayHospitalShare = (data.todayRevenue * data.hospitalPercentage / 100);
         const todayDoctorShare = (data.todayRevenue * data.doctorPercentage / 100);

         return {
            id,
            name: data.name,
            department: data.department,
            specialization: data.specialization,
            patientCount: data.patientCount,
            revenue: data.revenue,
            discountGiven: data.discountGiven, // NEW: Include discount
            totalFees: data.totalFees, // NEW: Include total fees before discount
            todayPatients: data.todayPatients,
            todayRevenue: data.todayRevenue,
            todayDiscount: data.todayDiscount, // NEW: Today discount
            todayTotalFees: data.todayTotalFees, // NEW: Today total fees
            hospitalShare,
            doctorShare,
            todayHospitalShare,
            todayDoctorShare,
            percentages: {
               hospital: data.hospitalPercentage,
               doctor: data.doctorPercentage,
               split: `${data.hospitalPercentage}/${data.doctorPercentage}`
            },
            ...(data.note && { note: data.note }),
            type: id === 'HOSPITAL_ONLY' ? 'hospital_only' : 'doctor_assigned'
         };
      };

      // Calculate totals
      const totalRevenue = opdStats.revenue + ipdStats.totalRevenue;
      const totalDiscount = opdStats.totalDiscount + ipdStats.totalDiscount;
      const totalFeesBeforeDiscount = opdStats.totalFeesBeforeDiscount + ipdStats.totalFees;
      const totalPending = ipdStats.pendingRevenue;
      const totalCollected = opdStats.revenue + ipdStats.collectedRevenue;
      const totalRefundAmount = refundStats.totalAmount;

      const response = {
         dateRange: {
            start: start.toISOString().split('T')[0],
            end: endDate || start.toISOString().split('T')[0],
            isToday: !startDate && !endDate
         },
         overview: {
            totalOPDPatients: opdStats.total,
            totalIPDPatients: ipdStats.total,
            totalRefunds: refundStats.total,
            totalRevenue: totalRevenue,
            totalCollected: totalCollected,
            totalPending: totalPending,
            totalRefundAmount: totalRefundAmount,
            totalDiscount: totalDiscount, // NEW: Total discount given
            totalFeesBeforeDiscount: totalFeesBeforeDiscount, // NEW: Total fees before discount
            netRevenue: totalCollected - totalRefundAmount
         },
         opd: {
            statistics: {
               totalPatients: opdStats.total,
               todayPatients: opdStats.today,
               withDoctor: opdStats.withDoctor,
               withoutDoctor: opdStats.withoutDoctor,
               totalRevenue: opdStats.revenue,
               todayRevenue: opdStats.todayRevenue,
               totalDiscount: opdStats.totalDiscount, // NEW: OPD discount
               totalFeesBeforeDiscount: opdStats.totalFeesBeforeDiscount, // NEW: OPD fees before discount
               doctorAssignedRevenue: Object.values(doctorStats)
                  .filter(d => d.name !== 'Hospital Only (No Doctor)')
                  .reduce((sum, d) => sum + d.revenue, 0),
               hospitalOnlyRevenue: doctorStats['HOSPITAL_ONLY'].revenue,
               todayDoctorAssignedRevenue: Object.values(doctorStats)
                  .filter(d => d.name !== 'Hospital Only (No Doctor)')
                  .reduce((sum, d) => sum + d.todayRevenue, 0),
               todayHospitalOnlyRevenue: doctorStats['HOSPITAL_ONLY'].todayRevenue
            },
            doctors: Object.entries(doctorStats)
               .filter(([_, d]) => d.patientCount > 0)
               .map(([id, data]) => formatDoctor(id, data)),
            purposeCategories: Object.entries(purposeStats)
               .filter(([_, p]) => p.count > 0)
               .map(([category, data]) => ({
                  category,
                  patientCount: data.count,
                  revenue: data.revenue,
                  discount: data.discount, // NEW: Discount per category
                  totalFees: data.totalFees // NEW: Total fees per category
               })),
            summary: {
               distribution: {
                  doctorAssigned: opdStats.total > 0 ? `${((opdStats.withDoctor / opdStats.total) * 100).toFixed(1)}%` : '0%',
                  hospitalOnly: opdStats.total > 0 ? `${((opdStats.withoutDoctor / opdStats.total) * 100).toFixed(1)}%` : '0%'
               },
               revenueSplit: {
                  doctorContracts: opdStats.revenue > 0 ? `${(((opdStats.revenue - doctorStats['HOSPITAL_ONLY'].revenue) / opdStats.revenue) * 100).toFixed(1)}%` : '0%',
                  hospitalOnly: opdStats.revenue > 0 ? `${((doctorStats['HOSPITAL_ONLY'].revenue / opdStats.revenue) * 100).toFixed(1)}%` : '0%'
               }
            }
         },
         ipd: {
            statistics: {
               totalPatients: ipdStats.total,
               admitted: ipdStats.admitted,
               discharged: ipdStats.discharged,
               totalRevenue: ipdStats.totalRevenue,
               collectedRevenue: ipdStats.collectedRevenue,
               pendingRevenue: ipdStats.pendingRevenue,
               totalDiscount: ipdStats.totalDiscount, // NEW: IPD discount
               totalFees: ipdStats.totalFees, // NEW: IPD total fees
               collectionRate: ipdStats.totalRevenue > 0 ?
                  ((ipdStats.collectedRevenue / ipdStats.totalRevenue) * 100).toFixed(1) + '%' : '0%'
            },
            breakdown: {
               byStatus: Object.entries(ipdStats.byStatus).map(([status, count]) => ({
                  status,
                  count,
                  percentage: ipdStats.total > 0 ? `${((count / ipdStats.total) * 100).toFixed(1)}%` : '0%'
               })),
               byWard: Object.entries(ipdStats.byWard).map(([ward, count]) => ({
                  ward,
                  count,
                  percentage: ipdStats.total > 0 ? `${((count / ipdStats.total) * 100).toFixed(1)}%` : '0%'
               }))
            }
         },
         refunds: {
            statistics: {
               totalRefunds: refundStats.total,
               totalAmount: refundStats.totalAmount,
               averageRefund: refundStats.total > 0 ?
                  (refundStats.totalAmount / refundStats.total).toFixed(2) : 0
            },
            breakdown: {
               byStatus: Object.entries(refundStats.byStatus).map(([status, count]) => ({
                  status,
                  count,
                  percentage: refundStats.total > 0 ? `${((count / refundStats.total) * 100).toFixed(1)}%` : '0%'
               })),
               byReason: Object.entries(refundStats.byReason).map(([reason, count]) => ({
                  reason,
                  count,
                  percentage: refundStats.total > 0 ? `${((count / refundStats.total) * 100).toFixed(1)}%` : '0%'
               })),
               byPaymentMethod: Object.entries(refundStats.byPaymentMethod).map(([method, count]) => ({
                  method,
                  count,
                  percentage: refundStats.total > 0 ? `${((count / refundStats.total) * 100).toFixed(1)}%` : '0%'
               }))
            }
         },
         financialSummary: {
            totalRevenue: totalRevenue,
            totalCollected: totalCollected,
            totalPending: totalPending,
            totalRefundAmount: totalRefundAmount,
            totalDiscount: totalDiscount, // NEW: Total discount given
            totalFeesBeforeDiscount: totalFeesBeforeDiscount, // NEW: Total fees before discount
            netRevenue: totalCollected - totalRefundAmount,
            breakdown: {
               opdRevenue: opdStats.revenue,
               ipdRevenue: ipdStats.totalRevenue,
               opdDiscount: opdStats.totalDiscount, // NEW: OPD discount
               ipdDiscount: ipdStats.totalDiscount, // NEW: IPD discount
               opdPercentage: totalRevenue > 0 ? `${((opdStats.revenue / totalRevenue) * 100).toFixed(1)}%` : '0%',
               ipdPercentage: totalRevenue > 0 ? `${((ipdStats.totalRevenue / totalRevenue) * 100).toFixed(1)}%` : '0%'
            },
            collectionMetrics: {
               overallCollectionRate: totalRevenue > 0 ?
                  ((totalCollected / totalRevenue) * 100).toFixed(1) + '%' : '0%',
               refundRate: totalCollected > 0 ?
                  ((totalRefundAmount / totalCollected) * 100).toFixed(1) + '%' : '0%',
               discountRate: totalFeesBeforeDiscount > 0 ?
                  ((totalDiscount / totalFeesBeforeDiscount) * 100).toFixed(1) + '%' : '0%' // NEW: Discount rate
            }
         },
      };

      return res.status(200).json({
         success: true,
         message: 'Summary data fetched successfully',
         data: response
      });

   } catch (error) {
      console.error('Summary error:', error);
      res.status(500).json({
         success: false,
         message: 'Failed to fetch summary',
         error: error.message
      });
   }
};