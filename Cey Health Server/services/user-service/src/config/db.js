import env from "dotenv";
env.config({ path: "../.env" });

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
