const express = require('express');
const router = express.Router();
const { User, Payment } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    data.userId = req.user.id;

    // Validate request body
    let validationSchema = yup.object({
        cardNumber: yup.string().trim().length(16).required(),
        cardholderName: yup.string().trim().min(3).max(100).required(),
        expiryDate: yup.string().trim().matches(/^\d{2}\/\d{2}$/, 'Expiry date must be in MM/YY format').required(),
        cvc: yup.string().trim().length(3).required(),
        staffDiscount: yup.string().trim().optional(),
        voucherCode: yup.string().trim().optional(),
        quantity: yup.number().min(1).required(),
        unitPrice: yup.number().min(0).required(),
        totalPrice: yup.number().min(0).required(),
        event: yup.string().trim().min(3).max(100).required(),
        refCode: yup.string().trim().min(3).max(100).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let result = await Payment.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%{search}%` } }
        ];
    }

    let list = await Payment.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let payment = await Payment.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });

    if (!payment) {
        res.sendStatus(404);
        return;
    }
    res.json(payment);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let payment = await Payment.findByPk(id);

    if (!payment) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (payment.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        cardNumber: yup.string().trim().length(16),
        cardholderName: yup.string().trim().min(3).max(100),
        expiryDate: yup.string().trim().matches(/^\d{2}\/\d{2}$/, 'Expiry date must be in MM/YY format'),
        cvc: yup.string().trim().length(3),
        staffDiscount: yup.string().trim().optional(),
        voucherCode: yup.string().trim().optional(),
        quantity: yup.number().min(1),
        unitPrice: yup.number().min(0),
        totalPrice: yup.number().min(0),
        event: yup.string().trim().min(3).max(100),
        refCode: yup.string().trim().min(3).max(100)
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let num = await Payment.update(data, { where: { id: id } });

        if (num == 1) {
            res.json({ message: "Payment was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update payment with id ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let payment = await Payment.findByPk(id);

    if (!payment) {
        res.sendStatus(404);
        return;
    }

    let userId = req.user.id;
    if (payment.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Payment.destroy({ where: { id: id } });
    if (num == 1) {
        res.json({ message: "Payment was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete payment with id ${id}.` });
    }
});

module.exports = router;
