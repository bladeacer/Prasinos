// Manveer
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Admin } = require('../models'); // Assuming Admin model is similar to User but with additional admin-specific fields
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth'); // Assuming isAdmin middleware checks for admin role
require('dotenv').config();

// Admin registration endpoint
router.post("/register", [validateToken], async (req, res) => {
    let data = req.body;
    // Validate request body with additional admin-specific validations if necessary
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50).required()
            .matches(/^[a-zA-Z '-,.]+$/,
                "name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).required(),
        phoneNumber: yup.string().trim().required('Phone number is required'),
        password: yup.string().trim().min(8).max(50).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password at least 1 letter and 1 number"),
        role: yup.string().trim().required() // Assuming role is a required field for admins
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Check if email already exists
        let admin = await Admin.findOne({
            where: { email: data.email }
        });
        if (admin) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }

        // Hash password
        data.password = await bcrypt.hash(data.password, 10);
        // Create admin
        let result = await Admin.create(data);
        res.json({
            message: `Admin ${result.email} was registered successfully.`
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Admin login endpoint
router.post("/login", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let admin = await Admin.findOne({
            where: { email: data.email }
        });
        if (!admin) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        let match = await bcrypt.compare(data.password, admin.password);
        if (!match) {
            console.log("Password not match");
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Return admin info
        let adminInfo = {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            phoneNumber: admin.phoneNumber,
            role: admin.role // Assuming role is part of the admin model
        };
        let accessToken = sign(adminInfo, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            admin: adminInfo
        });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Middleware to ensure only admins can access certain routes
// router.use([validateToken]);

// Example protected admin route
router.get("/dashboard", (req, res) => {
    // Dashboard logic here
    res.json({ message: "Welcome to the admin dashboard." });
});

module.exports = router;