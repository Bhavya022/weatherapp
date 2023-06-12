const redisClient = require("../helpers/redis") 
const axios = require('axios') 
const userCity = require("../models/user.model") 
const user=require("../models/user.model") 
const API_KEY = process.env.API_KEY 

const getCityData = async(req,res)=>{
    try{
  const city = req.params.city || req.body.preferred_city;
  const isCityInCache = await redisClient.get(`${city}`) 
  console.log(isCityInCache) 
  if(isCityInCache) return res.status(200).send({data:isCityInCache}) 
  const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`) 
  const weatherData = response.data 
  console.log(weatherData) 
  redisClient.set(city,JSON.stringify(weatherData),{EX:30*60}) 
  await userCity.findOneAndUpdate({userId:req.body.userId},{userId:req.body.userId,$push:{previousSearches:city}},{new:true,upsert:true,setDefaultOnInsert:true}) 
  return res.send({data:weatherData})
    } 
    catch(err){
        return res.status(500).send(err.message)
    }
} 

const mostSearchedCity = async (req,res)=>{
    try{
        const cities = await userCity.aggregate([
            {
                $match:{
                    userId:req.body.userId
                }
            },
            {
                $unwind:"$previousSearches"
            },
            {
                $group:{
                    _id:"$previousSearches",
                    count:{$sum:1}
                }
            },
            {
                $sort:{count:-1}
            }
        ]) 

        const city=cities[0]["_id"] 
        const isCityInCache=await redisClient.get(`${city}`) 
        if(isCityInCache) 
        return res.status(200).send({data:isCityInCache}) 
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`) 
  const weatherData = response.data 
  console.log(weatherData) 
  redisClient.set(city,JSON.stringify(weatherData),{EX:30*60}) 
  await userCity.findOneAndUpdate({userId:req.body.userId},{userId:req.body.userId,$push:{previousSearches:city}},{new:true,upsert:true,setDefaultOnInsert:true}) 
  return res.send({data:weatherData})
    } 
    catch(err){
        return res.status(500).send(err.message)
    }
} 
 
module.exports={getCityData,mostSearchedCity}
