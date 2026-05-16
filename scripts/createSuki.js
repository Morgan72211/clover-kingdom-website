require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Staff = require('../src/database/models/Staff');

const createSuki = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Delete existing suki account if any
    await Staff.deleteOne({ username: 'suki' });
    console.log('Old suki account removed (if existed)');

    // Create new suki account with correct password
    const hashedPassword = await bcrypt.hash('CloverKingdom_SilverSovereign!', 10);

    const suki = new Staff({
      username: 'suki',
      password: hashedPassword,
      rank: 'Suki'
    });

    await suki.save();
    console.log('Suki account created successfully!');
    console.log('Username: suki');
    console.log('Password: CloverKingdom_SilverSovereign!');
    console.log('Rank: Suki');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSuki();