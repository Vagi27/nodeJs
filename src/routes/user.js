const { userAuth } = require("../middlewares/userAuth");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/User");
const userRouter = require("express").Router();

const safeData = "firstName lastName about age gender skills photoURL";

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

        const connections = await connectionRequest
            .find({
                $or: [
                    { fromUserId: loggedInUser.id, status: "accepted" },
                    { toUserId: loggedInUser.id, status: "accepted" },
                ],
            })
            .populate("fromUserId", "firstName")
            .populate("toUserId", "firstName");

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser.id.toString()) {
                return row.toUserId;
            } else {
                return row.fromUserId;
            }
        });

        res.json({
            message: `Connections of ${loggedInUser.firstName}`,
            data,
        });
    } catch (err) {
        res.status(400).send("Couldn't get connections: " + err.message);
    }
});
userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const connectionRequests = await connectionRequest
            .find({
                $or: [
                    { fromUserId: loggedInUser.id },
                    { toUserId: loggedInUser.id },
                ],
            })
            .select("fromUserId toUserId status");

        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        /**
         * Ensure new users who haven’t made connection requests don't see their own profile,
         * -> in the feed by mandating a query parameter to exclude their ID.
         * */
        const usersOnFeed = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser.id } },
            ],
        })
            .select(safeData)
            .skip(skip)
            .limit(limit);
        res.json({ message: "Feed!", data: usersOnFeed });
    } catch (err) {
        res.status(400).send("Cannot get feed: " + err.message);
    }
});

module.exports = { userRouter };
