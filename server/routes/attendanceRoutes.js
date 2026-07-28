import express from "express";
import {
  getStudents,
  getAttendanceByDate,
  saveAttendance,
  getAttendanceHistory,
} from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/students", getStudents);
router.get("/attendance/:date", getAttendanceByDate);
router.post("/attendance", saveAttendance);
router.get("/history", getAttendanceHistory);

export default router;