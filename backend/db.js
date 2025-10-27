const mysql = require("mysql2");

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "dbms_project",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("Database pool created successfully");
} catch (error) {
  console.error("CRITICAL ERROR: Failed to configure database pool:", error.message);
  console.error("Ensure DB_HOST, DB_USER, and DB_PASSWORD environment variables are set.");
  process.exit(1);
}
module.exports = pool.promise();
