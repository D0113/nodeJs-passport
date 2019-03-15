const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const fs = require('fs');
const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ 
    secret: "ironman",
    maxAge: 5000
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
    // res.render('home');
    res.send('Login successfuly');
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