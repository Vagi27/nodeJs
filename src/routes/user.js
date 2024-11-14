const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_Secret_Key = "DevTinder@$123";
const { userAuth } = require("../middlewares/userAuth");

const userRouter = require("express").Router();
const safeData = "firstName lastName about age gender skills photoURL";

userRouter.get("/allusers",userAuth, async (req, res) => {
    try {
        const users = await User.find().select(safeData);
        console.log(users);
        res.send(users);
    } catch (err) {
        res.send("error Occurred:" + err.message);
    }
});
userRouter.get("/profile",userAuth, async (req, res) => {
    try {
        res.json({data:req.user});
    } catch (err) {
        res.status(400).send("cannot get profile " +err.message);
    }
});

module.exports = { userRouter };
