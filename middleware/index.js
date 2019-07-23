var Event = require('../models/event');
module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
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


// 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