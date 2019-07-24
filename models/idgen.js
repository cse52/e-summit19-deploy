var mongoose = require("mongoose");
var integerValidator = require('mongoose-integer');

var idgenSchema = new mongoose.Schema({
	value: {
        type: Number,
        integer: true
    }
});

idgenSchema.plugin(integerValidator);
module.exports = mongoose.model("Idgen", idgenSchema);