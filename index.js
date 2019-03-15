const express = require('express');
const app = express();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy; 
const fs = require('fs');
const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.set(express.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    passport.authenticate('local', { failureRedirect: '/login' });
});

passport.use(new localStrategy(
    (username, password, done) => {
        fs.readFileSync('./userDB.json', (err, data) => {
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

app.listen(port, () => {
    console.log('Server listen port', port);
});