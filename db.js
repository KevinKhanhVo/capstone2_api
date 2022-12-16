"use strict";

const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
    db = new Client({
    host: "localhost",
    user: "kevin",
    password: "postgres",
    port: "5432",
    database: "capstone2_test"
  })
}

db.connect();

module.exports = db;