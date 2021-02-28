const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const changePassword = require("./routes/changePassword");
require("dotenv").config();

mongoose.connect(process.env.DB_CONNECT, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "static")));

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/change-password", changePassword);

app.listen(3000, () => console.log("Server up at 3000"));
