import socket from "../services/socket/socketService";
import { getAllStaff } from "../features/staff/staffslice";
// import { getAllAppointments } from "../features/appointments/appointmentSlice";
// import { getAllAdmittedPatients } from "../features/ipdPatient/IpdPatientSlice";
import { getallDepartments } from "../features/department/DepartmentSlice";
import { fetchAllDoctors } from "../features/doctor/DoctorSlice";

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

//   /**
//    * 🔹 IPD REAL-TIME
//    */
//   socket.on("admission_changed", () => {
//     store.dispatch(getAllAdmittedPatients());
//   });

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

  return (next) => (action) => next(action);
};

export default socketMiddleware;
