var express = require("express"),
	app 	= express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	cookieParser = require("cookie-parser"),
	passport    = require("passport"),
	LocalStrategy = require("passport-local"),
	flash 	= require("connect-flash"),
    User	= require("./models/user"),
	session	= require("express-session"),
	// seedDB      = require("./seeds"),
    methodOverride = require("method-override");

// configure dotenv
require('dotenv').load();

//requiring routes
var eventRoutes    = require("./routes/events"),
    indexRoutes      = require("./routes/index");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/e-summit19';
mongoose.connect(databaseUri, { useNewUrlParser: true })
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "if you are good at something, never do it for free",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", indexRoutes);
app.use("/events", eventRoutes);

app.listen(process.env.PORT || 80, function(){
   console.log("The E-summit'19 Server Has Started! " + process.env.PORT);
});
