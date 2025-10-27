const { Router } = require('express');
const courseRouter = Router();

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { JWT_SECRET} = require('../authentication');
const { CourseModel } = require('../db');

courseRouter.get('/all', async (req, res) => {
    const response = await CourseModel.find();

    res.json({
        courses: response
    })
});

module.exports = {
    courseRouter
}