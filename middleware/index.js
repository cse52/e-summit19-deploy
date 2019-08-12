var Event = require('../models/event');
module.exports = {
  isLoggedIn: function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You must be signed in to do that!');
    res.redirect('/login');
  },
  alreadyLoginRedirect: function(req, res, next){
    if(req.isAuthenticated()){
      req.flash('success', 'Already Logged In!');
      res.redirect('/');
    } else {
      return next();
    }
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'Your Account does not have Administrator previleges.');
      res.redirect('back');
    }
  }
}