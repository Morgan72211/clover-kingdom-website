require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Delete old Suki if exists
    await User.deleteOne({ username: 'Suki' });
    console.log('Old Suki removed (if existed)');
    
    const suki = new User({ 
      username: 'Suki', 
      password: 'CloverKingdom_SilverSovereign!', 
      rank: 'Suki' 
    });
    await suki.save();
    console.log('Created: Suki');
    console.log('Password: CloverKingdom_SilverSovereign!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();