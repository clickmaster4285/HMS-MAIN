const hospitalModel = require("../models/index.model");
const emitGlobalEvent = require("../utils/emitGlobalEvent");
const EVENTS = require("../utils/socketEvents");
// Adding inventory record to the database
const createInventory = async (req, res) => {
    try {
        const {
            category,
            name,
            description,
            quantity,
            currentStock,
            department,
            room,
            wards,
            supplier,
            purchaseDate,
            warrantyExpiry,
            status,
            specifications,
        } = req.body;
console.log("the request is",req.body)

        // Validate currentStock doesn't exceed quantity
        if (currentStock < quantity) {
            return res.status(400).json({
                message: "Current stock cannot exceed total quantity."
            });
        }

        const newInventory = await hospitalModel.inventory.create({
            category,
            name,
            description,
            quantity,
            currentStock,
            department,
            room,
            wards,
            supplier,
            purchaseDate,
            warrantyExpiry,
            status: status || 'Available',
            specifications,
        });
        console.log(newInventory)
        res.status(201).json({
            message: "Inventory record has been added successfully.",
            inventory: newInventory
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Inventory record was not added successfully.",
            error: error.message
        });
    }
};

// Get all Inventory data with optional filters
const getAllInventoryData = async (req, res) => {
    try {
        const filter = {deleted: false};
        const inventoryList = await hospitalModel.inventory.find(filter).populate('department');
        res.status(200).json({message: "Inventory data fetched successfully" ,inventoryList});
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching records",
            error: error.message,
        });
    }
}


// Get inventory item by ID
const getInventoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const inventoryItem = await hospitalModel.inventory.findById(id);
        if (!inventoryItem) {
            res.status(404).json({ message: "No inventory record found with this ID" })
        } else {
            res.status(200).json({
                message: "Inventory data found successfully",
                inventoryItem
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching record",
            error: error.message
        });
    }
};

// Update inventory data by ID
const updateInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validate currentStock doesn't exceed quantity if both are being updated
        if (updateData.currentStock !== undefined && updateData.quantity !== undefined) {
            if (updateData.currentStock > updateData.quantity) {
                return res.status(400).json({
                    message: "Current stock cannot exceed total quantity."
                });
            }
        }

        const inventoryItem = await hospitalModel.inventory.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!inventoryItem) {
            return res.status(404).json({ message: "No inventory record found" })
        }

        res.status(200).json({
            message: "Record updated successfully",
            updatedInventory: inventoryItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

// Delete inventory by ID
const deleteInventoryById = async (req, res) => {
    const { id } = req.params;
    
    try {

        console.log(req.params);
        const inventoryItem = await hospitalModel.inventory.findByIdAndUpdate( id,
            { deleted: true },
            { new: true });
            console.log(inventoryItem);
        if (!inventoryItem) {
            return res.status(404).json({ message: "Inventory not found" });
        }
        res.status(200).json({ message: "Record deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message })
    }
};


// Update inventory stock (add/subtract)
const updateInventoryStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, amount } = req.body;

        if (!['add', 'subtract'].includes(action) || !amount || isNaN(amount)) {
            return res.status(400).json({
                message: "Invalid request. Requires 'action' (add/subtract) and numeric 'amount'."
            });
        }

        const inventoryItem = await hospitalModel.inventory.findById(id);
        if (!inventoryItem) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

        if (action === 'add') {
            inventoryItem.currentStock += parseInt(amount);
            inventoryItem.quantity += parseInt(amount);
        } else {
            if (inventoryItem.currentStock < amount) {
                return res.status(400).json({
                    message: "Insufficient stock available."
                });
            }
            inventoryItem.currentStock -= parseInt(amount);
        }

        await inventoryItem.save();

        res.status(200).json({
            message: "Stock updated successfully",
            inventoryItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating stock",
            error: error.message
        });
    }
};

// Add maintenance record to inventory item
const addMaintenanceRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, type, description, cost } = req.body;

        const inventoryItem = await hospitalModel.inventory.findById(id);
        if (!inventoryItem) {
            return res.status(404).json({ message: "Inventory item not found" });
        }

        inventoryItem.maintenanceRecords.push({
            date: date || Date.now(),
            type,
            description,
            cost
        });

        // Update status to Maintenance if not already
        if (inventoryItem.status !== 'Maintenance') {
            inventoryItem.status = 'Maintenance';
        }

        await inventoryItem.save();

        res.status(200).json({
            message: "Maintenance record added successfully",
            inventoryItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding maintenance record",
            error: error.message
        });
    }
};

// Get low stock items
const getLowStockItems = async (req, res) => {
    try {
        const threshold = req.query.threshold || 10;
        const lowStockItems = await hospitalModel.inventory.find({
            currentStock: { $lte: parseInt(threshold) }
        }).populate('department');

        res.status(200).json({
            message: `Found ${lowStockItems.length} items with low stock`,
            lowStockItems
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching low stock items",
            error: error.message
        });
    }
};

module.exports = {
    createInventory,
    getAllInventoryData,
    getInventoryById,
    updateInventoryById,
    deleteInventoryById,
    updateInventoryStock,
    addMaintenanceRecord,
    getLowStockItems
};