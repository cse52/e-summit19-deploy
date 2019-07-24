var mongoose = require("mongoose");

var querySchema = new mongoose.Schema({
   name: String,
   email: String,
   query: String
});

module.exports = mongoose.model("Query", querySchema);