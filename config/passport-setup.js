const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config(); // To use the .env variables
const { UserModel } = require('../db');

// This saves the user's ID to the session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// This retrieves the user's details from the session
passport.deserializeUser(async (id, done) => {
    // In a real app, you would find the user in your database based on the ID
    // For this example, we'll just pass a placeholder user object
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new GoogleStrategy({
        // Options for the Google strategy
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        // This callback function is called when a user successfully authenticates
        // console.log('Passport callback function fired!');
        // console.log(profile); 
        // The user's profile information from Google
        try {
            
            let user = await UserModel.findOne({
                googleId: profile.id
            });

            if(user){
                return done(null, user);
                //we don't want to reach here if user already exists
            }

            user = await UserModel.findOne({
                email: profile.emails[0].value
            });

            if(user){
                user.email = profile.emails[0].value;
                user.googleId = profile.id;
                user.authProvider = 'google';
                user.save();
                return done(null, user);
            }
    
            // In a real application, you would find or create a user in your database
            // For now, we'll just pass the new user profile to the next step
            if(!user){
                user = await UserModel.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    profilePhoto: profile.photos[0].value,
                    authProvider: 'google'
                });
            }
    
            done(null, user); // This passes the user object to serializeUser
        } catch (error) {
            done(error,null);
        }
    })
);