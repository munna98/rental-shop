// // src/config/db.js
// import mongoose from 'mongoose';

// const connectDB = async () => {
//   if (mongoose.connection.readyState >= 1) return;

//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;


import mongoose from "mongoose";

const connectDB = async () => {
  // If already connected, return early to reuse the existing connection
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    // Create a new connection if one doesn't already exist
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB;
