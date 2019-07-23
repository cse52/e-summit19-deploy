var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
   name: String,
   head: String,
   headMobile: String,
   poster: String,
   description: String,

   participants: [
      {
         username: String,
         name: String,
         email: String,
         mobile: String
      }
   ]
});

module.exports = mongoose.model("Event", eventSchema);