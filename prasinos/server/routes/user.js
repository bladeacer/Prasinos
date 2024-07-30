const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Otp } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
const dayjs = require('dayjs')
require('dotenv').config();
const { Op } = require("sequelize");
const emailjs = require('@emailjs/nodejs');
const { generateOTP } = require('../utils/methods')


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
    let errorMsg = "Email or password is not correct.";
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email and password
        let status = 200;
        let user = await User.findOne({
            where: { email: data.email }
        });
        let verified = user.verified && true;
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

        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            createdAt: dayjs(user.createdAt.toString()).format("DD MMM YYYY").toString(),
            imageFile: user.imageFile,
            points: user.points,
            eventsJoined: user.eventsJoined,
            company: user.company
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
        res.status(400).json({ message: errorMsg });
        return;
    }
});

router.get("/auth", validateToken, async (req, res) => {
    let user = await User.findByPk(req.user.id);
    let status = 200;
    if (!user) {
        status = 404
    } else {
        let verified = user.verified;
        if (!verified) {
            status = 301;
        }

        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            createdAt: dayjs(user.createdAt.toString()).format("DD MMM YYYY").toString(),
            verified: user.verified,
            imageFile: user.imageFile,
            points: user.points,
            eventsJoined: user.eventsJoined,
            company: user.company
        };
        res.json({
            user: userInfo,
            status: status
        });
    }

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

    // TODO: Add logic to call OTP entity associated with user

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
                message: "Password was reset successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot reset password.`
            });
        }

    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.post("/sendVerifyEmail", validateToken, async (req, res) => {
    try {
        // TODO: Refactor code with OTP as database entity associated with each user
        let id = req.user.id;
        let user = await User.findByPk(id);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        let otp_is_exists = await Otp.findOne({ where: { otpForId: id } });

        if (!otp_is_exists) {
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
            const otpFor = "user";
            const data = {
                otp: otp,
                expiresAt: expiresAt,
                otpFor: otpFor,
                otpForId: id
            }
            await Otp.create(data);
        }
        else {
            const publicKey = process.env.EMAIL_JS_PUBLIC_KEY;
            const message_url = process.env.CLIENT_URL;
            const serviceId = process.env.EMAIL_JS_SERVICE_ID;
            const templateId = process.env.EMAIL_JS_TEMPLATE_ID;
            let templateParams = {
                to_name: `${user.name}`,
                message: `To finish the verification process, verify at:  ${message_url}/verifyhandler with the one-time password ${otp_is_exists.otp}. 
                Note this is a one-time password that will expire within 10 minutes.`,
                reply_to: `${user.email}`,
                subject: "Prasinos: Verify user"
            };
            await emailjs.send(serviceId, templateId, templateParams, { publicKey: publicKey });
        }

    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.put("/verifyhandler", validateToken, async (req, res) => {

    try {
        let id = req.user.id;
        let otp = req.body.otp;
        let status = 200;

        let otp_is_exists = await Otp.findOne({ where: { otpForId: id } });

        const now = new Date();
        if (now > otp_is_exists.expiresAt) {
            await Otp.destroy({ where: { otpForId: id } });
            status = 301;
        }
        else if (otp_is_exists && otp == otp_is_exists.otp) {
            let num = await User.update({ verified: true }, {
                where: { id: id }
            });

            if (num != 1) {
                status = 400;
            }
            await Otp.destroy({ where: { otpForId: id } });
        }
        else {
            status = 401;
        }
        if (status === 200) {
            res.json({
                message: "User was verified successfully."
            });
        } else if (status === 400) {
            res.status(400).json({
                message: `Cannot verify user with id ${id}. Either because of OTP expiry or server error.`
            });
        } else if (status == 401) {
            res.status(401).json({ message: 'Invalid verification attempt' });
        } else if (status == 301) {
            res.json({ message: "Reload" })
        }

    }
    catch (err) {
        res.status(400).json({ errors: "Try reloading the page" });
    }
})

router.delete("/delete", validateToken, async (req, res) => {
    let id = req.user.id;
    // Check id not found
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    let num = await User.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "User was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete user with id ${id}.`
        });
    }
});

// Reset password from forget password, get email check if exists, send email if email does exist with otp created.
router.post("/getResetUser", async (req, res) => {
    let data = req.body;
    try {
        let user = await User.findOne({ where: { email: data.email.toLowerCase() } });
        let id = user.id;
        if (user && user.verified) {
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
            const otpFor = "user";
            const data = {
                otp: otp,
                expiresAt: expiresAt,
                otpFor: otpFor,
                otpForId: id
            }
            await Otp.create(data);
            let otp_is_exists = await Otp.findOne({ where: { otpForId: id } });
            if (!otp_is_exists) {
                res.status(500).json({message: "Internal server error."})
            }

            const publicKey = process.env.EMAIL_JS_PUBLIC_KEY;
            const serviceId = process.env.EMAIL_JS_SERVICE_ID;
            const templateId = process.env.EMAIL_JS_TEMPLATE_ID;
            const templateParams = {
                to_name: `${user.name}`,
                message: `To continue with resetting your password, use the following otp:  ${otp_is_exists.otp} `,
                reply_to: `${user.email}`,
                subject: "Prasinos: Reset Password"
            };
            await emailjs.send(serviceId, templateId, templateParams, { publicKey: publicKey });
            let userInfo = {
                id: id 
            }
            res.json({user: userInfo});
        }
        else if (user && !user.verified) {
            res.status(404).json({ message: "Verify your email first" })
        }
        else {
            res.status(404).json({ message: "Email does not exist" })
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// TODO: Route to check otp for forget password
router.put("/resethandler", async (req, res) => {
    try {
        let id = req.body.id;
        let otp = req.body.otp;
        let status = 200;
        let otp_is_exists = await Otp.findOne({ where: { otpForId: id } });
        if (!otp_is_exists){
            status = 400;
        } else{
            const now = new Date();
            if (now > otp_is_exists.expiresAt) {
                status = 301;
            }
            else if (otp == otp_is_exists.otp.toString()) {
                status = 200;
            }
            else {
                status = 401;
            }
        }

        let num = await Otp.destroy({ where: { otpForId: id } });

        if (num !== 1) {
            status = 400;
        }
        if (status === 200) {
            res.json({
                message: "User was verified successfully."
            });
        } else if (status === 400) {
            res.status(400).json({
                message: `Cannot verify user with id ${id}. Either because of OTP expiry or server error.`
            });
        } else if (status == 401) {
            res.status(401).json({ message: 'Invalid verification attempt' });
        } else if (status == 301) {
            res.json({ message: "Reload" })
        }
    }
    catch (err) {
        res.status(400).json({ message: err.errors });
    }
});


// Get id and store it in next form submission using formik

router.put("/forgetReset", async (req, res) => {
    let id = req.body.id;

    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    };
    let data = req.body;
    data.password = await bcrypt.hash(data.password, 10);

    let validationSchema = yup.object({
        oldPassword: yup.string().trim().min(8).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password at least 1 letter and 1 number"),
        password: yup.string().trim().min(8).required()
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                "password at least 1 letter and 1 number")
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let match = await bcrypt.compare(data.oldPassword, user.password);

        let num = await User.update({password: data.password}, {
            where: { id: id }
        });

        if (num == 1 || !match) {
            res.json({
                message: "Password was resest successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot reset password.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
})

module.exports = router;


