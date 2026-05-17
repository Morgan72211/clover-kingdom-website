const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Error:', error);
    // process.exit(1); // REMOVED — prevents Render crash-loops
throw err; // Let the catch in server.js handle it
  }
};

module.exports = connectDB;