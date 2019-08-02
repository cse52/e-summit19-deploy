var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Credential = require("../models/credential"),
    Query = require("../models/query"),
    Idgen = require("../models/idgen"),
    sgMail = require("@sendgrid/mail");

sgMail.setApiKey('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');

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
    req.body.username = req.body.username.toLowerCase();
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }

        // generate ESN id
        global.generated_id = "NA";
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
                        global.generated_id = "ESN-" + newlyCreated.value;
                    }
                });
            } else {
                Idgen.findOneAndUpdate({}, {value : (foundValue.value+1)}, function(err, newlyUpdated){
                    if(err) {
                        console.log(err);
                        req.flash("error", "Error 102! Can't Generate!");
                        res.redirect("/register");
                    } else {
                        global.generated_id = "ESN-" + (newlyUpdated.value+1);
                    }
                });
            }
        });


        // send confirmation mail with gmail, password & ESN ID
        const email_msg = {
            to: req.body.username.toString(),
            from: 'esummit.nitsri@gmail.com',
            subject: 'ESummit-19 Registration',
            html: '<p>Your ESummit 2K19 Credentials are : </p> <p>Username : <b>'+req.body.username+'</b></p> <p>Password : <b>'+req.body.password+'</b></p> <p>ESN ID : <b>'+global.generated_id+'</b></p> <p>Please keep this email safe for further use!</p> <h5>ESummit Team</h5> <h6>NIT Srinagar</h6>'
        }

        sgMail.send(email_msg, function(err, msg){
            if(err){
                console.log(err);
            }
        });

        // authenticate registered user
        passport.authenticate("local")(req, res, function(){
            // create and new credential
            var newCredential = new Credential({
                username: req.body.username.toString().toLowerCase(),
                ID: global.generated_id,
                name: req.body.name.toUpperCase(), 
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password
            });
            // save credentials to DB
            Credential.create(newCredential, function(err, newlyCreated){
                if(err){
                    console.log(err);
                    req.flash("error", "Code RP04: Problem with account! Contact Admin");
                    req.logout();
                    return res.redirect('/');
                }
            });

            req.flash("success", "Your ESummit ID : " + global.generated_id);
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
    req.body.username = req.body.username.toLowerCase();
    passport.authenticate('local', function(err, user, info) {
    if (err) { 
        req.flash("error", "Code LP01 : Unable to Login");
        return next(err); 
    }
    if (!user) { 
        req.flash("error", "Password or username is incorrect");
        return res.redirect('/login'); 
    }

    req.logIn(user, function(err) {
      if (err) { 
        req.flash("error", "Code LP02: Unable to Login");
        return next(err);
      } else {
        Credential.findOne({username: req.body.username}, function(err, foundCredential){
            if (err) {
                console.log(err);
                req.flash("error", "Code LP03: Unable to Login");
                return res.redirect('/login');
            } else if(foundCredential === null) {
                req.flash("error", "Code LP04: Problem with account! Contact Admin");
                req.logout();
                return res.redirect('/');
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