import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import SummaryCard from "../components/SummaryCard";

import {
  getStudents,
  getAttendanceHistory,
} from "../services/attendanceApi";

function Dashboard() {
  const [studentCount, setStudentCount] = useState(0);

  const [presentCount, setPresentCount] = useState(0);

  const [absentCount, setAbsentCount] = useState(0);

  const [lateCount, setLateCount] = useState(0);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    
    try {
      // Fetch students
      const studentResponse = await getStudents();

      setStudentCount(studentResponse.data.length);

      // Fetch attendance history
      const historyResponse = await getAttendanceHistory();

      setHistory(historyResponse.data);
      

      // If attendance exists, show latest summary
      if (historyResponse.data.length > 0) {
        const latestAttendance = historyResponse.data[0];

        setPresentCount(Number(latestAttendance.present));

        setAbsentCount(Number(latestAttendance.absent));

        setLateCount(Number(latestAttendance.late));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatAttendanceDate = (dateInput) => {
    if (!dateInput) {
      return "";
    }

    if (dateInput instanceof Date) {
      return dateInput.toLocaleDateString("en-IN");
    }

    if (typeof dateInput !== "string") {
      return "";
    }

    if (dateInput.includes("T")) {
      const parsed = new Date(dateInput);
      return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-IN");
    }

    const parts = dateInput.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const parsed = new Date(Number(year), Number(month) - 1, Number(day));
      return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-IN");
    }

    const parsedFallback = new Date(dateInput);
    return Number.isNaN(parsedFallback.getTime()) ? "" : parsedFallback.toLocaleDateString("en-IN");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-100 to-cyan-50 py-10">

      <div className="max-w-7xl mx-auto px-6">

        {/* Welcome Section */}

        <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-sky-700 to-cyan-600 shadow-2xl p-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 text-white">

          <div>

            <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight">
              Good Morning 👋
            </h1>

            <p className="mt-3 text-slate-200 text-lg">
              {today}
            </p>

            <p className="mt-3 text-slate-200 max-w-xl">
              Welcome to Daily Attendance Tracker. Manage today's attendance and review recent activity from one modern dashboard.
            </p>

          </div>

          <Link
            to="/attendance"
            className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-blue-600 font-semibold shadow-xl transition duration-200 hover:scale-[1.02] hover:bg-slate-100"
          >
            Mark Attendance
          </Link>

        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

          <SummaryCard
            title="Total Students"
            value={studentCount}
            color="text-blue-600"
          />

          <SummaryCard
            title="Present"
            value={presentCount}
            color="text-green-600"
          />

          <SummaryCard
            title="Absent"
            value={absentCount}
            color="text-red-600"
          />

          <SummaryCard
            title="Late"
            value={lateCount}
            color="text-yellow-500"
          />

        </div>

        {/* Quick Actions */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <Link
            to="/attendance"
            className="rounded-[1.75rem] bg-white shadow-2xl p-8 transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
          >
            <h2 className="text-xl font-semibold text-blue-600">
              📋 Take Attendance
            </h2>

            <p className="text-slate-500 mt-2">
              Mark attendance for today's class.
            </p>
          </Link>

          <Link
            to="/history"
            className="rounded-[1.75rem] bg-white shadow-2xl p-8 transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
          >
            <h2 className="text-xl font-semibold text-emerald-600">
              📜 Attendance History
            </h2>

            <p className="text-slate-500 mt-2">
              View previously submitted attendance.
            </p>
          </Link>

        </div>

        {/* Recent Activity */}

        <div className="rounded-[2rem] bg-white shadow-2xl mt-10 overflow-hidden ring-1 ring-slate-200">

          <div className="bg-gradient-to-r from-sky-600 to-cyan-500 px-6 py-5 text-white">

            <h2 className="text-xl font-semibold">
              Recent Attendance
            </h2>

          </div>

          {history.length === 0 ? (

            <div className="p-10 text-center">

              <h3 className="text-xl font-semibold text-slate-900">
                No Attendance Found
              </h3>

              <p className="text-slate-500 mt-2">
                Start by marking today's attendance.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">

                <thead className="bg-slate-100 text-slate-600 uppercase text-sm tracking-[0.12em]">

                  <tr>

                    <th className="text-left p-4">Date</th>

                    <th className="text-center">Total</th>

                    <th className="text-center">Present</th>

                    <th className="text-center">Absent</th>

                    <th className="text-center">Late</th>

                  </tr>

                </thead>

                <tbody>
                  {history.slice(0, 5).map((item, index) => (

                    <tr
                      key={index}
                      className="border-b border-slate-200 transition duration-200 hover:bg-slate-50"
                    >

                      <td className="p-4 text-slate-900">
                        {formatAttendanceDate(item.attendance_date)}
                      </td>

                      <td className="text-center font-semibold text-slate-900">{item.total_students}</td>

                      <td className="text-center text-emerald-600 font-semibold">{item.present}</td>

                      <td className="text-center text-rose-600 font-semibold">{item.absent}</td>

                      <td className="text-center text-amber-500 font-semibold">{item.late}</td>

                    </tr>

                  ))}

                </tbody>

              </table>
            </div>

          )}

        </div>

      </div>
    </div>
  );
}

export default Dashboard;