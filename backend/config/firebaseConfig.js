const dotenv = require('dotenv');
dotenv.config();

const DB_URL = process.env.FIREBASE_DATABASE_URL;

module.exports = { DB_URL };
