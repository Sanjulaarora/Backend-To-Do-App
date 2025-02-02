require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./db/conn");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/router");
const jwt = require("jsonwebtoken");

// Define allowed origins
const corsOptions = {
    origin: 'https://to-do-app-phi-three.vercel.app', // Frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true, // Allow credentials (cookies, headers)
};

app.use(express.json());
app.use(cookieParser(""));
app.use(cors(corsOptions));
app.use(router);

app.options('*', cors(corsOptions)); // Handle OPTIONS requests


const port = process.env.PORT || 8005;

app.listen(port, () => {
    console.log(`server is running on port number ${port}`);
});