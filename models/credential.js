var mongoose = require("mongoose");

var CredentialSchema = new mongoose.Schema({
    username: String,
    name: String,
    email: String,
    mobile: String,
    password: String
});

module.exports = mongoose.model("Credential", CredentialSchema);