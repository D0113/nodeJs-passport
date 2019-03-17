require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

// route
const indexRoute = require('./routes/index.route');
const authRoute = require('./routes/auth.route');
// passport
const passport = require('passport');
const passportFb = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy; 

// const fs = require('fs');

//
const user = require('./models/user.model');

const port = 3000;

// set views engine (ejs)
app.set('views', './views');
app.set('view engine', 'ejs');

//bodyParser to read body param
app.use(bodyParser.urlencoded({extended: true}));

//session
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    maxAge: 6000 * 5
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));


// local passport
passport.use(new LocalStrategy(
    (username, password, done) => {
        // fs.readFile('./userDB.json', (err, data) => {
        //     const db = JSON.parse(data);
        //     const userRecord = db.find(user => user.username === username);
        //     if (userRecord) {
        //         if (userRecord.password === password) {
        //             return done(null, userRecord); 
        //         }
        //     }        
        //     return done(null, false);
        // });

        user.findOne({
            where: {
                username
            },
            raw: true
          }).then(user => {
              if (user) {
                  if (user.password === password) {
                    return done(null, user); 
                  }
              }
              return done(null, false);
          });
    }
));
//FB passport
passport.use(new passportFb(
    {
    clientID: process.env.CLIENT_ID,
    clientSecret:  process.env.CLIENT_SECRET,
    callbackURL: `http://localhost:3000/auth/facebook/callback`,
    profileFields: ['email', 'gender', 'locale', 'displayName']
    },
    (accessToken, refeshToken, profile, done) => {
        user.findOne({
            where: {
                username: profile._json.name
            },
            raw: true
          }).then(userResult => {
              if (userResult) {            
                return done(null, userResult); 
              }
             
              user.create({
                    username: profile._json.name,
                    password: profile._json.id
                }).then(newUser => {  
                    return done(null, newUser);
                });
          });
    }
));

// serializeUser to send session
passport.serializeUser((user, done) => {
    done(null, user.username);
});

//deserializeUser and send to req
passport.deserializeUser((name, done) => {
    // fs.readFile('./userDB.json', (err, data) => {
    //     const db = JSON.parse(data);
    //     const userRecord = db.find(user => user.username === name);
    //     if (userRecord) {
    //         return done(null, userRecord);
    //     } else {
    //         return done(null, false);
    //     }
    // });

    user.findOne({
        where: {
            username: name
        },
        raw: true
      }).then(user => {
          if (user) {            
            return done(null, user); 
          }
          return done(null, false);
      });
});

app.use('/', indexRoute);
app.use('/auth', authRoute);

app.listen(port, () => {
    console.log('Server listen port', port);
});