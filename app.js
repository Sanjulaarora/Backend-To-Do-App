require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./db/conn");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/router");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser(""));
app.use(cors());
app.use(router);


const port = process.env.PORT || 8005;

app.listen(port, () => {
    console.log(`server is running on port number ${port}`);
});