const mongoose = require("mongoose");

const connectDB = async () => {

    try{
        console.log("Inside DB connection")
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

    }catch(err){

        console.log(err);

        process.exit(1);

    }

}

module.exports = connectDB;
