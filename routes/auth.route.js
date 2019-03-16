var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/facebook', 
    passport.authenticate('facebook')
);

router.get('/facebook/callback', 
    // auth login ()
    passport.authenticate('facebook', {failureRedirect: '/', successRedirect: '/home'})
);

module.exports = router;