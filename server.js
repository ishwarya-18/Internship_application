const express = require("express");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const { Client } = require("pg");

const app = express();
const PORT = 3000;

// PostgreSQL Connection
const client = new Client({
    user: "postgres",  
    host: "localhost",
    database: "internship_applications",
    password: "2005",  
    port: 5432,
});

client.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Connection error", err.stack));

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

// Handle form submission
app.post("/submit", upload.single("resume"), async (req, res) => {
    const { name, email, phone, address, university, degree, position, coverLetter } = req.body;
    const resume = req.file ? req.file.filename : "No file uploaded";

    try {
        const query = `
            INSERT INTO applications (name, email, phone, address, university, degree, position, cover_letter, resume) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;
        `;

        const values = [name, email, phone, address, university, degree, position, coverLetter, resume];
        await client.query(query, values);
        console.log("Data inserted successfully!");

        // Redirect to success page with query parameters
        res.redirect(`/success.html?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${phone}&address=${encodeURIComponent(address)}&university=${encodeURIComponent(university)}&degree=${encodeURIComponent(degree)}&position=${encodeURIComponent(position)}&coverLetter=${encodeURIComponent(coverLetter)}&resume=${encodeURIComponent(resume)}`);

    } catch (err) {
        console.error("Error inserting data into database:", err);
        res.status(500).send("Error submitting application");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
