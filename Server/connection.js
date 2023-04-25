//creating connection to connect to mongodb

//requiring mongoose for ease in connection
const mongoose = require("mongoose");
//connection string, can be stored as dotenv later
const dbURl;

//creating connection function
const connectDB = async () => {
  try {
    //mongodb connection string
    const conn = await mongoose.connect(dbURl, {
      useNewUrlParser: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

//exporting the module
module.exports = connectDB;
