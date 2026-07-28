function StudentCard({ student, onStatusChange }) {

  return (

    <div className="rounded-[1.75rem] bg-white shadow-lg border border-slate-200 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5 transition duration-200 hover:-translate-y-1 hover:shadow-2xl">

      <div>

        <h2 className="font-semibold text-xl text-slate-900">

          {student.name}

        </h2>

        <p className="text-slate-500 mt-1">

          {student.batch}

        </p>
      </div>

      <div className="flex gap-2">

        <button
          onClick={() => onStatusChange(student.id, "Present")}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${
            student.status === "Present"
              ? "bg-emerald-600 text-white shadow-lg"
              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          }`}
        >
          Present
        </button>

        <button
          onClick={() => onStatusChange(student.id, "Absent")}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${
            student.status === "Absent"
              ? "bg-rose-600 text-white shadow-lg"
              : "bg-rose-100 text-rose-700 hover:bg-rose-200"
          }`}
        >
          Absent
        </button>

        <button
          onClick={() => onStatusChange(student.id, "Late")}
          className={`rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${
            student.status === "Late"
              ? "bg-amber-500 text-white shadow-lg"
              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          Late
        </button>

      </div>

    </div>

  );

}

export default StudentCard;