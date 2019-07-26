var express = require("express");
var router  = express.Router();
var Event = require("../models/event");
var Credential = require("../models/credential");
var middleware = require("../middleware");
var { isLoggedIn, isAdmin } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all events
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all events from DB
      Event.find({name: regex}, function(err, allEvents){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allEvents);
         }
      });
  } else {
      // Get all events from DB
      Event.find({}, function(err, allEvents){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allEvents);
            } else {
              res.render("events/index",{events: allEvents, page: 'events'});
            }
         }
      });
  }
});

//CREATE - add new event to DB
router.post("/", isLoggedIn, isAdmin, function(req, res){
    var name = req.body.name;
    var head = req.body.head;
    var headMobile = req.body.headMobile;
    var poster = req.body.poster;
    var description = req.body.description;
    var newEvent = {name: name, head: head, headMobile: headMobile, poster: poster, description: description};
      // Create a new event and save to DB
    Event.create(newEvent, function(err, newlyCreated){
        if(err){
              console.log(err);
        } else {
              //redirect back to event page
              res.redirect("/events");
        }
    });
});

//NEW - show form to create new event
router.get("/new", isLoggedIn, isAdmin, function(req, res){
    res.render("events/new"); 
});

// SHOW - shows more info about one event
router.get("/:id", function(req, res){
    //find the event with provided ID
    Event.findById(req.params.id).exec(function(err, foundEvent){
        if(err || !foundEvent){
            console.log(err);
            req.flash('error', 'Sorry, that event does not exist!');
            return res.redirect('/events');
        }
        //render show template with that event
        res.render("events/show", {event: foundEvent});
    });
});

// Create Participation
router.post("/:id/participate", isLoggedIn, function(req, res){
    //lookup event using ID
    Event.findById(req.params.id, function(err, event){
        if(err){
            console.log(err);
            res.redirect("/events");
        } else {
            Credential.findOne({username: req.user.username}, function(err, foundCredential){
                if(err){
                    console.log(err);
                } else {
                    // console.log(foundCredential);
                    var participantCredential = {
                        username: foundCredential.username,
                        ID : foundCredential.ID,
                        name: foundCredential.name,
                        mobile: foundCredential.mobile
                    }
                    // console.log(participantCredential);
                   
                    var foundParticipant = event.participants.find(function(element){
                        return element.username === participantCredential.username;
                    });
                    // console.log(typeof foundParticipant + " : " + foundParticipant);

                    if(foundParticipant != null) {
                        if(foundParticipant.username === req.user.username) {
                            req.flash('error', 'Already Participated');
                            res.redirect('/events/' + event._id);
                        }
                    } else {
                        event.participants.push(participantCredential);
                        event.save();
                        req.flash('success', "Participation Successful");
                        res.redirect('/events/' + event._id);
                    }

                }
            });
        }
    });
});

// LIST : Show Event Participation List
router.get("/:id/list", function(req, res){
    //find the event with provided ID
    Event.findById(req.params.id).exec(function(err, foundEvent){
        if(err || !foundEvent){
            console.log(err);
            req.flash('error', 'Sorry, that event does not exist!');
            return res.redirect('/events');
        }
        //render show template with that event
        // console.log(foundEvent);
        res.render("events/list", {event: foundEvent});
    });
});

 // EDIT - shows edit form for a event
router.get("/:id/edit", isLoggedIn, isAdmin, function(req, res){
    //render edit template with that event
    res.render("events/edit", {event: req.event});
});

// PUT - updates event in the database
router.put("/:id", isLoggedIn, isAdmin, function(req, res){
    Event.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, event){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/events/" + event._id);
        }
    });
});
  


// DELETE - removes event and the database
router.delete("/:id", isLoggedIn, isAdmin, function(req, res) {
    req.event.remove(function(err) {
        if(err) {
            req.flash('error', err.message);
            return res.redirect('/');
        }
        req.flash('error', 'event deleted!');
        res.redirect('/events');
      });
});

module.exports = router;


