const express = require("express");

const dbConnect=require("./config/database");
const app = express();

dbConnect().then(()=>{
    console.log("database connected successfully");
    app.listen(3000, () => {
        console.log("Server is listening on port 3000...");
    });
}).catch(()=>{
    console.error("DB Connection cannot be established");
});
