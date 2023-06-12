const {Router}=require("express") 
const {auth}=require("../middlewares/auth") 
const {getcitydata,mostsearchedcity}=require("../controllers/city.controller") 
const redislimit = require("../middlewares/redislimit") 

const cityRouter = Router() 

cityRouter.get("/mostsearchedcity",mostsearchedcity) 
cityRouter.get("/:city",auth,getcitydata) 
module.exports={cityRouter }