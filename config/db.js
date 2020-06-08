const mongoose = require('mongoose');
const config = require('config');
const db = config.get('MongoURI');

//whenevr we use async await we wrap that up in a try catch block

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI||db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('mongo db Connected');
  } catch (error) {
    console.error(error.message);
    // exit process with failure
    process.exit(1);
  }
};
module.exports = connectDB;
