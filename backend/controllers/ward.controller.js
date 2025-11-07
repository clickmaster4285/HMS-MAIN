const hospitalModel = require("../models/index.model");
const { generateUniqueWardNumber, getNextAvailableWardNumber } = require("../utils/generateUniqueWardNumber");

// In your frontend, you can use this to suggest next available number
exports.getSuggestedWardNumber = async (req, res) => {
    try {
        const { departmentId } = req.params;

        const nextWardNumber = await getNextAvailableWardNumber(departmentId);

        res.status(200).json({
            success: true,
            suggestedWardNumber: nextWardNumber
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a new ward
exports.createWard = async (req, res) => {
    const { name, department, wardNumber, bedCount, nurseAssignments } = req.body;

    try {
        // Validate department exists
        const departmentDoc = await hospitalModel.Department.findById(department);
        if (!departmentDoc) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Generate unique ward number (this now returns the full format)
        const wardNumberResult = await generateUniqueWardNumber(department, wardNumber);

        if (!wardNumberResult.isUnique) {
            return res.status(409).json({
                success: false,
                message: `Ward ${wardNumberResult.displayWardNumber} already exists in ${departmentDoc.name} department. Please use a different ward number.`
            });
        }

        // Generate beds with the display ward number
        const beds = Array.from({ length: bedCount }, (_, i) => ({
            bedNumber: `${wardNumberResult.displayWardNumber}-B${i + 1}`,
            occupied: false
        }));

        const newWard = await hospitalModel.ward.create({
            name,
            department: departmentDoc._id,
            department_Name: departmentDoc.name,
            wardNumber: wardNumberResult.displayWardNumber, // Store the full format
            displayWardNumber: wardNumberResult.displayWardNumber, // Keep this for consistency
            bedCount,
            beds,
            nurses: nurseAssignments
        });

        // Add ward to department
        departmentDoc.ward.push(newWard._id);
        await departmentDoc.save();

        res.status(201).json({
            success: true,
            message: 'Ward created successfully',
            ward: newWard
        });
    } catch (error) {
        // Handle duplicate key error specifically
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: `A ward with this number already exists in the department. Please use a different ward number.`
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all non-deleted wards
exports.getAllWards = async (req, res) => {
    try {
        const wards = await hospitalModel.ward.find().notDeleted();
        res.status(200).json({
            success: true,
            count: wards.length,
            wards
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch wards",
            error: error.message
        });
    }
};

// Update Ward by ID
exports.updateWardById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, wardNumber, bedCount, nurseAssignments } = req.body;

        // Find existing ward
        const existingWard = await hospitalModel.ward.findById(id).notDeleted();
        if (!existingWard) {
            return res.status(404).json({
                success: false,
                message: "Ward not found"
            });
        }

        let updateData = { name, bedCount, nurses: nurseAssignments };
        let newDisplayWardNumber = existingWard.displayWardNumber;
        let newWardNumber = existingWard.wardNumber;

        // Check if department or ward number changed
        if (department && department !== existingWard.department.toString()) {
            // Department changed - need to regenerate display number
            const wardNumberResult = await generateUniqueWardNumber(department, wardNumber || existingWard.wardNumber, id);

            if (!wardNumberResult.isUnique) {
                return res.status(409).json({
                    success: false,
                    message: `Ward number ${wardNumber || existingWard.wardNumber} already exists in ${wardNumberResult.departmentName} department.`
                });
            }

            updateData.department = department;
            updateData.department_Name = wardNumberResult.departmentName;
            updateData.wardNumber = wardNumberResult.displayWardNumber; // Store the full format
            updateData.displayWardNumber = wardNumberResult.displayWardNumber;
            newDisplayWardNumber = wardNumberResult.displayWardNumber;
            newWardNumber = wardNumberResult.displayWardNumber;

            // Remove from old department, add to new department
            await hospitalModel.Department.updateMany(
                { ward: id },
                { $pull: { ward: id } }
            );

            const newDepartment = await hospitalModel.Department.findById(department);
            if (newDepartment) {
                newDepartment.ward.push(id);
                await newDepartment.save();
            }
        }
        else if (wardNumber && wardNumber !== existingWard.wardNumber) {
            // Only ward number changed within same department
            const wardNumberResult = await generateUniqueWardNumber(existingWard.department, wardNumber, id);

            if (!wardNumberResult.isUnique) {
                return res.status(409).json({
                    success: false,
                    message: `Ward number ${wardNumber} already exists in ${existingWard.department_Name} department.`
                });
            }

            updateData.wardNumber = wardNumberResult.displayWardNumber; // Store the full format
            updateData.displayWardNumber = wardNumberResult.displayWardNumber;
            newDisplayWardNumber = wardNumberResult.displayWardNumber;
            newWardNumber = wardNumberResult.displayWardNumber;
        }

        // Update bed numbers if display ward number changed
        if (newDisplayWardNumber !== existingWard.displayWardNumber) {
            updateData.beds = existingWard.beds.map((bed, index) => ({
                ...bed.toObject(),
                bedNumber: `${newDisplayWardNumber}-B${index + 1}`
            }));
        }

        const updatedWard = await hospitalModel.ward.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).notDeleted();

        if (!updatedWard) {
            return res.status(404).json({
                success: false,
                message: "Ward not found after update"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ward updated successfully",
            data: updatedWard // Ensure this is returned
        });
    } catch (error) {
        console.error("Error updating ward:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update ward",
            error: error.message
        });
    }
};

// Get wards by department (non-deleted only)
exports.getWardsByDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;

        // First validate the department exists
        const department = await hospitalModel.Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({
                success: false,
                message: 'Department not found'
            });
        }

        // Get all wards with full details
        const wards = await hospitalModel.ward.find({
            _id: { $in: department.ward },
            isDeleted: false
        }); // Exclude unnecessary fields

        res.status(200).json({
            success: true,
            wards
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getWardsById = async (req, res) => {
    try {
        const { wardId } = req.params;
        // res.send("here")
        // First validate the department exists
        const ward = await hospitalModel.ward.findById(wardId);
        if (!ward) {
            return res.status(404).json({
                success: false,
                message: 'ward not found'
            });
        }

        res.status(200).json({
            success: true,
            ward
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getPatientbyBedId = async (req, res) => {
    try {
        const { bedId } = req.params;

        // Find the ward containing this bed
        const ward = await hospitalModel.ward.findOne({
            'beds._id': bedId,
            isDeleted: false
        });

        if (!ward) {
            return res.status(404).json({
                success: false,
                message: 'Bed not found in any ward'
            });
        }

        // Find the specific bed
        const bed = ward.beds.find(b =>
            b._id.toString() === bedId &&
            !b.isDeleted
        );

        if (!bed) {
            return res.status(404).json({
                success: false,
                message: 'Bed not found or has been deleted'
            });
        }

        // Get patient details from AdmittedPatient collection
        let patientDetails = null;
        if (bed.occupied && bed.currentPatientMRNo) {
            try {
                // Query using the correct field name from your schema
                patientDetails = await hospitalModel.AdmittedPatient.findOne({
                    patient_MRNo: bed.currentPatientMRNo
                }).select('patient_Name patient_MRNo patient_CNIC patient_Gender patient_DateOfBirth patient_Address patient_Guardian admission_Details ward_Information status');

                if (!patientDetails) {
                    patientDetails = { 
                        patient_MRNo: bed.currentPatientMRNo, 
                        error: "Patient details not found in admitted patients" 
                    };
                }
            } catch (patientError) {
                console.error('Error fetching patient:', patientError);
                patientDetails = { 
                    patient_MRNo: bed.currentPatientMRNo, 
                    error: "Error fetching patient details" 
                };
            }
        }

        res.status(200).json({
            success: true,
            data: {
                bed: {
                    id: bed._id,
                    bedNumber: bed.bedNumber,
                    status: bed.occupied ? 'Occupied' : 'Available',
                    currentPatientMRNo: bed.currentPatientMRNo,
                    ward: {
                        id: ward._id,
                        name: ward.name,
                        wardNumber: ward.wardNumber,
                        department: ward.department_Name
                    }
                },
                patient: patientDetails,
                history: bed.history.filter(h => !h.isDeleted)
            }
        });

    } catch (error) {
        console.error('Error in getPatientbyBedId:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};
// Soft delete a ward
exports.deleteWard = async (req, res) => {
    try {
        const { id } = req.params;

        const ward = await hospitalModel.ward.findById(id).notDeleted();
        if (!ward) {
            return res.status(404).json({
                success: false,
                message: "Ward not found"
            });
        }

        // Check if any beds are occupied
        const occupiedBeds = ward.beds.some(bed => bed.occupied);
        if (occupiedBeds) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete ward with occupied beds"
            });
        }

        await ward.softDelete();

        // Remove from department
        await hospitalModel.Department.updateMany(
            { ward: id },
            { $pull: { ward: id } }
        );

        res.status(200).json({
            success: true,
            message: "Ward deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete ward",
            error: error.message
        });
    }
};

// Get bed history
exports.getBedHistory = async (req, res) => {
    try {
        const { wardId, bedNumber } = req.params;

        const ward = await hospitalModel.ward.findById(wardId).notDeleted();
        if (!ward) {
            return res.status(404).json({
                success: false,
                message: "Ward not found"
            });
        }

        const bed = ward.beds.find(b =>
            b.bedNumber.toString().trim().toUpperCase() === bedNumber.toString().trim().toUpperCase() &&
            !b.isDeleted
        );

        if (!bed) {
            return res.status(404).json({
                success: false,
                message: "Bed not found in ward"
            });
        }

        // Return history with only MRNo
        const history = bed.history
            .filter(h => !h.isDeleted)
            .map(h => ({
                patientMRNo: h.patientMRNo,
                admissionDate: h.admissionDate,
                dischargeDate: h.dischargeDate
            }));

        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get bed history",
            error: error.message
        });
    }
};