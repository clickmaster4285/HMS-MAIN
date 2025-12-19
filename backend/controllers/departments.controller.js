const hospitalModel = require("../models/index.model")
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");
// Create a new department
const createDepartments = async (req, res) => {
    try {
        const { name, description, location, role, status, servicesOffered, } = req.body;

        const newDepartment = new hospitalModel.Department({
            name, description, location, role, status, servicesOffered,
        });

        await newDepartment.save();
        emitGlobalEvent(req, EVENTS.DEPARTMENT, "create", newDepartment);
        res.status(202).json({ message: "Department Added Successfully", departments: newDepartment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error Creating Department", error: error.message });
    }
}

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departmentsList = await hospitalModel.Department.find();
        res.status(200).json({ departmentsList });
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments", error: error.message });
    }
}

// Get department by ID
const getDepartmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const department = await hospitalModel.Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: "Error fetching department", error: error.message });
    }
}

// Update department by ID
const updateDepartmentById = async (req, res) => {
    const { id } = req.params;
    const { name, description, location, status, servicesOffered, } = req.body;

    try {
        const department = await hospitalModel.Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        department.name = name || department.name;
        department.description = description || department.description;
        department.location = location || department.location;
        department.status = status || department.status;
        department.servicesOffered = servicesOffered || department.servicesOffered;

        await department.save();
        emitGlobalEvent(req, EVENTS.DEPARTMENT, "update", department);
        res.status(200).json(department);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Delete department by ID
const deleteDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const department = await hospitalModel.Department.findByIdAndDelete(id);
        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        emitGlobalEvent(req, EVENTS.DEPARTMENT, "delete", department);
        
        res.status(200).json({ message: "Department deleted successfully", department });
    } catch (error) {
        res.status(500).json({ message: "Error deleting department", error: error.message });
    }
}

module.exports = {
    createDepartments,
    getAllDepartments,
    getDepartmentById,
    updateDepartmentById,
    deleteDepartment,
}