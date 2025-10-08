const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { JWT_SECRET, auth } = require('./auth');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const { UserModel } = require('./db');

const app = express();
const PORT = 3009;

// -------------------------------------------------------------------------------------------------------------------
const session = require('express-session');
const passport = require('passport');
const { is } = require('zod/locales');
require('./config/passport-setup'); // This executes the passport config file

// --- Middleware Setup ---

// 1. Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if you're using HTTPS
}));

// 2. Initialize Passport and its session middleware
app.use(passport.initialize());
app.use(passport.session());

// --- Helper Middleware to Protect Routes ---(auth)
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next(); // If user is authenticated, proceed to the route handler
    } else {
        res.status(401).send('You are not logged in!');
    }
};

// --- Auth Routes ---

// The route that starts the Google authentication process
app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'] // What information we want from Google
    })
);

// The callback route that Google redirects to after authentication
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to the profile page.
        // res.redirect('/index.html');

    }
);

// Logout route
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// -------------------------------------------------------------------------------------------------------------------

app.use(express.json());
app.use(express.static('public'));
// app.require(cors({
//     origin: 'http://127.0.0.1:5500/public/index.html'
// }));

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_LINK);
        app.listen(PORT, () => {
            console.log(`Server starting at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(`error occured while starting the server: ${error}`);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const user = await UserModel.findOne({
       $or:[
        { email: email },
        { name: name }
       ]
    });

    if(user){
        res.json({
            message: "This user already exists in the database"
        })
    }

    const hashedPass = await bcrypt.hash(password,10);

    const response = await UserModel.create({
        email: email,
        name: name,
        password: hashedPass
    });

    res.json({
        message: "Sucessfully Signed up!"
    });
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email
    });

    if(!user){
        res.status(403).json({
            message: "User does not exist in the database"
        })
    }
    const passMatch = await bcrypt.compare(password,user.password);

    if(passMatch){
        const token = jwt.sign({
            id: user._id.toString()
        },JWT_SECRET);

        res.json({
            token: token
        });
    }else{
        res.json({
            message: "Invalid Password"
        });
    }
});

app.get('/me', auth, (req, res) => {
    
})

app.get('/profile', isLoggedIn, async (req, res) => {
    res.json({
        "Photo": req.user.profilePhoto
    })
});

app.get('/courses', (req, res) => {

})

startServer();