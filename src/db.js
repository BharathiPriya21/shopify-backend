const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString:process.env.EXTERNAL_URL,
  ssl: { rejectUnauthorized: false },
});

// const pool = new Pool({
// host: process.env.PGHOST || 'localhost',
// port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
// user: process.env.PGUSER,
// password: process.env.PGPASSWORD,
// database: process.env.PGDATABASE,
// });
pool.connect((err) => {
  if (!err) {
    console.log("database connection succeeded");
   
  } else {
    console.log("database connection failed" + err);
  }
});

module.exports = pool;