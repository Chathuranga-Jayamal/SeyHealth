const mysql = require("mysql2/promise");

// MySQL connection (WAMP default: user=root, no password, db=hospitaldb)
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "G@m1th@123",  // default WAMP has no password for root
    database: "Ceyhealth",
    dateStrings:true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
