const hospitalModel = require("../models/index.model");
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");

//to create a new inventory record
const createMedicineRecord = async (req, res) => {
  try {
    const {
      medicine_Name,
      medicine_Category,
      medicine_Company,
      medicine_PurchaseData,
      medicine_Price,
      medicine_ManufactureDate,
      medicine_ExpiryData,
      medicine_Stock,
    } = req.body;

    const newMedicine = await hospitalModel.Medicine.create({
      medicine_Name,
      medicine_Category,
      medicine_Company,
      medicine_PurchaseData,
      medicine_Price,
      medicine_ManufactureDate,
      medicine_ExpiryData,
      medicine_Stock,
    });

    res.status(201).json({
      message: "Medicine recored has been added sucessfully",
      Medicine: newMedicine,
    });
  } catch (error) {
    console.log(error);
    req.status(500).json({
      message: "Medicine record was not added successfully.",
      error: error.message,
    });
  }
};

//get all data
const getAllMedicine = async (req, res) => {
  try {
    const medicineList = await hospitalModel.Medicine.find();
    res.status(200).json(medicineList);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching medicine records",
      error: error.messgage,
    });
  }
};

const getMedicineById = async (req, res) => {
  const { id } = req.params;
  try {
    const Medicine = await hospitalModel.Medicine.findById(id);
    if (!Medicine) {
      return res.status(404).json({ message: "no medicine found by this id" });
    }
    res.status(202).json({ message: "medicine found sucessfully", Medicine });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

const updateMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      medicine_Name,
      medicine_Category,
      medicine_Company,
      medicine_PurchaseData,
      medicine_Price,
      medicine_ManufactureDate,
      medicine_ExpiryData,
      medicine_Stock,
    } = req.body;


    // Validate ID format first
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid or missing ID" });
    }

    const Medicine = await hospitalModel.Medicine.findById(id);

    if (!Medicine) {
      return res.status(404).json({ message: "Medicine Record not found" });
    }

    // Update fields
    Medicine.medicine_Name = medicine_Name || Medicine.medicine_Name;
    Medicine.medicine_Category =
      medicine_Category || Medicine.medicine_Category;
    Medicine.medicine_Company = medicine_Company || Medicine.medicine_Company;
    Medicine.medicine_PurchaseData =
      medicine_PurchaseData || Medicine.medicine_PurchaseData;
    Medicine.medicine_Price = medicine_Price || Medicine.medicine_Price;
    Medicine.medicine_ManufactureDate =
      medicine_ManufactureDate || Medicine.medicine_ManufactureDate;
    Medicine.medicine_ExpiryData =
      medicine_ExpiryData || Medicine.medicine_ExpiryData;
    Medicine.medicine_Stock = medicine_Stock || Medicine.medicine_Stock;

    await Medicine.save();

    return res.status(200).json({
      message: "Medicine updated successfully",
      updatedMedicine: Medicine,
    });
  } catch (error) {
    console.error("Update failed:", error);

    // Failsafe: always respond
    if (!res.headersSent) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  }
};

const deleteMedicineById = async (req, res) => {
  const { id } = req.params;
  try {
    const Medicine = await hospitalModel.Medicine.findByIdAndDelete(id);
    if (!Medicine) {
      return res.status(400).json({ message: "medicine not found" });
    }
    res.status(202).json({ message: "record sucessfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
};

module.exports = {
  createMedicineRecord,
  getAllMedicine,
  updateMedicineById,
  deleteMedicineById,
  getMedicineById,
};
