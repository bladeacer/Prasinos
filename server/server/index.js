require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();

// Validate environment variables
if (!process.env.APP_PORT || !process.env.CLIENT_URL || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PWD) {
    console.error("ERROR: Missing required environment variables. Check your .env file.");
    process.exit(1);
}

// Initialize Sequelize with MySQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
    dialect: 'mysql',
    host: process.env.DB_HOST
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to Prásinos!");
});

// Routes

const staffRoute = require('./routes/staff')
app.use("/staff", staffRoute);

const eventfbRoute = require('./routes/eventfeedback');
app.use("/eventfb", eventfbRoute);

const websitefbRoute = require('./routes/websitefeedback');
app.use("/websitefb", websitefbRoute);

const rewardRoute = require('./routes/reward');
app.use("/reward", rewardRoute);

const userRoute = require('./routes/user');
app.use("/user", userRoute);

const fileRoute = require('./routes/file');
app.use("/file", fileRoute);

const redeemedRewardsRouter = require('./routes/redeemedRewards');
app.use("/redeemed-rewards", redeemedRewardsRouter);

const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

const paymentRoute = require('./routes/payment');
app.use("/payment", paymentRoute);

const bookingRoute = require('./routes/booking');
app.use("/booking", bookingRoute);

const adminRoute = require('./routes/admin');
app.use("/admin", adminRoute);

const attendanceRoute = require('./routes/attendance');
app.use("/attendance", attendanceRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Sync models
const db = require('./models');
db.sequelize = sequelize;
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
