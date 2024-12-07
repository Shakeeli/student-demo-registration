// Import required modules
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");  // Import CORS to allow requests from front-end

// Create an instance of Express
const app = express();

// Enable CORS for all routes
app.use(cors());  // This allows cross-origin requests from localhost:3000 (React)

app.use(express.json());  // Middleware to parse JSON request bodies

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: "localhost",        // Database host
  user: "root",             // Database username
  password: "my-secret-pw", // Your MySQL password (change if necessary)
  database: "student_demo_registration",  // The database you're working with
});

// Connect to the MySQL database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Route to get all available time slots and their remaining seats
// This endpoint should fetch all unique time slots and their remaining seats
app.get('/timeslots', (req, res) => {
  const query = `
    SELECT time_slot, seats_remaining
    FROM time_slots
    ORDER BY time_slot;`;  // Ensure time slots are ordered
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error retrieving time slots:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.status(200).json(result);  // Sends time slots to the frontend
  });
});

// Route to register a student
app.post("/register", (req, res) => {
  const { student_id, first_name, last_name, project_title, email, phone, time_slot } = req.body;

  // Check if the student is already registered
  db.query('SELECT * FROM students WHERE id = ?', [student_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      // Student already registered, ask if they want to change time slot
      return res.status(400).json({ error: "Student already registered, do you want to change the time slot?" });
    }

    // Check if seats are available in the selected time slot
    db.query('SELECT * FROM time_slots WHERE time_slot = ?', [time_slot], (err, timeSlotResult) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (!timeSlotResult.length || timeSlotResult[0].seats_remaining <= 0) {
        return res.status(400).json({ error: "No seats available for the selected time slot." });
      }

      // Insert student into students table
      db.query('INSERT INTO students (id, first_name, last_name, project_title, email, phone, time_slot_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [student_id, first_name, last_name, project_title, email, phone, timeSlotResult[0].id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Failed to register student." });
        }

        // Update the time slot's seats remaining
        db.query('UPDATE time_slots SET seats_remaining = seats_remaining - 1 WHERE id = ?', [timeSlotResult[0].id], (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Failed to update time slot seats." });
          }

          return res.status(200).json({ message: "Registration successful!" });
        });
      });
    });
  });
});

// Route to get all students registered
app.get("/students", (req, res) => {
  db.query("SELECT students.id, students.first_name, students.last_name, students.project_title, students.email, students.phone, time_slots.time_slot FROM students JOIN time_slots ON students.time_slot_id = time_slots.id", (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to retrieve students" });
    }
    return res.status(200).json(result);
  });
});

// Start the server and listen for incoming requests
const port = 5001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
