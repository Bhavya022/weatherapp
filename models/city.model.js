const mongoose = require("mongoose") 

const usercity=mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    previousSearches:[{type:String,required:true}] 
}) 

const usercitylist = mongoose.model("cities",usercity) 
module.exports=usercitylist