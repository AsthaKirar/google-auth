require('dotenv').config();

const express = require('express')
const app = express()
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


app.get('/', function (req, res) {
  res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');

})
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
function(accessToken, refreshToken, profile, done) {
  // Here you can save the user profile to your database
  return done(null, profile);
}));
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);
app.get('/profile', (req, res) => {
  res.send(`<h1>Profile</h1><pre>${JSON.stringify(req.user, null, 2)}</pre>`);
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

