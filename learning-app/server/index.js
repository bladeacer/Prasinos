require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

// Simple Route
app.get("/", (req, res) => {
  res.send("Welcome to Prásinos!");
});

// Routes
const rewardRoute = require("./routes/reward");
app.use("/reward", rewardRoute);

const userRoute = require("./routes/user");
app.use("/user", userRoute);

const fileRoute = require("./routes/file");
app.use("/file", fileRoute);

const redeemedRewardRoute = require("./routes/redeemedRewards"); // Ensure the file name is correct
app.use("/redeemed-rewards", redeemedRewardRoute); // Use the new route

const db = require("./models");
db.sequelize
  .sync({ alter: true })
  .then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
