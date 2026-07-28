import pool from "../config/db.js";

// Get all students
export const getStudents = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students ORDER BY id"
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
};

// Get attendance by date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const result = await pool.query(
      `SELECT
          attendance.student_id,
          students.name,
          students.batch,
          attendance.status,
          attendance.attendance_date
       FROM attendance
       INNER JOIN students
       ON attendance.student_id = students.id
       WHERE attendance.attendance_date = $1
       ORDER BY students.id`,
      [date]
    );

    res.status(200).json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch attendance"
    });
  }
};

const parseLocalDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
        return null;
    }

    const parts = dateString.split("-");
    if (parts.length === 3 && !parts[2].includes("T") && !parts[2].includes(":")) {
        const [year, month, day] = parts;
        const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
        return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    const parsedDate = new Date(dateString);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

// Save attendance

export const saveAttendance = async (req, res) => {

    try {

        const {
            attendanceDate,
            students,
            isCorrection
        } = req.body;

        // -----------------------------
        // Check Future Date
        // -----------------------------

        const today = new Date();
        today.setHours(0,0,0,0);

        const selectedDate = parseLocalDate(attendanceDate);

        if (!selectedDate) {
            return res.status(400).json({
                message: "Invalid attendance date."
            });
        }

        selectedDate.setHours(0,0,0,0);

        if(selectedDate > today){

            return res.status(400).json({
                message:"Future dates are not allowed."
            });

        }

        const normalizedAttendanceDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

        // -----------------------------
        // Check Duplicate Attendance
        // -----------------------------

        const existingAttendance = await pool.query(

            `SELECT * FROM attendance
             WHERE attendance_date = $1
             LIMIT 1`,

             [normalizedAttendanceDate]

        );

        if(existingAttendance.rows.length > 0 && !isCorrection){

            return res.status(400).json({
                message:"Attendance already exists for this date."
            });

        }

        // -----------------------------
        // Correction Mode
        // -----------------------------

        if(isCorrection){

            await pool.query(

                `DELETE FROM attendance
                 WHERE attendance_date=$1`,

                 [normalizedAttendanceDate]

            );

        }

        // -----------------------------
        // Insert Attendance
        // -----------------------------

        for(const student of students){

            await pool.query(

                `INSERT INTO attendance
                (
                    student_id,
                    attendance_date,
                    status,
                    is_correction
                )
                VALUES($1,$2,$3,$4)`,

                [
                    student.studentId,
                    normalizedAttendanceDate,
                    student.status,
                    isCorrection
                ]

            );

        }

        res.status(200).json({
            message:"Attendance Saved Successfully"
        });

    }
    catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

};

// Attendance history
// Get attendance history
export const getAttendanceHistory = async (req, res) => {
  try {

    const result = await pool.query(
      `SELECT
          attendance.attendance_date,
          COUNT(*) AS total_students,

          COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present,

          COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS absent,

          COUNT(CASE WHEN status = 'Late' THEN 1 END) AS late

       FROM attendance

       GROUP BY attendance.attendance_date

       ORDER BY attendance.attendance_date DESC`
    );

    res.status(200).json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch attendance history"
    });

  }
};