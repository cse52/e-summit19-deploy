var mongoose = require("mongoose");

var CredentialSchema = new mongoose.Schema({
    username: String,
    ID: String,
    name: String,
    mobile: String,
    password: String
});

module.exports = mongoose.model("Credential", CredentialSchema);