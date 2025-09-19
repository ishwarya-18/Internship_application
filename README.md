# 📄 Internship Application Form

## 🚀 Project Overview
This is a simple **Internship Application Form** built using **Node.js, Express, PostgreSQL, and Multer** for file uploads. The application allows users to submit their details along with a resume and stores the information in a PostgreSQL database.

---
## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Frontend:** HTML, CSS, JavaScript
- **File Uploads:** Multer

---
## 📂 Project Structure
```
📦 Project Directory
 ┣ 📂 uploads           # Stores uploaded resumes
 ┣ 📂 views             # HTML files
 ┣ 📂 public            # CSS and frontend assets
 ┣ 📜 server.js         # Main backend logic
 ┣ 📜 .env              # Environment variables (DB credentials)
 ┣ 📜 package.json      # Dependencies
```
---
## 🔧 Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/ishwarya-18/Internship_application
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file and add your PostgreSQL database URL:
```
DATABASE_URL=postgresql://postgres:2005@localhost:5432/internship_applications
```

### 4️⃣ Start the Server
```sh
node server.js
```
Server runs on **http://localhost:3000** 🌍

---
## 📌 Features
✅ Internship application form 📋  
✅ Resume upload support 📎  
✅ PostgreSQL database integration 🗄️  
✅ Email uniqueness validation ✉️  
✅ Success page with details 🎉  


---
## 🏗️ API Endpoints
| Method | Endpoint  | Description |
|--------|----------|-------------|
| GET    | `/`      | Serve the application form |
| POST   | `/submit` | Submit form data & upload resume |

---
## 🤝 Contributing
Feel free to open issues and contribute! 🎯

---
## 📜 License
This project is **MIT licensed**. 📝

