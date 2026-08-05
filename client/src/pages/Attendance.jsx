import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import StudentCard from "../components/StudentCard";
import {
  getStudents,
  saveAttendance,
} from "../services/attendanceApi";

function Attendance() {

  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [isCorrection, setIsCorrection] = useState(false);

  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDateLabel = (dateString) => {
    if (!dateString) return "";

    const [year, month, day] = dateString.split("-");
    const parsed = new Date(Number(year), Number(month) - 1, Number(day));
    return parsed.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const groupStudentsByBatch = (studentList) => {
    const groups = {};

    studentList.forEach((student) => {
      const batchName = student.batch || "Unassigned";

      if (!groups[batchName]) {
        groups[batchName] = [];
      }

      groups[batchName].push(student);
    });

    return Object.entries(groups).sort(([batchA], [batchB]) =>
      batchA.localeCompare(batchB)
    );
  };

  const groupedStudents = groupStudentsByBatch(students);

  useEffect(() => {
    setAttendanceDate(getLocalDateString());
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await getStudents();
      const studentList = response.data.map((student) => ({
        ...student,
        status: "Present",
      }));

      setStudents(studentList);
    } catch (error) {
      toast.error("Failed to load students");
    }
  };

  const handleStatusChange = (studentId, status) => {
    const updatedStudents = students.map((student) => {
      if (student.id === studentId) {
        return { ...student, status };
      }
      return student;
    });

    setStudents(updatedStudents);
  };

  const handleSubmit = async () => {
    try {
      const attendanceData = {
        attendanceDate,
        isCorrection,
        students: students.map((student) => ({
          studentId: student.id,
          status: student.status,
        })),
      };

      const response = await saveAttendance(attendanceData);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save attendance");
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-100 to-cyan-50 py-10">

      <div className="max-w-6xl mx-auto px-6">

        <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-sky-700 to-cyan-600 p-10 shadow-2xl text-white mb-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <h1 className="text-4xl font-semibold tracking-tight">

                Attendance

              </h1>

              <p className="mt-3 text-slate-200 max-w-2xl">

                Mark attendance for your selected date, then review or correct it instantly.

              </p>

            </div>

            <div className="rounded-3xl bg-white/10 border border-white/20 px-5 py-4 shadow-lg backdrop-blur-sm">

              <p className="text-sm uppercase tracking-[0.24em] text-slate-200">
                {attendanceDate === getLocalDateString() ? "Today" : "Selected Date"}
              </p>

              <p className="mt-2 text-2xl font-semibold">{formatDateLabel(attendanceDate)}</p>

            </div>

          </div>

        </div>

        <div className="rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 p-8 mb-8">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="w-full lg:w-1/2">

              <label className="block mb-2 text-sm font-semibold text-slate-700">Select Date</label>

              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition duration-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
              />

            </div>

            <div className="flex items-center gap-3 text-slate-700">

              <input
                type="checkbox"
                checked={isCorrection}
                onChange={(e) => setIsCorrection(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />

              <label className="font-medium">Correction Mode</label>

            </div>

          </div>

        </div>

        <div className="space-y-6">

          {groupedStudents.map(([batchName, batchStudents]) => (

            <section
              key={batchName}
              className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm"
            >

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                <h2 className="text-xl font-semibold text-slate-900">{batchName}</h2>

                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                  {batchStudents.length} students
                </span>

              </div>

              <div className="space-y-4">

                {batchStudents.map((student) => (

                  <StudentCard
                    key={student.id}
                    student={student}
                    onStatusChange={handleStatusChange}
                  />

                ))}

              </div>

            </section>

          ))}

        </div>

        <button
          onClick={handleSubmit}
          className="mt-10 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 px-8 py-4 text-white text-lg font-semibold shadow-lg transition duration-200 hover:scale-[1.01] hover:shadow-2xl"
        >

          Submit Attendance

      </button>

    </div>

  </div>

  );

}

export default Attendance;