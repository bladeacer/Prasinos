const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
const { Sequelize } = require('sequelize');
const eventRoutes = require('./routes/event');

const db = require('./models');
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

const userRoute = require('./routes/user');
app.use("/user", userRoute);

const fileRoute = require('./routes/file');
app.use("/file", fileRoute);

// Branden
const eventfbRoute = require('./routes/eventfeedback');
app.use("/eventfb", eventfbRoute);

const websitefbRoute = require('./routes/websitefeedback');
app.use("/websitefb", websitefbRoute);

// Jun long
const rewardRoute = require("./routes/reward");
app.use("/reward", rewardRoute);
const redeemedRewardsRouter = require("./routes/redeemedRewards");
app.use("/redeemed-rewards", redeemedRewardsRouter);
// Manveer + Zara
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

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

db.sequelize = sequelize;
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });