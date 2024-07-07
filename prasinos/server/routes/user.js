const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
const dayjs = require('dayjs')
require('dotenv').config();
const { Op } = require("sequelize");

router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/,
                "name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password at least 1 letter and 1 number"),
        phone: yup.string().lowercase().min(8).max(50).required()
            .matches(/^\+65\s?([689]\d{7}|[1][-\s]\d{7}|[3]\d{3}[-\s]\d{4})$/,
                "Express in the form '+65 81234567'")
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (user) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }

        // Hash passowrd
        data.password = await bcrypt.hash(data.password, 10);
        // Create user
        let result = await User.create(data);
        res.json({
            message: `Email ${result.email} was registered successfully.`
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.post("/login", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (!user) {
            res.status(400).json({ message: errorMsg });
            return;
        }
        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Return user info
        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            createdAt: dayjs(user.createdAt.toString()).format("DD MMM YYYY").toString()
            // return with nice date format
        };
        let staffInfo = {
            id: null,
            email: null,
            name: null,
            phone: null,
            createdAt: null
        }
        let accessToken = sign(userInfo, process.env.APP_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo,
            staff: staffInfo
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});

router.get("/auth", validateToken, async (req, res) => {
    let user = await User.findByPk(req.user.id);
    let userInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: dayjs(user.createdAt.toString()).format("DD MMM YYYY").toString()
    };
    res.json({
        user: userInfo
    });
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;

    let list = await User.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

// Call get by id on loading of settings page
// (user-facing)
// router.get("/:id", validateToken, async (req, res) => {
//     let id = req.params.id;
//     let user = await User.findByPk(id);
//     // Check id not found
//     if (!user) {
//         res.sendStatus(404);
//         return;
//     }
//     res.json({user});
// });

router.put("/edit/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    if (id != user.id) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    data.password = user.password;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim()
            .min(3, 'Name must be at least 3 characters')
            .max(50, 'Name must be at most 50 characters')
            .required('Name is required')
            .matches(/^[a-zA-Z '-,.]+$/,
                "Name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim()
            .email('Enter a valid email')
            .max(50, 'Email must be at most 50 characters')
            .required('Email is required'),
        phone: yup.string()
            .required("Phone number is required")
            .matches(/^\+65\s?([689]\d{7}|[1][-\s]\d{7}|[3]\d{3}[-\s]\d{4})$/,
                "Express in the form '+65 81234567'")
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await User.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "User was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update user with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.put("/reset/:id", validateToken, async (req, res) => {
    let id = req.params.id;

    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (user.id != userId) {
        res.sendStatus(403);
        return;
    }
    let data = req.body;
    data.password = await bcrypt.hash(data.password, 10);   

    let validationSchema = yup.object({
        password: yup.string().trim().min(8).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password at least 1 letter and 1 number")
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await User.update(data, {
            where: { id: id }
        });

        if (num == 1) {
            res.json({
                message: "User was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update user with id ${id}.`
            });
        }

    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Implement delete account (used in danger zone)

module.exports = router;
