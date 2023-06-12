const winston = require("winston") 

const {MongoDB} = require("winston-mongodb") 

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new MongoDB({
        db:process.env.MONGO_URL,
        collection:"logs",
        options:{
        useUnifiedTopology:true 
        }

      })
    ],
}) 

module.exports=logger