const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = process.env.MONGO_URI || "mongodb://localhost:27017/testdb";
db.tutorials = require("./tutorial.model.js")(mongoose);

module.exports = db;
