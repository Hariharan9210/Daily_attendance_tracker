import { NavLink } from "react-router-dom";

function Navbar() {

  return (

    <nav className="bg-gradient-to-r from-slate-900 via-sky-700 to-cyan-600 shadow-2xl border-b border-white/10 backdrop-blur-md">

          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-white tracking-tight">

            Daily Attendance Tracker

          </h1>

          <p className="text-sm text-slate-200 mt-1">

            Manage class attendance with speed and style

          </p>

        </div>
        <div className="flex flex-wrap items-center gap-3">

          <NavLink
            to="/"
            className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
              isActive
                ? "bg-white text-slate-900 shadow-xl"
                : "text-slate-100 hover:bg-white/15 hover:text-white"
            }`}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/attendance"
            className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
              isActive
                ? "bg-white text-slate-900 shadow-xl"
                : "text-slate-100 hover:bg-white/15 hover:text-white"
            }`}
          >
            Attendance
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${
              isActive
                ? "bg-white text-slate-900 shadow-xl"
                : "text-slate-100 hover:bg-white/15 hover:text-white"
            }`}
          >
            History
          </NavLink>

        </div>

      </div>

    </nav>

  );

}

export default Navbar;