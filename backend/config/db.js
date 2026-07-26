const mongoose = require('mongoose');

/**
 * Connect to MongoDB using MONGO_URI from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n❌ MongoDB Connection Failed!\n');
    console.error('   Error:', error.message);
    console.error('\n📋 To fix this, do ONE of the following:\n');
    console.error('   Option 1 – MongoDB Atlas (FREE, no install needed):');
    console.error('     1. Go to https://www.mongodb.com/cloud/atlas');
    console.error('     2. Create a free cluster');
    console.error('     3. Get your connection string');
    console.error('     4. Replace MONGO_URI in backend/.env with your Atlas URI');
    console.error('     5. Restart: node server.js\n');
    console.error('   Option 2 – Install MongoDB locally (requires admin):');
    console.error('     Download: https://www.mongodb.com/try/download/community\n');
    process.exit(1);
  }
};

module.exports = connectDB;
