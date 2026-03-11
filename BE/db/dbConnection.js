const mongoose = require('mongoose');
const connectDb = async ()=>{
    try{
      await  mongoose.connect(process.env.MONGO_LOCAL_URL);
      console.log("Db Connection Successful!");
    }
    catch(err){
         console.error("MongoDb connection failed ..." + err);
         process.exit(0);
    }
}

module.exports = connectDb;