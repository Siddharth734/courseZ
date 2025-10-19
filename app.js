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

const app = express();
const PORT = 3009;

// -------------------------------------------------------------------------------------------------------------------
app.use('/auth', authRouter);
// -------------------------------------------------------------------------------------------------------------------

app.use(express.json());
app.use(express.static('public'));
// app.require(cors({
//     origin: 'http://127.0.0.1:5500/public/index.html'
// }));

app.use('/admin', adminRouter);

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

app.post('/user/signup', async (req, res) => {
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

app.post('/user/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({
        email: email
    });

    if(!user){
        res.status(403).json({
            message: "User does not exist in the database"
        })
        return;
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

app.get('/me', (req, res) => {
    
})

// app.get('/profile', isLoggedIn, async (req, res) => {
//     res.json({
//         "Photo": req.user.profilePhoto
//     })
// });

app.get('/courses', (req, res) => {

})

startServer();