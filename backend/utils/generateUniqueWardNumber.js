const hospitalModel = require("../models/index.model");

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

      // Generate department prefix (first 4 characters uppercase)
      const departmentPrefix = department.name.substring(0, 4).toUpperCase();
      const displayWardNumber = `${departmentPrefix}-${wardNumber}`;

      // Check for existing ward with same department and ward number
      const query = {
         department: departmentId,
         wardNumber: wardNumber,
         isDeleted: false
      };

      // Exclude current ward during updates
      if (currentWardId) {
         query._id = { $ne: currentWardId };
      }

      const existingWard = await hospitalModel.ward.findOne(query);

      return {
         displayWardNumber,
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
      // Find the highest ward number in the department
      const highestWard = await hospitalModel.ward.findOne(
         {
            department: departmentId,
            isDeleted: false
         },
         { wardNumber: 1 },
         { sort: { wardNumber: -1 } }
      );

      return highestWard ? highestWard.wardNumber + 1 : 1;
   } catch (error) {
      console.error("Error getting next ward number:", error);
      throw new Error(`Unable to get next ward number: ${error.message}`);
   }
}

module.exports = {
   generateUniqueWardNumber,
   getNextAvailableWardNumber
};