const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
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

const db = require('./models');
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