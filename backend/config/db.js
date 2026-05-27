const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB not found. Starting in-memory fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ MongoDB Memory Server Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`❌ MongoDB Memory Server Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
