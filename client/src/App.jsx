import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import History from "./pages/History";

import Navbar from "./components/Navbar";

function App() {

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-100 to-cyan-50">

      <Navbar />

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route
          path="/attendance"
          element={<Attendance />}
        />

        <Route
          path="/history"
          element={<History />}
        />

      </Routes>

    </div>

  );

}

export default App;