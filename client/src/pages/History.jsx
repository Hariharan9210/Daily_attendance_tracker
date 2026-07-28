import { useEffect, useState } from "react";
import { getAttendanceHistory, getAttendanceByDate } from "../services/attendanceApi";

function History() {

    const [history, setHistory] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedAttendance, setSelectedAttendance] = useState([]);
    const [selectedAttendanceLoaded, setSelectedAttendanceLoaded] = useState(false);

    const getLocalDateString = (date = new Date()) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const today = getLocalDateString();
        setSelectedDate(today);
        loadHistory();
        loadAttendanceForDate(today);
    }, []);

    const loadHistory = async () => {
        try {
            const response = await getAttendanceHistory();
            setHistory(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const loadAttendanceForDate = async (date) => {
        try {
            const response = await getAttendanceByDate(date);
            setSelectedAttendance(response.data);
        } catch (error) {
            setSelectedAttendance([]);
        } finally {
            setSelectedAttendanceLoaded(true);
        }
    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);
        setSelectedAttendanceLoaded(false);
        loadAttendanceForDate(date);
    };

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

    const groupedSelectedAttendance = Object.entries(
        selectedAttendance.reduce((groups, student) => {
            const batchName = student.batch || "Unassigned";
            if (!groups[batchName]) {
                groups[batchName] = [];
            }
            groups[batchName].push(student);
            return groups;
        }, {})
    ).sort(([batchA], [batchB]) => batchA.localeCompare(batchB));

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-100 to-cyan-50 py-10">

            <div className="max-w-6xl mx-auto px-6">

                <div className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-sky-700 to-cyan-600 text-white shadow-2xl p-10 mb-10">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        <div>

                            <h1 className="text-4xl font-semibold tracking-tight">

                                Attendance History

                            </h1>

                            <p className="mt-3 text-slate-200 max-w-2xl">

                                Explore past attendance records and view the full student attendance for any selected date.

                            </p>

                        </div>

                        <div className="rounded-3xl bg-white/10 border border-white/20 px-5 py-4 shadow-lg backdrop-blur-sm">

                            <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Selected Date</p>

                            <p className="mt-2 text-2xl font-semibold">{formatAttendanceDate(selectedDate)}</p>

                        </div>

                    </div>

                </div>

                <div className="rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 p-8 mb-10">

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

                        <div>

                            <label className="block mb-2 text-sm font-semibold text-slate-700">Pick a date</label>

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition duration-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100"
                            />

                        </div>

                    </div>

                    <div className="mt-10">

                        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Attendance Details for {formatAttendanceDate(selectedDate)}</h2>

                        {selectedAttendanceLoaded ? (
                            selectedAttendance.length > 0 ? (
                                <div className="space-y-6">
                                    {groupedSelectedAttendance.map(([batchName, batchStudents]) => (
                                        <section key={batchName} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 shadow-sm">
                                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                                <h3 className="text-lg font-semibold text-slate-900">{batchName}</h3>
                                                <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                                                    {batchStudents.length} students
                                                </span>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[420px] border-separate border-spacing-y-2 text-left">
                                                    <thead>
                                                        <tr className="text-slate-500 uppercase text-xs tracking-[0.2em]">
                                                            <th className="px-3 py-2">Name</th>
                                                            <th className="px-3 py-2">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {batchStudents.map((student) => (
                                                            <tr key={student.student_id} className="rounded-2xl bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                                                <td className="px-3 py-3 text-slate-900">{student.name}</td>
                                                                <td className="px-3 py-3 text-slate-700 font-medium">{student.status}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">No attendance was recorded for this date.</p>
                            )
                        ) : (
                            <p className="text-slate-500">Loading attendance...</p>
                        )}

                    </div>

                </div>

                <div className="rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">

                    <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 px-6 py-5 text-white">

                        <h3 className="text-xl font-semibold">Attendance Summary</h3>

                    </div>

                    <table className="w-full text-slate-700">

                        <thead className="bg-slate-100 text-slate-600 uppercase text-sm tracking-[0.16em]">

                            <tr>

                                <th className="p-4 text-left">Date</th>

                                <th className="text-center">Total</th>

                                <th className="text-center">Present</th>

                                <th className="text-center">Absent</th>

                                <th className="text-center">Late</th>

                            </tr>

                        </thead>

                        <tbody>

                            {history.map((item, index) => (

                                <tr
                                    key={index}
                                    className="border-b border-slate-200 transition duration-200 hover:bg-slate-50 hover:shadow-sm"
                                >

                                    <td className="p-4">

                                        {formatAttendanceDate(item.attendance_date)}

                                    </td>

                                    <td className="text-center font-semibold text-slate-900">

                                        {item.total_students}

                                    </td>

                                    <td className="text-center text-emerald-600 font-semibold">

                                        {item.present}

                                    </td>

                                    <td className="text-center text-rose-600 font-semibold">

                                        {item.absent}

                                    </td>

                                    <td className="text-center text-amber-500 font-semibold">

                                        {item.late}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default History;