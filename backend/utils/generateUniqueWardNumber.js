const hospitalModel = require("../models/index.model");
const mongoose = require('mongoose')
/**
 * Generates a unique ward number based on department and ward number
 * @param {ObjectId} departmentId - The department ID
 * @param {Number} wardNumber - The requested ward number
 * @param {String} currentWardId - Current ward ID (for updates, optional)
 * @returns {Object} { displayWardNumber, isUnique }
 */
async function generateUniqueWardNumber(departmentId, wardNumber, currentWardId = null) {
   try {
      // Validate inputs
      if (!departmentId || !wardNumber) {
         throw new Error('Department ID and ward number are required');
      }

      // Get department details
      const department = await hospitalModel.Department.findById(departmentId);
      if (!department) {
         throw new Error('Department not found');
      }

      // Extract numeric part if wardNumber is in format "CARD-1"
      let numericWardNumber = wardNumber;
      if (typeof wardNumber === 'string' && wardNumber.includes('-')) {
         const parts = wardNumber.split('-');
         numericWardNumber = parts[parts.length - 1]; // Get the last part (the number)
      }

      // Generate department prefix and full ward number
      const departmentPrefix = department.name.substring(0, 4).toUpperCase();
      const fullWardNumber = `${departmentPrefix}-${numericWardNumber}`;

      // Check for existing ward with same department and full ward number
      const query = {
         department: departmentId,
         wardNumber: fullWardNumber,
         isDeleted: false
      };

      // Exclude current ward during updates
      if (currentWardId) {
         query._id = { $ne: currentWardId };
      }

      const existingWard = await hospitalModel.ward.findOne(query);

      return {
         displayWardNumber: fullWardNumber,
         isUnique: !existingWard,
         departmentName: department.name,
         existingWard: existingWard || null
      };
   } catch (error) {
      console.error("Error generating unique ward number:", error);
      throw new Error(`Unable to generate ward number: ${error.message}`);
   }
}
/**
 * Generates the next available ward number for a department
 * @param {ObjectId} departmentId - The department ID
 * @returns {Number} - Next available ward number
 */
async function getNextAvailableWardNumber(departmentId) {
   try {
      // Get department details
      const department = await hospitalModel.Department.findById(departmentId);
      if (!department) {
         throw new Error('Department not found');
      }

      const departmentPrefix = department.name.substring(0, 4).toUpperCase();

      // Find the highest ward number in the department
      const highestWard = await hospitalModel.ward.findOne(
         {
            department: departmentId,
            isDeleted: false,
            wardNumber: new RegExp(`^${departmentPrefix}-`) // Match wards in this department
         },
         { wardNumber: 1 },
         { sort: { wardNumber: -1 } }
      );

      let nextNumber = 1;
      if (highestWard) {
         // Extract the number part from "CARD-1" format
         const lastNumber = parseInt(highestWard.wardNumber.split('-')[1]);
         nextNumber = lastNumber + 1;
      }

      return nextNumber;
   } catch (error) {
      console.error("Error getting next ward number:", error);
      throw new Error(`Unable to get next ward number: ${error.message}`);
   }
}

module.exports = {
   generateUniqueWardNumber,
   getNextAvailableWardNumber
};