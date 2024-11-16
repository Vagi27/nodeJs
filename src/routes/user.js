const { userAuth } = require("../middlewares/userAuth");
const connectionRequest = require("../models/connectionRequest");

const userRouter = require("express").Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await connectionRequest
            .find({
                toUserId: loggedInUser.id,
                status: "interested",
            })
            .populate("fromUserId", "firstName lastName");

        res.json({
            message: `all requests to ${loggedInUser.firstName}`,
            data: connectionRequests,
        });
    } catch (err) {
        res.send("Couldn't get request: " + err.message);
    }
});

module.exports = { userRouter };
