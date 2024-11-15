const express = require("express");
const cookieParser=require("cookie-parser");

const dbConnect = require("./config/database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const app = express();

app.use("/", express.json());
app.use("/", cookieParser());
app.use(authRouter); //equivalent to-> app.use("/",authRouter)
app.use(profileRouter);

dbConnect()
    .then(() => {
        console.log("database connected successfully");
        app.listen(3000, () => {
            console.log("Server is listening on port 3000...");
        });
    })
    .catch(() => {
        console.error("DB Connection cannot be established");
    });
