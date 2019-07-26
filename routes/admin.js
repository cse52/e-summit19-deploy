var express = require("express"),
	router = express.Router();



// Wild Card Route with response 404
router.get("*", function(req, res){
    res.render("404");
});


module.exports = router;