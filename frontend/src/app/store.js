import { configureStore } from "@reduxjs/toolkit";

/* 🔹 Reducers */
import authReducer from "../features/auth/authSlice";
import doctorReducer from "../features/doctor/doctorSlice";
import appointmentReducer from "../features/appointments/appointmentSlice";
import patientReducer from "../features/patient/patientSlice";
import ipdPatientReducer from "../features/ipdPatient/IpdPatientSlice";
import staffReducer from "../features/staff/staffslice";
import roomReducer from "../features/roomsManagment/RoomSlice";
import departmentReducer from "../features/department/DepartmentSlice";
import otReducer from "../features/operationManagment/otSlice";
import WardReducer from "../features/ward/Wardslice";
import InventoryReducer from "../features/inventory/InventorySlice";
import MedicineReducer from "../features/medicine/MedicineSlice";
import patientTestReducer from "../features/patientTest/patientTestSlice";
import testReducer from "../features/testManagment/testSlice";
import testResultReducer from "../features/testResult/TestResultSlice";
import labBillReducer from "../features/labBill/LabBillSlice";
import RadiologySlice from "../features/Radiology/RadiologySlice";
import criticalResultReducer from "../features/criticalResult/criticalSlice";
import refundOpdReducer from "../features/refund/refundopdSlice";
import expensesReducer from "../features/expenses/expensesSlice";
import summaryReducer from '../features/summary/summarySlice';
/* 🔹 SOCKET MIDDLEWARE */
import socketMiddleware from "../middleware/socketMiddleware";

const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    appointments: appointmentReducer,
    patients: patientReducer,
    ipdPatient: ipdPatientReducer,
    staff: staffReducer,
    room: roomReducer,
    department: departmentReducer,
    ot: otReducer,
    ward: WardReducer,
    inventory: InventoryReducer,
    medicine: MedicineReducer,
    patientTest: patientTestReducer,
    labtest: testReducer,
    testResult: testResultReducer,
    labBill: labBillReducer,
    radiology: RadiologySlice,
    criticalResult: criticalResultReducer,
    refund: refundOpdReducer,
    expenses: expensesReducer,
    summary: summaryReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(socketMiddleware),
});

export default store;
