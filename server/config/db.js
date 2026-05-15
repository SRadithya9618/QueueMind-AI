const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database Error:", error.message);
    console.log("Please check your MongoDB Atlas IP Whitelist.");
  }
};

module.exports = connectDB;