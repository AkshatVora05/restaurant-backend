const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to database");
    }
    catch(err){
        console.log("Error connecting the database");
    }
};

module.exports = connectDb;