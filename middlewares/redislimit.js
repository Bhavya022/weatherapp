const redisClient=require("../helpers/redis") 
const redislimit = async (req,res,next)=>{
    const b=await redisClient.exists(req.ip) 
    if(b===1){
        let reqn = await redisClient.get(req.ip) 
        reqn =+reqn 
        if(reqn<3){
            redisClient.incr(req.ip) 
            next() 
        } 
        else if(reqn===3){
            redisClient.expire(req.ip,60) 
            return res.send("limit exceed")
        } 
        else{
            return res.send("limit exceed try after 1 min") 
        }
    } 
    else{
        redisClient.set(req.ip,1) 
        next() 
    }
} 
module.exports=redislimit