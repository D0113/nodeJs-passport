var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/home', (req, res) => {
    res.render('home', {
        name: req.user.username
    });
})

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', 
    passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/login' })
);

router.get('/club', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome');
    } else {
        res.send('login????????');
    }
})

module.exports = router;