const { Router } = require('express');
const passport = require('passport');
const authRouter = Router();

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