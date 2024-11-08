const express = require("express");
const User=require("./models/User");

const dbConnect=require("./config/database");
const app = express();
app.use("/",express.json());

app.post("/signup",async (req,res)=>{
    console.log(req.body);
    
    try{
        const user=new User(req.body);
        await user.save();
        res.send(("User Added Successfully"));
        
    }
    catch(err){
        console.error("something went wrong",err.message);
        res.send(("something went wrong"));
    }

    


});

dbConnect().then(()=>{
    console.log("database connected successfully");
    app.listen(3000, () => {
        console.log("Server is listening on port 3000...");
    });
}).catch(()=>{
    console.error("DB Connection cannot be established");
});
