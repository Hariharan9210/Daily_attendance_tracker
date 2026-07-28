import axios from "axios";

const API = "http://localhost:5000/api";

export const getStudents = async () => {
  return await axios.get(`${API}/students`);
};

export const saveAttendance = async (attendanceData) => {
  return await axios.post(`${API}/attendance`, attendanceData);
};

export const getAttendanceHistory = async () => {
  return await axios.get(`${API}/history`);
};

export const getAttendanceByDate = async (date) => {
  return await axios.get(`${API}/attendance/${date}`);
};