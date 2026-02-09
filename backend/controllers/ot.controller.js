const hospitalModel = require("../models/index.model");
const Admittedpatients = require("../models/admittedPatient.model");  // Reference to AdmittedPatient model
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");
const createOperation = async (req, res) => {
    try {
        const { patient_MRNo, otInformation, procedure, surgeon, department, otTime, otNumber, status, total_Operation_Cost, operation_PaymentStatus, payment_Method } = req.body;
   
        // Check if patient MR number is provided
        if (!patient_MRNo) { 
            return res.status(400).json({ success: false, message: "Patient MR Number is required" });
        }

        // Fetch patient details from AdmittedPatient based on MR number
        const patient = await Admittedpatients.findOne({ patient_MRNo: patient_MRNo });
        if (!patient) {
            return res.status(404).json({ success: false, message: `No patient found with MR number: ${patient_MRNo}` });
        }

        // Create the new operation document with full patient details and new fields
        const newOperation = await hospitalModel.Operation.create({
            patient_MRNo,
            patient_Details: {
                patient_Name: patient.patient_Name,
                patient_CNIC: patient.patient_CNIC,
                patient_Gender: patient.patient_Gender,
                patient_DateOfBirth: patient.patient_DateOfBirth,
                patient_Address: patient.patient_Address,
                patient_Guardian: patient.patient_Guardian,
            },
            procedure,
            surgeon,
            department,
            otTime: {
                startTime: otTime.startTime,
                endTime: otTime.endTime,
            },
            otNumber,
            status,
            otInformation,
            total_Operation_Cost,
            operation_PaymentStatus,
            payment_Method,
        });
        return res.status(200).json({
            success: true,
            message: "Operation created successfully",
            information: newOperation,
        });
    } catch (error) {
        console.error("Error creating operation:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllOperations = async (req, res) => {
    try {
        const operationsList = await hospitalModel.Operation.find();
        res.status(202).json({ operationsList });
    } catch (error) {
        return res.status(500).json({ message: "Error Fetching Operations", error: error.message });
    }
};

const getOperationsByMrno = async (req, res) => {
    const { mrno } = req.params;
    try {
        const operation = await hospitalModel.Operation.findOne({ patient_MRNo: mrno });
        if (!operation) {
            return res.status(404).json({ message: `Error fetching operation by MR number: ${mrno}` });
        }
        res.status(202).json({ message: "Successfully fetched operation by MR number", mrno, operation, });
    } catch (error) {
        res.status(500).json({ message: `Error fetching operation by MR number: ${mrno}`, error: error.message });
    }
};

const deleteOperation = async (req, res) => {
    const { mrno } = req.params;
    try {
        const operation = await hospitalModel.Operation.findOneAndDelete({ patient_MRNo: mrno });
        if (!operation) {
            return res.status(404).json({ message: `Error deleting operation by MR number: ${mrno}` });
        }
        res.status(202).json({ message: "Successfully deleted operation by MR number", mrno, operation, });
    } catch (error) {
        res.status(500).json({ message: `Error deleting operation by MR number: ${mrno}`, error: error.message, });
    }
};

const updateOperationByMrno = async (req, res) => {
    const { mrno } = req.params;
    const { otInformation, procedure, surgeon, department, otTime, otNumber, status, total_Operation_Cost, operation_PaymentStatus, payment_Method } = req.body;

    try {
        // Find the operation by MR number
        const operation = await hospitalModel.Operation.findOne({ patient_MRNo: mrno });

        if (!operation) {
            return res.status(404).json({ message: "Operation not found" });
        }

        // Update only the fields that can be modified
        // Do NOT update patient_MRNo, patient_Details, or wardInformation
        if (otInformation) {
            operation.otInformation = {
                operationName: otInformation.operationName || operation.otInformation.operationName,
                reasonForOperation: otInformation.reasonForOperation || operation.otInformation.reasonForOperation,
                doctor: {
                    seniorSurgeon: otInformation.doctor.seniorSurgeon || operation.otInformation.doctor.seniorSurgeon,
                    assistantDoctors: otInformation.doctor.assistantDoctors || operation.otInformation.doctor.assistantDoctors,
                    nurses: otInformation.doctor.nurses || operation.otInformation.doctor.nurses,
                    doctors_Fee: otInformation.doctor.doctors_Fee || operation.otInformation.doctor.doctors_Fee,
                    anesthesia_Type: otInformation.doctor.anesthesia_Type || operation.otInformation.doctor.anesthesia_Type,
                    operation_Date: otInformation.doctor.operation_Date || operation.otInformation.doctor.operation_Date,
                    surgery_Type: otInformation.doctor.surgery_Type || operation.otInformation.doctor.surgery_Type,
                    operation_Outcomes: otInformation.doctor.operation_Outcomes || operation.otInformation.doctor.operation_Outcomes,
                },
                equipment_Charges: otInformation.equipment_Charges || operation.otInformation.equipment_Charges,
            };
        }

        // Fields that can be updated
        operation.procedure = procedure || operation.procedure;
        operation.surgeon = surgeon || operation.surgeon;
        operation.department = department || operation.department;
        operation.otTime = otTime || operation.otTime;
        operation.otNumber = otNumber || operation.otNumber;
        operation.status = status || operation.status;
        operation.total_Operation_Cost = total_Operation_Cost || operation.total_Operation_Cost;
        operation.operation_PaymentStatus = operation_PaymentStatus || operation.operation_PaymentStatus;
        operation.payment_Method = payment_Method || operation.payment_Method;

        // Save the updated operation document
        await operation.save();

        // Send response with updated operation
        res.status(200).json({
            success: true,
            message: "Operation updated successfully",
            operation,
        });

    } catch (error) {
        res.status(500).json({
            message: `Error updating operation by MR number: ${mrno}`,
            error: error.message,
        });
    }
};

module.exports = {
    createOperation,
    getAllOperations,
    getOperationsByMrno,
    deleteOperation,
    updateOperationByMrno,
};
