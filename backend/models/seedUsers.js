const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./User');
// Adjust path to your User model if needed


// Load environment variables (Make sure your MONGO_URI is set here)
dotenv.config();

const dummyUsers = [
  {
    name: "System Admin",
    email: "admin@amazon.com",
    password: "AdminPassword123", // Will be hashed below
    role: "admin",
    address: {
      street: "100 Corporate Way",
      city: "Dubai",
      state: "Dubai",
      zip: "00000",
      country: "UAE"
    }
  },
  {
    name: "Logistics Specialist",
    email: "employee@amazon.com",
    password: "EmployeePassword123", // Will be hashed below
    role: "employee",
    address: {
      street: "450 Fulfillment Hub Rd",
      city: "Abu Dhabi",
      state: "Abu Dhabi",
      zip: "11111",
      country: "UAE"
    }
  }
];

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/amazonClone');
    console.log('Database connected successfully.');

    // 2. Clean up existing dummy accounts to prevent duplication errors
    console.log('Cleaning up existing target dummy accounts...');
    await User.deleteMany({ email: { $in: ['admin@amazon.com', 'employee@amazon.com'] } });

    // 3. Hash passwords and prepare documents
    console.log('Hashing credentials...');
    const saltedUsers = await Promise.all(
      dummyUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // 4. Save to the database
    await User.insertMany(saltedUsers);
    console.log('🟢 Success: Dummy Admin and Employee accounts generated!');
    
    // Exit script cleanly
    process.exit(0);
  } catch (error) {
    console.error('🔴 Error seeding account privileges:', error);
    process.exit(1);
  }
};

seedDatabase();