const mongoose = require("mongoose");
require("dotenv").config();

const MongoUri = process.env.MONGODB;

const initializeDB = async () => {
  mongoose
    .connect(MongoUri)
    .then(() => {
      console.log("Connected to MongoDB successfully.");
    })
    .catch(() => {
      console.log("Error while connecting to database.");
    });
};

module.exports = { initializeDB };
