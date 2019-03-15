const express = require('express');
const app = express();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy; // vua lam toi day thi buon ngu qua, tam phut 12.
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

app.listen(port, () => {
    console.log('Server listen port', port);
});