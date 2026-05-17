require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find().select('username rank createdAt');
    console.log('Users found:', users.length);
    users.forEach(u => console.log(`- ${u.username} (${u.rank})`));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

check();