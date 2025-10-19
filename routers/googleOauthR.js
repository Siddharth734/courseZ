const { Router } = require('express');
const authRouter = Router();

const session = require('express-session');
const passport = require('passport');
require('../config/passport-setup'); // This executes the passport config file

// --- Middleware Setup ---

// 1. Set up session middleware
authRouter.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if you're using HTTPS
}));

// 2. Initialize Passport and its session middleware
authRouter.use(passport.initialize());
authRouter.use(passport.session());

// --- Auth Routes ---

// The route that starts the Google authentication process
authRouter.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'] // What information we want from Google
    })
);

// The callback route that Google redirects to after authentication
authRouter.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to the profile page.
        res.redirect('/home.html');
    }
);

authRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = {
    authRouter
}