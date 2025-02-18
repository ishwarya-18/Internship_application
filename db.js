const { Client } = require("pg");

// Set up PostgreSQL client
const client = new Client({
    user: "postgres",  // Replace with your PostgreSQL username
    host: "localhost",
    database: "internship_applications",  // Replace with your database name
    password: "2005",  // Replace with your password
    port: 5432,
});

client.connect(); // Connect to PostgreSQL

module.exports = client;
