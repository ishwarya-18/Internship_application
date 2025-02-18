const express = require("express");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const { Client } = require('pg');  // Import the PostgreSQL client

const app = express();
const PORT = 3000;

// Set up PostgreSQL connection
const client = new Client({
    user: 'postgres',  // Replace with your PostgreSQL username
    host: 'localhost',
    database: 'internship_applications',
    password: '2005',  // Replace with your PostgreSQL password
    port: 5432,
});
client.connect();  // Connect to PostgreSQL

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));  // Updated static path

// Set up file storage for resume
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Render the application form
app.get("/", (req, res) => {
    res.render("index");
});

// Handle form submission and store data in PostgreSQL
app.post("/submit", upload.single("resume"), (req, res) => {
    const { name, email, phone, address, university, degree, position, coverLetter } = req.body;
    const resume = req.file ? req.file.filename : "No file uploaded";
    
    // Insert the data into the database
    const query = `INSERT INTO applications (name, email, phone, address, university, degree, position, cover_letter, resume) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    
    client.query(query, [name, email, phone, address, university, degree, position, coverLetter, resume], (err, result) => {
        if (err) {
            console.error("Error inserting data into database", err);
            return res.status(500).send("Error submitting application");
        }
        
        // Render success page after data is inserted
        res.render("success", { name, email, phone, address, university, degree, position, coverLetter, resume });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
