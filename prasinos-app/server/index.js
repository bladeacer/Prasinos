const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Validate environment variables
if (!process.env.APP_PORT || !process.env.CLIENT_URL) {
    console.error("ERROR: Missing required environment variables. Check your .env file.");
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to Prasinos.");
});

// Routes
const bookingRoute = require('./routes/booking');
app.use("/booking", bookingRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
const paymentRoute = require('./routes/payment');
app.use("/payment", paymentRoute);
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
