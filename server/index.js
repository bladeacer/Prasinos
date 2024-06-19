// Import the required dependencies
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');

// Top-level function to create the express application
const app = express();

// Use the origin URL as defined in the .env or process.env file
app.use(cors({
    origin: process.env.CLIENT_URL
}));
// Use the json function as defined in Express.js
app.use(express.json());

// Define the root get request and the response returned
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

const userRoute = require('./routes/user');
app.use("/user", userRoute);

// Defines get method done on /routes/tutorial and the response returned
// const tutorialRoute = require('./routes/tutorial');
// app.use("/tutorial", tutorialRoute)

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });


// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static('public'));

// // Enable CORS
// app.use(cors({
//     origin: process.env.CLIENT_URL
// }));

// // Simple Route
// app.get("/", (req, res) => {
//     res.send("Welcome to the learning space.");
// });

// // Routes
// // const tutorialRoute = require('./routes/tutorial');
// // app.use("/tutorial", tutorialRoute);
// // const userRoute = require('./routes/user');
// // app.use("/user", userRoute);
// // const fileRoute = require('./routes/file');
// // app.use("/file", fileRoute);

// const db = require('./models');
// db.sequelize.sync({ alter: true })
//     .then(() => {
//         let port = process.env.APP_PORT;
//         app.listen(port, () => {
//             console.log(`⚡ Sever running on http://localhost:${port}`);
//         });
//     })
//     .catch((err) => {
//         console.log(err);
//     });