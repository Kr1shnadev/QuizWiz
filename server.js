require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;
const SECRET_KEY = "SECRET_KEY"; // Change this to a secure value

app.use(cors({ origin: "*" }));
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Platform",
  password: "",
  port: 5432,
});

// **User Registration API**
app.post("/register", async (req, res) => {
    const { email, password, role, name } = req.body;

    if (!email || !password || !role || !name) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const userResult = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
            [email, hashedPassword]
        );

        const userId = userResult.rows[0].id;

        if (role === "student") {
            await pool.query("INSERT INTO students (user_id, name) VALUES ($1, $2)", [userId, name]);
        } else if (role === "faculty") {
            await pool.query("INSERT INTO faculty (user_id, name) VALUES ($1, $2)", [userId, name]);
        } else {
            return res.status(400).json({ error: "Invalid role" });
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Error in registration:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// **Login API with Role-Based Redirection**
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  
      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
  
      const user = userResult.rows[0];
  
      // **Compare entered password with hashed password**
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }
  
      // **Check if user is a student**
      const studentResult = await pool.query("SELECT * FROM students WHERE user_id = $1", [user.id]);
      if (studentResult.rows.length > 0) {
        const token = jwt.sign({ user_id: user.id, role: "student" }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token, role: "student", redirect: "faculty_home.html" });
      }
  
      // **Check if user is a faculty**
      const facultyResult = await pool.query("SELECT * FROM faculty WHERE user_id = $1", [user.id]);
      if (facultyResult.rows.length > 0) {
        const token = jwt.sign({ user_id: user.id, role: "faculty" }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token, role: "faculty", redirect: "faculty_home.html" });
      }
  
      res.status(403).json({ error: "User role not assigned" });
    } catch (err) {
      console.error("Error in login:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// **Protected Route Example**
app.get("/dashboard", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: `Welcome ${decoded.role}!` });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
