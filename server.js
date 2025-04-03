require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "web_backend_dev",
  password: "",
  port: 5432,
});

app.post("/login", async (req, res) => {
  console.log("Received login request:", req.body);

  const { email, password, role } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      console.log("User not found");
      return res.status(401).json({ message: "User not found or role mismatch" });
    }

    const user = result.rows[0];
    console.log("User found:", user);

    if (user.encrypted_passcode) {
      const isMatch = await bcrypt.compare(password, user.encrypted_passcode);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }
    } else {
      if (!user.name || password !== user.name) {
        return res.status(401).json({ error: "Invalid password" });
      }
    }

    const token = jwt.sign({ user_id: user.id, role }, "SECRET_KEY", { expiresIn: "1h" });
    console.log("Login successful, sending token...");
    res.json({ token, role });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
