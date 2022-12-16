"use strict";

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "c@pstone2V3RYS3CR3T";

const PORT = +process.env.PORT || 3001;

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "capstone2_test"
        : process.env.DATABASE_URL || "capstone2";
  }


module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri
};