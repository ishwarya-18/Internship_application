require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const { Client } = require("pg");

const app = express();
const PORT = 3000;

// PostgreSQL Connection
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Required for Render
    }
});

client.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Connection error", err.stack));
module.exports = client;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve CSS, JS
app.use(express.static(path.join(__dirname, "views")));  // Serve HTML
app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // ✅ Serve Uploaded Files

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.post("/submit", upload.single("resume"), async (req, res) => {
    const { name, email, phone, address, university, degree, position, coverLetter } = req.body;
    const resume = req.file ? req.file.filename : "No file uploaded";

    try {
        // Check if email already exists
        const emailCheckQuery = `SELECT * FROM applications WHERE email = $1`;
        const emailCheckResult = await client.query(emailCheckQuery, [email]);

        if (emailCheckResult.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists." });
        }

        // Insert new application
        const query = `
            INSERT INTO applications (name, email, phone, address, university, degree, position, cover_letter, resume) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
        `;
        const values = [name, email, phone, address, university, degree, position, coverLetter, resume];
        await client.query(query, values);
        console.log("Data inserted successfully!");

        res.status(200).json({ success: true, name, email, phone, address, university, degree, position, coverLetter, resume });

    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "Server error. Please try again." });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
