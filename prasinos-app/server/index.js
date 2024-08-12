require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();
const eventRoutes = require('./routes/event');

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

const db = require('./models');

// Sync models
db.sequelize = sequelize;

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
const bookingRoute = require('./routes/booking');
app.use("/booking", bookingRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.log(`Request URL: ${req.originalUrl} | Method: ${req.method}`);
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

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
