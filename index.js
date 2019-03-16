const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const passportFb = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy; 
const fs = require('fs');
const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ 
    secret: "ironman",
    maxAge: 6000 * 5
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/home', (req, res) => {
    res.render('home', {
        name: req.user.username
    });
})

app.get('/club', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('Welcome');
    } else {
        res.send('login????????');
    }
})

app.post('/login', 
    passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/login' })
);

passport.use(new LocalStrategy(
    (username, password, done) => {
        fs.readFile('./userDB.json', (err, data) => {
            const db = JSON.parse(data);
            const userRecord = db.find(user => user.username === username);
            if (userRecord) {
                if (userRecord.password === password) {
                    return done(null, userRecord); 
                }
            }        
            return done(null, false);
        });

    }
));

app.get('/auth/facebook', 
    passport.authenticate('facebook')
);

app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {failureRedirect: '/', successRedirect: '/home'})
);

passport.use(new passportFb(
    {
    clientID: "",
    clientSecret: "",
    callbackURL: ""
    },
    (accessToken, refeshToken, profile, done) => {
        console.log(profile);
    }
));


passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((name, done) => {
    fs.readFile('./userDB.json', (err, data) => {
        const db = JSON.parse(data);
        const userRecord = db.find(user => user.username === name);
        if (userRecord) {
            return done(null, userRecord);
        } else {
            return done(null, false);
        }
    });
});

app.listen(port, () => {
    console.log('Server listen port', port);
});