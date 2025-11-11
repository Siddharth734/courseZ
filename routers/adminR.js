const { Router } = require('express');
const adminRouter = Router();

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_SECRET} = require('../authentication');
const { AdminModel, CourseModel } = require('../db');

adminRouter.get('/', (req,res) => {
    res.redirect('/admin.html')
});

adminRouter.post('/login', async (req, res) => {
    const accessname = req.body.accessname;
    const password = req.body.password;
    
    const user = await AdminModel.findOne({
        accessname: accessname,
        password: password
    });

    if(!user){
        res.status(403).json({
            message: "Incorrect id or password"
        });
        return;
    }

    const token = jwt.sign({
        id: user._id.toString()
    }, JWT_SECRET);

    res.json({
        token: token
    });
});

adminRouter.post('/course', async (req, res) => {
    const title = req.body.title;
    const cost = req.body.cost;
    let image = req.body.image;

    const user = await CourseModel.findOne({
        title: title
    });
    if(user){
        res.json({
            message: "this course already exists"
        })
        return;
    }

    const defaultImg = "https://images.unsplash.com/photo-1557683311-eac922347aa1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGxhaW4lMjBjb2xvcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600";
    image = (image=="")?defaultImg:image;

    const response = await CourseModel.create({
        title: title,
        cost: cost,
        image: image
    });

    res.json({
        message: `course was added successfully: ${response}`
    })
});

adminRouter.get('/course', async (req, res) => {
    const response = await CourseModel.find();

    res.json({
        courses: response
    })
});

adminRouter.delete('/course', async (req, res) => {
    const id = req.body.id; 

    const response = await CourseModel.deleteOne({
        _id: id
    })
    res.json({
        message: "course was deleted successfully"
    })
})

adminRouter.put('/course', async (req, res) => {
    let newTitle = req.body.title;
    let newImage = req.body.image;
    let newCost = req.body.cost;
    const courseId = req.body.id;

    const course = await CourseModel.findById(courseId);

    if(!course){
        res.json({
            message: "Invalid Course: there exists no such course"
        });
        return;
    }

    newTitle = (newTitle==="")?course.title:newTitle;
    newCost = (newCost==="")?course.cost:newCost;
    newImage = (newImage==="")?course.image:newImage;

    // const response = 
    await CourseModel.updateOne({_id: courseId},{
        title: newTitle,
        image: newImage,
        cost: newCost
    })

    res.json({
        message: "course was updated sucessfully"
    })
})

module.exports = {
    adminRouter
}