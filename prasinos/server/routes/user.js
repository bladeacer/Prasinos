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
const emailjs = require('@emailjs/nodejs');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit'); // Assuming you're using express-rate-limit

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Limit to 10 requests per 15 minutes
    max: 10, // Allow a maximum of 10 requests within the window
});



// In-memory storage for passphrases (replace with a more robust solution)
const passphrases = {};

// Function to generate a random passphrase
function generatePassphrase() {
    const bytes = crypto.randomBytes(16);
    const passphrase = bytes.toString('base64').slice(0, 10);
    return passphrase;
}

// Function to generate a crypto UUID
function generateTempId() {
    return uuidv4();
}

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
        let status = 200;
        let user = await User.findOne({
            where: { email: data.email }
        });
        let verified = user.verified == true;
        if (!verified) {
            status = 301;
        }

        if (!user) {
            status = 400;
        };
        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            status = 400;
        };

        // Return user info
        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            createdAt: dayjs(user.createdAt.toString()).format("DD MMM YYYY").toString(),
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

        if (status === 400) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        res.json({
            accessToken: accessToken,
            user: userInfo,
            staff: staffInfo,
            status: status
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});

router.get("/auth", validateToken, async (req, res) => {
    let user = await User.findByPk(req.user.id);
    let verified = user.verified;
    let status = 200;
    if (!verified) {
        status = 301;
    }

    let userInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: dayjs(user.createdAt.toString()).format("DD MMM YYYY").toString(),
        verified: user.verified
    };
    res.json({
        user: userInfo,
        status: status
    });
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { id: { [Op.like]: `%${search}` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
            { verified: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;

    let list = await User.findAll({
        where: condition,
        order: [['createdAt', 'ASC']]
    });

    res.json(list);
});


router.put("/edit", validateToken, async (req, res) => {
    let id = req.user.id;
    // Check id not found
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
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

router.put("/reset", validateToken, async (req, res) => {
    let id = req.user.id;

    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
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

router.post("/resethandler", validateToken, async (req, res) => {
    let id = req.user.id;
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;

    let validationSchema = yup.object({
        password: yup.string().trim().min(8)
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password at least 1 letter and 1 number")
    });
    data = await validationSchema.validate(data,
        { abortEarly: false });

    if (!(bcrypt.compare(data.password, user.password))) {
        console.log(data.password);
        console.log(user.password);
        res.status(400).json({
            message: `Cannot verify user with id ${id}.`
        });
        return;
    }
    res.json({
        message: "User was verified successfully."
    });

});

router.post("/sendResetEmail", validateToken, async (req, res) => {
    try {
        let id = req.user.id;
        let user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const publicKey = process.env.EMAIL_JS_PUBLIC_KEY;
        const message_url = process.env.CLIENT_URL;
        const serviceId = process.env.EMAIL_JS_SERVICE_ID;
        const templateId = process.env.EMAIL_JS_TEMPLATE_ID;
        var templateParams = {
            to_name: `${user.name}`,
            message: `To continue with resetting your password, use the following link:  ${message_url}/reset `,
            reply_to: `${user.email}`,
            subject: "Prasinos: Reset Password"
        };
        await emailjs.send(serviceId, templateId, templateParams, { publicKey: publicKey });
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});

router.post("/verify", limiter, validateToken, async (req, res) => {
    try {
        let id = req.user.id;
        let user = await User.findByPk(id);
        let email = user.email;
        if (!user) {
            res.sendStatus(404);
            return;
        }
        const tempId = generateTempId();
        // Store tempId in localstorage for a short while
        const passphrase = generatePassphrase();

        if (passphrases[email]) {
            return res.status(429).json({ message: 'Verification email already sent for this address' });
        }
        else {
            passphrases[email] = { passphrase, tempId, expiresAt: Date.now() + 10 * 60 * 1000 }; // Expires in 10 minutes

            var templateParams = {
                to_name: `${user.name}`,
                message: `To finish the verification process, verify at:  ${process.env.CLIENT_URL}/verifyhandler with the passphrase ${passphrase}. 
                Note this is a one-time passphrase that will expire within 10 minutes.`,
                reply_to: `${user.email}`,
                subject: "Prasinos: Verify user"
            };

            await emailjs.send(process.env.EMAIL_JS_SERVICE_ID, process.env.EMAIL_JS_TEMPLATE_ID, templateParams, { publicKey: process.env.EMAIL_JS_PUBLIC_KEY });

            res.json({
                message: "User was verified successfully."
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.patch("/verifyhandler", validateToken, async (req, res) => {
    try {
        let id = req.user.id;
        const tempId = req.body.tempId;
        const enteredPassphrase = req.body.passphrase;

        if (!passphrases[tempId] || Date.now() > passphrases[tempId].expiresAt) {
            return res.status(401).json({ message: 'Invalid verification attempt' });
        }

        const { email, passphrase } = passphrases[tempId];

        if (enteredPassphrase === passphrase) {
            // Verification successful (mark user as verified, remove passphrase from memory)
            let num = await User.update({ verified: true }, {
                where: { id: id }
            });


            if (num !== 1) {
                res.status(400).json({
                    message: `Cannot verify user with id ${id}.`
                });
            }
            else {
                res.json({
                    message: "User was verified successfully."
                });
            }

            console.log(`User ${email} verified successfully!`);
            delete passphrases[tempId];
            res.json({ message: 'Verification successful!' });
        } else {
            res.status(401).json({ message: 'Incorrect passphrase' });
        }



    }
    catch (err) {
        res.status(400).json({ errors: err.erros });
    }
})


// app.post('/verify', (req, res) => {
//     const tempId = req.body.tempId;
//     const enteredPassphrase = req.body.passphrase;

//     if (!passphrases[tempId] || Date.now() > passphrases[tempId].expiresAt) {
//       return res.status(401).json({ message: 'Invalid verification attempt' });
//     }

//     const { email, passphrase } = passphrases[tempId];

//     if (enteredPassphrase === passphrase) {
//       // Verification successful (mark user as verified, remove passphrase from memory)
//       console.log(`User ${email} verified successfully!`);
//       delete passphrases[tempId];
//       res.json({ message: 'Verification successful!' });
//     } else {
//       res.status(401).json({ message: 'Incorrect passphrase' });
//     }
//   });

// const email = req.body.email;
// const enteredPassphrase = req.body.passphrase;
// const verificationTempId = req.body.verificationTempId;

// // ... Lookup user by email ...

// if (!user || user.passphrase !== enteredPassphrase || user.verificationTempId !== verificationTempId) {
//   // Handle error: Invalid passphrase or tempId mismatch
//   return;
// }

// const user = await User.findOne({
//     where: { email },
//   });


module.exports = router;