var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Credential = require("../models/credential"),
    Query = require("../models/query"),
    Idgen = require("../models/idgen");

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
    global.genrated_id = "NA";

    Idgen.findOne({}, function(err, foundValue){
        if(err){
            console.log(err);
            req.flash("error", "Error 100! Can't Register!");
            res.redirect("/register");

        } else if(foundValue === null) {
            var newIdgen = {value : 1};
            Idgen.create(newIdgen, function(err, newlyCreated){
                if(err){
                    console.log(err);
                    req.flash("error", "Error 101! Can't Generate!");
                    res.redirect("/register");
                } else {
                    global.genrated_id = "ESN-" + newlyCreated.value;
                }
            });
        } else {
            Idgen.findOneAndUpdate({}, {value : (foundValue.value+1)}, function(err, newlyUpdated){
                if(err) {
                    console.log(err);
                    req.flash("error", "Error 102! Can't Generate!");
                    res.redirect("/register");
                } else {
                    global.genrated_id = "ESN-" + (newlyUpdated.value+1);
                }
            });
        }
    });

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            // create and new credential
            var newCredential = new Credential({
                username: req.body.username,
                ID: global.genrated_id,
                name: req.body.name, 
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password
            });
            Credential.create(newCredential, function(err, newlyCreated){
                if(err){
                    console.log(err);
                }
            });
            req.flash("success", "Your ESummit ID : " + global.genrated_id);
            res.redirect("/events"); 
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handling login logic
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
        req.flash("error", "Error LP01 : Unable to Login");
        return next(err); 
    }
    if (!user) { 
        req.flash("error", "Password or username is incorrect");
        return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { 
        req.flash("error", "Error LP02 : Unable to Login");
        return next(err);
      } else {
        Credential.findOne({username: req.body.username}, function(err, foundCredential){
            if (err) {
                console.log(err);
                req.flash("error", "Error LP03 : Unable to Login");
                res.redirect('/login');
            } else {
                req.flash("success", "Welcome Back "+foundCredential.ID);
                return res.redirect('/events');
            }
        });

      }

    });
  })(req, res, next);
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged Out!");
   res.redirect("/");
});

// query route
router.post("/query", function(req, res) {
    var newQuery = {name: req.body.name, email: req.body.email, query: req.body.query};
      // Create a new query and save to DB
    Query.create(newQuery, function(err, newlyCreated){
        if(err){
              console.log(err);
              req.flash('error', 'Not open to Queries for now!');
        } else {
              req.flash('success', 'Query Registered. You will be contacted soon..');
              res.redirect("/");
        }
    });

});


module.exports = router;