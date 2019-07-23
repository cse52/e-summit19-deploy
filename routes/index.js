var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Credential = require("../models/credential");

//root route
router.get("/", function(req, res){
    res.render("landing", {page: 'landing'});
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'});
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.adminCode === process.env.ADMIN_CODE) {
      newUser.isAdmin = true;
    }
    var newCredential = new Credential({
        username: req.body.username, 
        name: req.body.name, 
        email: req.body.username,
        mobile: req.body.mobile,
        password: req.body.password
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            Credential.create(newCredential, function(err, newlyCreated){
                if(err){
                    console.log(err);
                }
            });
           req.flash("success", "Successfully Registered " + req.body.username);
           res.redirect("/events"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/events",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to E-summit!'
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged Out!");
   res.redirect("/");
});


module.exports = router;