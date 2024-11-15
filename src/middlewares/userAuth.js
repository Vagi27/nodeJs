const jwt = require("jsonwebtoken");
const JWT_Secret_Key = "DevTinder@$123";

const userAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;
        const user = jwt.verify(token, JWT_Secret_Key);
        if (!user) {
            console.log("invalid token");
        }
        req.user = user;
        next();
    } catch (err) {
        res.send("Error: token is not valid!!");
    }
};

module.exports = { userAuth };
