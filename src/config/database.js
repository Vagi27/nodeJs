const mongoose=require("mongoose");


const dbConnect=async()=>{
    await mongoose.connect("mongodb+srv://vagishmlk:1lprUWFkzNU5rzj9@malikcluster.iyvwq.mongodb.net/devTinder?retryWrites=true&w=majority&appName=malikCluster/");
}

module.exports=dbConnect;