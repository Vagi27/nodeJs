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
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await connectionRequest.find({
            $or: [
                { fromUserId: loggedInUser.id, status: "accepted" },
                { toUserId: loggedInUser.id, status: "accepted" },
            ],
        }).populate("fromUserId","firstName lastName");
        if (!connections) {
            throw new Error("No connections found");
        }
        res.json({
            message: `Connections of ${loggedInUser.firstName}`,
            data: connections,
        });
    } catch (err) {
        res.send("Couldn't get connections: " + err.message);
    }
});

module.exports = { userRouter };
