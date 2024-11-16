const { userAuth } = require("../middlewares/userAuth");

const userRouter=require("express").Router();

userRouter.get("/user/requests",userAuth,(req,res)=>{});

module.exports={userRouter};