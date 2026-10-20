const mysql = require('mysql2/promise');

// Mencegah pembuatan pool berlebihan di serverless environment
let pool;

if (!pool) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 2, // Dibatasi maksimal 2 koneksi per fungsi serverless
    maxIdle: 2,
    idleTimeout: 30000,
    queueLimit: 0,
    enableKeepAlive: true,
    ssl: { rejectUnauthorized: false }
  });
}

module.exports = pool;
