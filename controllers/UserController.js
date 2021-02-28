const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRules = require("../validation/rules/UserRules");
const passwordRules = require("../validation/rules/PasswordRules");
const validate = require("../validation/validate");
require("dotenv").config();

const register = async (req, res) => {
    const validation = validate(req.body, userRules);
    if (!validation[0]) return res.status(400).json(validation[1]);

    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    try {
        const user = await User.create({
            username,
            password: hash,
        });
        console.log(user);
    } catch (err) {
        if (err.code === 11000) {
            return res.json({
                status: "error",
                message: "Username already in use",
            });
        }

        throw err;
    }

    res.json({ status: "ok" });
};

const login = async (req, res) => {
    const validation = validate(req.body, userRules);
    if (!validation[0]) return res.status(400).json(validation[1]);

    const { username, password } = req.body;

    const user = await User.findOne({ username }).lean();

    if (!user) {
        return res
            .status(400)
            .json({ status: "error", error: "Invalid username/password" });
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET
        );
        return res.json({ status: "ok", data: token });
    }

    return res
        .status(400)
        .json({ status: "error", error: "Invalid username/password" });
};

const changePassword = async (req, res) => {
    const { token, newpassword } = req.body;
    const validation = validate({ password: newpassword }, passwordRules);
    if (!validation[0]) return res.status(400).json(validation[1]);

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const _id = user.id;
        const hash = await bcrypt.hash(newpassword, 10);
        await User.updateOne(
            { _id },
            {
                $set: {
                    password: hash,
                },
            }
        );
        res.json({ status: "ok" });
    } catch (err) {
        res.json({ status: "error" });
    }
};

module.exports = {
    register,
    login,
    changePassword,
};
