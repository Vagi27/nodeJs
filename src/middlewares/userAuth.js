const jwt = require("jsonwebtoken");
const JWT_Secret_Key = "DevTinder@$123";
const User = require("../models/User");

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        const user = jwt.verify(token, JWT_Secret_Key);
        const safeData =
            "firstName lastName email about age gender skills photoURL";
        req.user = await User.findOne({ _id: user.id }).select(safeData);
        // console.log(req.user);
        next();
    } catch (err) {
        return res.status(401).send("invalid token!");
    }
};

module.exports = { userAuth };
