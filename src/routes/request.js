const requestRouter = require("express").Router();
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

// console.log(requestRouter);

requestRouter.post(
    "/sendConnectionRequest/:status/:toUserId",
    userAuth,
    async (req, res) => {
        try {
            const fromUserId = req.user.id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            const allowedStatus = ["interested", "ignored"];

            if (!allowedStatus.includes(req.params.status)) {
                throw new Error("invalid connection status");
            }
            const user = await User.findOne({ _id: toUserId });
            if (!user) {
                throw new Error("User not Found!");
            }
            //finding req both ways, either (A to B) or (B to A)
            const existingReq = await ConnectionRequest.findOne({
                $or: [
                    { fromUserId, toUserId },
                    {
                        fromUserId: toUserId,
                        toUserId: fromUserId,
                    },
                ],
            });
            if (existingReq) {
                throw new Error("Connection already exists");
            }
            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status,
            });

            const data = await connectionRequest.save();
            res.json({
                message: `${req.params.status} request marked towards ${user?.firstName}`,
                data,
            });
        } catch (err) {
            res.send("Cannot Send Request: " + err.message);
        }
    }
);

requestRouter.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUserId = req.user;

            const { status, requestId } = req.params;
            const allowedStatus = ["accepted", "rejected"];

            if (!allowedStatus.includes(status)) {
                throw new Error("invalid connection status");
            }

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUserId.id,
                status: "interested",
            });

            if (!connectionRequest) {
                throw new Error("Connection request not found!");
            }
            connectionRequest.status = status;
            const data = await connectionRequest.save();
            res.json({
                message: `connection status updated to ${status}`,
                data,
            });
        } catch (err) {
            res.status(400).send(
                "Couldn't update connection request: " + err.message
            );
        }
    }
);
module.exports = { requestRouter };
