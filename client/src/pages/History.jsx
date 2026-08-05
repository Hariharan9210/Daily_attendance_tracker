import { useEffect, useState } from "react";
import { getAttendanceHistory, getAttendanceByDate } from "../services/attendanceApi";

function History() {
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState([]);
  const [selectedAttendanceLoaded, setSelectedAttendanceLoaded] = useState(false);

  const today = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const date = today();
    setSelectedDate(date);
    loadHistory();
    loadAttendance(date);
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getAttendanceHistory();
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAttendance = async (date) => {
    try {
      const res = await getAttendanceByDate(date);
      setSelectedAttendance(res.data);
    } catch {
      setSelectedAttendance([]);
    }
    setSelectedAttendanceLoaded(true);
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedAttendanceLoaded(false);
    loadAttendance(date);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const grouped = {};
  selectedAttendance.forEach((student) => {
    const batch = student.batch || "Unassigned";
    if (!grouped[batch]) grouped[batch] = [];
    grouped[batch].push(student);
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fbff_0%,_#eef4ff_45%,_#f8fafc_100%)] p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[28px] bg-gradient-to-br from-sky-700 via-cyan-600 to-blue-500 p-8 text-white shadow-2xl shadow-sky-200">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">Attendance History</h1>
              <p className="mt-2 max-w-2xl text-sm text-sky-50 sm:text-base">
                Review daily attendance by date and explore the complete historical summary.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Selected day</p>
              <h2 className="text-2xl font-semibold text-slate-800">
                {formatDate(selectedDate) || "Choose a date"}
              </h2>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
              <span>Select Date</span>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </label>
          </div>

          <div className="mt-6">
            {!selectedAttendanceLoaded ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                Loading attendance...
              </div>
            ) : selectedAttendance.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                No attendance found for this date.
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([batch, students]) => (
                  <div key={batch} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70">
                    <div className="border-b border-slate-200 bg-white px-4 py-3">
                      <h3 className="text-lg font-semibold text-slate-800">{batch}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-left text-slate-600">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student.student_id} className="border-t border-slate-200 bg-white/70">
                              <td className="px-4 py-3 font-medium text-slate-700">{student.name}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                    student.status === "Present"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : student.status === "Late"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-rose-100 text-rose-700"
                                  }`}
                                >
                                  {student.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Historical summary</p>
              <h2 className="text-2xl font-semibold text-slate-800">Attendance Overview</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Present</th>
                  <th className="px-4 py-3 font-semibold">Absent</th>
                  <th className="px-4 py-3 font-semibold">Late</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={`${item.attendance_date}-${index}`} className="border-t border-slate-200 bg-white/70 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-700">{formatDate(item.attendance_date)}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{item.total_students}</td>
                    <td className="px-4 py-3 text-center text-emerald-600">{item.present}</td>
                    <td className="px-4 py-3 text-center text-rose-600">{item.absent}</td>
                    <td className="px-4 py-3 text-center text-amber-600">{item.late}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;