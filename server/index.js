import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", attendanceRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Database Connected Successfully",
      currentTime: result.rows[0].now
    });

  } catch (error) {
  console.error("Database Error:", error);

  res.status(500).json({
    success: false,
    message: error.message
  });
}
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});