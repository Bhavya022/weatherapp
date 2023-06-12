
const express = require("express") 
const connection = require("./config/db") 
const {userRouter}=require("./routes/user.route") 
const cityRouter=require("./routes/city.routes") 
const redisClient=require("./helpers/redis") 
const logger=require("./middlewares/logger") 
require("dotenv").config() 
const PORT = process.env.PORT||8880
const app=express() 
app.use(express.json()) 

app.get("/",async(req,res)=>{
    res.send(await redisClient.get("name"))
}) 
app,use("/api/user",userRouter) 
app.use("/api/weather",cityRouter) 

app.listen(PORT,async()=>{
    try{
        await connection() 
        console.log("connected to db") 
        logger.log("info","Db connect")
    } 
    catch(err){
        console.log(err.message) 
        logger.log("error","db connect fail")
    } 
    console.log("server running @",PORT)
})