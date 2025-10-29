const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const { JWT_SECRET, auth } = require('./authentication');
const { UserModel } = require('./db');
const { authRouter } = require('./routers/googleOauthR')
const { adminRouter } = require('./routers/adminR')
const { courseRouter } = require('./routers/courseR')
const { userRouter } = require('./routers/userR')

const session = require('express-session');
const passport = require('passport');
require('./config/passport-setup'); // This executes the passport config file

const app = express();
const PORT = 3009;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signupLoginpage.html'));
});

app.use(express.static('public'));
// app.require(cors({
//     origin: 'http://127.0.0.1:5500/public/index.html'
// }));

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

//routers
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/course', courseRouter);
app.use('/user', userRouter);

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

startServer();