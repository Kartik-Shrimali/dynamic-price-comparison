const mysql = require("mysql2");

let pool;

try {
  pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Kartik@19111",
    database: "dbms_project",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("Database pool created successfully");
} catch (error) {
  console.error("Error creating database pool:", error.message);
  process.exit(1); 
}
module.exports = pool.promise();
