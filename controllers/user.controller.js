const user = require("../models/user.model") 
const bcrypt=require("bcrypt") 
const jwt = require("jsonwebtoken") 
const redisClient = require("../helpers/redis") 

const signup = async(req,res)=>{
    try{
        const {name,email,password,preferred_city}=req.body 
        const isuserpresent = await user.findOne({email}) 
        if(isuserpresent) 
        return res.send('user already exist')
    
    const hash = await bcrypt.hash(password,6) 
    const newUser = new user({name,email,password:hash,preferred_city}) 
    await newUser.save() 
    res.send("signup successful")
    } 
    catch(err){
        res.send(err.message) 
    }
} 
const login = async(req,res)=>{
    try{
        const {email,password}=req.body 
        const isuserpresent = await user.findOne({email}) 
        if(!isuserpresent) 
        return res.send("user not found") 
        const ispassword = await bcrypt.compare(password,isuserpresent.password) 
        if(!ispassword) 
        return res.send("Invalid credentials") 
        const token = await jwt.sign({userId:isuserpresent._id,preferred_city:isuserpresent.preferred_city},process.env.JWT_SECRET,{expiresIn:"1hr"}) 
        res.send({message:"login success"})
    } 
    catch(err){
        res.send(err.message)
    }
} 
const logout = async(req,res)=>{
    try{
        const token = req.headers?.authorization?.split(" ")[1] 
        if(!token) 
        return res.status(400) 
        await redisClient.set(token,token) 
        res.send("logout success")
    } 
    catch(err){
        res.send(err.message)
    }
} 

module.exports={login,logout,signup}