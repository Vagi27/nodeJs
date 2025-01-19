const express = require("express");
const cookieParser = require("cookie-parser");

const dbConnect = require("./config/database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");
var cors = require("cors");
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use("/", express.json());
app.use("/", cookieParser());
app.use(authRouter); //equivalent to-> app.use("/",authRouter)
app.use(profileRouter);
app.use(requestRouter);
app.use(userRouter);

dbConnect()
    .then(() => {
        console.log("database connected successfully");
        app.listen(3000, () => {
            console.log("Server is listening on port http://localhost:3000");
        });
    })
    .catch(() => {
        console.error("DB Connection cannot be established");
    });
