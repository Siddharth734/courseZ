const { Router } = require('express');
const userRouter = Router();

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_SECRET} = require('../authentication');
const { UserModel, CourseModel } = require('../db');

userRouter.post('/signup', async (req, res) => {
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

userRouter.post('/login', async (req, res) => {
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

userRouter.get('/profile', async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Not authenticated with Google"
        });
    }
    res.json({
        "Photo": req.user.profilePhoto,
        "Balance": req.user.balance
    })
});

userRouter.put('/purchase', async (req, res) => {
    const courseId = req.body.id;
    const Course = await CourseModel.findById(courseId);

    if(!Course){
        res.json({
            message: "Invalid Course"
        })
        return;   
    }

    const User = await UserModel.findById(req.user._id);

    const userBalance = Number(User.balance);
    const courseCost = Number(Course.cost);
    
    if(userBalance < courseCost){
        res.json({
            message: "Insufficient balance"
        })
        return;
    }else{
        User.courses.push(courseId);
        User.balance = String(userBalance - courseCost);
        await User.save();
        
        res.json({
            message: "Sucessful Purchase"
        })
    }
});

userRouter.get('/mycourses', async (req, res) => {
    const User = await UserModel.findById(req.user._id).populate('courses');

    res.json({
        courses: User.courses
    })
});

module.exports = {
    userRouter
}