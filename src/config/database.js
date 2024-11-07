const mongoose=require("mongoose");


const dbConnect=async()=>{
    await mongoose.connect("mongodb+srv://vagishmlk:1lprUWFkzNU5rzj9@malikcluster.iyvwq.mongodb.net/?retryWrites=true&w=majority&appName=malikCluster/devTinder");
}

module.exports=dbConnect;