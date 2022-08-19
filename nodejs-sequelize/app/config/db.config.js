require('dotenv').config()

module.exports = {
  HOST: process.env.DBHOST || "localhost",
  USER: process.env.DBUSER || "postgres",
  PASSWORD: process.env.DBPASSWORD || "123456",
  DB: process.env.DBDB || "dbuser",
  dialect: process.env.DBdialect || "postgres",
  pool: {
    max: process.env.DBmax || 5,
    min: process.env.DBmin || 0,
    acquire: process.env.DBacquire || 30000,
    idle: process.env.DBidle || 10000
  }
};

