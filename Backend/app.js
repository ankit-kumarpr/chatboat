const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const connectToDb = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const UserRoutes=require('./routes/UserRoutes');

connectToDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use('/api/user',UserRoutes);

module.exports = app;
