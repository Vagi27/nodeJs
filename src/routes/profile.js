const profileRouter = require("express").Router();

const User = require("../models/User");
const { userAuth } = require("../middlewares/userAuth");
const { validateProfileEditData } = require("../utils/validations");

const safeData = "firstName lastName about age gender skills photoURL";

profileRouter.get("/allusers", userAuth, async (req, res) => {
    try {
        const users = await User.find().select(safeData);
        console.log(users);
        res.send(users);
    } catch (err) {
        res.send("error Occurred:" + err.message);
    }
});
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }).select(safeData);
        res.json({ data: user });
    } catch (err) {
        res.status(400).send("cannot get profile " + err.message);
    }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateProfileEditData(req);

        const loggedInUser = req.user;
        // console.log(loggedInUser);
        Object.keys(req.body).forEach(
            (key) => (loggedInUser[key] = req.body[key])
        );
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName} profile edited`,
            data: loggedInUser,
        });
    } catch (err) {
        res.status(400).send("Cannot update profile: " + err.message);
    }
});

module.exports = { profileRouter };
