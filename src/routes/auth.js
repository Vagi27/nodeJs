const express = require("express");
const authRouter = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_Secret_Key = "DevTinder@$123";

const {
    validateSignUpData,
    validateLoginData,
} = require("../utils/validations");

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const user = new User(req.body);

        const foundUser = await User.findOne({ email: req.body.email });
        if (foundUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        user.password = hashedPassword;
        user.save();

        const payload = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        const token = jwt.sign(payload, JWT_Secret_Key);
        res.cookie("token", token);
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.json({ message: "User Added Successfully", data: userWithoutPassword });
    } catch (err) {
        res.status(400).send("Error saving user: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        validateLoginData(req);

        const user = await User.findOne({ email }).exec();
        if (!user) {
            throw new Error("user does not exist!");
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Invalid Credentials!");
        }
        const payload = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
        };
        const token = jwt.sign(payload, JWT_Secret_Key);
        // console.log(token);
        res.cookie("token", token);
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        // console.log(user);

        res.json(userWithoutPassword);
    } catch (err) {
        res.status(400).send(err.message);
    }
});
authRouter.get("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("logout successful, Cookie Cleared");
});

module.exports = { authRouter };
