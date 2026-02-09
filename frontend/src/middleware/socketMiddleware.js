import socket from "../services/socket/socketService";
import { getAllStaff } from "../features/staff/staffslice";
// import { getAllAppointments } from "../features/appointments/appointmentSlice";
import { getAllAdmittedPatients } from "../features/ipdPatient/IpdPatientSlice";
import { getallDepartments } from "../features/department/DepartmentSlice";
import { fetchAllDoctors } from "../features/doctor/doctorSlice";
import {fetchPatients} from "../features/patient/patientSlice";
import { fetchPatientTestAll } from "../features/patientTest/patientTestSlice";
import {getAllTests} from "../features/testManagment/testSlice";
import {getAllWards} from "../features/ward/Wardslice";
import {getAllRooms} from "../features/roomsManagment/RoomSlice";
import { fetchPatientTestById } from "../features/patientTest/patientTestSlice";
import { fetchCriticalResults } from "../features/criticalResult/criticalSlice";
import {getExpenses} from "../features/expenses/expensesSlice";
import {getAllRefunds} from "../features/refund/refundopdSlice";
import {fetchAllRadiologyReports} from "../features/Radiology/RadiologySlice";

const socketMiddleware = (store) => {
  // Connect once
  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });

  /**
   * 🔹 STAFF REAL-TIME
   */
  socket.on("staff_changed", () => {
    store.dispatch(getAllStaff());
  });

//   /**
//    * 🔹 APPOINTMENT REAL-TIME
//    */
//   socket.on("appointment_changed", () => {
//     store.dispatch(getAllAppointments());
//   });

  /**
   * 🔹 IPD REAL-TIME
   */
  socket.on("admission_changed", () => {
    store.dispatch(getAllAdmittedPatients());
  });

  /**
   * 🔹 DEPARTMENT REAL-TIME
   */
  socket.on("department_changed", () => {
    store.dispatch(getallDepartments());
  });

  /**
   * 🔹 DOCTOR REAL-TIME
   */

  socket.on("doctor_changed", () => {
    store.dispatch(fetchAllDoctors());
  });

    /**
   * 🔹 Patient REAL-TIME
   */

      socket.on("patient_changed", () => {
    store.dispatch(fetchPatients());
  });


    /**
   * 🔹 Patient Test REAL-TIME
   */
        socket.on("patient_test_changed", () => {
    store.dispatch(fetchPatientTestAll());
  });

        /**
   * 🔹 Test Management REAL-TIME
   */
        socket.on("test_management_changed", () => {
    store.dispatch(getAllTests());
  });

    /**
   * 🔹 Patient Test By ID REAL-TIME
   */
socket.on("test_result_changed", (payload) => {
  if (!payload) return;
  const patientTestId = payload.patientTestId || payload.id;
  if (!patientTestId) return;
  store.dispatch(fetchPatientTestById(patientTestId));
});


          /**
   * 🔹 CRITICAL RESULTS REAL-TIME
   */


          socket.on("critical_result_changed", () => {
    store.dispatch(fetchCriticalResults());
  });

          /**
   * 🔹 Ward REAL-TIME
   */
          socket.on("ward_changed", () => {
    store.dispatch(getAllWards());
  });

          /**
   * 🔹 Room REAL-TIME
   */
          socket.on("room_changed", () => {
    store.dispatch(getAllRooms());
  });


          /**
   * 🔹 EXPENSES REAL-TIME
   */
          socket.on("expense_changed", () => {
    store.dispatch(getExpenses());
  });

          /**
   * 🔹 REFUND REAL-TIME
   */
          socket.on("refund_changed", () => { 
    store.dispatch(getAllRefunds());
  });

          /**
   * 🔹 RADIOLOGY REPORT REAL-TIME
   */
          socket.on("radiology_changed", () => {
    store.dispatch(fetchAllRadiologyReports());
  });

  return (next) => (action) => next(action);
};

export default socketMiddleware;
