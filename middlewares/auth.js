const jwt = require("jsonwebtoken") 
const redisClient = require("../helpers/redis") 

const auth=async(req,res,next)=>{
    try{
        const token=req.headers?.authorization?.split("")[1] 
        if(!token) 
        return res.status(401).send("please login again") 
        const istoken = await jwt.verify(token,process.env.JWT_SECRET) 
        if(!istoken) 
        return res.send("Authentication failed login again") 
        const istokenblacklist=await redisClient.get(token) 
        if(istokenblacklist) 
        return res.send("unauthorized") 
        req.body.userId=istoken.userId 
        req.body.preferred_city=istoken.preferred_city 
        next() 
    } 
    catch(err){
        res.send(err.message)
    }
} 
module.exports={auth}